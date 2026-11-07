[← Back to README](../../README.md) · [Português](../pt-BR/evaluation-protocol.md)

# Evaluation protocol

What the automated tests already show, and how ARO is to be evaluated by experts and with real cases (SABiOx evaluation activity, cycle 3 onwards). The automated tests check syntax, structure, constraints and query answers; they do **not** show that the domain theory is right, that the UFO commitments are adequate, or that analysts can use the ontology. This protocol covers those three questions.

## 1. Questions

| ID | Question | Strand |
|---|---|---|
| EQ-1 | Is the OntoUML model well formed, and are the UFO commitments (kinds, subkinds, categories, roles, relator, high-order types) adequate? | Ontological review |
| EQ-2 | Do the classes, relations and definitions cover what researchers say about art and reality, without missing or redundant concepts? | Domain review |
| EQ-3 | Can analysts annotate real works with ARO, and do independent analysts produce compatible annotations? | Annotation study |
| EQ-4 | Are the competency and research questions answered by the data analysts actually produce? | Annotation study |

## 2. Automated verification (already in place)

| Check | Tool | Where |
|---|---|---|
| Generated artifacts match the catalog | `scripts/build.py --check` | test 1 |
| OWL, RDF/XML and JSON-LD agree; every term labelled and defined in en and pt-BR | rdflib | tests 2–4 |
| UFO commitments projected into OWL: disjoint ultimate sortals, coverings of abstract classes, roles as intersections, relators with two mediations, no union ranges | catalog and OWL checks | test 3 |
| Examples are logically consistent with those axioms | OWL 2 RL reasoner (owlrl) | test 6 |
| SHACL conformance of every example, and violations on deliberately wrong data | pyshacl | test 6 |
| Every SPARQL query (CQ-01–CQ-21, RQ-01–RQ-04) answers on the examples; expected answers checked on the case studies | rdflib SPARQL | tests 7–8 |
| OntoUML export valid against the official schema and well formed | `scripts/verify_ontouml.py` | test 8 |

Run with `python tests/test_project.py`.

## 3. Strand A — ontological review (EQ-1)

1. **Tool check (ADR-009).** *Done automatically:* the OntoUML JSON export is validated against the official schema and verified for well-formedness (`python scripts/verify_ontouml.py`, see [OntoUML page](ontouml.md#validation-of-the-ontouml-model-adr-009-adr-032)). *Remaining:* rebuild or import the model in an OntoUML editor (e.g. the OntoUML plugin for Visual Paradigm) from `model/diagrams/ontouml/` and `docs/*/reference-model.md`; run its well-formedness verification; export the OntoUML JSON. Record every error and how it was resolved (new ADR when the model changes).
2. **Anti-pattern review.** Check the model against the OntoUML anti-patterns catalogued by Sales & Guizzardi (2015) — e.g. relators without enough mediations, mixed rigidity in generalizations, imprecise abstractions — and document each occurrence as accepted (with reason) or fixed.
3. **Expert review.** 2–3 ontology engineers with UFO/OntoUML experience review the [OntoUML diagrams](ontouml.md) and the stereotype table of the [reference model](reference-model.md). For every class they answer: *Is the stereotype adequate? Is the identity principle clear? Is the definition precise?* (yes / partly / no, with comments). Open points raised in [ontouml.md](ontouml.md) (the «instantiation» of SKOS concepts, external classes) are asked explicitly.

**Outcome:** list of findings with decisions; updated catalog and ADRs; OntoUML JSON export.

## 4. Strand B — domain review (EQ-2)

Participants: 3–5 researchers in literature, music, film or cultural studies, and 1–2 researchers in social sciences who work with empirical evidence.

Instrument (per participant, about 60 minutes):
1. a short presentation of ARO's purpose and the [module map](../../model/diagrams/modules.en.svg);
2. for each module, the class list with definitions ([reference model](reference-model.md)); questions on a 5-point scale — *clarity*, *relevance*, *completeness* — and open questions: *what is missing? what would you name differently? what is redundant?*;
3. the competency questions ([CQ list](competency-questions.md)): *would you ask this? what other questions would you ask?*;
4. the derivation vocabularies (types, regimes, dimensions, operations, roles): *are the concepts distinguishable? are important ones missing?*

**Analysis:** median scores per class and per vocabulary; thematic coding of open answers; each change proposal becomes an issue and, when accepted, a catalog change with an ADR.

## 5. Strand C — real-case annotation study (EQ-3, EQ-4)

**Material.** 3 works in different media (e.g. a song, a novel chapter, a film), each with at least one derivation (cover, sample, adaptation) and one plausible correspondence with documented real cases. A **skeleton file** with the works, expressions, manifestations and selections (line ranges, time spans) is given to everyone, so that every annotator uses the same IRIs for anchors. No copyrighted text is distributed: participants use their own copies, attached locally in the annotator.

**Participants.** 6–10 analysts (graduate students or researchers of the domain), working independently with the [annotator](../../annotator/README.md) after a 30-minute training with the [manual](annotator-manual.md).

**Tasks** (per work): interpret 3 given selections (situation, pattern); state the derivation between the given anchors (type, regime, at least two transformation aspects, justification); link one pattern to a real case with a source, an evidence item and an assessment; challenge or assess one claim of the example data.

**Measures.**

| Measure | How | Target (tentative) |
|---|---|---|
| Completion and time per task | annotator logs and observation | ≥ 80 % of tasks completed |
| Validity of the produced data | `python scripts/validate.py` on each file | no violations after the annotator's own validation |
| Agreement on derivations | `python scripts/compare_annotations.py a.ttl b.ttl …` — Krippendorff's alpha (nominal) per vocabulary: types, regimes, aspects | α ≥ 0.667 for types (Krippendorff 2004: tentative conclusions) |
| Answerability of the questions | run every `queries/*.rq` over the merged files; for CQ-19, the share of claims without grounds | every CQ/RQ answers; ≤ 20 % ungrounded claims |
| Usability of the annotator | System Usability Scale (Brooke 1996) after the session | SUS ≥ 68 |
| Difficulties | think-aloud during one task and a short interview | thematic coding |

Disagreement is **not** an error in ARO (ADR-002): low agreement on interpretations is expected. Agreement is measured on derivation vocabularies, where low values point to concepts that are hard to tell apart (input to Strand B).

## 6. Ethics and data

Studies with people in Brazil require approval by a research ethics committee (CEP/CONEP, Resolução CNS 510/2016 for human and social sciences) before Strands B and C. Participants sign informed consent; annotations are stored under pseudonymous agent IRIs; no personal data is written into the Turtle files. Works' texts and recordings are not redistributed.

## 7. Threats to validity

- **Selection of works and participants:** few works and a convenience sample; mitigate by varying media and recruiting from more than one institution.
- **Training effect:** annotators trained by the ontology's author may follow its intended readings; mitigate with written material only and an independent facilitator.
- **Tool effect:** usability problems of the annotator may be read as ontology problems; separate them in the analysis (SUS and interview vs. domain findings).
- **Skeleton bias:** giving selections in advance fixes the granularity; one task leaves selection to the annotator to observe it.

## 8. Outputs

An evaluation report per strand (in `docs/`), issues and ADRs for every accepted change, the anonymized annotation files as examples (with consent), and the agreement and SUS results recorded in the [requirements](requirements.md) table (column *how it is verified*).

## References

- Brooke, J. (1996). SUS: a "quick and dirty" usability scale. In *Usability Evaluation in Industry*. Taylor & Francis.
- Guizzardi, G. (2005). *Ontological Foundations for Structural Conceptual Models*. PhD thesis, University of Twente.
- Krippendorff, K. (2004). *Content Analysis: An Introduction to Its Methodology* (2nd ed.). Sage.
- Sales, T. P., & Guizzardi, G. (2015). Ontological anti-patterns: empirically uncovered error-prone structures in ontology-driven conceptual models. *Data & Knowledge Engineering*, 99, 72–104.
- Aguiar, C. Z., & Souza, V. E. S. (2024). SABiOx: the Extended Systematic Approach for Building Ontologies. CEUR-WS Vol-3905.

---

[← Back to README](../../README.md) · [Português](../pt-BR/evaluation-protocol.md)
