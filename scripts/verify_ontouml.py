"""Validate and verify the OntoUML export of ARO (ADR-009, ADR-032).

Usage:
  python scripts/verify_ontouml.py [model/ontouml/aro.ontouml.json]

1. Validation: the file must conform to the official OntoUML JSON Schema 1.0.2
   (model/ontouml/ontouml-schema-1.0.2.json, Apache-2.0, from the OntoUML project).
2. Verification: OntoUML well-formedness rules on classes, generalizations and relations,
   with the stereotype groups of the official ontouml-js library (1.0.0):
   - every class has a stereotype allowed by OntoUML;
   - a base sortal (subkind, role, phase) specializes exactly one ultimate sortal;
   - an ultimate sortal does not specialize another ultimate sortal;
   - rigid and semi-rigid types do not specialize anti-rigid types;
   - non-sortals do not specialize sortals, are abstract and are specialized by some sortal;
   - roles and role mixins have a relational dependency (on themselves or an ancestor);
   - event types do not specialize endurant types and vice versa;
   - relators mediate at least two entities (sum of the lower bounds of their mediations);
   - «mediation» starts at a relator, «participation» and «creation» link an event and an
     endurant, «instantiation» ends at a high-order «type».
   Relations without stereotype are reported as warnings (ADR-032 explains why ARO keeps them).

The same checks, run with the ontouml-js library itself, are in scripts/verify_ontouml.mjs.
Exit status 1 if the file is invalid or a rule is violated.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "model/ontouml/ontouml-schema-1.0.2.json"

# Stereotype groups as defined by ontouml-js 1.0.0
ULTIMATE = {"kind", "collective", "quantity", "relator", "quality", "mode"}
BASE_SORTAL = {"subkind", "phase", "role", "historicalRole"}
NON_SORTAL = {"category", "mixin", "phaseMixin", "roleMixin", "historicalRoleMixin"}
RIGID = {"kind", "quantity", "collective", "mode", "quality", "relator", "subkind", "category",
         "event", "situation", "type", "abstract", "datatype", "enumeration"}
SEMI_RIGID = {"mixin"}
ANTI_RIGID = {"role", "roleMixin", "historicalRole", "historicalRoleMixin", "phase", "phaseMixin"}
ENDURANT = ULTIMATE | BASE_SORTAL | NON_SORTAL
CLASS_STEREOTYPES = ENDURANT | {"event", "situation", "type", "abstract", "datatype", "enumeration"}
DEPENDENCE = {"mediation", "participation", "material", "externalDependence", "historicalDependence", None}


def validate(doc: dict) -> list[str]:
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    return [f"schema: {'/'.join(map(str, e.absolute_path))}: {e.message[:200]}" for e in validator.iter_errors(doc)]


def verify(doc: dict) -> tuple[list[str], list[str]]:
    elements = {e["id"]: e for e in doc["elements"]}
    classes = {i: e for i, e in elements.items() if e["type"] == "Class"}
    gens = [e for e in doc["elements"] if e["type"] == "Generalization"]
    relations = [e for e in doc["elements"] if e["type"] == "BinaryRelation"]
    name = lambda i: (elements[i].get("name") or {}).get("en", i)
    st = lambda i: classes[i]["stereotype"]
    parents = {i: [g["general"] for g in gens if g["specific"] == i] for i in classes}
    children = {i: [g["specific"] for g in gens if g["general"] == i] for i in classes}

    def closure(i, step):
        seen, stack = set(), list(step[i])
        while stack:
            k = stack.pop()
            if k not in seen:
                seen.add(k)
                stack += step[k]
        return seen

    ancestors = {i: closure(i, parents) for i in classes}
    descendants = {i: closure(i, children) for i in classes}

    def ends(r):
        a, b = (elements[p]["propertyType"] for p in r["properties"])
        return a, b

    def lower(r, side):
        card = elements[r["properties"][side]]["cardinality"]
        return int(card.split("..")[0]) if card.split("..")[0].isdigit() else 0

    errors, warnings = [], []
    for i, c in classes.items():
        s = c["stereotype"]
        if s not in CLASS_STEREOTYPES:
            errors.append(f"{name(i)}: stereotype «{s}» is not an OntoUML class stereotype")
            continue
        ultimate = [a for a in ancestors[i] if st(a) in ULTIMATE]
        if s in BASE_SORTAL and len(ultimate) != 1:
            errors.append(f"{name(i)}: «{s}» must specialize exactly one ultimate sortal, found {len(ultimate)}")
        if s in ULTIMATE and ultimate:
            errors.append(f"{name(i)}: ultimate sortal specializes another ({', '.join(map(name, ultimate))})")
        if s in RIGID | SEMI_RIGID:
            bad = [a for a in ancestors[i] if st(a) in ANTI_RIGID]
            if bad:
                errors.append(f"{name(i)}: rigid type specializes anti-rigid {', '.join(map(name, bad))}")
        if s in NON_SORTAL:
            bad = [a for a in ancestors[i] if st(a) in ULTIMATE | BASE_SORTAL]
            if bad:
                errors.append(f"{name(i)}: non-sortal specializes sortal {', '.join(map(name, bad))}")
            if not c["isAbstract"]:
                errors.append(f"{name(i)}: non-sortal must be abstract")
            if not any(st(d) in ULTIMATE | BASE_SORTAL for d in descendants[i]):
                errors.append(f"{name(i)}: non-sortal without sortal specializations")
        if s in {"role", "roleMixin"}:
            scope = {i} | ancestors[i]
            if not any(set(ends(r)) & scope and r["stereotype"] in DEPENDENCE for r in relations):
                errors.append(f"{name(i)}: role without relational dependency")
        if s == "event" and any(st(a) in ENDURANT for a in ancestors[i]):
            errors.append(f"{name(i)}: event type specializes an endurant type")
        if s in ENDURANT and any(st(a) == "event" for a in ancestors[i]):
            errors.append(f"{name(i)}: endurant type specializes an event type")
        if c["isAbstract"] and not children[i]:
            errors.append(f"{name(i)}: abstract class without specializations")

    for i in classes:
        if st(i) == "relator":
            total = sum(lower(r, 1) for r in relations if r["stereotype"] == "mediation" and ends(r)[0] == i)
            if total < 2:
                errors.append(f"{name(i)}: relator mediates fewer than two entities (lower bounds sum {total})")

    def is_event(i):
        return st(i) == "event" or any(st(a) == "event" for a in ancestors[i])

    for r in relations:
        s, t = ends(r)
        label = f"{name(s)} -{r['name']['en']}-> {name(t)}"
        kind = r["stereotype"]
        if kind is None:
            warnings.append(f"{label}: no relation stereotype")
        elif kind == "mediation" and st(s) != "relator" and not any(st(a) == "relator" for a in ancestors[s]):
            errors.append(f"{label}: «mediation» must start at a relator")
        elif kind in {"participation", "creation"} and is_event(s) == is_event(t):
            errors.append(f"{label}: «{kind}» must link an event and an endurant")
        elif kind == "instantiation" and st(t) != "type":
            errors.append(f"{label}: «instantiation» must end at a high-order «type»")
    return errors, warnings


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")   # «stereotype» marks on Windows consoles
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "model/ontouml/aro.ontouml.json"
    doc = json.loads(path.read_text(encoding="utf-8"))
    problems = validate(doc)
    errors, warnings = verify(doc) if not problems else ([], [])
    n_classes = sum(e["type"] == "Class" for e in doc["elements"])
    n_rel = sum(e["type"] == "BinaryRelation" for e in doc["elements"])
    print(f"{path.name}: {n_classes} classes, {n_rel} relations")
    print(f"  OntoUML JSON Schema 1.0.2: {'valid' if not problems else 'INVALID'}")
    for p in problems[:20]:
        print("   ", p)
    print(f"  well-formedness: {len(errors)} error(s), {len(warnings)} warning(s)")
    for e in errors:
        print("    ERROR", e)
    if "--warnings" in sys.argv:
        for w in warnings:
            print("    warning", w)
    return 1 if problems or errors else 0


if __name__ == "__main__":
    sys.exit(main())
