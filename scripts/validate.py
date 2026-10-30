"""Validate your own ARO data against the ontology and its SHACL constraints.

Usage:
  python scripts/validate.py my-data.ttl [more.ttl ...] [--lang pt-BR]

The data files are merged, RDFS inference is applied with the ARO ontology (so that,
for example, an external agent used with aro:contributionBy is recognised as an
aro:CreativeAgent), and every SHACL violation is printed with its focus node, path
and message in the chosen language (en by default). Exit code 0 = conforms, 1 = violations.
"""
from __future__ import annotations

import sys
from pathlib import Path

from pyshacl import validate
from rdflib import Graph, Namespace

ROOT = Path(__file__).resolve().parents[1]
SH = Namespace("http://www.w3.org/ns/shacl#")


def main(argv: list[str]) -> int:
    # Print accented text correctly on Windows consoles
    sys.stdout.reconfigure(encoding="utf-8")
    # Parse arguments: data files plus an optional --lang for violation messages
    lang = "en"
    if "--lang" in argv:
        i = argv.index("--lang")
        lang = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    if not argv:
        print(__doc__)
        return 2

    # Merge all data files; the format is guessed from each file extension
    data = Graph()
    for path in argv:
        data.parse(path)

    ontology = Graph().parse(ROOT / "ontology/src/aro.ttl")
    shapes = Graph().parse(ROOT / "validation/aro-shapes.ttl")
    # advanced=True enables SHACL-SPARQL constraints (e.g. distinct derivation anchors)
    conforms, results, _ = validate(data, shacl_graph=shapes, ont_graph=ontology,
                                    inference="rdfs", advanced=True)
    if conforms:
        print(f"OK: {len(data)} triples conform to the ARO constraints.")
        return 0

    # One line per violation, keeping only the message in the requested language
    for result in results.subjects(SH.resultSeverity, None):
        focus = results.value(result, SH.focusNode)
        path = results.value(result, SH.resultPath)
        messages = list(results.objects(result, SH.resultMessage))
        chosen = [m for m in messages if getattr(m, "language", None) == lang] or messages
        print(f"- {focus} | {path} | {chosen[0] if chosen else 'constraint violated'}")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
