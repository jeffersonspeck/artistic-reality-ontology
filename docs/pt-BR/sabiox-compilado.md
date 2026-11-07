[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/sabiox-compilation.md)

# Compilado SABiOx da ARO — desenvolvimento etapa por etapa

Este documento reúne, em um só lugar, **tudo o que no projeto foi moldado pelo SABiOx**: para cada fase e atividade de apoio, o que foi feito, em qual ciclo e **onde está no repositório**. Os caminhos são clicáveis a partir desta pasta (`docs/pt-BR/`). Versão em inglês: [sabiox-compilation.md](../en/sabiox-compilation.md).

> **Método.** SABiOx (Aguiar & Souza, 2024) tem cinco fases principais — **Requisitos → Preparação (Setup) → Captura → Projeto (Design) → Implementação** — e atividades de apoio transversais: **aquisição de conhecimento, documentação, gerência de configuração, avaliação, reúso e publicação**. Avaliação é atividade de apoio, não sexta fase. Fontes: [artigo](https://ceur-ws.org/Vol-3905/paper1.pdf) · [guia oficial](https://nemo.inf.ufes.br/wp-content/uploads/sabiox-guide2024-09.pdf).
>
> **Estado.** Os dois ciclos são rascunhos de pesquisa com testes automatizados de sintaxe, estrutura e consultas. Não houve ainda validação por especialistas nem avaliação com casos reais.

## Sumário

- [Visão geral dos ciclos](#visão-geral-dos-ciclos)
- [Fase 1 — Requisitos](#fase-1--requisitos)
- [Fase 2 — Preparação (Setup)](#fase-2--preparação-setup)
- [Fase 3 — Captura](#fase-3--captura)
- [Fase 4 — Projeto (Design)](#fase-4--projeto-design)
- [Fase 5 — Implementação](#fase-5--implementação)
- [Atividades de apoio](#atividades-de-apoio)
- [Rastreabilidade ponta a ponta](#rastreabilidade-ponta-a-ponta)
- [Pendências por fase](#pendências-por-fase)
- [Mapa reverso: arquivo → fase SABiOx](#mapa-reverso-arquivo--fase-sabiox)

---

## Visão geral dos ciclos

| Ciclo | Versão | Foco | Resultado principal |
|---|---|---|---|
| 1 | 0.1.0 | Obra, recorte, interpretação plural, situação representada, padrão situacional, evidência e correspondência com o real | 26 classes, 29 relações, FR-01–FR-12, CQ-01–CQ-12 |
| 2 | 0.2.0 | **Derivação entre obras** (tradução, cover, sample, adaptação, paródia, obra de fã…), explicação das derivações, preparo para anotador, fonte única de verdade | 36 classes, 49 relações, 5 vocabulários SKOS, FR-13–FR-18, NFR-10, CQ-13–CQ-18 |
| 3 | 0.3.0 | **Alegações e topo UFO**: uma abstração `Claim`, um único «kind» para registros analíticos, categorias no lugar de uniões, níveis do IFLA LRM, padrão de papéis OntoUML para agentes, tempo nos eventos, alinhamentos | 50 classes, 45 relações, consultas CQ-01–CQ-04 e CQ-07–CQ-21, ADR-026–ADR-033, exportação OntoUML JSON validada e verificada, script de migração, protocolo de avaliação |

Registro dos ciclos: [sabiox-plan.md](sabiox-plan.md) · histórico de mudanças: [CHANGELOG.md](../../CHANGELOG.md).

```
Requisitos ──► Setup ──► Captura ──► Projeto ──► Implementação
 (o quê/por quê)  (como)    (conceitual)  (operacional)   (código + testes)
     ▲                                                        │
     └──────────── avaliação / rastreabilidade ◄──────────────┘
```

---

## Fase 1 — Requisitos

Define propósito, escopo, usos previstos, requisitos e as questões de competência (CQs) que servem de critério de aceitação.

| Artefato SABiOx | Ciclo 1 | Ciclo 2 | Onde |
|---|---|---|---|
| Propósito (o quê / por quê / para quê) | Interpretação rastreável sem confundir ficção com fato | + derivação entre obras; obras derivadas como criações por direito próprio | [purpose-and-scope.md](purpose-and-scope.md) |
| Escopo e exclusões | Exclui extração automática, checagem de notícias, inferência causal automática | + legalidade/originalidade fora do escopo, detecção automática de similaridade, cadeias de derivação inferidas | [purpose-and-scope.md](purpose-and-scope.md) |
| Compromisso epistêmico | Toda correspondência é alegação falível que requer evidência | Toda derivação é alegação contestável e explicada | [purpose-and-scope.md](purpose-and-scope.md) |
| Requisitos funcionais | FR-01–FR-12 | FR-13 (derivação em 3 níveis), FR-14 (tipos), FR-15 (o que é mantido/transformado), FR-16 (atos e papéis criativos), FR-17 (explicação), FR-18 (seletores W3C e formato de anotação) | [requirements.md](requirements.md) |
| Requisitos não funcionais | NFR-01–NFR-09 | NFR-10: catálogo único do qual tudo é gerado e verificado | [requirements.md](requirements.md) |
| Questões de competência | CQ-01–CQ-12 | CQ-13 (derivadas de uma obra), CQ-14 (cadeias), CQ-15 (transformações), CQ-16 (padrões mantidos), CQ-17 (explicação), CQ-18 (contribuições criativas) | [competency-questions.md](competency-questions.md) |
| Modularização | 5 pacotes: `artwork`, `interpretation`, `representation`, `pattern`, `evidence` | + pacote `derivation` | `packages` em [conceptual-model.json](../../model/conceptual-model.json) |
| Princípios de dados | 8 princípios (recorte ≠ interpretação, ficção ≠ empírico…) | — | [README.md](../../LEIA-ME.md#princípios) |

---

## Fase 2 — Preparação (Setup)

Escolhe a ontologia de fundamentação, a linguagem de modelagem conceitual, a linguagem operacional, as ferramentas e a política de reúso.

| Decisão de setup | Escolha | Onde |
|---|---|---|
| Ontologia de fundamentação | UFO-A (identidade, tipos, dependência), UFO-B (eventos), UFO-C (intencionalidade, objetos sociais/informacionais) | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Linguagem conceitual | OntoUML como referência; estereótipos provisórios | [ontouml-status.md](../../model/ontouml-status.md) |
| Linguagem operacional | RDF/OWL 2 (Turtle, RDF/XML, JSON-LD), SHACL, JSON Schema 2020-12, SPARQL | [README.md](../../README.md) |
| Política gUFO / UFO-C | gUFO 1.0.0 cobre UFO-A e parte de UFO-B; UFO-C não é importada (ADR-008) | [foundation-and-mappings.md](foundation-and-mappings.md), [design-decisions.md](design-decisions.md) |
| Ferramentas (ciclo 1) | Python + `rdflib`, `jsonschema`; Graphviz para diagramas | [requirements.txt](../../requirements.txt) |
| Ferramentas (ciclo 2) | + `pyshacl` (validação SHACL); **gerador** `scripts/build.py`; Graphviz instalado | [requirements.txt](../../requirements.txt), [build.py](../../scripts/build.py) |
| Fonte única de verdade (ciclo 2) | `model/conceptual-model.json` gera OWL, SHACL, schemas, documentação de referência e diagramas (ADR-017, NFR-10) | [conceptual-model.json](../../model/conceptual-model.json), [build.py](../../scripts/build.py) |

**Fluxo de geração (ciclo 2):**

```
model/conceptual-model.json
        │  python scripts/build.py
        ├─► ontology/src/aro.ttl · aro.owl · aro.jsonld        (Implementação)
        ├─► validation/aro-shapes.ttl                     (Projeto)
        ├─► schemas/record.schema.json
        ├─► schemas/derivation-annotation.schema.json     (Projeto)
        ├─► docs/{en,pt-BR}/reference-model.md            (Captura / Documentação)
        └─► model/diagrams/*.dot ─► *.svg                 (Captura)
python scripts/build.py --check   → falha se algum artefato divergir do catálogo
```

---

## Fase 3 — Captura

Constrói o modelo conceitual de referência: classes, estereótipos, definições bilíngues, dependências, fundamentação e relações.

### Catálogo conceitual

| Pacote | Classes | Ciclo | Diagrama |
|---|---|---|---|
| `artwork` | ArtisticEntity, Artwork, Expression, Manifestation, Selection, AnalysisUnit | 1 (ciclo 2: `hasSelector`; ciclo 3: níveis do LRM, a Manifestation da 0.2 virou Expression) | [artwork.svg](../../model/diagrams/artwork.svg) |
| `claim` | AnalyticalRecord, Claim, Justification, Challenge, Assessment, CriteriaAssessment, EvidenceAssessment*, AssessmentCriterion | 3 (a partir de classes do ciclo 1; *EvidenceAssessment fica em `evidence`) |
| `interpretation` | InterpretationRecord, InterpretiveAct | 1 |
| `agent` | Agent, Person, Collective, Analyst, CreativeAgent, PersonAnalyst, CollectiveAnalyst, PersonCreator, CollectiveCreator | 3 (Analyst e CreativeAgent dos ciclos 1–2) | [interpretation.svg](../../model/diagrams/interpretation.svg) |
| `representation` | DepictedElement, DepictedAgent, SituationDescription, IntentionalStateDescription | 1 | [representation.svg](../../model/diagrams/representation.svg) |
| `pattern` | SituationPattern, PatternCondition | 1 | [pattern.svg](../../model/diagrams/pattern.svg) |
| `evidence` | EmpiricalCase, EmpiricalClaim, ReferenceSource, EvidenceItem, CorrespondenceClaim, EvidenceAssessment, ExplanationHypothesis, EmpiricalSituation, EmpiricalEvent | 1 | [evidence.svg](../../model/diagrams/evidence.svg) |
| `derivation` | DerivationClaim, TransformationAspect, CreativeAct, CreativeAgent, CreativeContribution, DerivationType, DerivationRegime, ArtisticDimension, TransformationOperation, CreativeRole | 2 | [derivation.svg](../../model/diagrams/derivation.svg) |

Visão completa: [overview.svg](../../model/diagrams/overview.svg). Definições, dependências e fundamentação de cada classe: [reference-model.md](reference-model.md) (gerado).

### Estereótipos OntoUML usados (provisórios)

| Estereótipo | Classes | Ciclo |
|---|---|---|
| «kind» | Artwork, Expression, Manifestation, Selection, AnalyticalRecord, ReferenceSource, Person (até o ciclo 2, toda classe informacional era «kind») | 1–3 |
| «subkind» | todo registro analítico: Claim e seus seis tipos, Justification, Assessment e seus dois tipos, descrições, padrões, casos, itens de evidência, aspectos de transformação… | 3 (DepictedAgent, IntentionalStateDescription desde o 1) |
| «category» | ArtisticEntity, Agent | 3 |
| «collective» | Collective | 3 |
| «role» | PersonAnalyst, CollectiveAnalyst, PersonCreator, CollectiveCreator | 3 |
| «event» | InterpretiveAct, EmpiricalEvent, CreativeAct | 1 e 2 |
| «situation» | EmpiricalSituation | 1 |
| «relator» | CreativeContribution | 2 |
| «roleMixin» | CreativeAgent, Analyst — **agentes vêm de ontologias externas** | 2 |
| «type» (alta ordem) | DerivationType, DerivationRegime, ArtisticDimension, TransformationOperation, CreativeRole | 2 |

### Vocabulários controlados (ciclo 2, SKOS)

| Esquema | Conceitos | Organização | Fundamentação |
|---|---|---|---|
| DerivationTypeScheme | 40 | 5 famílias: re-realização, incorporação, transformação, imitação, extensão | Genette, Tillett, Smiraglia, Burkholder, Rajewsky, Hutcheon, Navas, Jenkins… |
| DerivationRegimeScheme | 4 | lúdico, satírico, sério, reverencial | regimes de Genette (+ reverencial, acréscimo da ARO) |
| ArtisticDimensionScheme | 56 | 7 famílias por mídia: narrativa, verbal, música, visual, audiovisual, transmidiática, paratexto | Chatman, Genette, Panofsky, Bordwell & Thompson |
| TransformationOperationScheme | 5 | mantido, modificado, acrescentado, removido, recontextualizado | — |
| CreativeRoleScheme | 10 | autor, compositor, intérprete, arranjador, tradutor, remixador… | — |

Fundamentação, revisão e bibliografia da tipologia: [derivation-typology.md](derivation-typology.md). Tabelas completas com a fonte de cada conceito: [reference-model.md](reference-model.md#vocabulários-controlados-skos).

### Aquisição de conhecimento usada na captura

- Ciclo 1: UFO/gUFO/UFO-C, OntoUML (fontes em [foundation-and-mappings.md](foundation-and-mappings.md)).
- Ciclo 2: revisão de literatura da tipologia de derivação, com referências conferidas e marcação † quando há divergência entre fontes secundárias ([derivation-typology.md](derivation-typology.md#referências)).

---

## Fase 4 — Projeto (Design)

Transforma o modelo conceitual em decisões operacionais: IRIs, projeção RDF/OWL, restrições, formatos de troca e decisões registradas.

| Elemento de projeto | Conteúdo | Onde |
|---|---|---|
| Política de IRIs | Namespace `https://w3id.org/aro/ontology#`; IDs neutros com rótulos EN/PT (NFR-06) | [aro.ttl](../../ontology/src/aro.ttl) |
| Projeção OWL | Classes, propriedades, subclasses, categorias como uniões disjuntas (ciclo 3; uniões no ciclo 2), sortais últimos disjuntos, papéis como interseções, conceitos SKOS tipados por classes «type» | [build.py](../../scripts/build.py) (`build_ontology`) |
| Restrições SHACL de cardinalidade e classe | Ciclo 1: 8 restrições; ciclo 2: + âncoras 1..1, tipo obrigatório, dimensão/operação 1..1, papéis, agentes como IRI | [aro-shapes.ttl](../../validation/aro-shapes.ttl) |
| Restrições SHACL-SPARQL (ciclos 2–3) | Âncoras devem ser entidades artísticas; origem ≠ derivada; atos criativos não produzem recortes; avaliações de evidência ponderam evidência | `sparql_constraints` em [conceptual-model.json](../../model/conceptual-model.json) |
| Tipos de dados | XSD por propriedade; seletores W3C Web Annotation | [datatypes-and-validation.md](datatypes-and-validation.md) |
| Formatos de troca | `reference-source` (ciclo 1), `record` (genérico), **`derivation-annotation`** para o anotador (ciclo 2, gerado dos vocabulários) | [schemas/](../../schemas/) |
| Alinhamentos externos | `rdfs:seeAlso` (não equivalência) a `prov:wasDerivedFrom`, `schema:isBasedOn`, Wikidata P144, `prov:Agent`, `foaf:Agent`, `oa:SpecificResource` | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Decisões registradas | ADR-001–ADR-010 (ciclo 1), ADR-011–ADR-025 (ciclo 2), ADR-026–ADR-031 (ciclo 3) | [design-decisions.md](design-decisions.md) |

### Decisões de projeto por tema

| Tema | ADRs |
|---|---|
| Interpretação e epistemologia | ADR-001 (interpretação ancorada), 002, 003, 005, 006 |
| Fontes e evidências | ADR-004, 005 |
| OWL vs. semântica de referência | ADR-007, 008, 009 (aberta), 010 (aberta) |
| Derivação como alegação | ADR-011, 012 (nível pelas âncoras), 013 (sem transitividade), 015 (uma origem por alegação) |
| Escopo: legalidade fora do escopo | ADR-014 |
| Vocabulários e regime | ADR-016, 018, 020 |
| Agentes externos | ADR-019, 022 |
| Anotação | ADR-021 (seletores W3C), 023 (schema gerado) |
| Engenharia | ADR-017 (fonte única) |
| Política de idioma | ADR-024 (termos em inglês, anotações completas en/pt-BR, conteúdo multilíngue) |

---

## Fase 5 — Implementação

Codifica a ontologia, os dados de exemplo e as verificações.

| Artefato | Conteúdo | Ciclo | Onde |
|---|---|---|---|
| Ontologia OWL | 50 classes, 45 propriedades de objeto, propriedades de dados, 5 esquemas SKOS | 1 → 3 | [aro.ttl](../../ontology/src/aro.ttl), [aro.owl](../../ontology/src/aro.owl), [aro.jsonld](../../ontology/src/aro.jsonld) |
| Restrições | SHACL gerado | 1 → 2 | [aro-shapes.ttl](../../validation/aro-shapes.ttl) |
| Gerador | Catálogo → todos os artefatos; `--check` detecta divergência; renderiza SVG | 2 | [build.py](../../scripts/build.py) |
| Exemplo genérico sintético | obra → recorte → interpretação → padrão → caso → evidência | 1 | [synthetic-data.ttl](../../examples/synthetic-data.ttl), [synthetic-reference-source.json](../../examples/synthetic-reference-source.json) |
| Exemplo de derivação sintético | cover, sample com seletores W3C e justificativa, adaptação que mantém padrão, obra de fã em cadeia; agentes de schema.org/FOAF | 2 | [synthetic-derivation.ttl](../../examples/synthetic-derivation.ttl) |
| Exemplo de anotação | anotação de sample no formato do anotador | 2 | [synthetic-derivation-annotation.json](../../examples/synthetic-derivation-annotation.json) |
| Consultas das CQs | CQ-05, CQ-06 (ciclo 1); CQ-13–CQ-18 (ciclo 2) | 1 e 2 | [queries/](../../queries/) |
| Testes | ver [Avaliação](#avaliação) | 1 → 2 | [test_project.py](../../tests/test_project.py) |

Como executar:

```bash
python -m pip install -r requirements.txt
python scripts/build.py
python tests/test_project.py
```

---

## Atividades de apoio

### Aquisição de conhecimento

| O quê | Onde |
|---|---|
| Fundamentação UFO-A/B/C, gUFO, UFO-C OWL (CTU), OntoUML | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Literatura de derivação (poética, biblioteconomia, música, intermidialidade, adaptação, fãs) e de dimensões (narratologia, iconologia, cinema) | [derivation-typology.md](derivation-typology.md) |

### Documentação

| O quê | Onde |
|---|---|
| Documentação bilíngue EN / PT-BR | [docs/en/](../en/), [docs/pt-BR/](./) |
| Documentação de referência gerada (não editar à mão) | [reference-model.md](reference-model.md) |
| Portas de entrada | [README.md](../../README.md), [LEIA-ME.md](../../LEIA-ME.md) |
| Este compilado | [sabiox-compilado.md](sabiox-compilado.md) |

### Gerência de configuração

| O quê | Onde |
|---|---|
| Versionamento semântico (0.1.0 → 0.2.0) | `version` em [conceptual-model.json](../../model/conceptual-model.json), `owl:versionInfo` em [aro.ttl](../../ontology/src/aro.ttl), [CITATION.cff](../../CITATION.cff) |
| Histórico de mudanças | [CHANGELOG.md](../../CHANGELOG.md) |
| Controle de versão | repositório git; `.gitignore` |
| Coerência entre artefatos | `python scripts/build.py --check` (executado nos testes) |

### Avaliação

Verificação automatizada em [test_project.py](../../tests/test_project.py) — confirma sintaxe, estrutura e respostas das consultas, **não** a correção da teoria de domínio:

| Verificação | Ciclo |
|---|---|
| Ontologia, SHACL e exemplos fazem parse | 1 |
| JSON Schema de fonte válido e exemplo conforme | 1 |
| Consultas SPARQL retornam resultados | 1 |
| Artefatos gerados batem com o catálogo (`build.py --check`) | 2 |
| Os três formatos OWL têm o mesmo número de triplas | 2 |
| Integridade do catálogo: classes/relações presentes no OWL, pacotes, especializações, extremidades das relações, conceitos sem colisão de nomes, `broader` válido | 2 |
| Exemplos conformes ao SHACL (`pyshacl`, inferência RDFS) | 2 |
| Teste negativo SHACL: autoderivação a partir de entidade não artística é rejeitada | 2 |
| Schema do anotador válido; exemplo aceito; anotação inválida rejeitada | 2 |
| Todo termo tem rótulos/definições/comentários en e pt-BR; texto de conteúdo sem idioma é rejeitado pelo SHACL | 2 |

Avaliação por especialistas e com casos reais: pendente ([Pendências](#pendências-por-fase)).

### Reúso

| Reusado | Como | Onde |
|---|---|---|
| UFO / OntoUML | fundamentação conceitual e estereótipos | [foundation-and-mappings.md](foundation-and-mappings.md) |
| SKOS | vocabulários controlados | [aro.ttl](../../ontology/src/aro.ttl) |
| W3C Web Annotation (`oa:`) | seletores de recortes | `hasSelector` em [reference-model.md](reference-model.md) |
| PROV-O, FOAF, schema.org, Wikidata | identidade de agentes e alinhamentos via `rdfs:seeAlso` | [foundation-and-mappings.md](foundation-and-mappings.md) |
| Dublin Core | `dcterms:source` nos conceitos; metadados | [aro.ttl](../../ontology/src/aro.ttl) |

### Publicação

| O quê | Estado | Onde |
|---|---|---|
| Licença MIT (sem redistribuir ontologias de terceiros) | feito | [LICENSE](../../LICENSE) |
| Citação | sem DOI ainda | [CITATION.cff](../../CITATION.cff) |
| IRI persistente `w3id.org/aro` | declarado, não registrado | [aro.ttl](../../ontology/src/aro.ttl) |

---

## Rastreabilidade ponta a ponta

Do requisito à verificação. Matriz oficial: [traceability.md](traceability.md).

| Requisito | CQ | Classes principais | Consulta / verificação |
|---|---|---|---|
| FR-01–FR-02 | CQ-01, CQ-20 | Artwork, Expression, Manifestation, Selection | inspeção; [CQ-20](../../queries/CQ-20-work-levels.rq) |
| FR-03–FR-04 | CQ-02–CQ-03, CQ-19 | InterpretationRecord, Justification, Claim | inspeção; [CQ-19](../../queries/CQ-19-ungrounded-claims.rq) |
| FR-05–FR-06 | CQ-04 | SituationDescription, SituationPattern | inspeção |
| FR-07–FR-09 | CQ-05–CQ-08 | ReferenceSource, EvidenceItem, CorrespondenceClaim | [CQ-05](../../queries/CQ-05-cases-by-pattern.rq), [CQ-06](../../queries/CQ-06-reference-sources.rq) |
| FR-10 | CQ-10, CQ-12 | ExplanationHypothesis, EvidenceAssessment | futuro |
| FR-11 | CQ-11 | AssessmentCriterion, CriteriaAssessment | futuro |
| FR-12 | CQ-01–CQ-18 | modelo inteiro | revisão da documentação |
| FR-13–FR-14 | CQ-13–CQ-14 | DerivationClaim, DerivationType | [CQ-13](../../queries/CQ-13-derivations-of-work.rq), [CQ-14](../../queries/CQ-14-derivation-chains.rq), SHACL de âncoras |
| FR-15 | CQ-15–CQ-16 | TransformationAspect, ArtisticDimension, TransformationOperation | [CQ-15](../../queries/CQ-15-transformation-aspects.rq), [CQ-16](../../queries/CQ-16-patterns-retained.rq) |
| FR-16 | CQ-18 | CreativeAct, CreativeContribution, CreativeAgent, CreativeRole | [CQ-18](../../queries/CQ-18-creative-contributions.rq) |
| FR-17 | CQ-17 | Justification, ReferenceSource, Assessment | [CQ-17](../../queries/CQ-17-derivation-explanations.rq) |
| FR-18 | — | Selection, oa:Selector, schema do anotador | validação JSON Schema nos testes |
| NFR-10 | — | catálogo conceitual | `build.py --check` nos testes |

---

## Pendências por fase

| Fase / atividade | Pendência |
|---|---|
| Requisitos | Vocabulário que distinga semelhança, possibilidade e divergência nas alegações de correspondência (FR-10) |
| Captura | Revisão especializada dos estereótipos («roleMixin», «type», «relator», «kind» de objetos informacionais) |
| Projeto | Diagramar e verificar a exportação OntoUML num editor OntoUML (ADR-009: exportação gerada, válida no schema e bem formada no ciclo 3) |
| Implementação | JSON-LD context para o anotador; conversor anotação JSON → RDF |
| Aquisição de conhecimento | Conferir no original os dados marcados com † (Tillett 1991) e as categorias de Smiraglia (ampliações, extrações) |
| Avaliação | Executar o [protocolo de avaliação](evaluation-protocol.md) (revisão por especialistas, estudo de anotação com casos reais); estereótipos de relação para as 33 associações simples se especialistas propuserem estereótipos adequados (ADR-032) |
| Publicação | Registro do w3id, DOI, repositório público |

---

## Mapa reverso: arquivo → fase SABiOx

| Arquivo / pasta | Fase ou atividade | Gerado? |
|---|---|---|
| [purpose-and-scope.md](purpose-and-scope.md) | Requisitos | não |
| [requirements.md](requirements.md) | Requisitos | não |
| [competency-questions.md](competency-questions.md) | Requisitos | não |
| [foundation-and-mappings.md](foundation-and-mappings.md) | Setup · Reúso · Aquisição de conhecimento | não |
| [ontouml-status.md](../../model/ontouml-status.md) | Setup · Captura | não |
| [requirements.txt](../../requirements.txt) | Setup · Gerência de configuração | não |
| [conceptual-model.json](../../model/conceptual-model.json) | Captura (**fonte única**) | não |
| [model/diagrams/](../../model/diagrams/) | Captura · Documentação | **sim** |
| [reference-model.md](reference-model.md) | Captura · Documentação | **sim** |
| [derivation-typology.md](derivation-typology.md) | Captura · Aquisição de conhecimento | não |
| [design-decisions.md](design-decisions.md) | Projeto | não |
| [datatypes-and-validation.md](datatypes-and-validation.md) | Projeto | não |
| [aro-shapes.ttl](../../validation/aro-shapes.ttl) | Projeto | **sim** |
| [schemas/](../../schemas/) | Projeto | `record` e `derivation-annotation` **sim**; `reference-source` não |
| [ontology/src/](../../ontology/src/) | Implementação (versão em desenvolvimento, módulos) | **sim** |
| [releases/](../../releases/README.md) | Gerência de configuração · Publicação (versões congeladas) | copiadas por `build.py --release` e nunca mais alteradas |
| [build.py](../../scripts/build.py) | Setup · Implementação · Gerência de configuração | não |
| [validate.py](../../scripts/validate.py), [query.py](../../scripts/query.py) | Implementação · Publicação (ferramentas de uso) | não |
| [annotator/](../../annotator/README.md), [annotator.py](../../scripts/annotator.py) | Implementação · Publicação (ferramenta de anotação) | não |
| [examples/](../../examples/) | Implementação · Avaliação | não |
| [queries/](../../queries/) | Implementação · Avaliação | não |
| [test_project.py](../../tests/test_project.py) | Avaliação | não |
| [traceability.md](traceability.md) | Avaliação · Documentação | não |
| [sabiox-plan.md](sabiox-plan.md) | Gerência de configuração · Documentação | não |
| [CHANGELOG.md](../../CHANGELOG.md), [CITATION.cff](../../CITATION.cff) | Gerência de configuração · Publicação | não |
| [README.md](../../README.md), [LEIA-ME.md](../../LEIA-ME.md) | Documentação · Publicação (guias de uso) | seção de classes **sim** |
| [LICENSE](../../LICENSE) | Publicação | não |

**Regra prática:** para mudar o modelo, edite [conceptual-model.json](../../model/conceptual-model.json), rode `python scripts/build.py` e depois `python tests/test_project.py`. Os arquivos marcados como gerados nunca devem ser editados à mão.

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/sabiox-compilation.md)
