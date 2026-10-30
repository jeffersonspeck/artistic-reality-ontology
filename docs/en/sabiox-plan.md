[← Back to README](../../README.md) · [Português](../pt-BR/sabiox-plan.md)

# SABiOx development cycle 1 — v0.1.0

| Phase | This repository's artifacts | Completion |
|---|---|---|
| Requirements | Purpose, scope, FR/NFR and 12 competency questions | Draft captured |
| Setup | UFO-A/B/C policy, OntoUML and RDF/OWL design, source review | Initial baseline |
| Capture | 26 classes, 29 relations, diagram views and reference catalog | Draft; expert validation pending |
| Design | IRI policy, RDF projection, SHACL, JSON Schema, ADRs | Initial design |
| Implementation | Turtle / RDFXML / JSON-LD, two SPARQL queries and synthetic test instance | Prototype tested for parsing/querying |

Supporting activities: documentation, knowledge acquisition, reuse, configuration management, evaluation, publication. Formal review, real-world evidence assessment and native OntoUML serialization remain backlog items.

**Methodological distinction:** Evaluation is a supporting activity across phases, not a sixth primary SABiOx phase.

Reference: https://nemo.inf.ufes.br/projetos/sabiox/

# SABiOx development cycle 2 — v0.2.0 (derivation module)

| Phase | This repository's artifacts | Completion |
|---|---|---|
| Requirements | FR-13–FR-18, NFR-10, CQ-13–CQ-18 | Draft captured |
| Setup | Generator `scripts/build.py`; catalog as single source of truth | Implemented |
| Capture | `derivation` package: 10 classes, 19 relations, 5 SKOS vocabularies (40 derivation types, 56 dimensions); `hasSelector` to W3C Web Annotation | Draft; expert validation pending |
| Design | ADR-011–ADR-024, literature-grounded typology review, SHACL cardinality and SPARQL constraints, alignments via rdfs:seeAlso | Initial design |
| Implementation | Regenerated OWL/SHACL/schemas/docs/DOT, `examples/synthetic-derivation.ttl`, annotator schema and example, six SPARQL probes, rendered SVGs | Prototype tested (build check, SHACL conformance and negative test, SPARQL) |

Backlog: expert review of «roleMixin»/«type»/«relator» stereotypes, LRMoo alignment, evaluation with real cases.

---

[← Back to README](../../README.md) · [Português](../pt-BR/sabiox-plan.md)
