[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/evaluation-protocol.md)

# Protocolo de avaliação

O que os testes automáticos já mostram e como a ARO deve ser avaliada por especialistas e com casos reais (atividade de avaliação do SABiOx, a partir do ciclo 3). Os testes automáticos verificam sintaxe, estrutura, restrições e respostas das consultas; **não** mostram que a teoria do domínio está certa, que os compromissos da UFO são adequados, nem que analistas conseguem usar a ontologia. Este protocolo trata dessas três questões.

## 1. Perguntas

| ID | Pergunta | Vertente |
|---|---|---|
| EQ-1 | O modelo OntoUML é bem formado, e os compromissos da UFO (kinds, subkinds, categorias, papéis, relator, tipos de alta ordem) são adequados? | Revisão ontológica |
| EQ-2 | As classes, relações e definições cobrem o que pesquisadores dizem sobre arte e realidade, sem conceitos faltando ou redundantes? | Revisão de domínio |
| EQ-3 | Analistas conseguem anotar obras reais com a ARO, e analistas independentes produzem anotações compatíveis? | Estudo de anotação |
| EQ-4 | As questões de competência e de pesquisa são respondidas pelos dados que os analistas de fato produzem? | Estudo de anotação |

## 2. Verificação automática (já implementada)

| Verificação | Ferramenta | Onde |
|---|---|---|
| Artefatos gerados batem com o catálogo | `scripts/build.py --check` | teste 1 |
| OWL, RDF/XML e JSON-LD coincidem; todo termo rotulado e definido em en e pt-BR | rdflib | testes 2–4 |
| Compromissos da UFO projetados em OWL: sortais últimos disjuntos, coberturas das classes abstratas, papéis como interseções, relatores com duas mediações, nenhuma imagem em união | verificações do catálogo e do OWL | teste 3 |
| Exemplos logicamente consistentes com esses axiomas | raciocinador OWL 2 RL (owlrl) | teste 6 |
| Conformidade SHACL de todo exemplo, e violações em dados errados de propósito | pyshacl | teste 6 |
| Toda consulta SPARQL (CQ-01–CQ-21, RQ-01–RQ-04) responde nos exemplos; respostas esperadas conferidas nos estudos de caso | SPARQL do rdflib | testes 7–8 |
| Exportação OntoUML válida no schema oficial e bem formada | `scripts/verify_ontouml.py` | teste 8 |

Execute com `python tests/test_project.py`.

## 3. Vertente A — revisão ontológica (EQ-1)

1. **Verificação em ferramenta (ADR-009).** *Feito automaticamente:* a exportação OntoUML JSON é validada no schema oficial e verificada quanto à boa formação (`python scripts/verify_ontouml.py`, ver [página OntoUML](ontouml.md#validação-do-modelo-ontouml-adr-009-adr-032)). *Falta:* reconstruir ou importar o modelo num editor OntoUML (ex.: plugin OntoUML para Visual Paradigm) a partir de `model/diagrams/ontouml/` e de `docs/*/reference-model.md`; rodar a verificação de boa formação; exportar o JSON OntoUML. Registrar cada erro e como foi resolvido (nova ADR quando o modelo mudar).
2. **Revisão de antipadrões.** Conferir o modelo com os antipadrões OntoUML catalogados por Sales & Guizzardi (2015) — ex.: relatores sem mediações suficientes, rigidez misturada em generalizações, abstrações imprecisas — e documentar cada ocorrência como aceita (com motivo) ou corrigida.
3. **Revisão por especialistas.** 2–3 engenheiros de ontologia com experiência em UFO/OntoUML revisam os [diagramas OntoUML](ontouml.md) e a tabela de estereótipos do [modelo de referência](reference-model.md). Para cada classe respondem: *O estereótipo é adequado? O princípio de identidade é claro? A definição é precisa?* (sim / em parte / não, com comentários). Os pontos em aberto de [ontouml.md](ontouml.md) (a «instantiation» de conceitos SKOS, classes externas) são perguntados explicitamente.

**Resultado:** lista de achados com decisões; catálogo e ADRs atualizados; exportação JSON OntoUML.

## 4. Vertente B — revisão de domínio (EQ-2)

Participantes: 3–5 pesquisadores de literatura, música, cinema ou estudos culturais, e 1–2 pesquisadores de ciências sociais que trabalhem com evidência empírica.

Instrumento (por participante, cerca de 60 minutos):
1. breve apresentação do propósito da ARO e do [mapa dos módulos](../../model/diagrams/modules.pt-BR.svg);
2. para cada módulo, a lista de classes com definições ([modelo de referência](reference-model.md)); perguntas em escala de 5 pontos — *clareza*, *relevância*, *completude* — e perguntas abertas: *o que falta? o que você nomearia de outro modo? o que é redundante?*;
3. as questões de competência ([lista de CQs](competency-questions.md)): *você faria esta pergunta? que outras faria?*;
4. os vocabulários de derivação (tipos, regimes, dimensões, operações, papéis): *os conceitos são distinguíveis? faltam conceitos importantes?*

**Análise:** mediana das notas por classe e por vocabulário; codificação temática das respostas abertas; cada proposta de mudança vira uma pendência e, se aceita, uma mudança no catálogo com ADR.

## 5. Vertente C — estudo de anotação com casos reais (EQ-3, EQ-4)

**Material.** 3 obras em mídias diferentes (ex.: uma canção, um capítulo de romance, um filme), cada uma com ao menos uma derivação (cover, sample, adaptação) e uma correspondência plausível com casos reais documentados. Um **arquivo esqueleto** com as obras, expressões, manifestações e recortes (faixas de linhas, trechos de tempo) é entregue a todos, para que todo anotador use os mesmos IRIs nas âncoras. Nenhum texto protegido por direito autoral é distribuído: os participantes usam suas próprias cópias, anexadas localmente no anotador.

**Participantes.** 6–10 analistas (pós-graduandos ou pesquisadores do domínio), trabalhando de forma independente com o [anotador](../../annotator/README.md) após 30 minutos de treino com o [manual](manual-anotador.md).

**Tarefas** (por obra): interpretar 3 recortes dados (situação, padrão); afirmar a derivação entre as âncoras dadas (tipo, regime, ao menos dois aspectos de transformação, justificativa); ligar um padrão a um caso real com fonte, item de evidência e avaliação; contestar ou avaliar uma alegação dos dados de exemplo.

**Medidas.**

| Medida | Como | Meta (provisória) |
|---|---|---|
| Conclusão e tempo por tarefa | registros do anotador e observação | ≥ 80 % das tarefas concluídas |
| Validade dos dados produzidos | `python scripts/validate.py` em cada arquivo | nenhuma violação após a validação do próprio anotador |
| Concordância nas derivações | `python scripts/compare_annotations.py a.ttl b.ttl …` — alfa de Krippendorff (nominal) por vocabulário: tipos, regimes, aspectos | α ≥ 0,667 para tipos (Krippendorff 2004: conclusões provisórias) |
| Capacidade de responder às questões | executar toda `queries/*.rq` sobre os arquivos reunidos; para a CQ-19, a proporção de alegações sem fundamento | toda CQ/RQ responde; ≤ 20 % de alegações sem fundamento |
| Usabilidade do anotador | System Usability Scale (Brooke 1996) após a sessão | SUS ≥ 68 |
| Dificuldades | pensar em voz alta durante uma tarefa e entrevista curta | codificação temática |

Discordância **não** é erro na ARO (ADR-002): espera-se baixa concordância nas interpretações. A concordância é medida nos vocabulários de derivação, onde valores baixos indicam conceitos difíceis de distinguir (insumo para a Vertente B).

## 6. Ética e dados

Pesquisas com pessoas no Brasil exigem aprovação de comitê de ética em pesquisa (CEP/CONEP, Resolução CNS 510/2016 para ciências humanas e sociais) antes das Vertentes B e C. Os participantes assinam termo de consentimento; as anotações são guardadas sob IRIs de agente pseudônimos; nenhum dado pessoal é gravado nos arquivos Turtle. Textos e gravações das obras não são redistribuídos.

## 7. Ameaças à validade

- **Escolha de obras e participantes:** poucas obras e amostra por conveniência; atenuar variando as mídias e recrutando em mais de uma instituição.
- **Efeito do treino:** anotadores treinados pelo autor da ontologia podem seguir as leituras previstas; atenuar com material escrito apenas e um facilitador independente.
- **Efeito da ferramenta:** problemas de usabilidade do anotador podem ser lidos como problemas da ontologia; separá-los na análise (SUS e entrevista vs. achados de domínio).
- **Viés do esqueleto:** dar os recortes prontos fixa a granularidade; uma tarefa deixa a escolha do recorte ao anotador para observá-la.

## 8. Produtos

Um relatório de avaliação por vertente (em `docs/`), pendências e ADRs para cada mudança aceita, os arquivos de anotação anonimizados como exemplos (com consentimento), e os resultados de concordância e SUS registrados na tabela de [requisitos](requirements.md) (coluna *como é verificado*).

## Referências

- Brooke, J. (1996). SUS: a "quick and dirty" usability scale. In *Usability Evaluation in Industry*. Taylor & Francis.
- Guizzardi, G. (2005). *Ontological Foundations for Structural Conceptual Models*. Tese de doutorado, University of Twente.
- Krippendorff, K. (2004). *Content Analysis: An Introduction to Its Methodology* (2. ed.). Sage.
- Sales, T. P., & Guizzardi, G. (2015). Ontological anti-patterns: empirically uncovered error-prone structures in ontology-driven conceptual models. *Data & Knowledge Engineering*, 99, 72–104.
- Aguiar, C. Z., & Souza, V. E. S. (2024). SABiOx: the Extended Systematic Approach for Building Ontologies. CEUR-WS Vol-3905.

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/evaluation-protocol.md)
