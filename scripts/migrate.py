"""Migrate ARO 0.2.x Turtle data to ARO 0.3.0.

Usage:
  python scripts/migrate.py file.ttl [more.ttl ...]            # rewrite the files in place
  python scripts/migrate.py --check file.ttl [more.ttl ...]    # exit 1 if any file still needs migration

The migration is textual, so comments and layout are kept. It applies the renames of 0.3.0
(see CHANGELOG and docs/*/design-decisions.md, ADR-026 to ADR-030):

  classes     Manifestation (0.2, a version/realization) -> Expression (IFLA LRM)
              InterpretiveJustification -> Justification
              InterpretationChallenge -> Challenge
              InterpretationAssessment -> CriteriaAssessment
  relations   hasManifestation (artwork -> version) -> hasExpression
              claimProducedByAct -> producedByAct
              derivationJustifiedBy -> hasJustification
              referencesSource, caseHasReference, derivationReferencesSource -> citesSource
              supportsClaim, assessesCorrespondence, assessesInterpretation, assessesDerivation -> assessesClaim

and adds the relator's second end: every CreativeContribution without aro:contributionTo
gets the artistic entities produced by the creative act it belongs to.
The annotator applies the same migration when it loads an older file.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

from rdflib import Graph, Namespace, URIRef
from rdflib.namespace import RDF

ARO = Namespace("https://w3id.org/aro/ontology#")

# Order matters: hasManifestation must become hasExpression before Manifestation becomes Expression
RENAMES = [
    ("hasManifestation", "hasExpression"),
    ("Manifestation", "Expression"),
    ("InterpretiveJustification", "Justification"),
    ("InterpretationChallenge", "Challenge"),
    ("InterpretationAssessment", "CriteriaAssessment"),
    ("claimProducedByAct", "producedByAct"),
    ("derivationJustifiedBy", "hasJustification"),
    ("derivationReferencesSource", "citesSource"),
    ("referencesSource", "citesSource"),
    ("caseHasReference", "citesSource"),
    ("assessesCorrespondence", "assessesClaim"),
    ("assessesInterpretation", "assessesClaim"),
    ("assessesDerivation", "assessesClaim"),
    ("supportsClaim", "assessesClaim"),
]
# aro:Name or <https://w3id.org/aro/ontology#Name>, as a whole term
TERM = r"(aro:|<https://w3id\.org/aro/ontology#){old}(?=[\s;,.>)\]]|$)"


# Terms that exist only from 0.3 on: a file using them is already 0.3, so its Manifestation and
# hasManifestation are the new IFLA LRM ones and must not be renamed
NEW_TERMS = ("Expression", "hasExpression", "embodiesExpression", "contributionTo", "assessesClaim", "Claim", "Challenge")
LRM_RENAMES = {"hasManifestation", "Manifestation"}


def is_current(text: str) -> bool:
    return any(re.search(TERM.format(old=t), text) for t in NEW_TERMS)


def rename(text: str) -> str:
    current = is_current(text)
    for old, new in RENAMES:
        if current and old in LRM_RENAMES:
            continue
        text = re.sub(TERM.format(old=old), lambda m: m.group(1) + new, text)
    return text


def add_contribution_targets(text: str) -> str:
    """Give each CreativeContribution the artistic entities its creative act produced."""
    g = Graph()
    g.parse(data=text, format="turtle")
    nm = g.namespace_manager

    def term(node: URIRef) -> str:
        return node.n3(nm)

    for contribution in g.subjects(RDF.type, ARO.CreativeContribution):
        if (contribution, ARO.contributionTo, None) in g:
            continue
        targets = sorted({t for act in g.subjects(ARO.hasContribution, contribution)
                          for t in g.objects(act, ARO.producesCreation)})
        if not targets:
            continue
        addition = f"aro:contributionTo {', '.join(term(t) for t in targets)} ;"
        # insert right after "<subject> a aro:CreativeContribution ;" when written that way
        pattern = re.compile(rf"(^[ \t]*{re.escape(term(contribution))}\s+a\s+aro:CreativeContribution\s*;)", re.M)
        if pattern.search(text):
            text = pattern.sub(lambda m: f"{m.group(1)} {addition}", text, count=1)
        else:
            text += f"\n# Added by scripts/migrate.py (ARO 0.3): the entity this contribution is to\n" \
                    f"{term(contribution)} {addition[:-2]} .\n"
    return text


def migrate(text: str) -> str:
    return add_contribution_targets(rename(text))


def main() -> int:
    check = "--check" in sys.argv
    files = [Path(a) for a in sys.argv[1:] if a != "--check"]
    if not files:
        print(__doc__)
        return 2
    stale = []
    for path in files:
        old = path.read_bytes().decode("utf-8")   # keep the file's own line endings
        new = migrate(old)
        if new != old:
            stale.append(path)
            if not check:
                path.write_bytes(new.encode("utf-8"))
    verb = "need migration" if check else "migrated"
    print(f"{len(stale)} file(s) {verb}" + (":\n  " + "\n  ".join(map(str, stale)) if stale else "."))
    return 1 if check and stale else 0


if __name__ == "__main__":
    sys.exit(main())
