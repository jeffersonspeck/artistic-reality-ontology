[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/competency-questions.md)

# Questões de competência

Estas perguntas orientam a aceitação. **Todas (CQ-01–CQ-21) têm consulta SPARQL executável** em [`queries/`](../../queries/); os testes executam todas e conferem as respostas esperadas nos estudos de caso, e o anotador as executa em **Análise → Consultas**.

- **CQ-01** — Quais obras e manifestações contêm um recorte?  `[Selection,Expression,Manifestation,Artwork]`
- **CQ-02** — Quais interpretações concorrentes surgem de um recorte?  `[InterpretationRecord,Selection]`
- **CQ-03** — Quais premissas fundamentam uma interpretação?  `[Justification,InterpretationRecord]`
- **CQ-04** — Quais padrões são abstraídos de situações representadas?  `[SituationDescription,SituationPattern]`
- **CQ-05** — Quais casos reais foram alegados similares a um padrão?  `[CorrespondenceClaim,EmpiricalCase,SituationPattern]`
- **CQ-06** — Quais fontes apoiam determinada correspondência?  `[CorrespondenceClaim,ReferenceSource,EvidenceItem]`
- **CQ-07** — Uma fonte pode ser reutilizada em casos e interpretações?  `[ReferenceSource,EmpiricalCase,InterpretationRecord]`
- **CQ-08** — Uma evidência apoia ou contesta uma afirmação específica?  `[Assessment,Claim,EvidenceItem]`
- **CQ-09** — Quem elaborou e avaliou determinada interpretação?  `[InterpretiveAct,Analyst,Assessment,Challenge]`
- **CQ-10** — Quais explicações são hipotetizadas para um padrão?  `[ExplanationHypothesis,SituationPattern]`
- **CQ-11** — Quais critérios orientam julgamentos epistêmicos versus valorativos?  `[EpistemicCriterion,ValueCriterion,CriteriaAssessment]`
- **CQ-12** — Quais evidências são insuficientes para inferência causal?  `[EvidenceAssessment,ExplanationHypothesis]`
- **CQ-13** — Que entidades são alegadas derivadas de uma obra, em que nível e de que tipo?  `[DerivationClaim,DerivationType,ArtisticEntity]`
- **CQ-14** — Que obras estão ligadas por cadeias de alegações explícitas de derivação?  `[DerivationClaim,Artwork]`
- **CQ-15** — O que uma derivação mantém, modifica, acrescenta, remove ou recontextualiza?  `[DerivationClaim,TransformationAspect,ArtisticDimension,TransformationOperation]`
- **CQ-16** — Quais derivações mantêm um padrão situacional da origem?  `[TransformationAspect,SituationPattern]`
- **CQ-17** — Como uma alegação de derivação é explicada: que justificativas, fontes e avaliações de evidência incidem sobre ela?  `[DerivationClaim,Justification,ReferenceSource,Assessment]`
- **CQ-18** — Quem contribuiu para o ato criativo que realiza uma derivação, e com que papel?  `[CreativeAct,CreativeContribution,CreativeAgent,CreativeRole,ArtisticEntity]`
- **CQ-19** — Quais alegações ainda não têm fundamento (nem justificativa, nem fonte citada, nem avaliação)?  `[Claim,Justification,ReferenceSource,Assessment]`
- **CQ-20** — Por quais expressões e manifestações uma obra existe?  `[Artwork,Expression,Manifestation]`
- **CQ-21** — Quando ocorreram os atos criativos por trás de uma derivação, e a entidade derivada vem depois da origem?  `[CreativeAct,DerivationClaim,ArtisticEntity]`
- **RQ-01–RQ-04** — Questões de pesquisa respondidas nos estudos de caso; ver [estudos de caso](case-studies.md).

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/competency-questions.md)
