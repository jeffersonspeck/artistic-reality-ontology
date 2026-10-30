[← Back to README](../../README.md) · [Português](../pt-BR/foundation-and-mappings.md)

# Foundational ontology and reuse mapping

- **UFO-A:** identity, rigidity, endurants, sortal kinds/subkinds and dependency. Some class stereotypes are provisional commitments and still require expert review.
- **UFO-B:** acts and events; descriptions of represented fictional events are *not* themselves empirical UFO-B events.
- **UFO-C:** agency, intentionality, social/information objects, documents and normative interpretation are conceptual grounding only.
- **gUFO 1.0.0:** lightweight OWL implementation mainly of UFO-A and limited UFO-B. It **does not** fully implement UFO-C. We do not assert OWL imports or equivalences that imply full UFO-C implementation.
- **Other UFO-C OWL artifacts:** the Czech Technical University has published a separate UFO-C OWL artifact (1.1.0); this is not evidence that gUFO contains UFO-C.
- **OntoUML:** a conceptual reference model. DOT views here are illustrations, NOT native exchange JSON and not yet semantically checked by an OntoUML validator.
- **OWL:** operational projection: preserves classes, predicates, labels and two subtyping relations, but does not encode complete modal/dependency semantics, fiction semantics, defeasible epistemology or grounded causal inference.
- **PROV-O:** recommended for provenance in a future increment; evidence records and reference sources are not assumed prov:Entity subclasses without reviewing modelling implications.
- **Dublin Core:** recommended for bibliographic metadata.
- **W3C Web Annotation:** adopted in v0.2: `Selection hasSelector oa:Selector` (ADR-021), and the annotator schema uses the same selector shapes.
- **Agents:** `Analyst` and `CreativeAgent` are «roleMixin»s; agents themselves come from external ontologies (ADR-019, ADR-022).
- **Derivation (v0.2):** `DerivationClaim` links via `rdfs:seeAlso` to `prov:wasDerivedFrom`, `schema:isBasedOn` and Wikidata `P144` (based on). These are **not** equivalences: those properties assert derivation as fact, while ARO represents a contestable claim made by an agent. IFLA LRMoo/FRBRoo work-to-work derivation relations and Genette's hypertextuality (transformation vs imitation) informed the derivation type vocabulary; formal alignment is backlog.
- **UFO and derivation:** `CreativeAct` is a UFO-B event, `CreativeContribution` a UFO-A relator between act and agent, `CreativeAgent` a «roleMixin» that accepts agents from external ontologies (`rdfs:seeAlso` prov:Agent, foaf:Agent, schema:Person, schema:Organization) without modelling them; vocabulary classes are provisional high-order «type»s. See [derivation typology](derivation-typology.md) for the literature behind the vocabularies.

## Known limitations

The reference model and the OWL projection are **not semantically equivalent**. Strong UFO rigidity, historical/simultaneous dependencies, defeasible justifications, fictional worlds, confidence calibration and causal claims cannot be validated from the OWL axioms alone. Some OntoUML stereotypes are preliminary, and a native OntoUML JSON export requires a separate authoring/validation step (the [OntoUML exchange schema](https://github.com/OntoUML/ontouml-schema) is unrelated to the application JSON Schemas in `schemas/`). SHACL checks closed-world structural necessities only when run by a SHACL engine. The tests confirm syntax, structure and query behaviour, not the correctness of the domain theory.

## Sources
- Aguiar & Souza, *SABiOx: the Extended Systematic Approach for Building Ontologies* (2024): https://ceur-ws.org/Vol-3905/paper1.pdf
- SABiOx official guide: https://nemo.inf.ufes.br/wp-content/uploads/sabiox-guide2024-09.pdf
- https://nemo.inf.ufes.br/en/projetos/ufo/
- https://nemo-ufes.github.io/gufo/
- https://onto.fel.cvut.cz/ontologies/ufo-c
- https://github.com/OntoUML/ontouml-schema

---

[← Back to README](../../README.md) · [Português](../pt-BR/foundation-and-mappings.md)
