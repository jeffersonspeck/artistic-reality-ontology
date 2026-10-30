[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/sabiox-plan.md)

# Ciclo SABiOx 1 — v0.1.0

| Fase | Artefatos do repositório | Estado |
|---|---|---|
| Requisitos | Propósito, escopo, FR/NFR e 12 questões de competência | Rascunho capturado |
| Preparação (Setup) | Política UFO-A/B/C, OntoUML, RDF/OWL e revisão de fontes | Linha de base inicial |
| Captura | 26 classes, 29 relações, diagramas e catálogo | Rascunho, validação especializada pendente |
| Projeto (Design) | IRIs, RDF, SHACL, JSON Schema e decisões ADR | Projeto inicial |
| Implementação | Turtle, RDF/XML, JSON-LD, consultas e instância sintética | Protótipo com testes básicos |

Atividades de apoio: documentação, aquisição de conhecimento, reutilização, configuração, avaliação e publicação. Revisão formal, análise de casos e serialização OntoUML nativa pendentes.

**Distinção metodológica:** Avaliação é atividade transversal de apoio, não sexta fase principal do SABiOx.

Fonte: https://nemo.inf.ufes.br/projetos/sabiox/

# Ciclo SABiOx 2 — v0.2.0 (módulo de derivação)

| Fase | Artefatos do repositório | Estado |
|---|---|---|
| Requisitos | FR-13–FR-18, NFR-10, CQ-13–CQ-18 | Rascunho capturado |
| Preparação (Setup) | Gerador `scripts/build.py`; catálogo como fonte única | Implementado |
| Captura | Pacote `derivation`: 10 classes, 19 relações, 5 vocabulários SKOS (40 tipos de derivação, 56 dimensões); `hasSelector` para W3C Web Annotation | Rascunho, validação especializada pendente |
| Projeto (Design) | ADR-011–ADR-024, revisão da tipologia fundamentada na literatura, restrições SHACL de cardinalidade e SPARQL, alinhamentos via rdfs:seeAlso | Projeto inicial |
| Implementação | OWL/SHACL/schemas/docs/DOT regenerados, `examples/synthetic-derivation.ttl`, schema e exemplo do anotador, seis consultas SPARQL, SVGs renderizados | Protótipo testado (verificação de build, conformidade SHACL e teste negativo, SPARQL) |

Pendências: revisão especializada dos estereótipos «roleMixin»/«type»/«relator», alinhamento LRMoo, avaliação com casos reais.

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/sabiox-plan.md)
