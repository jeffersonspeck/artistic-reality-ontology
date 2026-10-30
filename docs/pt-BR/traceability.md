[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/traceability.md)

# Matriz de rastreabilidade

| Requisitos | Questões | Classes | Verificação |
|---|---|---|---|
| FR-01–FR-02 | CQ-01 | Artwork, Manifestation, Selection | Inspeção do catálogo |
| FR-03–FR-04 | CQ-02–CQ-03 | InterpretationRecord, InterpretiveJustification | Inspeção |
| FR-05–FR-06 | CQ-04 | SituationDescription, SituationPattern | Inspeção |
| FR-07–FR-09 | CQ-05–CQ-08 | ReferenceSource, EvidenceItem, CorrespondenceClaim | SPARQL CQ-05/CQ-06 |
| FR-10 | CQ-10, CQ-12 | ExplanationHypothesis, EvidenceAssessment | Futuros testes |
| FR-11 | CQ-11 | AssessmentCriterion, InterpretationAssessment | Futuros testes |
| FR-12 | CQ-01–CQ-18 | Modelo inteiro | Revisão da documentação |
| FR-13–FR-14 | CQ-13–CQ-14 | DerivationClaim, DerivationType | SPARQL CQ-13/CQ-14; restrições SHACL de âncora |
| FR-15 | CQ-15–CQ-16 | TransformationAspect, ArtisticDimension, TransformationOperation | SPARQL CQ-15/CQ-16 |
| FR-16 | CQ-18 | CreativeAct, CreativeContribution, CreativeAgent, CreativeRole | SPARQL CQ-18 |
| FR-17 | CQ-17 | InterpretiveJustification, ReferenceSource, EvidenceAssessment | SPARQL CQ-17 |
| FR-18 | — | Selection, oa:Selector; schema de anotação de derivação | Validação JSON Schema (positiva e negativa) nos testes |
| FR-19 | — | ReferenceSource, qualquer recurso (externalLink, sourceURL) | Links no anotador; testes de rótulos bilíngues |
| FR-20 | — | Modelo inteiro (anotador) | Teste manual no navegador; arquivos salvos passam no scripts/validate.py |
| NFR-10 | — | Catálogo conceitual | `scripts/build.py --check` nos testes |

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/traceability.md)
