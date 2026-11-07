[← Back to README](../../README.md) · [Português](../pt-BR/competency-questions.md)

# Competency questions

These are acceptance questions. **Every one (CQ-01–CQ-21) has an executable SPARQL query** in [`queries/`](../../queries/); the tests run them all and check the expected answers on the case studies, and the annotator runs them from **Analysis → Queries**.

- **CQ-01** — Which works and manifestations contain a selected segment?  `[Selection,Expression,Manifestation,Artwork]`
- **CQ-02** — Which competing interpretations arise from one selection?  `[InterpretationRecord,Selection]`
- **CQ-03** — Which premises justify an interpretation?  `[Justification,InterpretationRecord]`
- **CQ-04** — Which patterns are abstracted from represented situations?  `[SituationDescription,SituationPattern]`
- **CQ-05** — Which real-world cases have been claimed similar to a pattern?  `[CorrespondenceClaim,EmpiricalCase,SituationPattern]`
- **CQ-06** — Which reference sources support a given correspondence?  `[CorrespondenceClaim,ReferenceSource,EvidenceItem]`
- **CQ-07** — Can one source be reused across cases and interpretations?  `[ReferenceSource,EmpiricalCase,InterpretationRecord]`
- **CQ-08** — Does evidence support or challenge a specific claim?  `[Assessment,Claim,EvidenceItem]`
- **CQ-09** — Who authored and evaluated a given interpretation?  `[InterpretiveAct,Analyst,Assessment,Challenge]`
- **CQ-10** — What explanations are hypothesized for a pattern?  `[ExplanationHypothesis,SituationPattern]`
- **CQ-11** — Which criteria govern epistemic versus value judgments?  `[EpistemicCriterion,ValueCriterion,CriteriaAssessment]`
- **CQ-12** — Which evidence is insufficient to infer a causal explanation?  `[EvidenceAssessment,ExplanationHypothesis]`
- **CQ-13** — Which entities are claimed to derive from a given artwork, at which level and by which type?  `[DerivationClaim,DerivationType,ArtisticEntity]`
- **CQ-14** — Which artworks are connected by chains of explicit derivation claims?  `[DerivationClaim,Artwork]`
- **CQ-15** — What does a derivation retain, modify, add, remove or recontextualize?  `[DerivationClaim,TransformationAspect,ArtisticDimension,TransformationOperation]`
- **CQ-16** — Which derivations retain a situation pattern of their source?  `[TransformationAspect,SituationPattern]`
- **CQ-17** — How is a derivation claim explained: which justifications, sources and evidence assessments bear on it?  `[DerivationClaim,Justification,ReferenceSource,Assessment]`
- **CQ-18** — Who contributed to the creative act realizing a derivation, in which role?  `[CreativeAct,CreativeContribution,CreativeAgent,CreativeRole,ArtisticEntity]`
- **CQ-19** — Which claims have no grounds yet (no justification, cited source or assessment)?  `[Claim,Justification,ReferenceSource,Assessment]`
- **CQ-20** — Through which expressions and manifestations does an artwork exist?  `[Artwork,Expression,Manifestation]`
- **CQ-21** — When did the creative acts behind a derivation happen, and does the derived entity come after its source?  `[CreativeAct,DerivationClaim,ArtisticEntity]`
- **RQ-01–RQ-04** — Research questions answered on the case studies; see [case studies](case-studies.md).

---

[← Back to README](../../README.md) · [Português](../pt-BR/competency-questions.md)
