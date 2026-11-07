[← Back to README](../../README.md) · [Português](../pt-BR/foundation-and-mappings.md)

# Foundational ontology and reuse mapping

- **UFO-A:** identity, rigidity, endurants, sortal kinds/subkinds and dependency. Some class stereotypes are provisional commitments and still require expert review.
- **UFO-B:** acts and events; descriptions of represented fictional events are *not* themselves empirical UFO-B events.
- **UFO-C:** agency, intentionality, social/information objects, documents and normative interpretation are conceptual grounding only.
- **gUFO 1.0.0:** lightweight OWL implementation mainly of UFO-A and limited UFO-B. It **does not** fully implement UFO-C. We do not assert OWL imports or equivalences that imply full UFO-C implementation.
- **Other UFO-C OWL artifacts:** the Czech Technical University has published a separate UFO-C OWL artifact (1.1.0); this is not evidence that gUFO contains UFO-C.
- **OntoUML:** a conceptual reference model. DOT views here are illustrations, NOT native exchange JSON and not yet semantically checked by an OntoUML validator.
- **OWL:** operational projection: preserves classes, predicates, labels and two subtyping relations, but does not encode complete modal/dependency semantics, fiction semantics, defeasible epistemology or grounded causal inference.
- **PROV-O:** aligned since 0.3 by `rdfs:seeAlso` (ADR-031): `InterpretiveAct`/`CreativeAct` ~ `prov:Activity`, `producedByAct` ~ `prov:wasGeneratedBy`, `hasParticipant` ~ `prov:wasAssociatedWith`, `Agent` ~ `prov:Agent`. ARO keeps its own terms because its records are claims, not provenance facts.
- **Dublin Core:** `citesSource` ~ `dcterms:references`; `ReferenceSource` ~ `dcterms:BibliographicResource`; `dcterms:` is recommended for bibliographic metadata of sources.
- **W3C Web Annotation:** adopted in v0.2: `Selection hasSelector oa:Selector` (ADR-021), and the annotator schema uses the same selector shapes.
- **Agents (0.3, ADR-029):** «category» `Agent` over «kind» `Person` and «collective» `Collective`; the «roleMixin»s `Analyst` and `CreativeAgent` are specialized by «role»s defined in OWL as intersections (e.g. `PersonAnalyst` ≡ `Person` ⊓ `Analyst`). Agents are still IRIs of external ontologies (ADR-019, ADR-022); typing them `aro:Person`/`aro:Collective` places them in the pattern.
- **Derivation:** `DerivationClaim` links via `rdfs:seeAlso` to `prov:wasDerivedFrom`, `schema:isBasedOn` and Wikidata `P144` (based on). These are **not** equivalences: those properties assert derivation as fact, while ARO represents a contestable claim made by an agent. Genette's hypertextuality (transformation vs imitation) and IFLA LRMoo work-to-work relations informed the derivation type vocabulary.
- **UFO and derivation:** `CreativeAct` is a UFO-B event; `CreativeContribution` is a UFO-A relator mediating the agent (`contributionBy`) and the artistic entity (`contributionTo`), founded by the act (`hasContribution`); vocabularies are high-order «type»s whose instances are SKOS concepts.

## Alignments (0.3)

All alignments are `rdfs:seeAlso` (ADR-031): they point to the closest term elsewhere without importing it or asserting equivalence.

| ARO | Aligned with | Why not an equivalence |
|---|---|---|
| `Artwork`, `Expression`, `Manifestation` | `lrmoo:F1_Work`, `lrmoo:F2_Expression`, `lrmoo:F3_Manifestation` (IFLA LRMoo) | ARO adopts the LRM levels (ADR-028) but not LRMoo's CIDOC-CRM commitments |
| `hasExpression`, `hasManifestation`/`embodiesExpression` | `lrmoo:R3_is_realised_in`, `lrmoo:R4_embodies` | same reason |
| `CreativeAct` | `prov:Activity`, `lrmoo:F28_Expression_Creation` | a creative act may produce several levels at once |
| `Selection` | `oa:SpecificResource` | a selection is a domain entity that may carry several selectors |
| `InterpretationRecord`, `hasPrimarySelection` | `oa:Annotation`, `oa:hasTarget` | an interpretation is a claim with an act, justification and assessment, not just an annotation |
| `InterpretiveAct`, `producedByAct`, `hasParticipant` | `prov:Activity`, `prov:wasGeneratedBy`, `prov:wasAssociatedWith` | ARO records who asserted a claim, not the provenance of data |
| `Claim`, `Assessment` | `schema:Claim`, `schema:ClaimReview` | schema.org reviews have ratings and publishers ARO does not require |
| `ReferenceSource`, `citesSource` | `dcterms:BibliographicResource`, `schema:CreativeWork`, `dcterms:references` | — |
| `Agent`, `Person`, `Collective` | `prov:Agent`, `foaf:Agent`, `foaf:Person`, `schema:Person`, `foaf:Group`, `schema:Organization`, `schema:MusicGroup` | agents stay external IRIs |
| `DerivationClaim` | `prov:wasDerivedFrom`, `schema:isBasedOn`, `wdt:P144` | those assert derivation as a fact |

## Known limitations

The reference model and the OWL projection are **not semantically equivalent**. Strong UFO rigidity, historical/simultaneous dependencies, defeasible justifications, fictional worlds, confidence calibration and causal claims cannot be validated from the OWL axioms alone. OntoUML stereotypes were revised in 0.3 (one kind for analytical records, categories instead of unions, the role pattern for agents, a relator with two relata) but are not yet checked in an OntoUML tool, and a native OntoUML JSON export requires a separate authoring/validation step (the [OntoUML exchange schema](https://github.com/OntoUML/ontouml-schema) is unrelated to the application JSON Schemas in `schemas/`). SHACL checks closed-world structural necessities only when run by a SHACL engine. The tests confirm syntax, structure and query behaviour, not the correctness of the domain theory.

## Sources
- Aguiar & Souza, *SABiOx: the Extended Systematic Approach for Building Ontologies* (2024): https://ceur-ws.org/Vol-3905/paper1.pdf
- SABiOx official guide: https://nemo.inf.ufes.br/wp-content/uploads/sabiox-guide2024-09.pdf
- https://nemo.inf.ufes.br/en/projetos/ufo/
- https://nemo-ufes.github.io/gufo/
- https://onto.fel.cvut.cz/ontologies/ufo-c
- https://github.com/OntoUML/ontouml-schema

---

[← Back to README](../../README.md) · [Português](../pt-BR/foundation-and-mappings.md)
