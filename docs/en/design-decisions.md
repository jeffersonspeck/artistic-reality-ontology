[← Back to README](../../README.md) · [Português](../pt-BR/design-decisions.md)

# Design decision register

| ID | Decision | Consequence | Status |
|---|---|---|---|
| ADR-001 | An anchored interpretation is an InterpretationRecord, not a Selection (v0.1 called this "derivation"; the term is now reserved for ADR-011) | Maintain explicit source anchor | Adopted (renamed in v0.2) |
| ADR-002 | Interpretations may conflict | No functional meaning per selection | Adopted |
| ADR-003 | Represented and empirical realms are distinct | Separate SituationDescription and EmpiricalSituation | Adopted |
| ADR-004 | A source is reusable and independent | Many-to-many citation paths; reference can support or challenge different claims | Adopted |
| ADR-005 | Evidence supports a specific assessment, not automatic truth | Explicit EvidenceAssessment | Adopted |
| ADR-006 | Correspondence is an information claim, not a UFO relator | Evaluate before assigning epistemic status | Adopted |
| ADR-007 | OWL is an approximation of reference semantics | SHACL and process rules complement OWL | Adopted |
| ADR-008 | No full UFO-C OWL import | Conceptual grounding documented | Adopted |
| ADR-009 | Create native OntoUML exchange only after tool validation | DOT/SVG treated as reference views | Open |
| ADR-010 | Decide identity of abstract propositions vs authored records | Avoid silent equivocation | Open |
| ADR-011 | Derivation between works is a contestable DerivationClaim, not a fact-asserting property | Claims can be cited, assessed with evidence and contradicted; prov:wasDerivedFrom, schema:isBasedOn and Wikidata P144 are linked via rdfs:seeAlso only | Adopted |
| ADR-012 | No ontological commitment on whether a cover/translation is a new artwork or a new manifestation | Each claim states its level through its anchors (Artwork, Manifestation or Selection) | Adopted |
| ADR-013 | Each hop of a derivation chain is represented as a separate claim; no transitivity axiom (no owl:TransitiveProperty); chains are retrieved by query | Each hop keeps its own evidence and status (CQ-14) | Adopted |
| ADR-014 | Legality, authorization and originality of derivations are outside the scope of the ontology; derivations are represented with the explanations agents give for them | No authorization vocabulary; derivative works are creations in their own right; Genette's "plagiat" is named UnacknowledgedBorrowing | Adopted (revised in v0.2) |
| ADR-015 | One claim links exactly one source and one derived anchor | Mashups and multi-source works use several claims | Adopted |
| ADR-016 | Derivation types, dimensions, operations, roles and statuses are SKOS concepts typed by high-order classes | Vocabularies extensible without schema change; OntoUML «type» stereotype provisional | Adopted |
| ADR-017 | model/conceptual-model.json is the single source of truth; scripts/build.py generates OWL, SHACL, schemas, reference docs and diagrams | Tests fail if generated artifacts drift from the catalog | Adopted |
| ADR-018 | Derivation stance (homage, parody's critique, play) is a separate DerivationRegime axis, not a type | Types describe mechanism; regimes describe stance (after Genette) | Adopted |
| ADR-019 | CreativeAgent is a «roleMixin»; agents themselves are not modelled | Any external agent IRI (PROV-O, FOAF, schema.org, Wikidata) is accepted; SHACL requires only an IRI | Adopted |
| ADR-020 | Artistic dimensions form a SKOS hierarchy by medium family | Annotation tools can offer per-medium lists; use the most specific concept | Adopted |
| ADR-021 | Selections are located with W3C Web Annotation selectors (oa:Selector) via hasSelector; selectorExpression is only a shortcut | Interoperable with annotation tools (media fragments, text quote/position, SVG) | Adopted |
| ADR-022 | Analyst is a «roleMixin» like CreativeAgent | Analysts are external agent IRIs; SHACL requires only an IRI | Adopted |
| ADR-023 | The annotator exchange schema (schemas/derivation-annotation.schema.json) is generated from the SKOS vocabularies | Annotation tools cannot drift from the ontology vocabulary | Adopted |
| ADR-024 | Ontology language policy: all IRIs and terms in English; every class, property, concept, scheme, comment, SHACL message and ontology metadata carries en and pt-BR literals; recorded content (textValue, derivationExtent, annotator texts) accepts any BCP 47 language | rdf:langString enforced by SHACL; tests check en/pt-BR coverage of every term | Adopted |

---

[← Back to README](../../README.md) · [Português](../pt-BR/design-decisions.md)
| ADR-025 | Repository layout with development and frozen versions (as in OntoMI): `ontology/src/` holds the generated development ontology and one module per package; `releases/v<version>/` holds immutable snapshots with release notes; every version has `owl:versionIRI` and links to the previous one with `owl:priorVersion` | Citable, comparable versions; `build.py --release` refuses to overwrite a release | Adopted |
