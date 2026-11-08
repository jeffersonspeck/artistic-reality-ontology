# Changelog

All notable changes to ARO. Versions follow the SABiOx development cycles (see `docs/*/sabiox-plan.md`).

## [1.0.0] - 2026-11-07

Frozen files: [releases/v1.0.0](releases/v1.0.0/RELEASE-NOTES.md). First stable version: the 0.3 model frozen without the provisional marks. **No class, relation, domain, range or constraint changed**; 0.3 data stays valid (only `owl:versionIRI` and `owl:versionInfo` change, and `owl:priorVersion` points to 0.3.0-beta).

### Changed

- **Version 1.0.0, stable**: version IRI `https://w3id.org/aro/ontology/1.0.0`; README/LEIA-ME, `CITATION.cff` and the releases index no longer describe ARO as beta or a research draft.
- **OntoUML commitments**: class comments read "OntoUML stereotype: …" (was "provisional"); the high-order vocabulary types and «instantiation» lose the provisional mark. Basis: the OntoUML export is valid against the official schema and well formed with `scripts/verify_ontouml.py` and the official ontouml-js 1.0.0 library (0 errors, 33 warnings accepted by ADR-032). ADR-009 and ADR-016 updated.
- **Documentation aligned with what is implemented**: the reference model intro, `docs/*/ontouml.md` and `model/ontouml-status.md` describe the OntoUML exchange file that already exists; the UFO notes for «kind», «event» and «situation» mention the disjointness of ultimate sortals and the `startDate`/`endDate` dates; the SABiOx plan and compilation record completed phases (with a 1.0.0 section) and list later work under "Next versions"; FR-10/FR-11 in the traceability table point to the CQ-10–CQ-12 queries.
- **Homem na Estrada (researcher's annotation)**: `examples/aro_homem_na_estrada_realidade_social.ttl` redone in the current structure: agents typed `aro:Person`/`aro:Collective`; IFLA LRM levels (recording and lyric text as expressions, the album *Raio X do Brasil* and the public transcription as manifestations, passages located in the transcription); every analytical record authored by `producedByAct` through two dated interpretive acts (replacing `prov:wasAttributedTo`); every assessment with `assessmentOutcome`; `citesSource` instead of `prov:wasDerivedFrom`; dated empirical situations; depicted agents and elements; an `IntentionalStateDescription`; a criteria assessment and a justified challenge; the two explanatory hypotheses assessed as inconclusive (CQ-12); the sample of Tim Maia's *Ela Partiu* as a `DerivationClaim`. No claim is left without grounds (CQ-19). Report updated (`docs/pt-BR/relatorio-anotacao-homem-na-estrada-realidade-social.md`).
- **Annotator**: published on GitHub Pages (<https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/>, `.nojekyll`), linked from README/LEIA-ME and the manuals; a focus tab reads its data from the tab that opened it and never overwrites the shared draft with an empty graph; tabs no longer bounce the draft between them (nodes can be dragged again with several tabs open; blank-node labels stay stable); the node counter follows every redraw; PNG export and Print / PDF draw the graph as it looks on screen (cards, colours, badges, highlighted relations) instead of plain boxes; action buttons and menus are plain text; help texts rewritten.
- **Case studies** (`examples/case-studies.ttl` and the per-work files): correspondence claims and assessments are worded at the level of the pattern, because the state-violence pattern is shared by *Homem na Estrada* and *Vidas Secas* and its real cases reach both works; `corr-hne-police`/`assess-hne-police` renamed `corr-police-lethality`/`assess-police-lethality` (the Vidas Secas file no longer carries a claim named after, and speaking of, the song); every claim and assessment authored by `producedByAct`. `docs/*/case-studies.md` explains how a shared pattern brings its cases to every work.
- **Other examples**: `quickstart.ttl` matches the README (analyst typed `aro:Person`, dated act, derivation claim authored); `synthetic-data.ttl` and `synthetic-derivation.ttl` type their agents `aro:Person`/`aro:Collective` (no direct instance of the abstract `Analyst`), date their acts and give assessments an outcome and an author.
- **Annotator guide**: "Load example" opens the case studies, as the annotator does.
- **Tests**: the OWL 2 RL consistency check also covers the Homem na Estrada annotation.

### Removed

- Annotations of *Homem na Estrada* left in the 0.2 structure: `examples/aro_homem_na_estrada_refeita.ttl` (its *Ela Partiu* derivation moved to the annotation above), its accidental copy `examples/aro_homem_na_estrada_refeita - Copia.ttl`, and `examples/example_homem_na_estrada_revisado.ttl` (v0.2.0-beta revision of the case study). The case study itself stays in `examples/case-studies.ttl` and `examples/example_homem_na_estrada.ttl`.

## [0.3.0-beta] - 2026-11-06

Frozen files: [releases/v0.3.0-beta](releases/v0.3.0-beta/RELEASE-NOTES.md). SABiOx cycle 3: claims, UFO top level and IFLA LRM. **Breaking changes** for 0.2 data: run `python scripts/migrate.py file.ttl` (the annotator converts older files when it opens them).

### Added

- **`Claim`** (abstract «subkind», ADR-026) generalizing InterpretationRecord, DerivationClaim, CorrespondenceClaim, EmpiricalClaim, ExplanationHypothesis and Challenge; **`AnalyticalRecord`** (the single «kind» of every analytical record, ADR-027); new packages `claim` (Claims and records) and `agent` (Agents).
- **Categories instead of unions** (ADR-027): `ArtisticEntity` (artwork, expression, manifestation, selection) is the range of derivation anchors, `producesCreation` and `contributionTo`; `Agent` generalizes persons and collectives. No relation has a union range any more.
- **IFLA LRM levels** (ADR-028): `Expression` (realization with its own content) and `Manifestation` in the LRM sense (publication or carrier, optional), with `hasExpression`/`realizesArtwork`, `hasManifestation`/`embodiesExpression` (declared inverses) and `locatedInManifestation`.
- **OntoUML role pattern for agents** (ADR-029): `Person` («kind»), `Collective` («collective»), and the «role»s `PersonAnalyst`, `CollectiveAnalyst`, `PersonCreator`, `CollectiveCreator`, each defined in OWL as the intersection of its kind and its roleMixin.
- **Relator with two relata and time** (ADR-030): `contributionTo` («mediation», min 1); `startDate`/`endDate` on acts, empirical events and situations (year, year-month, date or date-time, checked by SHACL `sh:or`).
- **OWL axioms for the UFO commitments**: `owl:AllDisjointClasses` for ultimate sortals, `owl:disjointUnionOf` for abstract classes; the tests check the examples' consistency with an OWL 2 RL reasoner (`owlrl`).
- **Alignments** (ADR-031, `rdfs:seeAlso`): W3C Web Annotation (`oa:Annotation`, `oa:hasTarget`), PROV-O (`prov:Activity`, `prov:wasGeneratedBy`, `prov:wasAssociatedWith`, `prov:Agent`), IFLA LRMoo (F1/F2/F3, R3/R4, F28), schema.org (`Claim`, `ClaimReview`, `CreativeWork`), FOAF, Dublin Core.
- **Queries** CQ-19 (claims without grounds), CQ-20 (expressions and manifestations of a work), CQ-21 (dates of the creative acts behind a derivation).
- **SHACL**: per-class constraints (`shacl_by_class`, e.g. `producedByAct` required on InterpretationRecord), creative acts do not produce selections, evidence assessments weigh evidence, date datatypes.
- **Scripts**: `scripts/migrate.py` (0.2 → 0.3, textual, keeps comments, idempotent) and `scripts/compare_annotations.py` (Krippendorff's alpha between annotators on derivation vocabularies).
- **OntoUML exchange file** (ADR-009): `model/ontouml/aro.ontouml.json`, generated from the catalog in the official OntoUML JSON format, valid against the OntoUML JSON Schema 1.0.2 (copied in `model/ontouml/`, Apache-2.0) and well formed: `scripts/verify_ontouml.py` checks sortality, rigidity, identity providers, abstract non-sortals, role dependencies, relator mediations and relation stereotypes (0 errors; 33 plain associations as warnings, ADR-032); `scripts/verify_ontouml.mjs` runs the same rules with the official ontouml-js 1.0.0 library.
- **Every competency question has a query**: CQ-01–CQ-04 and CQ-07–CQ-12 added (selection in works, competing interpretations, premises, patterns, source reuse, evidence outcomes, authors and assessors, explanations, epistemic vs value criteria, evidence insufficient for causes); the tests check their expected answers on the case studies; all run in the annotator.
- **Assessments and criteria** (ADR-033): `assessmentOutcome` (supports, partiallySupports, challenges, inconclusive, irrelevant; SHACL `sh:in`), `EpistemicCriterion` and `ValueCriterion` (FR-11 now met); `producedByAct` applies to every analytical record, so assessments and challenges have authors. The case studies gain a reviewer with a competing reading, a criteria assessment and an inconclusive assessment of the causal hypothesis.
- **Evaluation protocol** (`docs/*/evaluation-protocol.md`): ontological review (OntoUML tool, anti-patterns, experts), domain review and a real-case annotation study with agreement and usability measures.
- **Examples**: the album *Raio X do Brasil* and the first edition of *Vidas Secas* as manifestations, dated creative and interpretive acts, agents typed `aro:Person`/`aro:Collective`.

### Changed

- **Renamed**: `Manifestation` (0.2, a version) → `Expression`; `InterpretiveJustification` → `Justification`; `InterpretationChallenge` → `Challenge` (targets any claim); `InterpretationAssessment` → `CriteriaAssessment`; `EvidenceAssessment` and `CriteriaAssessment` specialize the abstract `Assessment`.
- **Merged relations** (one per role of a claim): `claimProducedByAct` → `producedByAct`; `derivationJustifiedBy` → `hasJustification`; `referencesSource`, `caseHasReference`, `derivationReferencesSource` → `citesSource` (any analytical record); `supportsClaim`, `assessesCorrespondence`, `assessesInterpretation`, `assessesDerivation` → `assessesClaim` (1..*).
- **Stereotypes**: 22 informational «kind»s became «subkind»s of `AnalyticalRecord` (7 kinds in total); `Analyst` and `CreativeAgent` specialize the «category» `Agent`.
- **ADRs**: ADR-010 closed (a claim is an authored record); ADR-012, ADR-019 and ADR-022 revised.
- **Generator**: categories, roles with two parents, disjointness and coverings, abstract classes in italics with `{abstract}` in the OntoUML diagrams, per-class SHACL, date datatypes; overview generalizations into another package drawn lighter.
- **OntoUML diagrams**: also rendered as PNG at 200 dpi (`model/diagrams/ontouml/*.png`); the overview and the artwork, evidence and derivation packages are laid out left to right so they fit a page; relations between packages are drawn lighter than those inside a package.
- **Annotator**: abstract classes and agents are not offered for direct creation; module colours for the new packages; dates typed automatically (`gYear`, `gYearMonth`, `date`, `dateTime`); local texts attach to expressions; the in-browser validation knows the new anchors, creations and dates; 0.2 files and drafts are converted on load.
- **Documentation**: README/LEIA-ME, OntoUML page, foundations and mappings (alignment table), requirements, traceability, competency questions, case studies, SABiOx plan and compilation (cycle 3), annotator manual and guide.

## [0.2.1-beta] - 2026-11-06

Frozen files: [releases/v0.2.1-beta](releases/v0.2.1-beta/RELEASE-NOTES.md). Documentation release: no class, relation, domain, range or constraint changed.

### Added

- **Relation definitions**: every object property has a `skos:definition` in English and Portuguese (catalog fields `definition_en`/`definition_pt`) saying what it links and why; shown in the reference model's relation tables.
- **Modules in the ontology**: the six module IRIs are declared in `aro.ttl` with bilingual label and `dcterms:description` (catalog `packages[].description_*`) and linked by `dcterms:hasPart`; classes and relations point to their module with `rdfs:isDefinedBy`; module files carry the description.

### Changed

- **Annotator, adding nodes from a node**: the creation panel starts from the selected node and lists, by its type, the **Children** (this → relation → new) and **Parents** (new → relation → this) the ontology allows, one card per relation with its classes as chips (required first, full ones greyed, filterable); other options link an existing node, concept, selector or external IRI. Replaces the class picker with "Link to" and the "New node linked here…" menu form; the right-click menu now opens the panel on the node.
- **Annotator, node cards and hover descriptions**: graph nodes are HTML cards with the ontology class on top (module colour) and the text below, with a hidden-neighbours badge; hovering a node, relation, class chip or node pill explains the element (class, module, OntoUML nature, definition, relation description). PNG export and printing still draw the nodes.
- **Annotator, descriptions from the ontology**: relation cards and hover descriptions show the relation's `skos:definition`; class descriptions add the class's `rdfs:comment` (OntoUML stereotype, UFO foundation, dependency) and its module's description; module names come from the ontology.
- **Annotator, inspector**: header with class, module and expandable definition; a bar of actions; foldable cards for content, texts, references and links, data, relations and incoming relations; long texts clamped with "show more".

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
- **Annotator, linked creation and long texts**: "Link to" in the creation panel and a right-click "New node linked here…" menu, both offering only links allowed by the ontology (domain/range, subclasses, SHACL maximum); "Content" card with the full text; per-node "show full text" and a "Full texts" toggle that draws long texts as wider cards.
- **OntoUML diagrams** (`model/diagrams/ontouml/`, `docs/*/ontouml.md`): UML class diagrams in OntoUML notation generated from the catalog — class stereotypes, attributes, association stereotypes (`ontouml` field: «participation», «creation», «mediation», provisional «instantiation»), multiplicities at both ends, generalizations — overview and one per package, with rationale and a list of what must be reviewed before an official OntoUML export.
- **Annotator, CQ/RQ queries**: "Queries (CQ/RQ)" panel runs every query of `queries/` in the browser (Oxigraph WebAssembly) over the annotations plus the ontology, with the same results as `scripts/query.py`; editable SPARQL; clickable result nodes. `queries/index.json` (generated) lists each query with its question in English and Portuguese.
- **Annotator layout**: toolbar actions grouped in menus (File, Analysis, View, Export, Language) on a single line; side panels can be hidden (**Create**, **Inspector**, or a thin rail to reopen) and resized by dragging the splitter; **Graph only** hides both panels and reduces the toolbar; validation and query results are floating panels that can be minimized, closed and resized; the creation panel has folding sections. The layout is remembered in the browser (`annotator/layout.js`).
- **Homem na Estrada (revised annotation)**: `examples/aro_homem_na_estrada_refeita.ttl` now records the sample of Tim Maia's *Ela Partiu* in the 1993 recording (Sampling; recorded sound recontextualized; justification and cited source), so CQ-13, CQ-15, CQ-17 and CQ-18 answer on it. The analyst is identified as Jefferson Rodrigo Speck (PPGInf/UFPR), and Pedro Paulo Soares Pereira (Mano Brown) is credited as author of lyrics and music.
- **Language-independent queries**: CQ-13, CQ-15 and RQ-01–RQ-04 no longer require English texts; they declare `VALUES ?lang { "en" }` as the preferred language and fall back to any available language (`scripts/query.py --lang`, content language in the annotator). Data written only in Portuguese, such as `examples/aro_homem_na_estrada_refeita.ttl`, now answers RQ-01 and RQ-03; tests cover Portuguese-only data.
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
