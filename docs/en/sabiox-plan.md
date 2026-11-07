[← Back to README](../../README.md) · [Português](../pt-BR/sabiox-plan.md)

# SABiOx development cycle 1 — v0.1.0

| Phase | This repository's artifacts | Completion |
|---|---|---|
| Requirements | Purpose, scope, FR/NFR and 12 competency questions | Captured |
| Setup | UFO-A/B/C policy, OntoUML and RDF/OWL design, source review | Baseline |
| Capture | 26 classes, 29 relations, diagram views and reference catalog | Captured |
| Design | IRI policy, RDF projection, SHACL, JSON Schema, ADRs | Designed |
| Implementation | Turtle / RDFXML / JSON-LD, two SPARQL queries and synthetic test instance | Implemented; parsing and queries tested |

Supporting activities: documentation, knowledge acquisition, reuse, configuration management, evaluation, publication. Formal review and real-world evidence assessment were carried into the later cycles.

**Methodological distinction:** Evaluation is a supporting activity across phases, not a sixth primary SABiOx phase.

Reference: https://nemo.inf.ufes.br/projetos/sabiox/

# SABiOx development cycle 2 — v0.2.0 (derivation module)

| Phase | This repository's artifacts | Completion |
|---|---|---|
| Requirements | FR-13–FR-18, NFR-10, CQ-13–CQ-18 | Captured |
| Setup | Generator `scripts/build.py`; catalog as single source of truth | Implemented |
| Capture | `derivation` package: 10 classes, 19 relations, 5 SKOS vocabularies (40 derivation types, 56 dimensions); `hasSelector` to W3C Web Annotation | Captured |
| Design | ADR-011–ADR-024, literature-grounded typology review, SHACL cardinality and SPARQL constraints, alignments via rdfs:seeAlso | Designed |
| Implementation | Regenerated OWL/SHACL/schemas/docs/DOT, `examples/synthetic-derivation.ttl`, annotator schema and example, six SPARQL probes, rendered SVGs | Implemented and tested (build check, SHACL conformance and negative test, SPARQL) |

Carried into cycle 3: stereotype revision (role pattern, categories, relator), LRMoo alignment.

# SABiOx development cycle 3 — v0.3.0 (claims, UFO top level, IFLA LRM)

| Phase | This repository's artifacts | Completion |
|---|---|---|
| Requirements | CQ-19–CQ-21 (ungrounded claims, work levels, dated acts); executable queries for every CQ (CQ-01–CQ-04 and CQ-07–CQ-12 added); FR-01, FR-02, FR-04, FR-08, FR-13 and FR-17 restated with the new terms | Captured |
| Setup | Generator extended: categories, roles with two parents (OWL intersections), disjointness and coverings, per-class SHACL, date datatypes; `scripts/migrate.py` for 0.2 data | Implemented |
| Capture | New packages `claim` and `agent`; `Claim` and `AnalyticalRecord`; «category» `ArtisticEntity` and `Agent`; `Expression` and LRM `Manifestation`; «role» pattern for agents; `contributionTo`; `startDate`/`endDate` — 50 classes, 45 relations | Captured |
| Design | ADR-026–ADR-033 (ADR-009 adopted with the OntoUML export, ADR-010 closed, ADR-012/019/022 revised); `EpistemicCriterion`/`ValueCriterion`, `assessmentOutcome`; alignments with W3C Web Annotation, PROV-O, LRMoo, schema.org, Dublin Core as `rdfs:seeAlso` | Designed |
| Implementation | Regenerated artifacts and diagrams (SVG and 200 dpi PNG); examples migrated and enriched (album and first edition as manifestations, dated acts, typed agents); three new SPARQL probes; annotator updated and converting 0.2 files | Implemented and tested (build check, SHACL, OWL RL consistency, migration, SPARQL) |
| Evaluation | [Evaluation protocol](evaluation-protocol.md): expert review and real-case annotation study | Planned |

Verification added in this cycle: OntoUML JSON export valid against the official schema and well formed (`scripts/verify_ontouml.py`, cross-checked with ontouml-js). Cross-checked with the official ontouml-js library in version 1.0.0 (0 errors).

# Version 1.0.0 — consolidation

1.0.0 freezes the cycle 3 model as the stable version, without changing classes, relations or constraints:

- OntoUML stereotypes and UFO foundations recorded without the provisional mark, after verification with `scripts/verify_ontouml.py` and the official ontouml-js library (0 errors);
- reference, OntoUML and SABiOx documentation aligned with what is already implemented (OntoUML exchange file, disjointness of ultimate sortals, dates of acts and situations);
- frozen copy in [`releases/v1.0.0/`](../../releases/v1.0.0/).

Evaluation with experts and real cases follows the [evaluation protocol](evaluation-protocol.md).

---

[← Back to README](../../README.md) · [Português](../pt-BR/sabiox-plan.md)
