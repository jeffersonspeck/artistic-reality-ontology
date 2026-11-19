[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/annotation-guide.md) · [Manual do anotador](manual-anotador.md)

# Guia de anotação

Este guia explica **como criar anotações** no [anotador](https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/): o que cada tipo de nó representa, o que ele precisa para existir e em que ordem criar os nós para registrar uma leitura, um padrão, um caso real ou uma derivação. O [manual do anotador](manual-anotador.md) cobre o resto da ferramenta (instalação, navegação, validação, arquivos).

## 1. A regra principal

O anotador só deixa criar o que a ontologia permite:

- **Filhos e pais vêm da estrutura.** A partir de um nó, só aparecem as relações que o tipo dele aceita (domínio e imagem das propriedades) e as classes que podem preencher cada uma.
- **O que é obrigatório vem junto.** Algumas classes não existem sozinhas: um recorte precisa de uma expressão, uma expressão precisa de uma obra, um registro de interpretação precisa de um recorte e de um ato. Essas ligações mínimas (cardinalidade mínima das restrições SHACL) são pedidas **no momento da criação**, e o nó só é criado quando estão preenchidas.
- **A criação é validada.** Depois de criar, os nós novos passam pelas mesmas regras de **Análise → Validar**. Se a ontologia recusar algo, nada é gravado e o motivo aparece no rodapé.

## 2. A janela "Criar nó"

Abra a janela por qualquer um destes caminhos:

- o botão **Criar nó…** no alto do painel *Criar*;
- os botões **Filhos** e **Pais** no inspetor de um nó;
- botão direito num nó → **Adicionar filho…** ou **Adicionar pai…**;
- uma etiqueta de classe no painel *Criar* (a janela abre com essa classe já escolhida).

A janela tem duas colunas.

**1. O que criar** (esquerda)
- Com um nó de partida, duas abas: **Filhos** (este → relação → novo) e **Pais** (novo → relação → este). Cada relação aparece com o que ela significa e as classes que a preenchem. Uma relação que já tem o máximo de valores permitido aparece em cinza.
- Sem nó de partida, todas as classes que podem ser criadas, agrupadas por módulo, com filtro.
- *O que não pode ser criado aqui* explica as exceções: classes abstratas (escolha uma subclasse), conceitos de vocabulário e agentes (escolhidos nos campos).

**2. Preencher** (direita)
- **Cartão da classe:** módulo, natureza OntoUML, definição e a ligação que será criada.
- **Texto:** título, descrição ou conteúdo do nó, no idioma escolhido. Outros idiomas entram depois no inspetor.
- **Obrigatório para existir:** uma caixa por exigência da ontologia, com a cardinalidade (exatamente 1, pelo menos 1) e o que a relação significa. Cada caixa pode ser preenchida por:
  - um **nó existente** compatível;
  - um **nó novo**, que mostra logo abaixo as exigências dele (por exemplo, um ato interpretativo novo pede o participante);
  - um **conceito de vocabulário** (tipo de derivação, dimensão, operação, papel), numa lista com definições;
  - um **agente** (pessoa ou coletivo), existente ou novo, com nome e, se houver, o IRI que o identifica.
  A caixa fica vermelha enquanto falta algo e verde quando está completa. Quando a ligação com o nó de partida já cumpre uma exigência (por exemplo, criar uma expressão a partir de uma obra cumpre "expressão realiza obra"), ela aparece como preenchida.
- **Opcional agora:** dados próprios da classe, como datas (ano, ano-mês ou data), resultado de uma avaliação, se uma condição é obrigatória.
- **Pode ser ligado depois:** as demais relações que a classe aceita, para completar no inspetor.

O rodapé diz o que ainda falta. O botão **Criar** só é liberado quando tudo o que é obrigatório está preenchido.

## 3. Receitas

As receitas abaixo seguem a ordem em que as exigências se encadeiam. Em cada passo, a janela pede o que está entre parênteses.

### 3.1 Uma obra e o trecho que você vai interpretar

1. **Obra** (`Artwork`), sem ligação: só o título.
2. A partir da obra, **Filhos** → *expressão* (`Expression`): a gravação, o texto da letra, a tradução. A ligação com a obra já cumpre a exigência.
3. Se a edição importa (álbum, edição de livro), a partir da expressão, **Filhos** → *manifestação* (`Manifestation`).
4. A partir da expressão, **Pais** → *recorte* (`Selection`): o trecho analisado. No inspetor, acrescente `hasSelector` para localizá-lo (linhas `line=27,30`, tempo `t=12,16` ou citação literal).

### 3.2 Uma leitura do trecho

1. **Registro de interpretação** (`InterpretationRecord`), a partir do recorte (**Pais**) ou sem ligação. A janela pede:
   - o recorte principal (`hasPrimarySelection`);
   - o ato que produziu a leitura (`producedByAct`). Um ato novo pede quem participou (`hasParticipant`): você, como pessoa, com o seu ORCID ou Lattes se quiser.
2. A partir do registro, **Filhos** → *descrição de situação* (ou *descrição de estado intencional*, para medo, desejo, crença): o que o trecho representa, nas suas palavras.
3. Opcional: *justificativa* (`hasJustification`) e fontes (`citesSource`) para fundamentar a leitura.

### 3.3 Do trecho ao mundo real

1. A partir da descrição de situação, **Filhos** → *padrão situacional* (`generalizesAs`). O padrão pede pelo menos uma *condição* (`hasCondition`); crie-a ali mesmo.
2. **Fonte de referência** (`ReferenceSource`), sem ligação: o relatório, o artigo, a base de dados. Acrescente o link em *Links*.
3. **Item de evidência** (`EvidenceItem`): pede a fonte (`derivedFromSource`).
4. **Caso empírico** (`EmpiricalCase`): o caso real. Depois, no inspetor, ligue-o à situação ou ao evento empírico (`caseAboutSituation`, `caseAboutEvent`) e à fonte (`citesSource`).
5. **Alegação de correspondência** (`CorrespondenceClaim`): pede o padrão (`assertsPattern`) e o caso (`assertsCase`). Escreva a alegação no nível do padrão, não da obra: o mesmo padrão pode aparecer em várias obras.
6. **Avaliação de evidência** (`EvidenceAssessment`): pede a alegação avaliada (`assessesClaim`) e a evidência (`assessesEvidence`). Em *Opcional agora*, escolha o resultado (apoia, apoia em parte, contesta, inconclusivo, irrelevante) e escreva o que a evidência apoia e o que não apoia.

### 3.4 Uma derivação entre obras (cover, sample, adaptação, paródia)

1. Tenha as duas entidades artísticas: obra, expressão, manifestação ou recorte de cada lado.
2. **Alegação de derivação** (`DerivationClaim`). A janela pede:
   - a origem (`hasSourceAnchor`) e o derivado (`hasDerivedAnchor`), diferentes entre si;
   - o tipo de derivação (`hasDerivationType`), escolhido no vocabulário com definições.
3. Opcional: *aspecto de transformação* (`hasTransformation`), que pede uma dimensão e uma operação (por exemplo, som gravado, recontextualizado); o regime (`hasRegime`); o ato criativo (`derivationRealizedBy`); justificativa e fontes.

### 3.5 Quem criou

1. **Ato criativo** (`CreativeAct`): pede o que ele produziu (`producesCreation`): obra, expressão ou manifestação, nunca um recorte. Em *Opcional agora*, a data.
2. A partir do ato, **Filhos** → *contribuição criativa*: pede o agente (`contributionBy`), o papel (`contributionRole`: autor, compositor, intérprete…) e a entidade à qual contribuiu (`contributionTo`).

### 3.6 Divergência e revisão

- **Contestação** (`Challenge`): pede a alegação contestada (`challenges`); pode visar qualquer alegação, inclusive outra contestação.
- **Avaliação por critérios** (`CriteriaAssessment`): pede a alegação avaliada e pelo menos um *critério* (epistêmico, sobre fundamentação; ou de valor, sobre mérito).

## 4. O que cada classe exige

A tabela vem das restrições SHACL da ARO 1.0.0 (`validation/aro-shapes.ttl`) e do catálogo (`model/conceptual-model.json`). "Exigido para existir" é o que a janela pede antes de criar; o resto pode ser acrescentado depois.

| Classe | O que é | Exigido para existir | Dados opcionais |
|---|---|---|---|
| **obra** (`Artwork`) | Criação artística identificável, considerada independentemente de qualquer versão ou cópia (nível obra do LRM). | nada além do próprio nó | — |
| **expressão** (`Expression`) | Realização específica de uma obra com conteúdo próprio: uma interpretação ou gravação, uma tradução, um arranjo, uma versão do texto, uma montagem de filme (nível expressão do LRM). | `realizesArtwork` → obra (1) | — |
| **manifestação** (`Manifestation`) | Publicação ou suporte que materializa uma ou mais expressões: edição de álbum, edição de livro, transmissão, lançamento digital (nível manifestação do LRM). Opcional: registre quando a edição importa, por exemplo para localizar uma página ou faixa. | `embodiesExpression` → expressão (1 ou mais) | — |
| **recorte** (`Selection`) | Parte endereçável de uma expressão (linhas, trecho de tempo, região de imagem), localizada por seletores; não é componente físico. | `selectsFrom` → expressão (1) | `selectorExpression` |
| **unidade de análise** (`AnalysisUnit`) | Agrupamento intencional de recortes com finalidade analítica. | nada além do próprio nó | — |
| **justificativa** (`Justification`) | Argumento registrado que liga premissas a uma alegação: por que uma interpretação, derivação, correspondência ou hipótese é afirmada. | nada além do próprio nó | — |
| **contestação** (`Challenge`) | Alegação que critica outra alegação ou propõe alternativa a ela; sendo também alegação, pode por sua vez ser justificada, avaliada e contestada. | `challenges` → alegação (1) | — |
| **avaliação por critérios** (`CriteriaAssessment`) | Avaliação de uma alegação segundo critérios epistêmicos ou de valor explícitos (plausibilidade, coerência, fidelidade...). | `assessesClaim` → alegação (1 ou mais)<br>`usesCriterion` → critério de avaliação (1 ou mais) | `assessmentOutcome` |
| **critério de avaliação** (`AssessmentCriterion`) | Regra explícita que uma avaliação aplica para julgar uma alegação; critérios epistêmicos julgam se a alegação é bem fundamentada, critérios de valor julgam seu mérito. | nada além do próprio nó | — |
| **critério epistêmico** (`EpistemicCriterion`) | Critério sobre conhecimento: se uma alegação é apoiada, coerente, plausível ou bem documentada (evidência textual, confiabilidade da fonte, coerência com a obra). | nada além do próprio nó | — |
| **critério de valor** (`ValueCriterion`) | Critério sobre mérito: se uma alegação ou leitura é relevante, justa, original ou eticamente adequada, independentemente de ser verdadeira. | nada além do próprio nó | — |
| **registro de interpretação** (`InterpretationRecord`) | Registro autoral persistente de uma interpretação de recorte. | `hasPrimarySelection` → recorte (1)<br>`producedByAct` → ato interpretativo (1) | — |
| **ato interpretativo** (`InterpretiveAct`) | Atividade intencional temporal que produz interpretações registradas. | `hasParticipant` → analista (1 ou mais) | `endDate`, `startDate` |
| **elemento representado** (`DepictedElement`) | Representação informacional de um referente na obra. | nada além do próprio nó | — |
| **agente representado** (`DepictedAgent`) | Elemento representado que se refere a agente ou personagem. | nada além do próprio nó | — |
| **descrição de situação** (`SituationDescription`) | Descrição registrada de situação representada. | nada além do próprio nó | — |
| **descrição de estado intencional** (`IntentionalStateDescription`) | Descrição de situação que atribui desejo, crença ou intenção a agente representado. | nada além do próprio nó | — |
| **padrão situacional** (`SituationPattern`) | Especificação informacional reutilizável de condições situacionais. | `hasCondition` → condição de padrão (1 ou mais) | — |
| **condição de padrão** (`PatternCondition`) | Condição individualizada obrigatória ou opcional de um padrão. | nada além do próprio nó | `isRequiredCondition` |
| **avaliação de evidência** (`EvidenceAssessment`) | Avaliação de se itens de evidência apoiam, contestam ou são irrelevantes para uma alegação. | `assessesClaim` → alegação (1 ou mais)<br>`assessesEvidence` → item de evidência (1 ou mais) | `assessmentOutcome` |
| **caso empírico** (`EmpiricalCase`) | Dossiê documentado sobre uma situação ou ocorrência real. | nada além do próprio nó | — |
| **afirmação empírica** (`EmpiricalClaim`) | Afirmação registrada e verificável acerca do mundo empírico. | nada além do próprio nó | — |
| **fonte de referência** (`ReferenceSource`) | Recurso externo citável: notícia, estudo, relatório, documento legal, relato, conjunto de dados etc. | nada além do próprio nó | `sourceURL` |
| **item de evidência** (`EvidenceItem`) | Afirmação ou observação contextualizada extraída de uma fonte. | `derivedFromSource` → fonte de referência (1) | — |
| **alegação de correspondência** (`CorrespondenceClaim`) | Alegação contestável de similaridade, instanciação ou relevância explicativa entre padrão e caso empírico. | `assertsCase` → caso empírico (1)<br>`assertsPattern` → padrão situacional (1) | — |
| **hipótese explicativa** (`ExplanationHypothesis`) | Mecanismo ou fatores propostos para explicar fenômeno representado ou observado. | nada além do próprio nó | — |
| **situação empírica** (`EmpiricalSituation`) | Configuração de entidades e condições no mundo real. | nada além do próprio nó | `endDate`, `startDate` |
| **evento empírico** (`EmpiricalEvent`) | Ocorrência do mundo real delimitada temporalmente. | nada além do próprio nó | `endDate`, `startDate` |
| **alegação de derivação** (`DerivationClaim`) | Alegação contestável, feita por um agente, de que uma entidade artística (obra, expressão, manifestação ou recorte) deriva de outra de modos especificados. A entidade derivada é representada como criação por direito próprio; legalidade e originalidade estão fora do escopo da ontologia. | `hasDerivationType` → tipo de derivação (1 ou mais)<br>`hasDerivedAnchor` → entidade artística (1)<br>`hasSourceAnchor` → entidade artística (1) | `derivationExtent` |
| **aspecto de transformação** (`TransformationAspect`) | Registro do que ocorreu com uma dimensão artística numa derivação (mantida, modificada, acrescentada, removida ou recontextualizada). | `hasDimension` → dimensão artística (1)<br>`hasOperation` → operação de transformação (1) | — |
| **ato criativo** (`CreativeAct`) | Atividade intencional no tempo que faz existir uma entidade artística (obra, expressão ou manifestação), inclusive as derivadas. | `producesCreation` → entidade artística (1 ou mais) | `endDate`, `startDate` |
| **contribuição criativa** (`CreativeContribution`) | Participação de um agente criativo num ato criativo sob um ou mais papéis. | `contributionBy` → agente criativo (1)<br>`contributionRole` → papel criativo (1 ou mais)<br>`contributionTo` → entidade artística (1 ou mais) | — |

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/annotation-guide.md)
