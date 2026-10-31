"""Run a SPARQL query over your ARO data (plus the ontology) and print the results.

Usage:
  python scripts/query.py my-data.ttl [more.ttl ...] --query queries/CQ-13-derivations-of-work.rq [--lang pt-BR]

--lang sets the preferred language of texts and labels in the results (default: en). The
queries declare it as `VALUES ?lang { "en" }`; texts missing in that language are shown in
the language they have, so data written only in Portuguese (or any language) still answers.

The ontology is loaded together with the data so that queries can read concept labels
(e.g. the English or Portuguese name of a derivation type). IRIs in the ARO namespace
are shortened to aro:Name for readability.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

from rdflib import Graph

ROOT = Path(__file__).resolve().parents[1]
ARO = "https://w3id.org/aro/ontology#"


def short(value) -> str:
    """Readable cell: aro: prefix for ARO terms, empty string for unbound variables."""
    if value is None:
        return ""
    text = str(value)
    return "aro:" + text[len(ARO):] if text.startswith(ARO) else text


def main(argv: list[str]) -> int:
    # Print accented text correctly on Windows consoles
    sys.stdout.reconfigure(encoding="utf-8")
    if "--query" not in argv:
        print(__doc__)
        return 2
    lang = "en"
    if "--lang" in argv:
        i = argv.index("--lang")
        lang = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    i = argv.index("--query")
    query_path = argv[i + 1]
    data_paths = argv[:i] + argv[i + 2:]

    graph = Graph().parse(ROOT / "ontology/src/aro.ttl")
    for path in data_paths:
        graph.parse(path)

    sparql = Path(query_path).read_text(encoding="utf-8")
    # preferred language of texts and labels (see the module docstring)
    sparql = re.sub(r'VALUES \?lang \{ "[^"]*" \}', f'VALUES ?lang {{ "{lang}" }}', sparql)
    result = graph.query(sparql)
    # Tab-separated output: header with variable names, then one line per row
    print("\t".join(str(v) for v in result.vars))
    rows = 0
    for row in result:
        print("\t".join(short(v) for v in row))
        rows += 1
    print(f"({rows} row(s))", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
