[← Back to README](../../README.md) · [Português](../pt-BR/competency-questions.md)

# Competency questions

These are acceptance questions; CQ-05, CQ-06 and CQ-13–CQ-18 have executable SPARQL probes in `queries/`.

- **CQ-01** — Which works and manifestations contain a selected segment?  `[Selection,Manifestation,Artwork]`
- **CQ-02** — Which competing interpretations arise from one selection?  `[InterpretationRecord,Selection]`
- **CQ-03** — Which premises justify an interpretation?  `[InterpretiveJustification,InterpretationRecord]`
- **CQ-04** — Which patterns are abstracted from represented situations?  `[SituationDescription,SituationPattern]`
- **CQ-05** — Which real-world cases have been claimed similar to a pattern?  `[CorrespondenceClaim,EmpiricalCase,SituationPattern]`
- **CQ-06** — Which reference sources support a given correspondence?  `[CorrespondenceClaim,ReferenceSource,EvidenceItem]`
- **CQ-07** — Can one source be reused across cases and interpretations?  `[ReferenceSource,EmpiricalCase,InterpretationRecord]`
- **CQ-08** — Does evidence support or challenge a specific claim?  `[EvidenceAssessment,EmpiricalClaim,EvidenceItem]`
- **CQ-09** — Who authored and evaluated a given interpretation?  `[InterpretiveAct,Analyst,InterpretationAssessment]`
- **CQ-10** — What explanations are hypothesized for a pattern?  `[ExplanationHypothesis,SituationPattern]`
- **CQ-11** — Which criteria govern epistemic versus value judgments?  `[AssessmentCriterion,InterpretationAssessment]`
- **CQ-12** — Which evidence is insufficient to infer a causal explanation?  `[EvidenceAssessment,ExplanationHypothesis]`
- **CQ-13** — Which entities are claimed to derive from a given artwork, at which level and by which type?  `[DerivationClaim,DerivationType,Artwork,Manifestation,Selection]`
- **CQ-14** — Which artworks are connected by chains of explicit derivation claims?  `[DerivationClaim,Artwork]`
- **CQ-15** — What does a derivation retain, modify, add, remove or recontextualize?  `[DerivationClaim,TransformationAspect,ArtisticDimension,TransformationOperation]`
- **CQ-16** — Which derivations retain a situation pattern of their source?  `[TransformationAspect,SituationPattern]`
- **CQ-17** — How is a derivation claim explained: which justifications, sources and evidence assessments bear on it?  `[DerivationClaim,InterpretiveJustification,ReferenceSource,EvidenceAssessment]`
- **CQ-18** — Who contributed to the creative act realizing a derivation, in which role?  `[CreativeAct,CreativeContribution,CreativeAgent,CreativeRole]`
- **RQ-01–RQ-04** — Research questions answered on the case studies; see [case studies](case-studies.md).

---

[← Back to README](../../README.md) · [Português](../pt-BR/competency-questions.md)
