[← Back to README](../../README.md) · [Português](../pt-BR/traceability.md)

# Traceability matrix

| Requirements | Competency questions | Main classes | Test |
|---|---|---|---|
| FR-01–FR-02 | CQ-01, CQ-20 | Artwork, Expression, Manifestation, Selection | SPARQL CQ-01/CQ-20 |
| FR-03–FR-04 | CQ-02–CQ-03, CQ-09, CQ-19 | InterpretationRecord, Justification, Claim, Challenge | SPARQL CQ-02/CQ-03/CQ-09/CQ-19 |
| FR-05–FR-06 | CQ-04 | SituationDescription, SituationPattern | SPARQL CQ-04 |
| FR-07–FR-09 | CQ-05–CQ-08 | ReferenceSource, EvidenceItem, CorrespondenceClaim, Assessment | SPARQL CQ-05–CQ-08 |
| FR-10 | CQ-10, CQ-12 | ExplanationHypothesis, EvidenceAssessment | SPARQL CQ-10/CQ-12 |
| FR-11 | CQ-11 | EpistemicCriterion, ValueCriterion, CriteriaAssessment | SPARQL CQ-11 |
| FR-12 | CQ-01–CQ-21 | Entire model | Docs review |
| FR-13–FR-14 | CQ-13–CQ-14 | DerivationClaim, DerivationType | SPARQL CQ-13/CQ-14; SHACL anchor constraints |
| FR-15 | CQ-15–CQ-16 | TransformationAspect, ArtisticDimension, TransformationOperation | SPARQL CQ-15/CQ-16 |
| FR-16 | CQ-18 | CreativeAct, CreativeContribution, CreativeAgent, CreativeRole | SPARQL CQ-18 |
| FR-17 | CQ-17 | Justification, ReferenceSource, Assessment | SPARQL CQ-17 |
| FR-18 | — | Selection, oa:Selector; derivation-annotation schema | JSON Schema validation (positive and negative) in tests |
| FR-19 | — | ReferenceSource, any resource (externalLink, sourceURL) | Annotator links; bilingual-label tests |
| FR-20 | — | Whole model (annotator) | Manual browser test; saved files pass scripts/validate.py |
| NFR-10 | — | Conceptual catalog | `scripts/build.py --check` in tests |

---

[← Back to README](../../README.md) · [Português](../pt-BR/traceability.md)
