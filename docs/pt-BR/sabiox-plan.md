[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/sabiox-plan.md)

# Ciclo SABiOx 1 — v0.1.0

| Fase | Artefatos do repositório | Estado |
|---|---|---|
| Requisitos | Propósito, escopo, FR/NFR e 12 questões de competência | Capturado |
| Preparação (Setup) | Política UFO-A/B/C, OntoUML, RDF/OWL e revisão de fontes | Linha de base |
| Captura | 26 classes, 29 relações, diagramas e catálogo | Capturado |
| Projeto (Design) | IRIs, RDF, SHACL, JSON Schema e decisões ADR | Projetado |
| Implementação | Turtle, RDF/XML, JSON-LD, consultas e instância sintética | Implementado; leitura e consultas testadas |

Atividades de apoio: documentação, aquisição de conhecimento, reutilização, configuração, avaliação e publicação. Revisão formal e análise de casos seguiram para os ciclos seguintes.

**Distinção metodológica:** Avaliação é atividade transversal de apoio, não sexta fase principal do SABiOx.

Fonte: https://nemo.inf.ufes.br/projetos/sabiox/

# Ciclo SABiOx 2 — v0.2.0 (módulo de derivação)

| Fase | Artefatos do repositório | Estado |
|---|---|---|
| Requisitos | FR-13–FR-18, NFR-10, CQ-13–CQ-18 | Capturado |
| Preparação (Setup) | Gerador `scripts/build.py`; catálogo como fonte única | Implementado |
| Captura | Pacote `derivation`: 10 classes, 19 relações, 5 vocabulários SKOS (40 tipos de derivação, 56 dimensões); `hasSelector` para W3C Web Annotation | Capturado |
| Projeto (Design) | ADR-011–ADR-024, revisão da tipologia fundamentada na literatura, restrições SHACL de cardinalidade e SPARQL, alinhamentos via rdfs:seeAlso | Projetado |
| Implementação | OWL/SHACL/schemas/docs/DOT regenerados, `examples/synthetic-derivation.ttl`, schema e exemplo do anotador, seis consultas SPARQL, SVGs renderizados | Implementado e testado (verificação de build, conformidade SHACL e teste negativo, SPARQL) |

Levado ao ciclo 3: revisão dos estereótipos (padrão de papéis, categorias, relator), alinhamento LRMoo.

# Ciclo de desenvolvimento SABiOx 3 — v0.3.0 (alegações, topo UFO, IFLA LRM)

| Fase | Artefatos deste repositório | Conclusão |
|---|---|---|
| Requisitos | CQ-19–CQ-21 (alegações sem fundamento, níveis da obra, atos datados); consultas executáveis para toda CQ (CQ-01–CQ-04 e CQ-07–CQ-12 acrescentadas); FR-01, FR-02, FR-04, FR-08, FR-13 e FR-17 reescritos com os novos termos | Capturado |
| Preparação | Gerador estendido: categorias, papéis com dois pais (interseções OWL), disjunção e coberturas, SHACL por classe, tipos de data; `scripts/migrate.py` para dados 0.2 | Implementado |
| Captura | Novos pacotes `claim` e `agent`; `Claim` e `AnalyticalRecord`; «category» `ArtisticEntity` e `Agent`; `Expression` e `Manifestation` do LRM; padrão de «role» para agentes; `contributionTo`; `startDate`/`endDate` — 50 classes, 45 relações | Capturado |
| Projeto | ADR-026–ADR-033 (ADR-009 adotada com a exportação OntoUML, ADR-010 encerrada, ADR-012/019/022 revistas); `EpistemicCriterion`/`ValueCriterion`, `assessmentOutcome`; alinhamentos com W3C Web Annotation, PROV-O, LRMoo, schema.org, Dublin Core como `rdfs:seeAlso` | Projetado |
| Implementação | Artefatos e diagramas regenerados (SVG e PNG a 200 dpi); exemplos migrados e enriquecidos (álbum e primeira edição como manifestações, atos datados, agentes tipados); três novas consultas SPARQL; anotador atualizado e convertendo arquivos 0.2 | Implementado e testado (build, SHACL, consistência OWL RL, migração, SPARQL) |
| Avaliação | [Protocolo de avaliação](evaluation-protocol.md): revisão por especialistas e estudo de anotação com casos reais | Planejada |

Verificação acrescentada neste ciclo: exportação OntoUML JSON válida no schema oficial e bem formada (`scripts/verify_ontouml.py`, conferida com o ontouml-js). Conferida com a biblioteca oficial ontouml-js na versão 1.0.0 (0 erros).

# Versão 1.0.0 — consolidação

A 1.0.0 congela o modelo do ciclo 3 como versão estável, sem mudar classes, relações nem restrições:

- estereótipos OntoUML e fundamentação UFO registrados sem a marca de provisório, depois da verificação com o `scripts/verify_ontouml.py` e a biblioteca oficial ontouml-js (0 erros);
- documentação de referência, OntoUML e SABiOx alinhada ao que já está implementado (arquivo de intercâmbio OntoUML, disjunção entre sortais últimos, datas de atos e situações);
- versão congelada em [`releases/v1.0.0/`](../../releases/v1.0.0/).

A avaliação por especialistas e com casos reais segue o [protocolo de avaliação](evaluation-protocol.md).

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/sabiox-plan.md)
