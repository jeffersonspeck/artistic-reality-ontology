"""Agreement between annotators who annotated the same works with ARO.

Usage:
  python scripts/compare_annotations.py annotator-a.ttl annotator-b.ttl [annotator-c.ttl ...]
  python scripts/compare_annotations.py --lang pt-BR a.ttl b.ttl

Used in the real-case annotation study of the evaluation protocol
(docs/*/evaluation-protocol.md). Annotators start from the same skeleton file (works,
expressions, selections), so anchors and selections have the same IRIs in every file.

For each derivation claimed between the same source and derived anchors, it compares the
concepts chosen from the controlled vocabularies (derivation types, regimes and
transformation aspects as dimension + operation) and reports:
  - per vocabulary, Krippendorff's alpha (nominal, presence/absence of each concept per
    anchor pair; an annotator who made no claim for that pair counts as missing);
  - the anchor pairs claimed by only some annotators.
For interpretations it reports how many selections each annotator interpreted and how many
were interpreted by all.
"""
from __future__ import annotations

import sys
from collections import defaultdict
from itertools import permutations
from pathlib import Path

from rdflib import Graph, Namespace
from rdflib.namespace import RDF

ARO = Namespace("https://w3id.org/aro/ontology#")


def krippendorff_alpha(units: list[list]) -> float | None:
    """Nominal alpha. `units` holds, per unit, the values given by the coders (None = missing)."""
    coincidence: dict[tuple, float] = defaultdict(float)
    for values in units:
        vals = [v for v in values if v is not None]
        m = len(vals)
        if m < 2:
            continue
        for a, b in permutations(range(m), 2):
            coincidence[(vals[a], vals[b])] += 1 / (m - 1)
    totals: dict = defaultdict(float)
    for (c, _), w in coincidence.items():
        totals[c] += w
    n = sum(totals.values())
    if n <= 1:
        return None
    observed = sum(w for (c, k), w in coincidence.items() if c != k)
    expected = sum(totals[c] * totals[k] for c in totals for k in totals if c != k) / (n - 1)
    if expected == 0:
        return 1.0 if observed == 0 else None
    return 1 - observed / expected


def claims(g: Graph) -> dict[tuple, dict[str, set]]:
    """Derivation claims of one annotator, keyed by (source anchor, derived anchor)."""
    out: dict[tuple, dict[str, set]] = {}
    for c in g.subjects(RDF.type, ARO.DerivationClaim):
        for s in g.objects(c, ARO.hasSourceAnchor):
            for d in g.objects(c, ARO.hasDerivedAnchor):
                entry = out.setdefault((s, d), {"types": set(), "regimes": set(), "aspects": set()})
                entry["types"] |= set(g.objects(c, ARO.hasDerivationType))
                entry["regimes"] |= set(g.objects(c, ARO.hasRegime))
                for a in g.objects(c, ARO.hasTransformation):
                    for dim in g.objects(a, ARO.hasDimension):
                        for op in g.objects(a, ARO.hasOperation):
                            entry["aspects"].add((dim, op))
    return out


def short(term) -> str:
    if isinstance(term, tuple):
        return "+".join(short(t) for t in term)
    s = str(term)
    return s.split("#")[-1].split("/")[-1]


def main() -> int:
    files = [Path(a) for a in sys.argv[1:] if not a.startswith("--")]
    if len(files) < 2:
        print(__doc__)
        return 2
    graphs = [Graph().parse(f) for f in files]
    per_coder = [claims(g) for g in graphs]
    pairs = sorted(set().union(*per_coder), key=lambda p: (str(p[0]), str(p[1])))
    print(f"{len(files)} annotators, {len(pairs)} anchor pair(s) with derivation claims\n")
    for field in ("types", "regimes", "aspects"):
        units = []
        for pair in pairs:
            labels = set().union(*(c[pair][field] for c in per_coder if pair in c))
            for label in labels:
                units.append([(label in c[pair][field]) if pair in c else None for c in per_coder])
        alpha = krippendorff_alpha(units)
        shown = "n/a (too few judgements)" if alpha is None else f"{alpha:.3f}"
        print(f"  {field:8s} Krippendorff's alpha = {shown}  ({len(units)} unit(s))")
    partial = [p for p in pairs if sum(p in c for c in per_coder) < len(per_coder)]
    if partial:
        print("\nAnchor pairs claimed by only some annotators:")
        for p in partial:
            who = ", ".join(f.name for f, c in zip(files, per_coder) if p in c)
            print(f"  {short(p[0])} -> {short(p[1])}: {who}")
    # interpretations: coverage of selections
    selections = [set(g.objects(None, ARO.hasPrimarySelection)) for g in graphs]
    common = set.intersection(*selections) if selections else set()
    print("\nSelections interpreted:")
    for f, s in zip(files, selections):
        print(f"  {f.name}: {len(s)}")
    print(f"  by all annotators: {len(common)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
