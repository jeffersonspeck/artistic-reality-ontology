[← Back to README](../../README.md) · [Português](../pt-BR/sabiox-compilado.md)

# ARO SABiOx compilation — development phase by phase

This document puts in one place **everything in the project that was shaped by SABiOx**: for each phase and supporting activity, what was done, in which cycle, and **where it lives in the repository**. Paths are clickable from this folder (`docs/en/`). Portuguese version: [sabiox-compilado.md](../pt-BR/sabiox-compilado.md).

> **Method.** SABiOx (Aguiar & Souza, 2024) has five primary phases — **Requirements → Setup → Capture → Design → Implementation** — and cross-cutting supporting activities: **knowledge acquisition, documentation, configuration management, evaluation, reuse and publication**. Evaluation is a supporting activity, not a sixth phase. Sources: [paper](https://ceur-ws.org/Vol-3905/paper1.pdf) · [official guide](https://nemo.inf.ufes.br/wp-content/uploads/sabiox-guide2024-09.pdf).
>
> **Status.** Both cycles are research drafts with automated syntax, structure and query tests. There has been no expert validation and no evaluation with real cases yet.

## Contents

- [Cycle overview](#cycle-overview)
- [Phase 1 — Requirements](#phase-1--requirements)
- [Phase 2 — Setup](#phase-2--setup)
- [Phase 3 — Capture](#phase-3--capture)
- [Phase 4 — Design](#phase-4--design)
- [Phase 5 — Implementation](#phase-5--implementation)
- [Supporting activities](#supporting-activities)
- [End-to-end traceability](#end-to-end-traceability)
- [Open items by phase](#open-items-by-phase)
- [Reverse map: file → SABiOx phase](#reverse-map-file--sabiox-phase)

---

## Cycle overview

| Cycle | Version | Focus | Main result |
|---|---|---|---|
| 1 | 0.1.0 | Artwork, selection, plural interpretation, represented situation, situation pattern, evidence and correspondence with reality | 26 classes, 29 relations, FR-01–FR-12, CQ-01–CQ-12 |
| 2 | 0.2.0 | **Derivation between works** (translation, cover, sampling, adaptation, parody, fan work…), explanation of derivations, annotator readiness, single source of truth | 36 classes, 49 relations, 5 SKOS vocabularies, FR-13–FR-18, NFR-10, CQ-13–CQ-18 |

Cycle record: [sabiox-plan.md](sabiox-plan.md) · change history: [CHANGELOG.md](../../CHANGELOG.md).

```
Requirements ──► Setup ──► Capture ──► Design ──► Implementation
 (what/why)       (how)    (conceptual) (operational) (code + tests)
     ▲                                                     │
     └────────── evaluation / traceability ◄───────────────┘
```

---

## Phase 1 — Requirements

Defines purpose, scope, intended uses, requirements and the competency questions (CQs) that act as acceptance criteria.

| SABiOx artifact | Cycle 1 | Cycle 2 | Where |
|---|---|---|---|
| Purpose (what / why / for what) | Traceable interpretation without mistaking fiction for fact | + derivation between works; derivative works as creations in their own right | [purpose-and-scope.md](purpose-and-scope.md) |
| Scope and exclusions | Excludes automatic extraction, news fact-checking, automatic causal inference | + legality/originality out of scope, automatic similarity detection, inferred derivation chains | [purpose-and-scope.md](purpose-and-scope.md) |
| Epistemic commitment | Every correspondence is a fallible claim requiring evidence | Every derivation is a contestable, explained claim | [purpose-and-scope.md](purpose-and-scope.md) |
| Functional requirements | FR-01–FR-12 | FR-13 (derivation at 3 levels), FR-14 (types), FR-15 (what is retained/transformed), FR-16 (creative acts and roles), FR-17 (explanation), FR-18 (W3C selectors and annotation format) | [requirements.md](requirements.md) |
| Non-functional requirements | NFR-01–NFR-09 | NFR-10: single catalog from which everything is generated and checked | [requirements.md](requirements.md) |
| Competency questions | CQ-01–CQ-12 | CQ-13 (derivatives of a work), CQ-14 (chains), CQ-15 (transformations), CQ-16 (retained patterns), CQ-17 (explanation), CQ-18 (creative contributions) | [competency-questions.md](competency-questions.md) |
| Modularization | 5 packages: `artwork`, `interpretation`, `representation`, `pattern`, `evidence` | + `derivation` package | `packages` in [conceptual-model.json](../../model/conceptual-model.json) |
| Data principles | 8 principles (selection ≠ interpretation, fiction ≠ empirical…) | — | [README.md](../../README.md#key-principles) |

---

## Phase 2 — Setup

Chooses the foundational ontology, conceptual modelling language, operational language, tools and reuse policy.

| Setup decision | Choice | Where |
|---|---|---|
| Foundational ontology | UFO-A (identity, types, dependence), UFO-B (events), UFO-C (intentionality, social/information objects) | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Conceptual language | OntoUML as reference; provisional stereotypes | [ontouml-status.md](../../model/ontouml-status.md) |
| Operational language | RDF/OWL 2 (Turtle, RDF/XML, JSON-LD), SHACL, JSON Schema 2020-12, SPARQL | [README.md](../../README.md) |
| gUFO / UFO-C policy | gUFO 1.0.0 covers UFO-A and part of UFO-B; UFO-C is not imported (ADR-008) | [foundation-and-mappings.md](foundation-and-mappings.md), [design-decisions.md](design-decisions.md) |
| Tools (cycle 1) | Python + `rdflib`, `jsonschema`; Graphviz for diagrams | [requirements.txt](../../requirements.txt) |
| Tools (cycle 2) | + `pyshacl` (SHACL validation); **generator** `scripts/build.py`; Graphviz installed | [requirements.txt](../../requirements.txt), [build.py](../../scripts/build.py) |
| Single source of truth (cycle 2) | `model/conceptual-model.json` generates OWL, SHACL, schemas, reference docs and diagrams (ADR-017, NFR-10) | [conceptual-model.json](../../model/conceptual-model.json), [build.py](../../scripts/build.py) |

**Generation flow (cycle 2):**

```
model/conceptual-model.json
        │  python scripts/build.py
        ├─► ontology/src/aro.ttl · aro.owl · aro.jsonld        (Implementation)
        ├─► validation/aro-shapes.ttl                     (Design)
        ├─► schemas/record.schema.json
        ├─► schemas/derivation-annotation.schema.json     (Design)
        ├─► docs/{en,pt-BR}/reference-model.md            (Capture / Documentation)
        └─► model/diagrams/*.dot ─► *.svg                 (Capture)
python scripts/build.py --check   → fails if any artifact drifts from the catalog
```

---

## Phase 3 — Capture

Builds the reference conceptual model: classes, stereotypes, bilingual definitions, dependencies, grounding and relations.

### Conceptual catalog

| Package | Classes | Cycle | Diagram |
|---|---|---|---|
| `artwork` | Artwork, Manifestation, Selection, AnalysisUnit | 1 (Selection gains `hasSelector` in cycle 2) | [artwork.svg](../../model/diagrams/artwork.svg) |
| `interpretation` | InterpretationRecord, InterpretiveAct, Analyst, InterpretiveJustification, InterpretationChallenge, InterpretationAssessment, AssessmentCriterion | 1 (Analyst becomes «roleMixin» in cycle 2) | [interpretation.svg](../../model/diagrams/interpretation.svg) |
| `representation` | DepictedElement, DepictedAgent, SituationDescription, IntentionalStateDescription | 1 | [representation.svg](../../model/diagrams/representation.svg) |
| `pattern` | SituationPattern, PatternCondition | 1 | [pattern.svg](../../model/diagrams/pattern.svg) |
| `evidence` | EmpiricalCase, EmpiricalClaim, ReferenceSource, EvidenceItem, CorrespondenceClaim, EvidenceAssessment, ExplanationHypothesis, EmpiricalSituation, EmpiricalEvent | 1 | [evidence.svg](../../model/diagrams/evidence.svg) |
| `derivation` | DerivationClaim, TransformationAspect, CreativeAct, CreativeAgent, CreativeContribution, DerivationType, DerivationRegime, ArtisticDimension, TransformationOperation, CreativeRole | 2 | [derivation.svg](../../model/diagrams/derivation.svg) |

Full view: [overview.svg](../../model/diagrams/overview.svg). Definitions, dependencies and grounding of every class: [reference-model.md](reference-model.md) (generated).

### OntoUML stereotypes used (provisional)

| Stereotype | Classes | Cycle |
|---|---|---|
| «kind» | most information classes (Artwork, InterpretationRecord, DerivationClaim, TransformationAspect…) | 1 and 2 |
| «subkind» | DepictedAgent, IntentionalStateDescription | 1 |
| «event» | InterpretiveAct, EmpiricalEvent, CreativeAct | 1 and 2 |
| «situation» | EmpiricalSituation | 1 |
| «relator» | CreativeContribution | 2 |
| «roleMixin» | CreativeAgent, Analyst — **agents come from external ontologies** | 2 |
| «type» (high-order) | DerivationType, DerivationRegime, ArtisticDimension, TransformationOperation, CreativeRole | 2 |

### Controlled vocabularies (cycle 2, SKOS)

| Scheme | Concepts | Organization | Grounding |
|---|---|---|---|
| DerivationTypeScheme | 40 | 5 families: re-realization, incorporation, transformation, imitation, extension | Genette, Tillett, Smiraglia, Burkholder, Rajewsky, Hutcheon, Navas, Jenkins… |
| DerivationRegimeScheme | 4 | playful, satirical, serious, reverential | Genette's regimes (+ reverential, an ARO addition) |
| ArtisticDimensionScheme | 56 | 7 medium families: narrative, verbal, music, visual, audiovisual, cross-media, paratext | Chatman, Genette, Panofsky, Bordwell & Thompson |
| TransformationOperationScheme | 5 | retained, modified, added, removed, recontextualized | — |
| CreativeRoleScheme | 10 | author, composer, performer, arranger, translator, remixer… | — |

Grounding, review and bibliography of the typology: [derivation-typology.md](derivation-typology.md) (full bibliography in the [Portuguese version](../pt-BR/derivation-typology.md#referências)). Full tables with each concept's source: [reference-model.md](reference-model.md#controlled-vocabularies-skos).

### Knowledge acquisition used in capture

- Cycle 1: UFO/gUFO/UFO-C, OntoUML (sources in [foundation-and-mappings.md](foundation-and-mappings.md)).
- Cycle 2: literature review for the derivation typology, with references checked and marked † where secondary sources disagree ([pt-BR derivation-typology.md](../pt-BR/derivation-typology.md#referências)).

---

## Phase 4 — Design

Turns the conceptual model into operational decisions: IRIs, RDF/OWL projection, constraints, exchange formats and recorded decisions.

| Design element | Content | Where |
|---|---|---|
| IRI policy | Namespace `https://w3id.org/aro/ontology#`; neutral IDs with EN/PT labels (NFR-06) | [aro.ttl](../../ontology/src/aro.ttl) |
| OWL projection | Classes, properties, subclasses, unions (anchors Artwork ∪ Manifestation ∪ Selection), SKOS concepts typed by «type» classes | [build.py](../../scripts/build.py) (`build_ontology`) |
| SHACL cardinality and class constraints | Cycle 1: 8 constraints; cycle 2: + anchors 1..1, mandatory type, dimension/operation 1..1, roles, agents as IRIs | [aro-shapes.ttl](../../validation/aro-shapes.ttl) |
| SHACL-SPARQL constraints (cycle 2) | Anchors must be Artwork/Manifestation/Selection; source ≠ derived | `sparql_constraints` in [conceptual-model.json](../../model/conceptual-model.json) |
| Datatypes | XSD per property; W3C Web Annotation selectors | [datatypes-and-validation.md](datatypes-and-validation.md) |
| Exchange formats | `reference-source` (cycle 1), `record` (generic), **`derivation-annotation`** for the annotator (cycle 2, generated from the vocabularies) | [schemas/](../../schemas/) |
| External alignments | `rdfs:seeAlso` (not equivalence) to `prov:wasDerivedFrom`, `schema:isBasedOn`, Wikidata P144, `prov:Agent`, `foaf:Agent`, `oa:SpecificResource` | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Recorded decisions | ADR-001–ADR-010 (cycle 1), ADR-011–ADR-025 (cycle 2) | [design-decisions.md](design-decisions.md) |

### Design decisions by theme

| Theme | ADRs |
|---|---|
| Interpretation and epistemology | ADR-001 (anchored interpretation), 002, 003, 005, 006 |
| Sources and evidence | ADR-004, 005 |
| OWL vs reference semantics | ADR-007, 008, 009 (open), 010 (open) |
| Derivation as a claim | ADR-011, 012 (level via anchors), 013 (no transitivity), 015 (one source per claim) |
| Scope: legality out of scope | ADR-014 |
| Vocabularies and regime | ADR-016, 018, 020 |
| External agents | ADR-019, 022 |
| Annotation | ADR-021 (W3C selectors), 023 (generated schema) |
| Engineering | ADR-017 (single source of truth) |
| Language policy | ADR-024 (English terms, full en/pt-BR annotations, multilingual content) |

---

## Phase 5 — Implementation

Encodes the ontology, example data and checks.

| Artifact | Content | Cycle | Where |
|---|---|---|---|
| OWL ontology | 36 classes, 49 object properties, datatype properties, 5 SKOS schemes | 1 → 2 | [aro.ttl](../../ontology/src/aro.ttl), [aro.owl](../../ontology/src/aro.owl), [aro.jsonld](../../ontology/src/aro.jsonld) |
| Constraints | Generated SHACL | 1 → 2 | [aro-shapes.ttl](../../validation/aro-shapes.ttl) |
| Generator | Catalog → all artifacts; `--check` detects drift; renders SVG | 2 | [build.py](../../scripts/build.py) |
| Generic synthetic example | artwork → selection → interpretation → pattern → case → evidence | 1 | [synthetic-data.ttl](../../examples/synthetic-data.ttl), [synthetic-reference-source.json](../../examples/synthetic-reference-source.json) |
| Synthetic derivation example | cover, sampling with W3C selectors and justification, adaptation retaining a pattern, fan work in a chain; agents from schema.org/FOAF | 2 | [synthetic-derivation.ttl](../../examples/synthetic-derivation.ttl) |
| Annotation example | sampling annotation in the annotator format | 2 | [synthetic-derivation-annotation.json](../../examples/synthetic-derivation-annotation.json) |
| CQ queries | CQ-05, CQ-06 (cycle 1); CQ-13–CQ-18 (cycle 2) | 1 and 2 | [queries/](../../queries/) |
| Tests | see [Evaluation](#evaluation) | 1 → 2 | [test_project.py](../../tests/test_project.py) |

How to run:

```bash
python -m pip install -r requirements.txt
python scripts/build.py
python tests/test_project.py
```

---

## Supporting activities

### Knowledge acquisition

| What | Where |
|---|---|
| UFO-A/B/C grounding, gUFO, UFO-C OWL (CTU), OntoUML | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Derivation literature (poetics, library science, music, intermediality, adaptation, fandom) and dimension literature (narratology, iconology, film) | [derivation-typology.md](derivation-typology.md) |

### Documentation

| What | Where |
|---|---|
| Bilingual EN / PT-BR documentation | [docs/en/](./), [docs/pt-BR/](../pt-BR/) |
| Generated reference documentation (do not edit by hand) | [reference-model.md](reference-model.md) |
| Entry points | [README.md](../../README.md), [LEIA-ME.md](../../LEIA-ME.md) |
| This compilation | [sabiox-compilation.md](sabiox-compilation.md) |

### Configuration management

| What | Where |
|---|---|
| Semantic versioning (0.1.0 → 0.2.0) | `version` in [conceptual-model.json](../../model/conceptual-model.json), `owl:versionInfo` in [aro.ttl](../../ontology/src/aro.ttl), [CITATION.cff](../../CITATION.cff) |
| Change history | [CHANGELOG.md](../../CHANGELOG.md) |
| Version control | git repository; `.gitignore` |
| Consistency across artifacts | `python scripts/build.py --check` (run by the tests) |

### Evaluation

Automated verification in [test_project.py](../../tests/test_project.py). It confirms syntax, structure and query answers, **not** the correctness of the domain theory:

| Check | Cycle |
|---|---|
| Ontology, SHACL and examples parse | 1 |
| Source JSON Schema valid and example conforms | 1 |
| SPARQL queries return results | 1 |
| Generated artifacts match the catalog (`build.py --check`) | 2 |
| The three OWL serializations have the same triple count | 2 |
| Catalog integrity: classes/relations present in OWL, packages, specializations, relation endpoints, no concept/class name clashes, valid `broader` | 2 |
| Examples conform to SHACL (`pyshacl`, RDFS inference) | 2 |
| Negative SHACL test: self-derivation from a non-artistic entity is rejected | 2 |
| Annotator schema valid; example accepted; invalid annotation rejected | 2 |
| Every term has en and pt-BR labels/definitions/comments; untagged content text is rejected by SHACL | 2 |

Expert and real-case evaluation: pending ([Open items](#open-items-by-phase)).

### Reuse

| Reused | How | Where |
|---|---|---|
| UFO / OntoUML | conceptual grounding and stereotypes | [foundation-and-mappings.md](foundation-and-mappings.md) |
| SKOS | controlled vocabularies | [aro.ttl](../../ontology/src/aro.ttl) |
| W3C Web Annotation (`oa:`) | selection selectors | `hasSelector` in [reference-model.md](reference-model.md) |
| PROV-O, FOAF, schema.org, Wikidata | agent identity and alignments via `rdfs:seeAlso` | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Dublin Core | `dcterms:source` on concepts; metadata | [aro.ttl](../../ontology/src/aro.ttl) |

### Publication

| What | Status | Where |
|---|---|---|
| MIT license (third-party ontologies not redistributed) | done | [LICENSE](../../LICENSE) |
| Citation | no DOI yet | [CITATION.cff](../../CITATION.cff) |
| Persistent IRI `w3id.org/aro` | declared, not registered | [aro.ttl](../../ontology/src/aro.ttl) |

---

## End-to-end traceability

From requirement to verification. Official matrix: [traceability.md](traceability.md).

| Requirement | CQ | Main classes | Query / check |
|---|---|---|---|
| FR-01–FR-02 | CQ-01 | Artwork, Manifestation, Selection | inspection |
| FR-03–FR-04 | CQ-02–CQ-03 | InterpretationRecord, InterpretiveJustification | inspection |
| FR-05–FR-06 | CQ-04 | SituationDescription, SituationPattern | inspection |
| FR-07–FR-09 | CQ-05–CQ-08 | ReferenceSource, EvidenceItem, CorrespondenceClaim | [CQ-05](../../queries/CQ-05-cases-by-pattern.rq), [CQ-06](../../queries/CQ-06-reference-sources.rq) |
| FR-10 | CQ-10, CQ-12 | ExplanationHypothesis, EvidenceAssessment | future |
| FR-11 | CQ-11 | AssessmentCriterion, InterpretationAssessment | future |
| FR-12 | CQ-01–CQ-18 | whole model | documentation review |
| FR-13–FR-14 | CQ-13–CQ-14 | DerivationClaim, DerivationType | [CQ-13](../../queries/CQ-13-derivations-of-work.rq), [CQ-14](../../queries/CQ-14-derivation-chains.rq), anchor SHACL |
| FR-15 | CQ-15–CQ-16 | TransformationAspect, ArtisticDimension, TransformationOperation | [CQ-15](../../queries/CQ-15-transformation-aspects.rq), [CQ-16](../../queries/CQ-16-patterns-retained.rq) |
| FR-16 | CQ-18 | CreativeAct, CreativeContribution, CreativeAgent, CreativeRole | [CQ-18](../../queries/CQ-18-creative-contributions.rq) |
| FR-17 | CQ-17 | InterpretiveJustification, ReferenceSource, EvidenceAssessment | [CQ-17](../../queries/CQ-17-derivation-explanations.rq) |
| FR-18 | — | Selection, oa:Selector, annotator schema | JSON Schema validation in tests |
| NFR-10 | — | conceptual catalog | `build.py --check` in tests |

---

## Open items by phase

| Phase / activity | Open item |
|---|---|
| Requirements | Executable queries for CQ-01–CQ-04 and CQ-07–CQ-12 |
| Capture | Expert review of stereotypes («roleMixin», «type», «relator», «kind» for information objects) |
| Design | ADR-009 (native OntoUML export) and ADR-010 (identity of propositions vs records) still open; formal alignment with LRMoo |
| Implementation | JSON-LD context for the annotator; annotation JSON → RDF converter |
| Knowledge acquisition | Check against the originals the data marked † (Tillett 1991) and Smiraglia's categories (amplifications, extractions) |
| Evaluation | Expert validation; evaluation with real cases; tests for CQ-10–CQ-12 |
| Publication | w3id registration, DOI, public repository |

---

## Reverse map: file → SABiOx phase

| File / folder | Phase or activity | Generated? |
|---|---|---|
| [purpose-and-scope.md](purpose-and-scope.md) | Requirements | no |
| [requirements.md](requirements.md) | Requirements | no |
| [competency-questions.md](competency-questions.md) | Requirements | no |
| [foundation-and-mappings.md](foundation-and-mappings.md) | Setup · Reuse · Knowledge acquisition | no |
| [ontouml-status.md](../../model/ontouml-status.md) | Setup · Capture | no |
| [requirements.txt](../../requirements.txt) | Setup · Configuration management | no |
| [conceptual-model.json](../../model/conceptual-model.json) | Capture (**single source of truth**) | no |
| [model/diagrams/](../../model/diagrams/) | Capture · Documentation | **yes** |
| [reference-model.md](reference-model.md) | Capture · Documentation | **yes** |
| [derivation-typology.md](derivation-typology.md) | Capture · Knowledge acquisition | no |
| [design-decisions.md](design-decisions.md) | Design | no |
| [datatypes-and-validation.md](datatypes-and-validation.md) | Design | no |
| [aro-shapes.ttl](../../validation/aro-shapes.ttl) | Design | **yes** |
| [schemas/](../../schemas/) | Design | `record` and `derivation-annotation` **yes**; `reference-source` no |
| [ontology/src/](../../ontology/src/) | Implementation (development version, modules) | **yes** |
| [releases/](../../releases/README.md) | Configuration management · Publication (frozen versions) | copied by `build.py --release`, then never changed |
| [build.py](../../scripts/build.py) | Setup · Implementation · Configuration management | no |
| [validate.py](../../scripts/validate.py), [query.py](../../scripts/query.py) | Implementation · Publication (user tools) | no |
| [annotator/](../../annotator/README.md), [annotator.py](../../scripts/annotator.py) | Implementation · Publication (annotation tool) | no |
| [examples/](../../examples/) | Implementation · Evaluation | no |
| [queries/](../../queries/) | Implementation · Evaluation | no |
| [test_project.py](../../tests/test_project.py) | Evaluation | no |
| [traceability.md](traceability.md) | Evaluation · Documentation | no |
| [sabiox-plan.md](sabiox-plan.md) | Configuration management · Documentation | no |
| [CHANGELOG.md](../../CHANGELOG.md), [CITATION.cff](../../CITATION.cff) | Configuration management · Publication | no |
| [README.md](../../README.md), [LEIA-ME.md](../../LEIA-ME.md) | Documentation · Publication (user guides) | class overview section **yes** |
| [LICENSE](../../LICENSE) | Publication | no |

**Rule of thumb:** to change the model, edit [conceptual-model.json](../../model/conceptual-model.json), run `python scripts/build.py`, then `python tests/test_project.py`. Files marked as generated must never be edited by hand.

---

[← Back to README](../../README.md) · [Português](../pt-BR/sabiox-compilado.md)
