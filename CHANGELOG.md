# Changelog

All notable changes to ARO. Versions follow the SABiOx development cycles (see `docs/*/sabiox-plan.md`).

## [0.2.0-beta] - 2026-10-30

Frozen files: [releases/v0.2.0-beta](releases/v0.2.0-beta/RELEASE-NOTES.md).

SABiOx cycle 2: derivation between works, annotator readiness and single source of truth.

### Added

- **Derivation package** (`derivation`): `DerivationClaim`, `TransformationAspect`, `CreativeAct`, `CreativeAgent`, `CreativeContribution`, and the high-order classes `DerivationType`, `DerivationRegime`, `ArtisticDimension`, `TransformationOperation`, `CreativeRole`.
- **Five SKOS vocabularies**: 40 derivation types in five families (re-realization, incorporation, transformation, imitation, extension), 4 derivation regimes, 56 artistic dimensions in 7 medium families, 5 transformation operations and 10 creative roles; each concept cites its literature (`dcterms:source`).
- **Explanation of derivations**: `derivationJustifiedBy` (to `InterpretiveJustification`), `derivationReferencesSource`, `assessesDerivation`, `claimProducedByAct`.
- **W3C Web Annotation selectors**: `Selection hasSelector oa:Selector` (media fragments, text quote/position, SVG).
- **Annotator exchange schema** `schemas/derivation-annotation.schema.json`, generated from the vocabularies, with multilingual texts and an example (`examples/synthetic-derivation-annotation.json`).
- **Generator** `scripts/build.py`: produces OWL (TTL, RDF/XML, JSON-LD), SHACL, JSON Schemas, reference docs and DOT/SVG diagrams from `model/conceptual-model.json`; `--check` detects drift.
- **SHACL**: derivation cardinality/class constraints, IRI node kind for agents, language-tagged text constraints, SPARQL constraints (anchor kind, distinct anchors), all with en/pt-BR messages.
- **Requirements and CQs**: FR-13–FR-18, NFR-10, CQ-13–CQ-18 with six SPARQL probes.
- **Examples**: fictional derivation network (cover, sampling, intermedial adaptation, fan work chain) with multilingual texts and external agents.
- **Documentation**: derivation typology with literature review and bibliography; SABiOx compilation in English and Portuguese (`docs/en/sabiox-compilation.md`, `docs/pt-BR/sabiox-compilado.md`); ADR-011–ADR-024.
- **User tools**: `scripts/validate.py` (SHACL validation of any data, messages in en or pt-BR) and `scripts/query.py` (run a competency query over any data); `examples/quickstart.ttl`.
- **Entry pages**: README.md and LEIA-ME.md rewritten as user guides (what ARO is, installation, use, step-by-step instantiation, validation, queries, classes); their class overview is generated from the catalog. Methodology, foundations and limitations moved to `docs/`.
- **Navigation**: every document in `docs/` (and `model/ontouml-status.md`) links back to README/LEIA-ME and to its other-language version, at the top and bottom.
- **Requirements as tables**: each FR/NFR now states how it is met, how it is verified and its status (met, met by inspection, partial with the gap stated).
- **Module map image**: `model/diagrams/modules.en.svg` and `modules.pt-BR.svg`, generated from the catalog (`module_diagram`), replace the text diagram in README/LEIA-ME.
- **Class documentation**: for each class the reference model now states what its stereotype means in UFO, how it is represented in OWL/TTL (with its Turtle triples), its SHACL constraints, what OWL cannot express and the gUFO pattern that would apply; a summary table maps each stereotype to OWL. README class tables gain a UFO column.
- **Annotator** (`annotator/`, started with `python scripts/annotator.py`): web tool to create and link ARO individuals (relations restricted by domain/range; vocabulary, selector and external-agent pickers), multilingual texts, links, Google search for situations and cases, expandable graph (Cytoscape.js), Turtle save/load (N3.js), in-browser checks from the SHACL shapes, English/Portuguese interface.
- **Annotator, analysis features**: neighbours open in a ring around the node grouped by relation (rest of the drawing stays put), tree or network layout, relation names on/off, highlighted relations of the selected node; focus tab for one node (depth 1–3, synchronized with the main tab); PNG export and print/PDF of the graph with the selected node's details; local source texts attached to a manifestation show the lines of each `line=a,b` selection and can be stored as `TextQuoteSelector` (texts stay in the browser; `private/` is git-ignored for researcher-owned texts). "Load example" now opens the case studies.
- **Per-work example files**: `examples/example_homem_na_estrada.ttl` and `examples/example_vidas_secas.ttl`, generated from `case-studies.ttl` (kept with all works) by `scripts/split_examples.py`; tests check they are up to date, valid and together cover the full file.
- **Annotator, hiding**: "Works shown" checkboxes hide a work with everything only it uses; "Show only this work"; "Hide node" with a list of hidden nodes to restore; node counter shows visible / total.
- **Academic affiliation**: doctoral project of Jefferson Rodrigo Speck (PPGInf/UFPR), supervised by Prof. Dr. Roberto Pereira (UFPR) and co-supervised by Prof. Dr. Clodis Boscarioli (UNIOESTE), GTIE/UNIOESTE — in `CITATION.cff` (authors, abstract), `LICENSE`, ontology metadata (`dcterms:creator`, `dcterms:contributor`, bilingual comment) and README/LEIA-ME; suggested citation in both languages.
- **Beta status**: version badge `0.2.0-beta` and "beta · in development" notice in README/LEIA-ME.
- **Annotator manual** (`docs/en/annotator-manual.md`, `docs/pt-BR/manual-anotador.md`): installation, start, screen, step-by-step first annotation, navigation, languages and links, local texts, validation, save/load, image/PDF, full validation and queries, running the tests, troubleshooting; "Running the tests" section in README/LEIA-ME.
- **Repository layout with releases** (ADR-025, following OntoMI): development ontology moved to `ontology/src/` with one module per package in `ontology/src/modules/`; frozen versions in `releases/v0.1.0/` (the original 0.1.0 files) and `releases/v0.2.0-beta/`, each with release notes in English and Portuguese; `owl:versionIRI` and `owl:priorVersion`; `python scripts/build.py --release` (refuses to overwrite); tests check every release.
- **Annotator, schema-driven forms**: "Add as target" for relations arriving at a node (properties whose range accepts it); new nodes may be of any subclass of the range; SHACL `maxCount` hides properties already full and `minCount` marks and lists missing required relations; general datatype properties folded under "More properties"; `aro:isRequiredCondition` now has domain `PatternCondition`.
- **Links**: new `aro:externalLink` (any resource) and `aro:sourceURL` now scoped to `ReferenceSource`; FR-19 and FR-20.
- **Case studies** (`examples/case-studies.ttl`, `docs/*/case-studies.md`): *Homem na Estrada* (Racionais MC's, 1993; 15 events located by line ranges of the lyric transcription, a recorded interpretation challenge, sample of Tim Maia's *Ela Partiu*) and *Vidas Secas* (Graciliano Ramos, 1938; 4 chapters, 1963 film adaptation), ten situation patterns, five real cases with public sources, evidence assessments and one explanatory hypothesis; no lyrics or novel text reproduced; research-question queries RQ-01–RQ-04 with tested answers.
- **Comments**: explanatory comments in the generator, tests, SPARQL queries and examples; generated-file notices in Turtle, RDF/XML, JSON Schema and DOT outputs; `$comment` describing the catalog structure.

### Changed

- **Language policy (ADR-024)**: English IRIs; every class, property, concept, scheme, comment, SHACL message and ontology metadata now has en and pt-BR literals, including dependency and grounding; `textValue` and `derivationExtent` are `rdf:langString` and accept any language.
- **Agents**: `Analyst` and `CreativeAgent` are «roleMixin»s; agents come from external ontologies (PROV-O, FOAF, schema.org, Wikidata) and are not modelled (ADR-019, ADR-022).
- **ADR-001** renamed the v0.1 sense of "derivation" to "anchored interpretation", reserving the term for derivation between works.
- **ADR-014**: legality, authorization and originality are outside the scope of the ontology; derivative works are represented as creations in their own right.
- **Typology review**: parody moved to transformation and allusion to incorporation (Genette); homage replaced by the regime axis; "plagiarism" renamed `UnacknowledgedBorrowing`; remix split into `ExtendedRemix` and `Remix` (Navas).
- **Tests**: build-drift check, catalog integrity, bilingual coverage, SHACL conformance and negative tests (pyshacl), annotator schema positive/negative tests, UTF-8 reading.
- **Diagrams**: all SVGs re-rendered with Graphviz; new `derivation` diagram with neighbouring classes.
- `requirements.txt` adds `pyshacl`.

### Removed

- Authorization status vocabulary and `hasAuthorizationStatus` (legality is out of scope).

## [0.1.0] - 2026-10-30

Frozen files: [releases/v0.1.0](releases/v0.1.0/RELEASE-NOTES.md).

SABiOx cycle 1: baseline.

- First bilingual SABiOx repository baseline.
- Added reusable independent ReferenceSource and contextual EvidenceItem/EvidenceAssessment.
- Defined conceptual catalog, preliminary stereotypes, SVG diagrams, RDF/OWL projections and JSON Schemas.
- Added 12 competency questions, 2 query probes and synthetic test data.
- Explicitly recorded validation and UFO-C mapping limitations.
