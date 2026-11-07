# Ontologia de Arte e Realidade (ARO)

![ARO](https://img.shields.io/badge/ARO-1.0.0-orange) ![Status](https://img.shields.io/badge/status-est%C3%A1vel-green) ![OWL](https://img.shields.io/badge/RDF%2FOWL-2-orange) ![SHACL](https://img.shields.io/badge/SHACL-validação-green) ![Idiomas](https://img.shields.io/badge/termos-EN%20%2B%20PT--BR-blue) ![Doutorado](https://img.shields.io/badge/doutorado-PPGInf%2FUFPR-informational) [![Anotador online](https://img.shields.io/badge/anotador-online-2563eb)](https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/)

> **[Read this documentation in English](README.md)** · Português (esta página)

Anotador online: <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/> ([manual](docs/pt-BR/manual-anotador.md)).

> Versão 1.0.0, parte de um projeto de doutorado (PPGInf/UFPR, ver [vinculação](#vinculação-acadêmica-e-institucional)). Congelada em [`releases/v1.0.0/`](releases/v1.0.0/).

A **ARO** é uma ontologia OWL para descrever **obras de arte em qualquer mídia** (música, texto, imagem, vídeo…) e o que se diz sobre elas, de forma rastreável e contestável:

- **o que se interpreta** num trecho de uma obra, admitindo interpretações divergentes;
- **que situações a obra representa** e que **padrões** essas situações formam;
- **que casos reais se parecem** com esses padrões, apoiados por fontes e evidências;
- **como uma obra deriva de outra** (tradução, cover, sample, adaptação, paródia, obra de fã…), o que foi mantido ou transformado, quem criou e **por que** se afirma a derivação.

A ARO é uma representação: ela não decide nem verifica nada. Interpretações, correspondências com a realidade e derivações são representadas como **alegações feitas por agentes**, junto com suas justificativas, fontes e avaliações de evidência, que outros agentes podem apoiar ou contestar. A ontologia nunca afirma por si que uma alegação é verdadeira, e a legalidade ou originalidade das derivações está fora do seu escopo.

---

## Sumário

- [Documentação](#documentação)
- [Como a ontologia está organizada](#como-a-ontologia-está-organizada)
- [Princípios](#princípios)
- [Instalação](#instalação)
- [Usar a ontologia](#usar-a-ontologia)
- [Instanciar: passo a passo](#instanciar-passo-a-passo)
- [Validar e consultar seus dados](#validar-e-consultar-seus-dados)
- [Anotador (ferramenta web)](#anotador-ferramenta-web)
- [Formato para ferramentas de anotação](#formato-para-ferramentas-de-anotação)
- [Executar os testes](#executar-os-testes)
- [Classes](#classes)
- [Idiomas](#idiomas)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Alterar o modelo](#alterar-o-modelo)
- [Vinculação acadêmica e institucional](#vinculação-acadêmica-e-institucional)
- [Status, licença e citação](#status-licença-e-citação)

---

## Documentação

A documentação completa está disponível nos dois idiomas:

| Documento | Português | English |
|---|---|---|
| Propósito e escopo | [Português](docs/pt-BR/purpose-and-scope.md) | [English](docs/en/purpose-and-scope.md) |
| Requisitos | [Português](docs/pt-BR/requirements.md) | [English](docs/en/requirements.md) |
| Questões de competência | [Português](docs/pt-BR/competency-questions.md) | [English](docs/en/competency-questions.md) |
| Modelo de referência (todas as classes, relações, vocabulários) | [Português](docs/pt-BR/reference-model.md) | [English](docs/en/reference-model.md) |
| Tipologia de derivação e bibliografia | [Português](docs/pt-BR/derivation-typology.md) | [English](docs/en/derivation-typology.md) |
| Fundamentação, mapeamentos e limitações | [Português](docs/pt-BR/foundation-and-mappings.md) | [English](docs/en/foundation-and-mappings.md) |
| Decisões de projeto (ADR-001 a ADR-033) | [Português](docs/pt-BR/design-decisions.md) | [English](docs/en/design-decisions.md) |
| Tipos de dados e validação | [Português](docs/pt-BR/datatypes-and-validation.md) | [English](docs/en/datatypes-and-validation.md) |
| Estudos de caso (Homem na Estrada, Vidas Secas) | [Português](docs/pt-BR/case-studies.md) | [English](docs/en/case-studies.md) |
| Diagramas OntoUML | [Português](docs/pt-BR/ontouml.md) | [English](docs/en/ontouml.md) |
| Rastreabilidade | [Português](docs/pt-BR/traceability.md) | [English](docs/en/traceability.md) |
| Protocolo de avaliação (especialistas e casos reais) | [Português](docs/pt-BR/evaluation-protocol.md) | [English](docs/en/evaluation-protocol.md) |
| Plano SABiOx | [Português](docs/pt-BR/sabiox-plan.md) | [English](docs/en/sabiox-plan.md) |
| Compilado SABiOx (tudo por fase) | [Português](docs/pt-BR/sabiox-compilado.md) | [English](docs/en/sabiox-compilation.md) |
| Anotador online | [Acessar](https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/) | [Open](https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/) |
| Manual do anotador (passo a passo) | [Português](docs/pt-BR/manual-anotador.md) | [English](docs/en/annotator-manual.md) |
| Guia do anotador | [Português](annotator/README.md#português) | [English](annotator/README.md#english) |
| Guia de uso (este arquivo) | [Português](LEIA-ME.md) | [English](README.md) |
| Versões congeladas (releases) | [Português](releases/README.md) | [English](releases/README.md) |
| Histórico de versões | — (só em inglês) | [English](CHANGELOG.md) |

---

## Como a ontologia está organizada

São oito módulos (caixas coloridas). Cada seta é uma relação da ontologia (por exemplo, a âncora de uma derivação é qualquer entidade artística: obra, expressão, manifestação ou recorte). O [diagrama completo](model/diagrams/overview.svg) mostra todas as classes e relações.

![Mapa dos módulos da ARO](model/diagrams/modules.pt-BR.svg)

| Módulo | Para quê | Diagrama |
|---|---|---|
| **Obra e recorte** | Identificar a obra, suas expressões (gravação, versão do texto, tradução) e manifestações (álbum, edição), como no IFLA LRM, e trechos endereçáveis | [artwork](model/diagrams/artwork.svg) |
| **Alegações e registros** | O que toda anotação tem em comum: registros analíticos e alegações, que são produzidas por um ato, justificadas, apoiadas em fontes, avaliadas e contestadas da mesma forma | [claim](model/diagrams/claim.svg) |
| **Interpretação** | Registrar interpretações de recortes e os atos que as produziram | [interpretation](model/diagrams/interpretation.svg) |
| **Representação** | Descrever situações, personagens e estados intencionais representados | [representation](model/diagrams/representation.svg) |
| **Padrão** | Generalizar situações em padrões reutilizáveis entre obras | [pattern](model/diagrams/pattern.svg) |
| **Evidência** | Ligar padrões a casos reais por alegações apoiadas em fontes e avaliações | [evidence](model/diagrams/evidence.svg) |
| **Derivação** | Dizer que uma obra/versão/trecho deriva de outro, como, o que mudou, quem fez e por quê | [derivation](model/diagrams/derivation.svg) |
| **Agentes** | Pessoas e coletivos (IRIs externos) e os papéis que desempenham como analistas e criadores | [agent](model/diagrams/agent.svg) |

## Princípios

1. **Recorte não é interpretação.** O trecho é um endereço; o sentido fica num `InterpretationRecord` separado.
2. **Representado não é empírico.** A situação na obra (`SituationDescription`) é distinta da situação real (`EmpiricalSituation`).
3. **Interpretações podem conflitar** e coexistir.
4. **Padrões são reutilizáveis** entre obras independentes.
5. **Fontes são independentes e reutilizáveis**; cada `EvidenceItem` representa um extrato contextual, e uma `EvidenceAssessment` representa o julgamento de um agente sobre se ele apoia ou contesta uma alegação **específica**.
6. **Uma alegação de correspondência representa semelhança**, não identidade nem causalidade.
7. **Derivação é representada como alegação**, não como fato; cada elo de uma cadeia de derivação é uma alegação separada, e nenhum axioma de transitividade é declarado.
8. **Obras derivadas são representadas como criações por direito próprio**; legalidade e originalidade estão fora do escopo da ontologia.
9. **Agentes vêm de fora**: pessoas, bandas e analistas são IRIs de outras ontologias (schema.org, FOAF, Wikidata, PROV-O); tipá-los como `aro:Person` ou `aro:Collective` os coloca no padrão de papéis da OntoUML.
10. **Toda alegação funciona do mesmo jeito.** Interpretações, derivações, correspondências, afirmações empíricas, hipóteses e contestações são todas `aro:Claim`: as mesmas propriedades registram quem as afirmou (`producedByAct`), por quê (`hasJustification`), com que fontes (`citesSource`), como foram julgadas (`assessesClaim`) e quem discorda (`challenges`).

## Instalação

Requisitos: **Python 3.10+**. Opcional: **Graphviz**, só para regenerar os diagramas SVG.

```bash
git clone <url-do-repositório> artistic-reality-ontology
cd artistic-reality-ontology
python -m pip install -r requirements.txt
python tests/test_project.py
```

O último comando deve terminar com `PASS: ...`. As dependências são `rdflib`, `jsonschema`, `pyshacl` e `owlrl`.

**Dados da versão 0.2?** Rode `python scripts/migrate.py meus-dados.ttl` (renomeações da 0.3, comentários preservados); o anotador converte arquivos antigos automaticamente ao abri-los.

## Usar a ontologia

| Arquivo | Uso |
|---|---|
| [`ontology/src/aro.ttl`](ontology/src/aro.ttl) | Versão atual em Turtle (também [`aro.owl`](ontology/src/aro.owl) em RDF/XML e [`aro.jsonld`](ontology/src/aro.jsonld)); um arquivo por pacote em [`ontology/src/modules/`](ontology/src/modules/) |
| [`releases/v1.0.0/`](releases/v1.0.0/) | **Versão congelada para citar** (IRI de versão `https://w3id.org/aro/ontology/1.0.0`); todas as versões em [`releases/`](releases/README.md) |
| [`validation/aro-shapes.ttl`](validation/aro-shapes.ttl) | Restrições SHACL para validar dados |
| [`model/ontouml/aro.ontouml.json`](model/ontouml/aro.ontouml.json) | O modelo como **projeto OntoUML** (JSON Schema oficial da OntoUML 1.0.2), verificado por `python scripts/verify_ontouml.py` |
| [`schemas/derivation-annotation.schema.json`](schemas/derivation-annotation.schema.json) | Formato JSON para ferramentas de anotação |

- **Namespace:** `https://w3id.org/aro/ontology#` (prefixo `aro:`).
- **Protégé ou outro editor OWL:** abra `ontology/src/aro.ttl`. Em *Preferences → Renderer*, escolha exibir por rótulo e idioma `pt-BR` para ver os termos em português.
- **Python:**

```python
from rdflib import Graph
g = Graph().parse("ontology/src/aro.ttl")
g.parse("meus-dados.ttl")
```

## Instanciar: passo a passo

O exemplo completo está em [`examples/quickstart.ttl`](examples/quickstart.ttl).

**1. Obra, expressão e recorte.** A obra é abstrata; a expressão é uma versão concreta com conteúdo próprio (gravação, texto, tradução); o recorte aponta um trecho dela com um seletor W3C Web Annotation (`t=` tempo, `xywh=` região, citação de texto ou SVG). Quando a edição importa (um álbum, uma edição de livro), acrescente uma `Manifestation` que `embodiesExpression`.

```turtle
@prefix aro:    <https://w3id.org/aro/ontology#> .
@prefix oa:     <http://www.w3.org/ns/oa#> .
@prefix schema: <https://schema.org/> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
@prefix ex:     <https://example.org/my-project/> .

ex:song a aro:Artwork ; aro:textValue "Song A"@en, "Canção A"@pt-BR .
ex:song-rec a aro:Expression ; aro:realizesArtwork ex:song .
ex:riff a aro:Selection ; aro:selectsFrom ex:song-rec ; aro:hasSelector ex:riff-sel .
ex:riff-sel a oa:FragmentSelector ; oa:value "t=12,16" .
```

**2. Interpretação.** Ancorada num recorte e produzida por um ato com um participante. O analista é qualquer IRI externo.

```turtle
ex:me a schema:Person, aro:Person .
ex:act a aro:InterpretiveAct ; aro:hasParticipant ex:me ; aro:startDate "2026-11-06"^^xsd:date .
ex:reading a aro:InterpretationRecord ;
  aro:hasPrimarySelection ex:riff ;
  aro:producedByAct ex:act ;
  aro:describesSituation ex:scene .
ex:scene a aro:SituationDescription ;
  aro:textValue "A character leaves home after a conflict."@en,
                "Uma personagem sai de casa após um conflito."@pt-BR .
```

**3. Derivação.** Uma faixa nova usa o riff como sample. O nível (obra, expressão, manifestação ou recorte) é escolhido pelas âncoras; tipo, regime, dimensão e operação são conceitos dos vocabulários; a justificativa explica a alegação.

```turtle
ex:track a aro:Artwork .
ex:track-rec a aro:Expression ; aro:realizesArtwork ex:track .
ex:loop a aro:Selection ; aro:selectsFrom ex:track-rec ; aro:hasSelector ex:loop-sel .
ex:loop-sel a oa:FragmentSelector ; oa:value "t=0,4" .

ex:claim a aro:DerivationClaim ;
  aro:hasSourceAnchor ex:riff ;
  aro:hasDerivedAnchor ex:loop ;
  aro:hasDerivationType aro:Sampling ;
  aro:hasRegime aro:PlayfulRegime ;
  aro:hasTransformation ex:aspect ;
  aro:hasJustification ex:why .
ex:aspect a aro:TransformationAspect ;
  aro:hasDimension aro:RecordedSoundDimension ;
  aro:hasOperation aro:Recontextualized .
ex:why a aro:Justification ;
  aro:textValue "Same 4-second guitar riff, pitched up."@en,
                "Mesmo riff de guitarra de 4 segundos, mais agudo."@pt-BR .
```

**Mais exemplos:**
- [`examples/synthetic-derivation.ttl`](examples/synthetic-derivation.ttl): cover com contribuições criativas, adaptação de romance para filme que mantém um padrão, cadeia fanfic → filme → romance, fontes e avaliação de evidência.
- [`examples/example_homem_na_estrada.ttl`](examples/example_homem_na_estrada.ttl) e [`examples/example_vidas_secas.ttl`](examples/example_vidas_secas.ttl): um arquivo por obra (gerados por `scripts/split_examples.py`).
- [`examples/case-studies.ttl`](examples/case-studies.ttl): **estudos de caso reais** — *Homem na Estrada* (Racionais MC's) e *Vidas Secas* (Graciliano Ramos) com sua adaptação para o cinema, ligados a casos reais e fontes documentadas; ver [estudos de caso](docs/pt-BR/case-studies.md).
- [`examples/aro_homem_na_estrada_realidade_social.ttl`](examples/aro_homem_na_estrada_realidade_social.ttl): anotação de pesquisa de *Homem na Estrada* em português (15 recortes, 8 cadeias de evidência com alcance declarado, o sample de *Ela Partiu*, hipóteses avaliadas como inconclusivas); relatório em [docs/pt-BR/relatorio-anotacao-homem-na-estrada-realidade-social.md](docs/pt-BR/relatorio-anotacao-homem-na-estrada-realidade-social.md).
- [`examples/synthetic-data.ttl`](examples/synthetic-data.ttl): cadeia completa obra → interpretação → padrão → caso real → evidência.

**Onde achar os conceitos:** os valores de `hasDerivationType`, `hasRegime`, `hasDimension`, `hasOperation` e `contributionRole` estão na [tabela de vocabulários](#classes) abaixo e, com definições e literatura, em [docs/pt-BR/reference-model.md](docs/pt-BR/reference-model.md#vocabulários-controlados-skos).

## Validar e consultar seus dados

```bash
python scripts/validate.py meus-dados.ttl --lang pt-BR
```

Mostra `OK` ou uma linha por violação (recurso, propriedade e mensagem em português). Exemplos de erros apontados: derivação sem tipo, origem igual à derivada, âncora que não é entidade artística, interpretação sem seu ato, data que não é data, texto sem marcação de idioma.

```bash
python scripts/query.py meus-dados.ttl --query queries/CQ-13-derivations-of-work.rq
```

Executa uma consulta SPARQL sobre seus dados mais a ontologia. Textos e rótulos aparecem em inglês por padrão; acrescente `--lang pt-BR` (ou qualquer etiqueta de idioma) para preferir outro idioma. Textos que não existem no idioma preferido aparecem no idioma que têm, então dados escritos em um só idioma respondem a todas as consultas. As consultas prontas em [`queries/`](queries/) respondem às questões de competência:

| Consulta | Pergunta |
|---|---|
| CQ-01 | Que obras, expressões e manifestações contêm um trecho? |
| CQ-02 | Que interpretações concorrentes surgem de um recorte? |
| CQ-03 | Que premissas justificam uma interpretação? |
| CQ-04 | Que padrões são abstraídos de situações representadas, e de que obras? |
| CQ-05 | Que casos reais foram alegados semelhantes a um padrão? |
| CQ-06 | Que fontes uma alegação de correspondência cita? |
| CQ-07 | Que fontes são reutilizadas entre casos, alegações e interpretações? |
| CQ-08 | A evidência apoia ou contesta uma alegação específica? |
| CQ-09 | Quem fez uma interpretação, e quem a avaliou ou contestou? |
| CQ-10 | Que explicações são hipotetizadas para um padrão? |
| CQ-11 | Que critérios são epistêmicos e quais são de valor? |
| CQ-12 | Que evidências são insuficientes para inferir uma explicação causal? |
| CQ-13 | O que deriva de uma obra, em que nível e de que tipo? |
| CQ-14 | Que obras estão ligadas por cadeias de derivação? |
| CQ-15 | O que cada derivação mantém, modifica, acrescenta, remove ou recontextualiza? |
| CQ-16 | Que derivações mantêm um padrão situacional da origem? |
| CQ-17 | Como cada derivação é explicada (justificativas, fontes, avaliações)? |
| CQ-18 | Quem contribuiu para a criação derivada e com que papel? |
| CQ-19 | Que alegações ainda não têm fundamento (justificativa, fonte ou avaliação)? |
| CQ-20 | Por quais expressões e manifestações uma obra existe? |
| CQ-21 | Quando ocorreram os atos criativos de uma derivação, e em que ordem? |
| RQ-01 | Que trechos representam situações alegadas correspondentes a casos reais documentados, e onde está a fonte? |
| RQ-02 | Que padrões situacionais se repetem em obras independentes? |
| RQ-03 | Como cada correspondência é sustentada (evidência, fonte, avaliação)? |
| RQ-04 | Que derivações mantêm um padrão da origem que corresponde a casos reais? |

## Anotador (ferramenta web)

A pasta [`annotator/`](annotator/README.md) traz uma ferramenta no navegador para instanciar a ARO sem escrever Turtle.

Ele roda online em <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/> (GitHub Pages, a partir do `main`). As anotações ficam no navegador até você salvá-las em `.ttl`.

Para rodar localmente:

```bash
python scripts/annotator.py
```

Crie nós de qualquer classe, ligue-os com as propriedades que a ontologia permite (inclusive conceitos de vocabulário, seletores W3C e agentes externos), escreva textos em vários idiomas, adicione links para fontes e evidências, pesquise situações no Google, abra o grafo passo a passo, valide e **salve ou carregue** suas anotações em Turtle. Interface em português ou inglês. Ver o [manual do anotador](docs/pt-BR/manual-anotador.md) (passo a passo) e o [guia do anotador](annotator/README.md#português) (referência rápida).

## Executar os testes

```bash
python tests/test_project.py
```

A saída deve terminar com `PASS: ...`. Os testes conferem:
- que os arquivos gerados batem com o catálogo;
- que as três serializações OWL coincidem;
- que todo termo tem rótulo em inglês e português;
- que os compromissos da UFO projetados em OWL valem (kinds disjuntos, coberturas, papéis, relatores) e que os exemplos são logicamente consistentes;
- que os exemplos estão na versão atual do vocabulário (migração 0.2 → 0.3);
- que a exportação OntoUML é válida no schema oficial e bem formada;
- os JSON Schemas e as restrições SHACL, com dados válidos e dados errados de propósito;
- cada consulta SPARQL;
- as respostas esperadas dos estudos de caso.

Detalhes: [manual do anotador, seção 12](docs/pt-BR/manual-anotador.md#12-executar-os-testes-do-projeto).

## Formato para ferramentas de anotação

Um anotador pode produzir JSON validado por [`schemas/derivation-annotation.schema.json`](schemas/derivation-annotation.schema.json): uma alegação de derivação por documento, com âncoras e seletores, tipos, regimes, aspectos e justificativa em um ou vários idiomas (`{"en": "...", "pt-BR": "..."}`). Os valores aceitos são gerados dos vocabulários da ontologia. Exemplo: [`examples/synthetic-derivation-annotation.json`](examples/synthetic-derivation-annotation.json).

## Classes

Visão geral gerada a partir do catálogo; a coluna UFO traz o estereótipo OntoUML. Para cada classe, [docs/pt-BR/reference-model.md](docs/pt-BR/reference-model.md) explica o que o estereótipo significa na UFO, como a classe é representada em OWL/TTL (com seu Turtle), suas restrições SHACL e o que o OWL não consegue expressar.

<!-- BEGIN GENERATED: class overview (scripts/build.py) -->
#### `artwork` — Obra e recorte

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `ArtisticEntity` | entidade artística | «category» | Tudo o que é artístico e pode ser origem ou resultado de uma derivação ou de um ato criativo: obra, expressão, manifestação ou recorte. |
| `Artwork` | obra | «kind» | Criação artística identificável, considerada independentemente de qualquer versão ou cópia (nível obra do LRM). |
| `Expression` | expressão | «kind» | Realização específica de uma obra com conteúdo próprio: uma interpretação ou gravação, uma tradução, um arranjo, uma versão do texto, uma montagem de filme (nível expressão do LRM). |
| `Manifestation` | manifestação | «kind» | Publicação ou suporte que materializa uma ou mais expressões: edição de álbum, edição de livro, transmissão, lançamento digital (nível manifestação do LRM). Opcional: registre quando a edição importa, por exemplo para localizar uma página ou faixa. |
| `Selection` | recorte | «kind» | Parte endereçável de uma expressão (linhas, trecho de tempo, região de imagem), localizada por seletores; não é componente físico. |
| `AnalysisUnit` | unidade de análise | «subkind» | Agrupamento intencional de recortes com finalidade analítica. |

#### `claim` — Alegações e registros

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `AnalyticalRecord` | registro analítico | «kind» | Objeto informacional registrado por um agente no curso de uma análise: o tipo comum de interpretações, descrições, padrões, casos, itens de evidência, alegações, justificativas e avaliações. Dois registros com o mesmo texto feitos por agentes ou atos diferentes são registros diferentes. |
| `Claim` | alegação | «subkind» | Registro analítico que afirma algo contestável: pode ser produzido por um ato, justificado, apoiado em fontes, avaliado e contestado. A ARO representa alegações, nunca sua verdade. |
| `Justification` | justificativa | «subkind» | Argumento registrado que liga premissas a uma alegação: por que uma interpretação, derivação, correspondência ou hipótese é afirmada. |
| `Challenge` | contestação | «subkind» | Alegação que critica outra alegação ou propõe alternativa a ela; sendo também alegação, pode por sua vez ser justificada, avaliada e contestada. |
| `Assessment` | avaliação | «subkind» | Registro analítico que julga uma ou mais alegações intimamente relacionadas: por critérios explícitos, por evidência, ou ambos. Registra um julgamento feito por um agente; não resolve a alegação. |
| `CriteriaAssessment` | avaliação por critérios | «subkind» | Avaliação de uma alegação segundo critérios epistêmicos ou de valor explícitos (plausibilidade, coerência, fidelidade...). |
| `AssessmentCriterion` | critério de avaliação | «subkind» | Regra explícita que uma avaliação aplica para julgar uma alegação; critérios epistêmicos julgam se a alegação é bem fundamentada, critérios de valor julgam seu mérito. |
| `EpistemicCriterion` | critério epistêmico | «subkind» | Critério sobre conhecimento: se uma alegação é apoiada, coerente, plausível ou bem documentada (evidência textual, confiabilidade da fonte, coerência com a obra). |
| `ValueCriterion` | critério de valor | «subkind» | Critério sobre mérito: se uma alegação ou leitura é relevante, justa, original ou eticamente adequada, independentemente de ser verdadeira. |

#### `interpretation` — Interpretação

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `InterpretationRecord` | registro de interpretação | «subkind» | Registro autoral persistente de uma interpretação de recorte. |
| `InterpretiveAct` | ato interpretativo | «event» | Atividade intencional temporal que produz interpretações registradas. |

#### `representation` — Representação

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `DepictedElement` | elemento representado | «subkind» | Representação informacional de um referente na obra. |
| `DepictedAgent` | agente representado | «subkind» | Elemento representado que se refere a agente ou personagem. |
| `SituationDescription` | descrição de situação | «subkind» | Descrição registrada de situação representada. |
| `IntentionalStateDescription` | descrição de estado intencional | «subkind» | Descrição de situação que atribui desejo, crença ou intenção a agente representado. |

#### `pattern` — Padrão situacional

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `SituationPattern` | padrão situacional | «subkind» | Especificação informacional reutilizável de condições situacionais. |
| `PatternCondition` | condição de padrão | «subkind» | Condição individualizada obrigatória ou opcional de um padrão. |

#### `evidence` — Evidência e mundo empírico

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `EvidenceAssessment` | avaliação de evidência | «subkind» | Avaliação de se itens de evidência apoiam, contestam ou são irrelevantes para uma alegação. |
| `EmpiricalCase` | caso empírico | «subkind» | Dossiê documentado sobre uma situação ou ocorrência real. |
| `EmpiricalClaim` | afirmação empírica | «subkind» | Afirmação registrada e verificável acerca do mundo empírico. |
| `ReferenceSource` | fonte de referência | «kind» | Recurso externo citável: notícia, estudo, relatório, documento legal, relato, conjunto de dados etc. |
| `EvidenceItem` | item de evidência | «subkind» | Afirmação ou observação contextualizada extraída de uma fonte. |
| `CorrespondenceClaim` | alegação de correspondência | «subkind» | Alegação contestável de similaridade, instanciação ou relevância explicativa entre padrão e caso empírico. |
| `ExplanationHypothesis` | hipótese explicativa | «subkind» | Mecanismo ou fatores propostos para explicar fenômeno representado ou observado. |
| `EmpiricalSituation` | situação empírica | «situation» | Configuração de entidades e condições no mundo real. |
| `EmpiricalEvent` | evento empírico | «event» | Ocorrência do mundo real delimitada temporalmente. |

#### `derivation` — Derivação e criação

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `DerivationClaim` | alegação de derivação | «subkind» | Alegação contestável, feita por um agente, de que uma entidade artística (obra, expressão, manifestação ou recorte) deriva de outra de modos especificados. A entidade derivada é representada como criação por direito próprio; legalidade e originalidade estão fora do escopo da ontologia. |
| `TransformationAspect` | aspecto de transformação | «subkind» | Registro do que ocorreu com uma dimensão artística numa derivação (mantida, modificada, acrescentada, removida ou recontextualizada). |
| `CreativeAct` | ato criativo | «event» | Atividade intencional no tempo que faz existir uma entidade artística (obra, expressão ou manifestação), inclusive as derivadas. |
| `CreativeContribution` | contribuição criativa | «relator» | Participação de um agente criativo num ato criativo sob um ou mais papéis. |
| `DerivationType` | tipo de derivação | «type» | Tipo de derivação (tradução, cover, sample, paródia...); suas instâncias são conceitos SKOS. |
| `DerivationRegime` | regime de derivação | «type» | Postura da derivação em relação à origem (lúdica, satírica, séria, reverencial); suas instâncias são conceitos SKOS. |
| `ArtisticDimension` | dimensão artística | «type» | Aspecto da obra segundo o qual a derivação pode ser comparada (melodia, letra, enredo, personagem, mídia...). |
| `TransformationOperation` | operação de transformação | «type» | O que a derivação faz com uma dimensão: manter, modificar, acrescentar, remover ou recontextualizar. |
| `CreativeRole` | papel criativo | «type» | Papel que qualifica uma contribuição criativa (compositor, intérprete, tradutor, remixador...). |

#### `agent` — Agentes

| Classe | Rótulo | UFO | Definição |
|---|---|---|---|
| `Agent` | agente | «category» | Tudo o que pode agir intencionalmente: uma pessoa ou um coletivo. Agentes são identificados por IRIs de vocabulários externos (Wikidata, ORCID, ISNI, FOAF, schema.org). |
| `Person` | pessoa | «kind» | Agente humano individual (autor, intérprete, analista, pesquisador). |
| `Collective` | coletivo | «collective» | Grupo de agentes que age como um: banda, companhia, grupo de pesquisa, equipe de filmagem, editora. |
| `Analyst` | analista | «roleMixin» | Agente enquanto participa de um ato interpretativo (interpreta, descreve, avalia). Desempenhado por pessoas ou coletivos identificados por IRIs externos. |
| `CreativeAgent` | agente criativo | «roleMixin» | Agente enquanto contribui para um ato criativo (compõe, interpreta, traduz, dirige...). Desempenhado por pessoas ou coletivos identificados por IRIs externos. |
| `PersonAnalyst` | pessoa analista | «role» | Pessoa enquanto participa de um ato interpretativo; definido como Person e Analyst. |
| `CollectiveAnalyst` | coletivo analista | «role» | Coletivo enquanto participa de um ato interpretativo; definido como Collective e Analyst. |
| `PersonCreator` | pessoa criadora | «role» | Pessoa enquanto participa de um ato criativo; definido como Person e CreativeAgent. |
| `CollectiveCreator` | coletivo criador | «role» | Coletivo enquanto participa de um ato criativo; definido como Collective e CreativeAgent. |

#### Vocabulários controlados (SKOS)

| Esquema | Conceitos | Nível mais alto |
|---|---|---|
| `DerivationTypeScheme` — Tipos de derivação | 40 | `Rerealization`, `Incorporation`, `Transformation`, `Imitation`, `Extension` |
| `ArtisticDimensionScheme` — Dimensões artísticas | 56 | `NarrativeDimension`, `TextDimension`, `MusicDimension`, `VisualDimension`, `AudiovisualDimension`, `GeneralDimension`, `ParatextDimension` |
| `DerivationRegimeScheme` — Regimes de derivação | 4 | `PlayfulRegime`, `SatiricalRegime`, `SeriousRegime`, `ReverentialRegime` |
| `TransformationOperationScheme` — Operações de transformação | 5 | `Retained`, `Modified`, `Added`, `Removed`, `Recontextualized` |
| `CreativeRoleScheme` — Papéis criativos | 10 | `AuthorRole`, `ComposerRole`, `LyricistRole`, `PerformerRole`, `ArrangerRole`, `TranslatorRole`, `AdapterRole`, `ProducerRole`, `DirectorRole`, `RemixerRole` |
<!-- END GENERATED: class overview -->

## Idiomas

- **Termos em inglês:** todos os IRIs (`aro:Artwork`, `aro:hasSourceAnchor`…).
- **Tradução completa em português:** toda classe, propriedade, conceito e mensagem de validação tem rótulo, definição e comentário em `@en` e `@pt-BR`.
- **Conteúdo em qualquer idioma:** textos dos seus dados (`aro:textValue`, `aro:derivationExtent`) devem ter marcação de idioma, por exemplo `"..."@es`, e podem ter um valor por idioma. Texto sem idioma é rejeitado na validação.

## Estrutura do repositório

| Pasta / arquivo | Conteúdo |
|---|---|
| `ontology/src/` | versão atual da ontologia (Turtle, RDF/XML, JSON-LD) e `modules/` por pacote — gerada |
| `releases/` | versões congeladas (`v0.1.0/`, `v0.2.0-beta/`, `v0.2.1-beta/`, `v0.3.0-beta/`, `v1.0.0/`), cada uma com ontologia, módulos, SHACL e notas de versão |
| `validation/` | restrições SHACL — gerada |
| `schemas/` | JSON Schemas (fonte de referência, registro genérico, anotação de derivação) |
| `examples/` | dados sintéticos de exemplo, todos fictícios |
| `queries/` | consultas SPARQL das questões de competência |
| `annotator/` | anotador web (grafo, salvar/carregar Turtle) |
| `scripts/` | `build.py` (gera os artefatos), `validate.py`, `query.py`, `migrate.py` (dados 0.2 → 0.3), `compare_annotations.py` (concordância entre anotadores), `verify_ontouml.py` (validação OntoUML), `annotator.py`, `split_examples.py` |
| `model/` | catálogo conceitual (fonte única) e diagramas |
| `docs/` | documentação completa em `en/` e `pt-BR/` |
| `tests/` | verificação automatizada |

## Alterar o modelo

O arquivo [`model/conceptual-model.json`](model/conceptual-model.json) é a **fonte única**. Para acrescentar uma classe, relação ou conceito:

1. edite o catálogo (o `$comment` no topo explica cada campo);
2. rode `python scripts/build.py`, que regenera a ontologia, o SHACL, os schemas, a documentação de referência, os diagramas e a seção [Classes](#classes) deste arquivo;
3. rode `python tests/test_project.py`.

Não edite à mão os arquivos marcados como gerados.

## Vinculação acadêmica e institucional

Este projeto integra as atividades de pesquisa desenvolvidas no âmbito do Doutorado em Informática de **Jefferson Rodrigo Speck**, doutorando do Programa de Pós-Graduação em Informática (PPGInf) da Universidade Federal do Paraná (UFPR), sob orientação do **Prof. Dr. Roberto Pereira** (UFPR) e coorientação do **Prof. Dr. Clodis Boscarioli** (UNIOESTE), com vinculação ao Grupo de Pesquisa em Tecnologia e Inovação na Educação (GTIE), da Universidade Estadual do Oeste do Paraná (UNIOESTE).

A pesquisa de doutorado investiga a modelagem computacional da ética e da moral, considerando os limites da representação do conhecimento, a incompletude dos modelos, as dimensões desconhecidas ou excluídas da representação e suas implicações no desenvolvimento e na utilização de sistemas computacionais, especialmente aqueles fundamentados em Inteligência Artificial.

## Status, licença e citação

- **Status:** estável (v1.0.0), desenvolvida com a metodologia SABiOx e fundamentada na UFO. A exportação OntoUML é válida no OntoUML JSON Schema oficial e bem formada segundo a biblioteca oficial ontouml-js (0 erros). A avaliação por especialistas e com casos reais segue o [protocolo de avaliação](docs/pt-BR/evaluation-protocol.md). Ver [limitações](docs/pt-BR/foundation-and-mappings.md#limitações-conhecidas).
- **Licença:** MIT ([LICENSE](LICENSE)). Ontologias de terceiros não são redistribuídas.
- **Citação** ([CITATION.cff](CITATION.cff), ainda sem DOI):
  > SPECK, Jefferson Rodrigo. *Artistic Reality Ontology (ARO)*, versão 1.0.0. Curitiba: Universidade Federal do Paraná, Programa de Pós-Graduação em Informática, 2026. Ontologia e software. Projeto de doutorado; orientação: Roberto Pereira; coorientação: Clodis Boscarioli.
- **Exemplos:** os exemplos sintéticos são fictícios. Os estudos de caso usam obras e fontes reais, mas as leituras são interpretações de um analista, e as correspondências são alegações, não fatos.
