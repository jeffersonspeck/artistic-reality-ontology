<!-- Gerado por scripts/build.py a partir de model/conceptual-model.json. Não editar à mão. -->

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/reference-model.md)

# Modelo conceitual de referência

**Importante:** as anotações de estereótipos são compromissos provisórios, não comprovação de validação automática OntoUML. Os diagramas DOT/SVG são visualizações, não arquivos nativos de intercâmbio OntoUML.

## Como os estereótipos UFO são representados em OWL

| Estereótipo | Classes | UFO | OWL/TTL | Não expressável em OWL |
|---|---|---|---|---|
| «category» | `ArtisticEntity`, `Agent` | Não-sortal rígido: generaliza kinds com princípios de identidade diferentes que partilham propriedades essenciais; não fornece identidade e não tem instâncias diretas. | `owl:Class` declarada como `owl:disjointUnionOf` dos kinds que generaliza; usada como domínio ou imagem no lugar de um `owl:unionOf`. | A rigidez não é expressável; o axioma de cobertura é o único compromisso representado. |
| «kind» | `Artwork`, `Expression`, `Manifestation`, `Selection`, `AnalyticalRecord`, `Person`, `ReferenceSource` | Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. | Declarada como `owl:Class`. | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| «subkind» | `AnalysisUnit`, `Claim`, `Justification`, `Challenge`, `Assessment`, `CriteriaAssessment`, `EvidenceAssessment`, `AssessmentCriterion`, `EpistemicCriterion`, `ValueCriterion`, `InterpretationRecord`, `DepictedElement`, `DepictedAgent`, `SituationDescription`, `IntentionalStateDescription`, `SituationPattern`, `PatternCondition`, `EmpiricalCase`, `EmpiricalClaim`, `EvidenceItem`, `CorrespondenceClaim`, `ExplanationHypothesis`, `DerivationClaim`, `TransformationAspect` | Sortal rígido que especializa um kind e herda seu princípio de identidade. | `owl:Class` com `rdfs:subClassOf` a classe especializada. | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| «collective» | `Collective` | Sortal rígido cujas instâncias são coleções de membros unificados por uma relação comum (banda, companhia); fornece sua identidade. | Declarada como `owl:Class`; os membros não são modelados (agentes são IRIs externos). | Rigidez, relação unificadora e pertencimento não são representados. |
| «role» | `PersonAnalyst`, `CollectiveAnalyst`, `PersonCreator`, `CollectiveCreator` | Sortal anti-rígido: instâncias de um kind o desempenham enquanto estão numa relação (participar de um ato); herda a identidade do kind. | `owl:Class` com `rdfs:subClassOf` seu kind e seu roleMixin, e `owl:equivalentClass` a interseção dos dois. | A anti-rigidez (um agente pode deixar de desempenhar o papel) não é expressável em OWL. |
| «event» | `InterpretiveAct`, `EmpiricalEvent`, `CreativeAct` | Perdurante (UFO-B): ocorrência que se desenrola no tempo e tem participantes; não é um objeto. | `owl:Class`; a participação é representada por propriedades de objeto. | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| «situation» | `EmpiricalSituation` | Situação (UFO-B): configuração de entidades que se dá num instante e pode disparar eventos ou resultar deles. | `owl:Class`. | O instante em que a situação se dá e seus constituintes não são representados. |
| «relator» | `CreativeContribution` | Relator (UFO-A): endurante existencialmente dependente das entidades que conecta; fundamento de verdade de uma relação material. | `owl:Class` com propriedades de objeto para seus relata; o SHACL impõe as cardinalidades de mediação. | Dependência existencial e a relação material derivada não são expressáveis em OWL. |
| «roleMixin» | `Analyst`, `CreativeAgent` | Não-sortal anti-rígido: classifica entidades de kinds diferentes por uma propriedade relacional (participar de um ato); não fornece identidade. | `owl:Class`; indivíduos de vocabulários externos são classificados nela por um raciocinador RDFS pelo `rdfs:range` da relação que os conecta. | A anti-rigidez (a entidade pode deixar de desempenhar o papel) não é expressável; qualquer IRI usado na relação é classificado. |
| «type» | `DerivationType`, `DerivationRegime`, `ArtisticDimension`, `TransformationOperation`, `CreativeRole` | Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). | `owl:Class` cujas instâncias são conceitos SKOS (cada conceito é tipado como `skos:Concept` e como esta classe). | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |

## Classes

### `ArtisticEntity` — entidade artística

**Definição:** Tudo o que é artístico e pode ser origem ou resultado de uma derivação ou de um ato criativo: obra, expressão, manifestação ou recorte.

| | |
|---|---|
| **UFO / OntoUML** | «category» — Não-sortal rígido: generaliza kinds com princípios de identidade diferentes que partilham propriedades essenciais; não fornece identidade e não tem instâncias diretas. |
| **Fundamentação** | não-sortal rígido UFO-A (category) que generaliza kinds com princípios de identidade diferentes |
| **Dependência** | nenhuma própria; cada instância tem a identidade de seu kind |
| **Em OWL/TTL** | `aro:ArtisticEntity a owl:Class`; abstrata (sem instâncias diretas): `owl:disjointUnionOf` (`aro:Artwork`, `aro:Expression`, `aro:Manifestation`, `aro:Selection`); imagem de: `hasSourceAnchor`, `hasDerivedAnchor`, `producesCreation`, `contributionTo` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de cobertura é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Category` |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:ArtisticEntity a owl:Class ;
    rdfs:label "artistic entity"@en,
        "entidade artística"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): category; foundation: UFO-A rigid non-sortal (category) generalizing kinds with different identity principles; dependency: none of its own; each instance takes the identity of its kind"@en,
        "Estereótipo OntoUML (provisório): category; fundamentação: não-sortal rígido UFO-A (category) que generaliza kinds com princípios de identidade diferentes; dependência: nenhuma própria; cada instância tem a identidade de seu kind"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    owl:disjointUnionOf [ ] ;
    skos:definition "Anything artistic that can be the origin or result of a derivation or a creative act: an artwork, an expression, a manifestation or a selection."@en,
        "Tudo o que é artístico e pode ser origem ou resultado de uma derivação ou de um ato criativo: obra, expressão, manifestação ou recorte."@pt-BR .
```

</details>

### `Artwork` — obra

**Definição:** Criação artística identificável, considerada independentemente de qualquer versão ou cópia (nível obra do LRM).

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto social/informacional UFO-C (compromisso de domínio) |
| **Dependência** | historicamente da criação; não de uma cópia específica |
| **Em OWL/TTL** | `aro:Artwork a owl:Class`; `rdfs:subClassOf aro:ArtisticEntity`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `hasExpression`; imagem de: `realizesArtwork` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Alinhamentos** | `rdfs:seeAlso` `lrmoo:F1_Work` |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Artwork a owl:Class ;
    rdfs:label "artwork"@en,
        "obra"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C social/information object (domain commitment); dependency: historically on creation; not on a single copy"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto social/informacional UFO-C (compromisso de domínio); dependência: historicamente da criação; não de uma cópia específica"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    rdfs:seeAlso lrmoo:F1_Work ;
    rdfs:subClassOf aro:ArtisticEntity ;
    skos:definition "Identifiable artistic creation, considered independently of any particular version or copy (the LRM work level)."@en,
        "Criação artística identificável, considerada independentemente de qualquer versão ou cópia (nível obra do LRM)."@pt-BR .
```

</details>

### `Expression` — expressão

**Definição:** Realização específica de uma obra com conteúdo próprio: uma interpretação ou gravação, uma tradução, um arranjo, uma versão do texto, uma montagem de filme (nível expressão do LRM).

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C (nível de conteúdo) |
| **Dependência** | realiza exatamente uma obra |
| **Em OWL/TTL** | `aro:Expression a owl:Class`; `rdfs:subClassOf aro:ArtisticEntity`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `realizesArtwork`, `hasManifestation`; imagem de: `hasExpression`, `embodiesExpression`, `selectsFrom` |
| **SHACL** | `realizesArtwork` (mín 1, máx 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Alinhamentos** | `rdfs:seeAlso` `lrmoo:F2_Expression` |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Expression a owl:Class ;
    rdfs:label "expression"@en,
        "expressão"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object (content level); dependency: realizes exactly one artwork"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C (nível de conteúdo); dependência: realiza exatamente uma obra"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    rdfs:seeAlso lrmoo:F2_Expression ;
    rdfs:subClassOf aro:ArtisticEntity ;
    skos:definition "Specific realization of an artwork with its own content: a performance or recording, a translation, an arrangement, a text version, a film cut (the LRM expression level)."@en,
        "Realização específica de uma obra com conteúdo próprio: uma interpretação ou gravação, uma tradução, um arranjo, uma versão do texto, uma montagem de filme (nível expressão do LRM)."@pt-BR .
```

</details>

### `Manifestation` — manifestação

**Definição:** Publicação ou suporte que materializa uma ou mais expressões: edição de álbum, edição de livro, transmissão, lançamento digital (nível manifestação do LRM). Opcional: registre quando a edição importa, por exemplo para localizar uma página ou faixa.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | artefato informacional UFO-C (nível de suporte) |
| **Dependência** | materializa ao menos uma expressão |
| **Em OWL/TTL** | `aro:Manifestation a owl:Class`; `rdfs:subClassOf aro:ArtisticEntity`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `embodiesExpression`; imagem de: `hasManifestation`, `locatedInManifestation` |
| **SHACL** | `embodiesExpression` (mín 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Alinhamentos** | `rdfs:seeAlso` `lrmoo:F3_Manifestation` |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Manifestation a owl:Class ;
    rdfs:label "manifestation"@en,
        "manifestação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information artifact (carrier level); dependency: embodies at least one expression"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: artefato informacional UFO-C (nível de suporte); dependência: materializa ao menos uma expressão"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    rdfs:seeAlso lrmoo:F3_Manifestation ;
    rdfs:subClassOf aro:ArtisticEntity ;
    skos:definition "Publication or carrier that embodies one or more expressions: an album edition, a book edition, a broadcast, a digital release (the LRM manifestation level). Optional: record it when the edition matters, e.g. to locate a page or a track."@en,
        "Publicação ou suporte que materializa uma ou mais expressões: edição de álbum, edição de livro, transmissão, lançamento digital (nível manifestação do LRM). Opcional: registre quando a edição importa, por exemplo para localizar uma página ou faixa."@pt-BR .
```

</details>

### `Selection` — recorte

**Definição:** Parte endereçável de uma expressão (linhas, trecho de tempo, região de imagem), localizada por seletores; não é componente físico.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C; categoria de domínio |
| **Dependência** | a expressão de onde é tirado e seus seletores |
| **Em OWL/TTL** | `aro:Selection a owl:Class`; `rdfs:subClassOf aro:ArtisticEntity`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `selectsFrom`, `locatedInManifestation`, `hasSelector`, `selectorExpression`; imagem de: `groupsSelection`, `hasPrimarySelection`, `hasSupportingSelection`, `aspectSourceSelection`, `aspectDerivedSelection` |
| **SHACL** | `selectsFrom` (mín 1, máx 1); `locatedInManifestation` (máx 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Alinhamentos** | `rdfs:seeAlso` `oa:SpecificResource` |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Selection a owl:Class ;
    rdfs:label "selection"@en,
        "recorte"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; domain category; dependency: the expression it is taken from and its selectors"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; categoria de domínio; dependência: a expressão de onde é tirado e seus seletores"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    rdfs:seeAlso oa:SpecificResource ;
    rdfs:subClassOf aro:ArtisticEntity ;
    skos:definition "Addressable portion of an expression (lines, a time span, an image region), located by selectors; not a physical component."@en,
        "Parte endereçável de uma expressão (linhas, trecho de tempo, região de imagem), localizada por seletores; não é componente físico."@pt-BR .
```

</details>

### `AnalysisUnit` — unidade de análise

**Definição:** Agrupamento intencional de recortes com finalidade analítica.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | referência organizacional a recortes |
| **Em OWL/TTL** | `aro:AnalysisUnit a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `groupsSelection` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:AnalysisUnit a owl:Class ;
    rdfs:label "analysis unit"@en,
        "unidade de análise"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: organizational reference to selections"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: referência organizacional a recortes"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Intentional grouping of selections for analytical purposes."@en,
        "Agrupamento intencional de recortes com finalidade analítica."@pt-BR .
```

</details>

### `AnalyticalRecord` — registro analítico

**Definição:** Objeto informacional registrado por um agente no curso de uma análise: o tipo comum de interpretações, descrições, padrões, casos, itens de evidência, alegações, justificativas e avaliações. Dois registros com o mesmo texto feitos por agentes ou atos diferentes são registros diferentes.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C; o único kind que fornece a identidade de todo registro analítico (ADR-026) |
| **Dependência** | historicamente do ato ou agente que o registrou |
| **Em OWL/TTL** | `aro:AnalyticalRecord a owl:Class`; abstrata (sem instâncias diretas): `owl:disjointUnionOf` (`aro:AnalysisUnit`, `aro:Claim`, `aro:Justification`, `aro:Assessment`, `aro:AssessmentCriterion`, `aro:DepictedElement`, `aro:SituationDescription`, `aro:SituationPattern`, `aro:PatternCondition`, `aro:EmpiricalCase`, `aro:EvidenceItem`, `aro:TransformationAspect`); disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `producedByAct`, `citesSource` |
| **SHACL** | `producedByAct` (máx 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:AnalyticalRecord a owl:Class ;
    rdfs:label "analytical record"@en,
        "registro analítico"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; the single kind supplying the identity of every analytical record (ADR-026); dependency: historically on the act or agent that recorded it"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; o único kind que fornece a identidade de todo registro analítico (ADR-026); dependência: historicamente do ato ou agente que o registrou"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    owl:disjointUnionOf [ ] ;
    skos:definition "Information object recorded by an agent in the course of an analysis: the common sort of interpretations, descriptions, patterns, cases, evidence items, claims, justifications and assessments. Two records with the same text by different agents or acts are different records."@en,
        "Objeto informacional registrado por um agente no curso de uma análise: o tipo comum de interpretações, descrições, padrões, casos, itens de evidência, alegações, justificativas e avaliações. Dois registros com o mesmo texto feitos por agentes ou atos diferentes são registros diferentes."@pt-BR .
```

</details>

### `Claim` — alegação

**Definição:** Registro analítico que afirma algo contestável: pode ser produzido por um ato, justificado, apoiado em fontes, avaliado e contestado. A ARO representa alegações, nunca sua verdade.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C (conteúdo proposicional como registro autoral, ADR-010) |
| **Dependência** | o ato ou agente que a afirma |
| **Em OWL/TTL** | `aro:Claim a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; abstrata (sem instâncias diretas): `owl:disjointUnionOf` (`aro:Challenge`, `aro:InterpretationRecord`, `aro:EmpiricalClaim`, `aro:CorrespondenceClaim`, `aro:ExplanationHypothesis`, `aro:DerivationClaim`); domínio de: `hasJustification`; imagem de: `challenges`, `assessesClaim` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Alinhamentos** | `rdfs:seeAlso` `schema:Claim` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Claim a owl:Class ;
    rdfs:label "claim"@en,
        "alegação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object (propositional content as authored record, ADR-010); dependency: the act or agent that asserts it"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C (conteúdo proposicional como registro autoral, ADR-010); dependência: o ato ou agente que a afirma"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:seeAlso schema:Claim ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    owl:disjointUnionOf [ ] ;
    skos:definition "Analytical record that asserts something contestable: it can be produced by an act, justified, supported by sources, assessed and challenged. ARO represents claims, never their truth."@en,
        "Registro analítico que afirma algo contestável: pode ser produzido por um ato, justificado, apoiado em fontes, avaliado e contestado. A ARO representa alegações, nunca sua verdade."@pt-BR .
```

</details>

### `Justification` — justificativa

**Definição:** Argumento registrado que liga premissas a uma alegação: por que uma interpretação, derivação, correspondência ou hipótese é afirmada.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | a alegação que sustenta e suas premissas articuladas |
| **Em OWL/TTL** | `aro:Justification a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; imagem de: `hasJustification` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Justification a owl:Class ;
    rdfs:label "justification"@en,
        "justificativa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: the claim it supports and its articulated premises"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: a alegação que sustenta e suas premissas articuladas"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Recorded argument connecting premises to a claim: why an interpretation, derivation, correspondence or hypothesis is asserted."@en,
        "Argumento registrado que liga premissas a uma alegação: por que uma interpretação, derivação, correspondência ou hipótese é afirmada."@pt-BR .
```

</details>

### `Challenge` — contestação

**Definição:** Alegação que critica outra alegação ou propõe alternativa a ela; sendo também alegação, pode por sua vez ser justificada, avaliada e contestada.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável) |
| **Dependência** | a alegação contestada e seu próprio argumento |
| **Em OWL/TTL** | `aro:Challenge a owl:Class`; `rdfs:subClassOf aro:Claim`; domínio de: `challenges` |
| **SHACL** | `challenges` (mín 1, máx 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Challenge a owl:Class ;
    rdfs:label "challenge"@en,
        "contestação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Claim (assessable, justifiable, citable, challengeable); dependency: the challenged claim and its own argument"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável); dependência: a alegação contestada e seu próprio argumento"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:subClassOf aro:Claim ;
    skos:definition "Claim that criticizes another claim or offers an alternative to it; being a claim itself, it can be justified, assessed and challenged in turn."@en,
        "Alegação que critica outra alegação ou propõe alternativa a ela; sendo também alegação, pode por sua vez ser justificada, avaliada e contestada."@pt-BR .
```

</details>

### `Assessment` — avaliação

**Definição:** Registro analítico que julga uma ou mais alegações intimamente relacionadas: por critérios explícitos, por evidência, ou ambos. Registra um julgamento feito por um agente; não resolve a alegação.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | as alegações avaliadas |
| **Em OWL/TTL** | `aro:Assessment a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; abstrata (sem instâncias diretas): `owl:disjointUnionOf` (`aro:CriteriaAssessment`, `aro:EvidenceAssessment`); domínio de: `assessesClaim`, `assessmentOutcome` |
| **SHACL** | `assessesClaim` (mín 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Alinhamentos** | `rdfs:seeAlso` `schema:ClaimReview` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Assessment a owl:Class ;
    rdfs:label "assessment"@en,
        "avaliação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: the assessed claims"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: as alegações avaliadas"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:seeAlso schema:ClaimReview ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    owl:disjointUnionOf [ ] ;
    skos:definition "Analytical record judging one or more closely related claims: by explicit criteria, by evidence, or both. It records a judgment made by an agent; it does not settle the claim."@en,
        "Registro analítico que julga uma ou mais alegações intimamente relacionadas: por critérios explícitos, por evidência, ou ambos. Registra um julgamento feito por um agente; não resolve a alegação."@pt-BR .
```

</details>

### `CriteriaAssessment` — avaliação por critérios

**Definição:** Avaliação de uma alegação segundo critérios epistêmicos ou de valor explícitos (plausibilidade, coerência, fidelidade...).

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Assessment |
| **Dependência** | a alegação avaliada e seus critérios |
| **Em OWL/TTL** | `aro:CriteriaAssessment a owl:Class`; `rdfs:subClassOf aro:Assessment`; domínio de: `usesCriterion` |
| **SHACL** | `usesCriterion` (mín 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CriteriaAssessment a owl:Class ;
    rdfs:label "criteria assessment"@en,
        "avaliação por critérios"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Assessment; dependency: the assessed claim and its criteria"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Assessment; dependência: a alegação avaliada e seus critérios"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:subClassOf aro:Assessment ;
    skos:definition "Assessment of a claim against explicit epistemic or value criteria (plausibility, coherence, fidelity...)."@en,
        "Avaliação de uma alegação segundo critérios epistêmicos ou de valor explícitos (plausibilidade, coerência, fidelidade...)."@pt-BR .
```

</details>

### `EvidenceAssessment` — avaliação de evidência

**Definição:** Avaliação de se itens de evidência apoiam, contestam ou são irrelevantes para uma alegação.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Assessment |
| **Dependência** | a alegação avaliada e a evidência ponderada |
| **Em OWL/TTL** | `aro:EvidenceAssessment a owl:Class`; `rdfs:subClassOf aro:Assessment`; domínio de: `assessesEvidence` |
| **SHACL** | `assessesEvidence` (mín 1); SPARQL: Uma avaliação de evidência deve ponderar ao menos um item de evidência. |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EvidenceAssessment a owl:Class ;
    rdfs:label "evidence assessment"@en,
        "avaliação de evidência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Assessment; dependency: the assessed claim and the evidence weighed"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Assessment; dependência: a alegação avaliada e a evidência ponderada"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:subClassOf aro:Assessment ;
    skos:definition "Assessment of whether evidence items support, challenge or are irrelevant to a claim."@en,
        "Avaliação de se itens de evidência apoiam, contestam ou são irrelevantes para uma alegação."@pt-BR .
```

</details>

### `AssessmentCriterion` — critério de avaliação

**Definição:** Regra explícita que uma avaliação aplica para julgar uma alegação; critérios epistêmicos julgam se a alegação é bem fundamentada, critérios de valor julgam seu mérito.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | significado normativo especificado |
| **Em OWL/TTL** | `aro:AssessmentCriterion a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; imagem de: `usesCriterion` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:AssessmentCriterion a owl:Class ;
    rdfs:label "assessment criterion"@en,
        "critério de avaliação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: specified normative meaning"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: significado normativo especificado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Explicit rule an assessment applies to judge a claim; epistemic criteria judge whether the claim is well grounded, value criteria judge its worth."@en,
        "Regra explícita que uma avaliação aplica para julgar uma alegação; critérios epistêmicos julgam se a alegação é bem fundamentada, critérios de valor julgam seu mérito."@pt-BR .
```

</details>

### `EpistemicCriterion` — critério epistêmico

**Definição:** Critério sobre conhecimento: se uma alegação é apoiada, coerente, plausível ou bem documentada (evidência textual, confiabilidade da fonte, coerência com a obra).

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional normativo UFO-C (subkind de AssessmentCriterion) |
| **Dependência** | herda a identidade de AssessmentCriterion |
| **Em OWL/TTL** | `aro:EpistemicCriterion a owl:Class`; `rdfs:subClassOf aro:AssessmentCriterion` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EpistemicCriterion a owl:Class ;
    rdfs:label "epistemic criterion"@en,
        "critério epistêmico"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C normative information object (subkind of AssessmentCriterion); dependency: inherits AssessmentCriterion identity"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional normativo UFO-C (subkind de AssessmentCriterion); dependência: herda a identidade de AssessmentCriterion"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:subClassOf aro:AssessmentCriterion ;
    skos:definition "Criterion about knowledge: whether a claim is supported, coherent, plausible or well documented (textual evidence, source reliability, coherence with the work)."@en,
        "Critério sobre conhecimento: se uma alegação é apoiada, coerente, plausível ou bem documentada (evidência textual, confiabilidade da fonte, coerência com a obra)."@pt-BR .
```

</details>

### `ValueCriterion` — critério de valor

**Definição:** Critério sobre mérito: se uma alegação ou leitura é relevante, justa, original ou eticamente adequada, independentemente de ser verdadeira.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional normativo UFO-C (subkind de AssessmentCriterion) |
| **Dependência** | herda a identidade de AssessmentCriterion |
| **Em OWL/TTL** | `aro:ValueCriterion a owl:Class`; `rdfs:subClassOf aro:AssessmentCriterion` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `claim` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:ValueCriterion a owl:Class ;
    rdfs:label "value criterion"@en,
        "critério de valor"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C normative information object (subkind of AssessmentCriterion); dependency: inherits AssessmentCriterion identity"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional normativo UFO-C (subkind de AssessmentCriterion); dependência: herda a identidade de AssessmentCriterion"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/claim> ;
    rdfs:subClassOf aro:AssessmentCriterion ;
    skos:definition "Criterion about worth: whether a claim or reading is relevant, fair, original or ethically adequate, independently of being true."@en,
        "Critério sobre mérito: se uma alegação ou leitura é relevante, justa, original ou eticamente adequada, independentemente de ser verdadeira."@pt-BR .
```

</details>

### `Agent` — agente

**Definição:** Tudo o que pode agir intencionalmente: uma pessoa ou um coletivo. Agentes são identificados por IRIs de vocabulários externos (Wikidata, ORCID, ISNI, FOAF, schema.org).

| | |
|---|---|
| **UFO / OntoUML** | «category» — Não-sortal rígido: generaliza kinds com princípios de identidade diferentes que partilham propriedades essenciais; não fornece identidade e não tem instâncias diretas. |
| **Fundamentação** | não-sortal rígido UFO-A (category) sobre pessoas e coletivos; agentes são identificados por IRIs externos; a ARO declara só o que a OntoUML exige |
| **Dependência** | nenhuma própria; identidade de Person ou Collective |
| **Em OWL/TTL** | `aro:Agent a owl:Class`; abstrata (sem instâncias diretas): `owl:disjointUnionOf` (`aro:Person`, `aro:Collective`) |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de cobertura é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Category` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Agent`, `rdfs:seeAlso` `foaf:Agent` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Agent a owl:Class ;
    rdfs:label "agent"@en,
        "agente"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): category; foundation: UFO-A rigid non-sortal (category) over persons and collectives; agents are identified by external IRIs; ARO declares only what OntoUML needs; dependency: none of its own; identity from Person or Collective"@en,
        "Estereótipo OntoUML (provisório): category; fundamentação: não-sortal rígido UFO-A (category) sobre pessoas e coletivos; agentes são identificados por IRIs externos; a ARO declara só o que a OntoUML exige; dependência: nenhuma própria; identidade de Person ou Collective"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:seeAlso prov:Agent,
        foaf:Agent ;
    owl:disjointUnionOf [ ] ;
    skos:definition "Anything that can act intentionally: a person or a collective. Agents are identified by IRIs of external vocabularies (Wikidata, ORCID, ISNI, FOAF, schema.org)."@en,
        "Tudo o que pode agir intencionalmente: uma pessoa ou um coletivo. Agentes são identificados por IRIs de vocabulários externos (Wikidata, ORCID, ISNI, FOAF, schema.org)."@pt-BR .
```

</details>

### `Person` — pessoa

**Definição:** Agente humano individual (autor, intérprete, analista, pesquisador).

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | kind UFO-A (substancial); agentes são identificados por IRIs externos; a ARO declara só o que a OntoUML exige |
| **Dependência** | identidade da própria pessoa; a ARO registra só papéis e contribuições |
| **Em OWL/TTL** | `aro:Person a owl:Class`; `rdfs:subClassOf aro:Agent`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`) |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` |
| **Alinhamentos** | `rdfs:seeAlso` `foaf:Person`, `rdfs:seeAlso` `schema:Person` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Person a owl:Class ;
    rdfs:label "person"@en,
        "pessoa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-A kind (substantial); agents are identified by external IRIs; ARO declares only what OntoUML needs; dependency: identity supplied by the person; ARO records only roles and contributions"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: kind UFO-A (substancial); agentes são identificados por IRIs externos; a ARO declara só o que a OntoUML exige; dependência: identidade da própria pessoa; a ARO registra só papéis e contribuições"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:seeAlso foaf:Person,
        schema:Person ;
    rdfs:subClassOf aro:Agent ;
    skos:definition "Individual human agent (author, performer, analyst, researcher)."@en,
        "Agente humano individual (autor, intérprete, analista, pesquisador)."@pt-BR .
```

</details>

### `Collective` — coletivo

**Definição:** Grupo de agentes que age como um: banda, companhia, grupo de pesquisa, equipe de filmagem, editora.

| | |
|---|---|
| **UFO / OntoUML** | «collective» — Sortal rígido cujas instâncias são coleções de membros unificados por uma relação comum (banda, companhia); fornece sua identidade. |
| **Fundamentação** | coletivo UFO-A; agentes são identificados por IRIs externos; a ARO declara só o que a OntoUML exige |
| **Dependência** | seus membros, sob uma relação unificadora |
| **Em OWL/TTL** | `aro:Collective a owl:Class`; `rdfs:subClassOf aro:Agent`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`) |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez, relação unificadora e pertencimento não são representados. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` + `rdfs:subClassOf gufo:Collection` |
| **Alinhamentos** | `rdfs:seeAlso` `foaf:Group`, `rdfs:seeAlso` `schema:Organization`, `rdfs:seeAlso` `schema:MusicGroup` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Collective a owl:Class ;
    rdfs:label "collective"@en,
        "coletivo"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): collective; foundation: UFO-A collective; agents are identified by external IRIs; ARO declares only what OntoUML needs; dependency: its members, under a unifying relation"@en,
        "Estereótipo OntoUML (provisório): collective; fundamentação: coletivo UFO-A; agentes são identificados por IRIs externos; a ARO declara só o que a OntoUML exige; dependência: seus membros, sob uma relação unificadora"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:seeAlso foaf:Group,
        schema:MusicGroup,
        schema:Organization ;
    rdfs:subClassOf aro:Agent ;
    skos:definition "Group of agents acting as one: a band, a company, a research group, a film crew, a publisher."@en,
        "Grupo de agentes que age como um: banda, companhia, grupo de pesquisa, equipe de filmagem, editora."@pt-BR .
```

</details>

### `Analyst` — analista

**Definição:** Agente enquanto participa de um ato interpretativo (interpreta, descreve, avalia). Desempenhado por pessoas ou coletivos identificados por IRIs externos.

| | |
|---|---|
| **UFO / OntoUML** | «roleMixin» — Não-sortal anti-rígido: classifica entidades de kinds diferentes por uma propriedade relacional (participar de um ato); não fornece identidade. |
| **Fundamentação** | não-sortal anti-rígido UFO-A (roleMixin) especializado por PersonAnalyst e CollectiveAnalyst |
| **Dependência** | relacionalmente da participação num InterpretiveAct; identidade fornecida por tipos externos |
| **Em OWL/TTL** | `aro:Analyst a owl:Class`; `rdfs:subClassOf aro:Agent`; indivíduos externos são classificados nela por um raciocinador RDFS pelo `rdfs:range` da relação que os conecta; imagem de: `hasParticipant` |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (a entidade pode deixar de desempenhar o papel) não é expressável; qualquer IRI usado na relação é classificado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:RoleMixin` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Agent`, `rdfs:seeAlso` `foaf:Person`, `rdfs:seeAlso` `schema:Person` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Analyst a owl:Class ;
    rdfs:label "analyst"@en,
        "analista"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): roleMixin; foundation: UFO-A anti-rigid non-sortal (roleMixin) specialized by PersonAnalyst and CollectiveAnalyst; dependency: relationally on participation in an InterpretiveAct; identity supplied by external kinds"@en,
        "Estereótipo OntoUML (provisório): roleMixin; fundamentação: não-sortal anti-rígido UFO-A (roleMixin) especializado por PersonAnalyst e CollectiveAnalyst; dependência: relacionalmente da participação num InterpretiveAct; identidade fornecida por tipos externos"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:seeAlso prov:Agent,
        foaf:Person,
        schema:Person ;
    rdfs:subClassOf aro:Agent ;
    skos:definition "Agent insofar as it takes part in an interpretive act (interprets, describes, assesses). Played by persons or collectives identified by external IRIs."@en,
        "Agente enquanto participa de um ato interpretativo (interpreta, descreve, avalia). Desempenhado por pessoas ou coletivos identificados por IRIs externos."@pt-BR .
```

</details>

### `CreativeAgent` — agente criativo

**Definição:** Agente enquanto contribui para um ato criativo (compõe, interpreta, traduz, dirige...). Desempenhado por pessoas ou coletivos identificados por IRIs externos.

| | |
|---|---|
| **UFO / OntoUML** | «roleMixin» — Não-sortal anti-rígido: classifica entidades de kinds diferentes por uma propriedade relacional (participar de um ato); não fornece identidade. |
| **Fundamentação** | não-sortal anti-rígido UFO-A (roleMixin) especializado por PersonCreator e CollectiveCreator |
| **Dependência** | relacionalmente de uma CreativeContribution; identidade fornecida por tipos externos |
| **Em OWL/TTL** | `aro:CreativeAgent a owl:Class`; `rdfs:subClassOf aro:Agent`; indivíduos externos são classificados nela por um raciocinador RDFS pelo `rdfs:range` da relação que os conecta; imagem de: `contributionBy` |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (a entidade pode deixar de desempenhar o papel) não é expressável; qualquer IRI usado na relação é classificado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:RoleMixin` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Agent`, `rdfs:seeAlso` `foaf:Agent`, `rdfs:seeAlso` `schema:Person`, `rdfs:seeAlso` `schema:Organization` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CreativeAgent a owl:Class ;
    rdfs:label "creative agent"@en,
        "agente criativo"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): roleMixin; foundation: UFO-A anti-rigid non-sortal (roleMixin) specialized by PersonCreator and CollectiveCreator; dependency: relationally on a CreativeContribution; identity supplied by external kinds"@en,
        "Estereótipo OntoUML (provisório): roleMixin; fundamentação: não-sortal anti-rígido UFO-A (roleMixin) especializado por PersonCreator e CollectiveCreator; dependência: relacionalmente de uma CreativeContribution; identidade fornecida por tipos externos"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:seeAlso prov:Agent,
        foaf:Agent,
        schema:Organization,
        schema:Person ;
    rdfs:subClassOf aro:Agent ;
    skos:definition "Agent insofar as it contributes to a creative act (composes, performs, translates, directs...). Played by persons or collectives identified by external IRIs."@en,
        "Agente enquanto contribui para um ato criativo (compõe, interpreta, traduz, dirige...). Desempenhado por pessoas ou coletivos identificados por IRIs externos."@pt-BR .
```

</details>

### `PersonAnalyst` — pessoa analista

**Definição:** Pessoa enquanto participa de um ato interpretativo; definido como Person e Analyst.

| | |
|---|---|
| **UFO / OntoUML** | «role» — Sortal anti-rígido: instâncias de um kind o desempenham enquanto estão numa relação (participar de um ato); herda a identidade do kind. |
| **Fundamentação** | sortal anti-rígido UFO-A (role) de Person, especializando o roleMixin Analyst |
| **Dependência** | relacionalmente da participação em um ato interpretativo |
| **Em OWL/TTL** | `aro:PersonAnalyst a owl:Class`; `rdfs:subClassOf aro:Person`; `rdfs:subClassOf aro:Analyst`; `owl:equivalentClass` `aro:Person` ⊓ `aro:Analyst`; definida como a interseção de seu kind e de seu roleMixin, de modo que um raciocinador classifica agentes nela |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (um agente pode deixar de desempenhar o papel) não é expressável em OWL. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Role` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:PersonAnalyst a owl:Class ;
    rdfs:label "person analyst"@en,
        "pessoa analista"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): role; foundation: UFO-A anti-rigid sortal (role) of Person, specializing the roleMixin Analyst; dependency: relationally on participation in an interpretive act"@en,
        "Estereótipo OntoUML (provisório): role; fundamentação: sortal anti-rígido UFO-A (role) de Person, especializando o roleMixin Analyst; dependência: relacionalmente da participação em um ato interpretativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:subClassOf aro:Analyst,
        aro:Person ;
    owl:equivalentClass [ ] ;
    skos:definition "A person while taking part in an interpretive act; defined as Person and Analyst."@en,
        "Pessoa enquanto participa de um ato interpretativo; definido como Person e Analyst."@pt-BR .
```

</details>

### `CollectiveAnalyst` — coletivo analista

**Definição:** Coletivo enquanto participa de um ato interpretativo; definido como Collective e Analyst.

| | |
|---|---|
| **UFO / OntoUML** | «role» — Sortal anti-rígido: instâncias de um kind o desempenham enquanto estão numa relação (participar de um ato); herda a identidade do kind. |
| **Fundamentação** | sortal anti-rígido UFO-A (role) de Collective, especializando o roleMixin Analyst |
| **Dependência** | relacionalmente da participação em um ato interpretativo |
| **Em OWL/TTL** | `aro:CollectiveAnalyst a owl:Class`; `rdfs:subClassOf aro:Collective`; `rdfs:subClassOf aro:Analyst`; `owl:equivalentClass` `aro:Collective` ⊓ `aro:Analyst`; definida como a interseção de seu kind e de seu roleMixin, de modo que um raciocinador classifica agentes nela |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (um agente pode deixar de desempenhar o papel) não é expressável em OWL. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Role` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CollectiveAnalyst a owl:Class ;
    rdfs:label "collective analyst"@en,
        "coletivo analista"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): role; foundation: UFO-A anti-rigid sortal (role) of Collective, specializing the roleMixin Analyst; dependency: relationally on participation in an interpretive act"@en,
        "Estereótipo OntoUML (provisório): role; fundamentação: sortal anti-rígido UFO-A (role) de Collective, especializando o roleMixin Analyst; dependência: relacionalmente da participação em um ato interpretativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:subClassOf aro:Analyst,
        aro:Collective ;
    owl:equivalentClass [ ] ;
    skos:definition "A collective while taking part in an interpretive act; defined as Collective and Analyst."@en,
        "Coletivo enquanto participa de um ato interpretativo; definido como Collective e Analyst."@pt-BR .
```

</details>

### `PersonCreator` — pessoa criadora

**Definição:** Pessoa enquanto participa de um ato criativo; definido como Person e CreativeAgent.

| | |
|---|---|
| **UFO / OntoUML** | «role» — Sortal anti-rígido: instâncias de um kind o desempenham enquanto estão numa relação (participar de um ato); herda a identidade do kind. |
| **Fundamentação** | sortal anti-rígido UFO-A (role) de Person, especializando o roleMixin CreativeAgent |
| **Dependência** | relacionalmente da participação em um ato criativo |
| **Em OWL/TTL** | `aro:PersonCreator a owl:Class`; `rdfs:subClassOf aro:Person`; `rdfs:subClassOf aro:CreativeAgent`; `owl:equivalentClass` `aro:Person` ⊓ `aro:CreativeAgent`; definida como a interseção de seu kind e de seu roleMixin, de modo que um raciocinador classifica agentes nela |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (um agente pode deixar de desempenhar o papel) não é expressável em OWL. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Role` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:PersonCreator a owl:Class ;
    rdfs:label "person creator"@en,
        "pessoa criadora"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): role; foundation: UFO-A anti-rigid sortal (role) of Person, specializing the roleMixin CreativeAgent; dependency: relationally on participation in a creative act"@en,
        "Estereótipo OntoUML (provisório): role; fundamentação: sortal anti-rígido UFO-A (role) de Person, especializando o roleMixin CreativeAgent; dependência: relacionalmente da participação em um ato criativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:subClassOf aro:CreativeAgent,
        aro:Person ;
    owl:equivalentClass [ ] ;
    skos:definition "A person while taking part in a creative act; defined as Person and CreativeAgent."@en,
        "Pessoa enquanto participa de um ato criativo; definido como Person e CreativeAgent."@pt-BR .
```

</details>

### `CollectiveCreator` — coletivo criador

**Definição:** Coletivo enquanto participa de um ato criativo; definido como Collective e CreativeAgent.

| | |
|---|---|
| **UFO / OntoUML** | «role» — Sortal anti-rígido: instâncias de um kind o desempenham enquanto estão numa relação (participar de um ato); herda a identidade do kind. |
| **Fundamentação** | sortal anti-rígido UFO-A (role) de Collective, especializando o roleMixin CreativeAgent |
| **Dependência** | relacionalmente da participação em um ato criativo |
| **Em OWL/TTL** | `aro:CollectiveCreator a owl:Class`; `rdfs:subClassOf aro:Collective`; `rdfs:subClassOf aro:CreativeAgent`; `owl:equivalentClass` `aro:Collective` ⊓ `aro:CreativeAgent`; definida como a interseção de seu kind e de seu roleMixin, de modo que um raciocinador classifica agentes nela |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (um agente pode deixar de desempenhar o papel) não é expressável em OWL. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Role` |
| **Pacote** | `agent` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CollectiveCreator a owl:Class ;
    rdfs:label "collective creator"@en,
        "coletivo criador"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): role; foundation: UFO-A anti-rigid sortal (role) of Collective, specializing the roleMixin CreativeAgent; dependency: relationally on participation in a creative act"@en,
        "Estereótipo OntoUML (provisório): role; fundamentação: sortal anti-rígido UFO-A (role) de Collective, especializando o roleMixin CreativeAgent; dependência: relacionalmente da participação em um ato criativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/agent> ;
    rdfs:subClassOf aro:Collective,
        aro:CreativeAgent ;
    owl:equivalentClass [ ] ;
    skos:definition "A collective while taking part in a creative act; defined as Collective and CreativeAgent."@en,
        "Coletivo enquanto participa de um ato criativo; definido como Collective e CreativeAgent."@pt-BR .
```

</details>

### `InterpretationRecord` — registro de interpretação

**Definição:** Registro autoral persistente de uma interpretação de recorte.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável) |
| **Dependência** | recorte de ancoragem; o ato interpretativo que o produziu |
| **Em OWL/TTL** | `aro:InterpretationRecord a owl:Class`; `rdfs:subClassOf aro:Claim`; domínio de: `hasPrimarySelection`, `hasSupportingSelection`, `describesSituation`, `supportsInterpretation`; imagem de: `supportsInterpretation` |
| **SHACL** | `hasPrimarySelection` (mín 1, máx 1); `producedByAct` (mín 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Alinhamentos** | `rdfs:seeAlso` `oa:Annotation` |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:InterpretationRecord a owl:Class ;
    rdfs:label "interpretation record"@en,
        "registro de interpretação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Claim (assessable, justifiable, citable, challengeable); dependency: anchor selection; the interpretive act that produced it"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável); dependência: recorte de ancoragem; o ato interpretativo que o produziu"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    rdfs:seeAlso oa:Annotation ;
    rdfs:subClassOf aro:Claim ;
    skos:definition "Persistent authored record of an interpretation of a selection."@en,
        "Registro autoral persistente de uma interpretação de recorte."@pt-BR .
```

</details>

### `InterpretiveAct` — ato interpretativo

**Definição:** Atividade intencional temporal que produz interpretações registradas.

| | |
|---|---|
| **UFO / OntoUML** | «event» — Perdurante (UFO-B): ocorrência que se desenrola no tempo e tem participantes; não é um objeto. |
| **Fundamentação** | evento UFO-B; ação intencional UFO-C |
| **Dependência** | agentes participantes e ocorrência temporal |
| **Em OWL/TTL** | `aro:InterpretiveAct a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `hasParticipant`, `startDate`, `endDate`; imagem de: `producedByAct` |
| **SHACL** | `hasParticipant` (mín 1, IRI) |
| **Não expressável em OWL** | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| **Padrão gUFO (não importado)** | `rdfs:subClassOf gufo:Event` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Activity` |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:InterpretiveAct a owl:Class ;
    rdfs:label "interpretive act"@en,
        "ato interpretativo"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): event; foundation: UFO-B event; UFO-C intentional action; dependency: participating agents and temporal occurrence"@en,
        "Estereótipo OntoUML (provisório): event; fundamentação: evento UFO-B; ação intencional UFO-C; dependência: agentes participantes e ocorrência temporal"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    rdfs:seeAlso prov:Activity ;
    skos:definition "Temporal intentional activity yielding interpretation records."@en,
        "Atividade intencional temporal que produz interpretações registradas."@pt-BR .
```

</details>

### `DepictedElement` — elemento representado

**Definição:** Representação informacional de um referente na obra.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | representação UFO-C (subkind de AnalyticalRecord); não é entidade do mundo real |
| **Dependência** | contexto representacional |
| **Em OWL/TTL** | `aro:DepictedElement a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; imagem de: `mentionsDepictedElement` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `representation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DepictedElement a owl:Class ;
    rdfs:label "depicted element"@en,
        "elemento representado"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C representation (subkind of AnalyticalRecord); not a real-world entity; dependency: representational context"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: representação UFO-C (subkind de AnalyticalRecord); não é entidade do mundo real; dependência: contexto representacional"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/representation> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Information-level representation of a referent in an artwork."@en,
        "Representação informacional de um referente na obra."@pt-BR .
```

</details>

### `DepictedAgent` — agente representado

**Definição:** Elemento representado que se refere a agente ou personagem.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | representação UFO-C |
| **Dependência** | herda a identidade de DepictedElement |
| **Em OWL/TTL** | `aro:DepictedAgent a owl:Class`; `rdfs:subClassOf aro:DepictedElement` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `representation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DepictedAgent a owl:Class ;
    rdfs:label "depicted agent"@en,
        "agente representado"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C representation; dependency: inherits DepictedElement identity"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: representação UFO-C; dependência: herda a identidade de DepictedElement"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/representation> ;
    rdfs:subClassOf aro:DepictedElement ;
    skos:definition "Depicted element referring to an agent or character."@en,
        "Elemento representado que se refere a agente ou personagem."@pt-BR .
```

</details>

### `SituationDescription` — descrição de situação

**Definição:** Descrição registrada de situação representada.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C (subkind de AnalyticalRecord), não gufo:Situation |
| **Dependência** | suporte interpretativo e conteúdo conceitual |
| **Em OWL/TTL** | `aro:SituationDescription a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `mentionsDepictedElement`, `generalizesAs`; imagem de: `describesSituation` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `representation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:SituationDescription a owl:Class ;
    rdfs:label "situation description"@en,
        "descrição de situação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object (subkind of AnalyticalRecord), not gufo:Situation; dependency: interpretive support and conceptual content"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C (subkind de AnalyticalRecord), não gufo:Situation; dependência: suporte interpretativo e conteúdo conceitual"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/representation> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Recorded description of a represented situation."@en,
        "Descrição registrada de situação representada."@pt-BR .
```

</details>

### `IntentionalStateDescription` — descrição de estado intencional

**Definição:** Descrição de situação que atribui desejo, crença ou intenção a agente representado.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | atribuição de conteúdo intencional UFO-C |
| **Dependência** | herda a identidade de SituationDescription |
| **Em OWL/TTL** | `aro:IntentionalStateDescription a owl:Class`; `rdfs:subClassOf aro:SituationDescription` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `representation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:IntentionalStateDescription a owl:Class ;
    rdfs:label "intentional state description"@en,
        "descrição de estado intencional"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C intentional content attribution; dependency: inherits SituationDescription identity"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: atribuição de conteúdo intencional UFO-C; dependência: herda a identidade de SituationDescription"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/representation> ;
    rdfs:subClassOf aro:SituationDescription ;
    skos:definition "Situation description attributing desire, belief or intention to a depicted agent."@en,
        "Descrição de situação que atribui desejo, crença ou intenção a agente representado."@pt-BR .
```

</details>

### `SituationPattern` — padrão situacional

**Definição:** Especificação informacional reutilizável de condições situacionais.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | condições definidoras; não idêntico a universal |
| **Em OWL/TTL** | `aro:SituationPattern a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `hasCondition`; imagem de: `generalizesAs`, `assertsPattern`, `explainsPattern`, `aspectConcernsPattern` |
| **SHACL** | `hasCondition` (mín 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `pattern` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:SituationPattern a owl:Class ;
    rdfs:label "situation pattern"@en,
        "padrão situacional"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: defining conditions; not identical to universal"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: condições definidoras; não idêntico a universal"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/pattern> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Reusable informational specification of situation conditions."@en,
        "Especificação informacional reutilizável de condições situacionais."@pt-BR .
```

</details>

### `PatternCondition` — condição de padrão

**Definição:** Condição individualizada obrigatória ou opcional de um padrão.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | padrão hospedeiro e especificação lógica |
| **Em OWL/TTL** | `aro:PatternCondition a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `isRequiredCondition`; imagem de: `hasCondition` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `pattern` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:PatternCondition a owl:Class ;
    rdfs:label "pattern condition"@en,
        "condição de padrão"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: host pattern and logical specification"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: padrão hospedeiro e especificação lógica"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/pattern> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Individuated mandatory or optional condition within a pattern."@en,
        "Condição individualizada obrigatória ou opcional de um padrão."@pt-BR .
```

</details>

### `EmpiricalCase` — caso empírico

**Definição:** Dossiê documentado sobre uma situação ou ocorrência real.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | descrição do caso e referente empírico |
| **Em OWL/TTL** | `aro:EmpiricalCase a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `caseAboutSituation`, `caseAboutEvent`; imagem de: `assertsCase` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EmpiricalCase a owl:Class ;
    rdfs:label "empirical case"@en,
        "caso empírico"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: case description and empirical referent"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: descrição do caso e referente empírico"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Documented dossier about one real-world situation or occurrence."@en,
        "Dossiê documentado sobre uma situação ou ocorrência real."@pt-BR .
```

</details>

### `EmpiricalClaim` — afirmação empírica

**Definição:** Afirmação registrada e verificável acerca do mundo empírico.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável) |
| **Dependência** | conteúdo da afirmação e referência empírica pretendida |
| **Em OWL/TTL** | `aro:EmpiricalClaim a owl:Class`; `rdfs:subClassOf aro:Claim` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EmpiricalClaim a owl:Class ;
    rdfs:label "empirical claim"@en,
        "afirmação empírica"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Claim (assessable, justifiable, citable, challengeable); dependency: claim content and intended empirical reference"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável); dependência: conteúdo da afirmação e referência empírica pretendida"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:subClassOf aro:Claim ;
    skos:definition "Recorded testable claim about the empirical world."@en,
        "Afirmação registrada e verificável acerca do mundo empírico."@pt-BR .
```

</details>

### `ReferenceSource` — fonte de referência

**Definição:** Recurso externo citável: notícia, estudo, relatório, documento legal, relato, conjunto de dados etc.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | proveniência da fonte; não vinculada a uma interpretação |
| **Em OWL/TTL** | `aro:ReferenceSource a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `sourceURL`; imagem de: `citesSource`, `derivedFromSource` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Alinhamentos** | `rdfs:seeAlso` `dcterms:BibliographicResource`, `rdfs:seeAlso` `schema:CreativeWork` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:ReferenceSource a owl:Class ;
    rdfs:label "reference source"@en,
        "fonte de referência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: source provenance; not tied to one interpretation"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: proveniência da fonte; não vinculada a uma interpretação"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:seeAlso dcterms:BibliographicResource,
        schema:CreativeWork ;
    skos:definition "Citable external resource: news, study, report, legal document, testimony, dataset, etc."@en,
        "Recurso externo citável: notícia, estudo, relatório, documento legal, relato, conjunto de dados etc."@pt-BR .
```

</details>

### `EvidenceItem` — item de evidência

**Definição:** Afirmação ou observação contextualizada extraída de uma fonte.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | fonte de referência e conteúdo observado |
| **Em OWL/TTL** | `aro:EvidenceItem a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `derivedFromSource`; imagem de: `assessesEvidence` |
| **SHACL** | `derivedFromSource` (mín 1, máx 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EvidenceItem a owl:Class ;
    rdfs:label "evidence item"@en,
        "item de evidência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: reference source and observation content"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: fonte de referência e conteúdo observado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Extracted contextual assertion or observation from a reference source."@en,
        "Afirmação ou observação contextualizada extraída de uma fonte."@pt-BR .
```

</details>

### `CorrespondenceClaim` — alegação de correspondência

**Definição:** Alegação contestável de similaridade, instanciação ou relevância explicativa entre padrão e caso empírico.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Claim; não é relator UFO |
| **Dependência** | padrão/caso comparados e dimensões |
| **Em OWL/TTL** | `aro:CorrespondenceClaim a owl:Class`; `rdfs:subClassOf aro:Claim`; domínio de: `assertsPattern`, `assertsCase` |
| **SHACL** | `assertsPattern` (mín 1, máx 1); `assertsCase` (mín 1, máx 1) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CorrespondenceClaim a owl:Class ;
    rdfs:label "correspondence claim"@en,
        "alegação de correspondência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Claim; not a UFO relator; dependency: compared pattern/case and dimensions"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Claim; não é relator UFO; dependência: padrão/caso comparados e dimensões"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:subClassOf aro:Claim ;
    skos:definition "Contestable assertion of similarity, instantiation or explanatory relevance between pattern and empirical case."@en,
        "Alegação contestável de similaridade, instanciação ou relevância explicativa entre padrão e caso empírico."@pt-BR .
```

</details>

### `ExplanationHypothesis` — hipótese explicativa

**Definição:** Mecanismo ou fatores propostos para explicar fenômeno representado ou observado.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável) |
| **Dependência** | explanandum explícito e conteúdo explicativo |
| **Em OWL/TTL** | `aro:ExplanationHypothesis a owl:Class`; `rdfs:subClassOf aro:Claim`; domínio de: `explainsPattern` |
| **SHACL** | — |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:ExplanationHypothesis a owl:Class ;
    rdfs:label "explanation hypothesis"@en,
        "hipótese explicativa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Claim (assessable, justifiable, citable, challengeable); dependency: explicit explanandum and explanatory content"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Claim (avaliável, justificável, citável, contestável); dependência: explanandum explícito e conteúdo explicativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    rdfs:subClassOf aro:Claim ;
    skos:definition "Proposed mechanism or factors explaining a represented or observed phenomenon."@en,
        "Mecanismo ou fatores propostos para explicar fenômeno representado ou observado."@pt-BR .
```

</details>

### `EmpiricalSituation` — situação empírica

**Definição:** Configuração de entidades e condições no mundo real.

| | |
|---|---|
| **UFO / OntoUML** | «situation» — Situação (UFO-B): configuração de entidades que se dá num instante e pode disparar eventos ou resultar deles. |
| **Fundamentação** | situação UFO-B; separada de descrições |
| **Dependência** | constituintes do mundo real |
| **Em OWL/TTL** | `aro:EmpiricalSituation a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `startDate`, `endDate`; imagem de: `caseAboutSituation` |
| **SHACL** | — |
| **Não expressável em OWL** | O instante em que a situação se dá e seus constituintes não são representados. |
| **Padrão gUFO (não importado)** | `rdfs:subClassOf gufo:Situation` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EmpiricalSituation a owl:Class ;
    rdfs:label "empirical situation"@en,
        "situação empírica"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): situation; foundation: UFO-B situation; separate from descriptions; dependency: real-world constituents"@en,
        "Estereótipo OntoUML (provisório): situation; fundamentação: situação UFO-B; separada de descrições; dependência: constituintes do mundo real"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    skos:definition "Configuration of entities and conditions in the real world."@en,
        "Configuração de entidades e condições no mundo real."@pt-BR .
```

</details>

### `EmpiricalEvent` — evento empírico

**Definição:** Ocorrência do mundo real delimitada temporalmente.

| | |
|---|---|
| **UFO / OntoUML** | «event» — Perdurante (UFO-B): ocorrência que se desenrola no tempo e tem participantes; não é um objeto. |
| **Fundamentação** | evento UFO-B |
| **Dependência** | ocorrência real e participantes |
| **Em OWL/TTL** | `aro:EmpiricalEvent a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `startDate`, `endDate`; imagem de: `caseAboutEvent` |
| **SHACL** | — |
| **Não expressável em OWL** | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| **Padrão gUFO (não importado)** | `rdfs:subClassOf gufo:Event` |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EmpiricalEvent a owl:Class ;
    rdfs:label "empirical event"@en,
        "evento empírico"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): event; foundation: UFO-B event; dependency: real occurrence and participants"@en,
        "Estereótipo OntoUML (provisório): event; fundamentação: evento UFO-B; dependência: ocorrência real e participantes"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    skos:definition "Real-world temporally bounded occurrence."@en,
        "Ocorrência do mundo real delimitada temporalmente."@pt-BR .
```

</details>

### `DerivationClaim` — alegação de derivação

**Definição:** Alegação contestável, feita por um agente, de que uma entidade artística (obra, expressão, manifestação ou recorte) deriva de outra de modos especificados. A entidade derivada é representada como criação por direito próprio; legalidade e originalidade estão fora do escopo da ontologia.

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de Claim; nem relator UFO nem fato afirmado |
| **Dependência** | exatamente uma âncora de origem e uma derivada; tipificada por ao menos um tipo de derivação |
| **Em OWL/TTL** | `aro:DerivationClaim a owl:Class`; `rdfs:subClassOf aro:Claim`; domínio de: `hasSourceAnchor`, `hasDerivedAnchor`, `hasDerivationType`, `hasRegime`, `hasTransformation`, `derivationRealizedBy`, `derivationExtent` |
| **SHACL** | `hasSourceAnchor` (mín 1, máx 1); `hasDerivedAnchor` (mín 1, máx 1); `hasDerivationType` (mín 1, classe `DerivationType`); `hasRegime` (classe `DerivationRegime`); SPARQL: As âncoras da derivação devem ser uma entidade artística: Artwork, Expression, Manifestation ou Selection.; SPARQL: As âncoras de origem e derivada devem ser diferentes. |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:wasDerivedFrom`, `rdfs:seeAlso` `schema:isBasedOn`, `rdfs:seeAlso` `wdt:P144` |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DerivationClaim a owl:Class ;
    rdfs:label "derivation claim"@en,
        "alegação de derivação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of Claim; neither a UFO relator nor an asserted fact; dependency: exactly one source anchor and one derived anchor; typed by at least one derivation type"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de Claim; nem relator UFO nem fato afirmado; dependência: exatamente uma âncora de origem e uma derivada; tipificada por ao menos um tipo de derivação"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    rdfs:seeAlso prov:wasDerivedFrom,
        wdt:P144,
        schema:isBasedOn ;
    rdfs:subClassOf aro:Claim ;
    skos:definition "Contestable assertion, made by an agent, that one artistic entity (artwork, expression, manifestation or selection) derives from another in specified ways. The derived entity is represented as a creation in its own right; legality and originality are outside the scope of the ontology."@en,
        "Alegação contestável, feita por um agente, de que uma entidade artística (obra, expressão, manifestação ou recorte) deriva de outra de modos especificados. A entidade derivada é representada como criação por direito próprio; legalidade e originalidade estão fora do escopo da ontologia."@pt-BR .
```

</details>

### `TransformationAspect` — aspecto de transformação

**Definição:** Registro do que ocorreu com uma dimensão artística numa derivação (mantida, modificada, acrescentada, removida ou recontextualizada).

| | |
|---|---|
| **UFO / OntoUML** | «subkind» — Sortal rígido que especializa um kind e herda seu princípio de identidade. |
| **Fundamentação** | objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda |
| **Dependência** | alegação de derivação hospedeira; uma dimensão e uma operação |
| **Em OWL/TTL** | `aro:TransformationAspect a owl:Class`; `rdfs:subClassOf aro:AnalyticalRecord`; domínio de: `hasDimension`, `hasOperation`, `aspectSourceSelection`, `aspectDerivedSelection`, `aspectConcernsPattern`; imagem de: `hasTransformation` |
| **SHACL** | `hasDimension` (mín 1, máx 1, classe `ArtisticDimension`); `hasOperation` (mín 1, máx 1, classe `TransformationOperation`) |
| **Não expressável em OWL** | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:SubKind` |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:TransformationAspect a owl:Class ;
    rdfs:label "transformation aspect"@en,
        "aspecto de transformação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): subkind; foundation: UFO-C information object; subkind of AnalyticalRecord, whose identity it inherits; dependency: host derivation claim; one dimension and one operation"@en,
        "Estereótipo OntoUML (provisório): subkind; fundamentação: objeto informacional UFO-C; subkind de AnalyticalRecord, cuja identidade herda; dependência: alegação de derivação hospedeira; uma dimensão e uma operação"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    rdfs:subClassOf aro:AnalyticalRecord ;
    skos:definition "Recorded statement of what happened to one artistic dimension in a derivation (retained, modified, added, removed or recontextualized)."@en,
        "Registro do que ocorreu com uma dimensão artística numa derivação (mantida, modificada, acrescentada, removida ou recontextualizada)."@pt-BR .
```

</details>

### `CreativeAct` — ato criativo

**Definição:** Atividade intencional no tempo que faz existir uma entidade artística (obra, expressão ou manifestação), inclusive as derivadas.

| | |
|---|---|
| **UFO / OntoUML** | «event» — Perdurante (UFO-B): ocorrência que se desenrola no tempo e tem participantes; não é um objeto. |
| **Fundamentação** | evento UFO-B; ação intencional UFO-C |
| **Dependência** | agentes participantes e ocorrência temporal |
| **Em OWL/TTL** | `aro:CreativeAct a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); domínio de: `producesCreation`, `hasContribution`, `startDate`, `endDate`; imagem de: `derivationRealizedBy` |
| **SHACL** | `producesCreation` (mín 1); SPARQL: Um ato criativo produz obras, expressões ou manifestações, não recortes. |
| **Não expressável em OWL** | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| **Padrão gUFO (não importado)** | `rdfs:subClassOf gufo:Event` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Activity`, `rdfs:seeAlso` `lrmoo:F28_Expression_Creation` |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CreativeAct a owl:Class ;
    rdfs:label "creative act"@en,
        "ato criativo"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): event; foundation: UFO-B event; UFO-C intentional action; dependency: participating agents and temporal occurrence"@en,
        "Estereótipo OntoUML (provisório): event; fundamentação: evento UFO-B; ação intencional UFO-C; dependência: agentes participantes e ocorrência temporal"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    rdfs:seeAlso lrmoo:F28_Expression_Creation,
        prov:Activity ;
    skos:definition "Intentional temporal activity that brings an artistic entity (artwork, expression or manifestation) into existence, including derivative ones."@en,
        "Atividade intencional no tempo que faz existir uma entidade artística (obra, expressão ou manifestação), inclusive as derivadas."@pt-BR .
```

</details>

### `CreativeContribution` — contribuição criativa

**Definição:** Participação de um agente criativo num ato criativo sob um ou mais papéis.

| | |
|---|---|
| **UFO / OntoUML** | «relator» — Relator (UFO-A): endurante existencialmente dependente das entidades que conecta; fundamento de verdade de uma relação material. |
| **Fundamentação** | relator UFO-A que media um agente e uma entidade artística; papel qualificado via CreativeRole |
| **Dependência** | existencialmente do agente que contribui e da entidade artística para a qual contribui; fundada pelo ato criativo |
| **Em OWL/TTL** | `aro:CreativeContribution a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); relata ligados por propriedades de objeto; cardinalidades de mediação impostas pelo SHACL; domínio de: `contributionBy`, `contributionTo`, `contributionRole`; imagem de: `hasContribution` |
| **SHACL** | `contributionBy` (mín 1, máx 1, IRI); `contributionTo` (mín 1); `contributionRole` (mín 1, classe `CreativeRole`) |
| **Não expressável em OWL** | Dependência existencial e a relação material derivada não são expressáveis em OWL. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` + `rdfs:subClassOf gufo:Relator` (relata via `gufo:mediates`) |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CreativeContribution a owl:Class ;
    rdfs:label "creative contribution"@en,
        "contribuição criativa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): relator; foundation: UFO-A relator mediating an agent and an artistic entity; role qualification via CreativeRole; dependency: existentially on the contributing agent and on the artistic entity contributed to; founded by the creative act"@en,
        "Estereótipo OntoUML (provisório): relator; fundamentação: relator UFO-A que media um agente e uma entidade artística; papel qualificado via CreativeRole; dependência: existencialmente do agente que contribui e da entidade artística para a qual contribui; fundada pelo ato criativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "Participation of one creative agent in one creative act under one or more roles."@en,
        "Participação de um agente criativo num ato criativo sob um ou mais papéis."@pt-BR .
```

</details>

### `DerivationType` — tipo de derivação

**Definição:** Tipo de derivação (tradução, cover, sample, paródia...); suas instâncias são conceitos SKOS.

| | |
|---|---|
| **UFO / OntoUML** | «type» — Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). |
| **Fundamentação** | tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept |
| **Dependência** | pertencimento a vocabulário controlado |
| **Em OWL/TTL** | `aro:DerivationType a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasDerivationType` |
| **SHACL** | — |
| **Não expressável em OWL** | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |
| **Padrão gUFO (não importado)** | — |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DerivationType a owl:Class ;
    rdfs:label "derivation type"@en,
        "tipo de derivação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): type; foundation: UFO high-order type (provisional); operationalized as skos:Concept; dependency: controlled vocabulary membership"@en,
        "Estereótipo OntoUML (provisório): type; fundamentação: tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept; dependência: pertencimento a vocabulário controlado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "Kind of derivation (translation, cover, sampling, parody...); its instances are SKOS concepts."@en,
        "Tipo de derivação (tradução, cover, sample, paródia...); suas instâncias são conceitos SKOS."@pt-BR .
```

</details>

### `DerivationRegime` — regime de derivação

**Definição:** Postura da derivação em relação à origem (lúdica, satírica, séria, reverencial); suas instâncias são conceitos SKOS.

| | |
|---|---|
| **UFO / OntoUML** | «type» — Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). |
| **Fundamentação** | tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept |
| **Dependência** | pertencimento a vocabulário controlado |
| **Em OWL/TTL** | `aro:DerivationRegime a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasRegime` |
| **SHACL** | — |
| **Não expressável em OWL** | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |
| **Padrão gUFO (não importado)** | — |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DerivationRegime a owl:Class ;
    rdfs:label "derivation regime"@en,
        "regime de derivação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): type; foundation: UFO high-order type (provisional); operationalized as skos:Concept; dependency: controlled vocabulary membership"@en,
        "Estereótipo OntoUML (provisório): type; fundamentação: tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept; dependência: pertencimento a vocabulário controlado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "Stance of a derivation toward its source (playful, satirical, serious, reverential); its instances are SKOS concepts."@en,
        "Postura da derivação em relação à origem (lúdica, satírica, séria, reverencial); suas instâncias são conceitos SKOS."@pt-BR .
```

</details>

### `ArtisticDimension` — dimensão artística

**Definição:** Aspecto da obra segundo o qual a derivação pode ser comparada (melodia, letra, enredo, personagem, mídia...).

| | |
|---|---|
| **UFO / OntoUML** | «type» — Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). |
| **Fundamentação** | tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept |
| **Dependência** | pertencimento a vocabulário controlado |
| **Em OWL/TTL** | `aro:ArtisticDimension a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasDimension` |
| **SHACL** | — |
| **Não expressável em OWL** | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |
| **Padrão gUFO (não importado)** | — |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:ArtisticDimension a owl:Class ;
    rdfs:label "artistic dimension"@en,
        "dimensão artística"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): type; foundation: UFO high-order type (provisional); operationalized as skos:Concept; dependency: controlled vocabulary membership"@en,
        "Estereótipo OntoUML (provisório): type; fundamentação: tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept; dependência: pertencimento a vocabulário controlado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "Aspect of a work along which derivation can be compared (melody, lyrics, plot, character, medium...)."@en,
        "Aspecto da obra segundo o qual a derivação pode ser comparada (melodia, letra, enredo, personagem, mídia...)."@pt-BR .
```

</details>

### `TransformationOperation` — operação de transformação

**Definição:** O que a derivação faz com uma dimensão: manter, modificar, acrescentar, remover ou recontextualizar.

| | |
|---|---|
| **UFO / OntoUML** | «type» — Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). |
| **Fundamentação** | tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept |
| **Dependência** | pertencimento a vocabulário controlado |
| **Em OWL/TTL** | `aro:TransformationOperation a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasOperation` |
| **SHACL** | — |
| **Não expressável em OWL** | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |
| **Padrão gUFO (não importado)** | — |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:TransformationOperation a owl:Class ;
    rdfs:label "transformation operation"@en,
        "operação de transformação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): type; foundation: UFO high-order type (provisional); operationalized as skos:Concept; dependency: controlled vocabulary membership"@en,
        "Estereótipo OntoUML (provisório): type; fundamentação: tipo de alta ordem UFO (provisório); operacionalizado como skos:Concept; dependência: pertencimento a vocabulário controlado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "What a derivation does to a dimension: retain, modify, add, remove or recontextualize."@en,
        "O que a derivação faz com uma dimensão: manter, modificar, acrescentar, remover ou recontextualizar."@pt-BR .
```

</details>

### `CreativeRole` — papel criativo

**Definição:** Papel que qualifica uma contribuição criativa (compositor, intérprete, tradutor, remixador...).

| | |
|---|---|
| **UFO / OntoUML** | «type» — Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). |
| **Fundamentação** | tipo de papel UFO (provisório); operacionalizado como skos:Concept |
| **Dependência** | pertencimento a vocabulário controlado |
| **Em OWL/TTL** | `aro:CreativeRole a owl:Class`; disjunta de todo outro sortal último (`owl:AllDisjointClasses`); instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `contributionRole` |
| **SHACL** | — |
| **Não expressável em OWL** | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |
| **Padrão gUFO (não importado)** | — |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CreativeRole a owl:Class ;
    rdfs:label "creative role"@en,
        "papel criativo"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): type; foundation: UFO role type (provisional); operationalized as skos:Concept; dependency: controlled vocabulary membership"@en,
        "Estereótipo OntoUML (provisório): type; fundamentação: tipo de papel UFO (provisório); operacionalizado como skos:Concept; dependência: pertencimento a vocabulário controlado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "Role qualifying a creative contribution (composer, performer, translator, remixer...)."@en,
        "Papel que qualifica uma contribuição criativa (compositor, intérprete, tradutor, remixador...)."@pt-BR .
```

</details>

## Relações

| Relation | Source → target | Multiplicity at target | Meaning |
|---|---|---|---|
| `hasExpression` | `Artwork` → `Expression` | `1..*` | **obra se realiza por expressão.** Liga uma obra a uma realização dela com conteúdo próprio (interpretação, gravação, tradução, arranjo, versão do texto). Use para dizer por quais expressões a obra existe. |
| `realizesArtwork` | `Expression` → `Artwork` | `1` | **expressão realiza obra.** Liga uma expressão à obra que ela realiza; lida do lado da expressão, diz a qual obra pertence esta interpretação, gravação, tradução ou versão. |
| `hasManifestation` | `Expression` → `Manifestation` | `0..*` | **expressão se materializa em manifestação.** Liga uma expressão a uma publicação ou suporte que a materializa (edição de álbum, edição de livro, transmissão, lançamento digital). Opcional: registre quando a edição importa. |
| `embodiesExpression` | `Manifestation` → `Expression` | `1..*` | **manifestação materializa expressão.** Liga uma manifestação às expressões que ela materializa; uma edição de álbum materializa as gravações que contém, uma edição de livro a versão do texto que imprime. |
| `selectsFrom` | `Selection` → `Expression` | `1` | **recorte referencia expressão.** Liga um recorte à expressão de onde ele é tirado. Todo recorte vem de exatamente uma expressão, para que sua localização (linhas, segundos, região) tenha sentido. |
| `locatedInManifestation` | `Selection` → `Manifestation` | `0..1` | **recorte localizado em manifestação.** Liga um recorte à manifestação específica a que seus seletores se referem, quando a localização depende da edição (página de uma edição do livro, minutagem de um lançamento). |
| `hasSelector` | `Selection` → `oa:Selector` | `0..*` | **recorte localizado por seletor W3C Web Annotation.** Liga um recorte a um seletor W3C Web Annotation que o localiza dentro da manifestação (fragmento de tempo, citação ou posição de texto, região de imagem, forma SVG). |
| `groupsSelection` | `AnalysisUnit` → `Selection` | `1..*` | **unidade agrupa recortes.** Liga uma unidade de análise aos recortes que ela agrupa, para que vários trechos sejam analisados juntos como uma unidade (uma cena, um refrão, um motivo). |
| `producedByAct` | `AnalyticalRecord` → `InterpretiveAct` | `0..1` | **ato produz registro.** Liga um registro analítico (alegação, avaliação, descrição...) ao ato analítico que o produziu, registrando quem o fez, e quando, como fato histórico distinto de seu conteúdo. Obrigatória para registros de interpretação. |
| `hasJustification` | `Claim` → `Justification` | `0..*` | **alegação sustentada por justificativa.** Liga uma alegação ao argumento que a sustenta: as premissas e o raciocínio que levam a uma interpretação, derivação, correspondência ou hipótese. |
| `citesSource` | `AnalyticalRecord` → `ReferenceSource` | `0..*` | **registro cita fonte.** Liga qualquer registro analítico (alegação, caso, descrição, padrão) a uma fonte de referência em que se apoia ou que o documenta (crítica, entrevista, notícia, estudo, créditos). |
| `challenges` | `Challenge` → `Claim` | `1` | **contestação visa alegação.** Liga uma contestação à alegação que ela critica ou para a qual propõe alternativa, de modo que a divergência fique registrada, e não apagada. |
| `assessesClaim` | `Assessment` → `Claim` | `1..*` | **avaliação julga alegações.** Liga uma avaliação às alegações que ela julga: interpretação, derivação, correspondência, afirmação empírica, hipótese ou contestação. Em geral uma; várias quando a mesma evidência incide sobre alegações intimamente relacionadas (ex.: uma afirmação empírica e a correspondência que nela se apoia). |
| `usesCriterion` | `CriteriaAssessment` → `AssessmentCriterion` | `1..*` | **avaliação usa critérios.** Liga uma avaliação por critérios aos critérios explícitos que ela aplica, para que a base do julgamento possa ser examinada e comparada. |
| `assessesEvidence` | `EvidenceAssessment` → `EvidenceItem` | `1..*` | **avaliação considera evidência.** Liga uma avaliação de evidência aos itens de evidência que ela pondera; toda avaliação considera pelo menos um item. |
| `hasPrimarySelection` | `InterpretationRecord` → `Selection` | `1` | **interpretação se ancora em recorte.** Liga um registro de interpretação ao único recorte de que ele trata: o trecho da obra em que a interpretação se ancora. |
| `hasSupportingSelection` | `InterpretationRecord` → `Selection` | `0..*` | **interpretação usa recorte de apoio.** Liga um registro de interpretação a outros recortes citados em seu apoio, além do principal (outros trechos da mesma obra ou de outras). |
| `hasParticipant` | `InterpretiveAct` → `Analyst` | `1..*` | **agente participa de ato.** Liga um ato interpretativo aos agentes (analistas) que participaram dele. Os agentes são identificados por IRIs externos (Wikidata, ORCID, FOAF, schema.org). |
| `describesSituation` | `InterpretationRecord` → `SituationDescription` | `0..*` | **interpretação descreve situação.** Liga um registro de interpretação às descrições de situações representadas que ele produz: o que, segundo a interpretação, acontece no trecho. |
| `supportsInterpretation` | `InterpretationRecord` → `InterpretationRecord` | `0..*` | **interpretação apoia outra.** Liga um registro de interpretação a outra interpretação que ele apoia, formando cadeias de interpretações. |
| `mentionsDepictedElement` | `SituationDescription` → `DepictedElement` | `0..*` | **descrição menciona elemento.** Liga uma descrição de situação aos elementos representados que ela envolve (personagens, lugares, objetos, grupos representados na obra). |
| `generalizesAs` | `SituationDescription` → `SituationPattern` | `0..*` | **descrição motiva abstração.** Liga uma descrição de situação a um padrão situacional abstraído dela: a configuração reutilizável que a situação representada é tomada como exemplo. |
| `hasCondition` | `SituationPattern` → `PatternCondition` | `1..*` | **padrão especifica condições.** Liga um padrão situacional às condições que o definem, cada uma individualizada para poder ser marcada como obrigatória ou opcional e comparada com casos reais. |
| `caseAboutSituation` | `EmpiricalCase` → `EmpiricalSituation` | `0..*` | **dossiê descreve situação real.** Liga um caso empírico (dossiê documentado) às situações do mundo real que ele documenta. |
| `caseAboutEvent` | `EmpiricalCase` → `EmpiricalEvent` | `0..*` | **dossiê descreve evento.** Liga um caso empírico (dossiê documentado) aos eventos do mundo real que ele documenta. |
| `assertsPattern` | `CorrespondenceClaim` → `SituationPattern` | `1` | **alegação referencia padrão.** Liga uma alegação de correspondência ao padrão situacional que ela compara com um caso real: o lado da arte na alegação de que arte e realidade se correspondem. |
| `assertsCase` | `CorrespondenceClaim` → `EmpiricalCase` | `1` | **alegação referencia caso.** Liga uma alegação de correspondência ao caso empírico que ela compara com um padrão: o lado da realidade na alegação de que arte e realidade se correspondem. |
| `derivedFromSource` | `EvidenceItem` → `ReferenceSource` | `1` | **evidência obtida de fonte.** Liga um item de evidência à fonte de referência de onde foi extraído, para que toda evidência possa ser rastreada até uma fonte citável. |
| `explainsPattern` | `ExplanationHypothesis` → `SituationPattern` | `0..*` | **hipótese explica padrão.** Liga uma hipótese explicativa ao padrão situacional que ela se propõe explicar (mecanismos ou fatores por trás da configuração recorrente). |
| `hasSourceAnchor` | `DerivationClaim` → `ArtisticEntity` | `1` | **alegação indica entidade de origem.** Liga uma alegação de derivação à entidade de onde a derivação parte (qualquer entidade artística: obra, expressão, manifestação ou recorte): o lado de origem da alegação. |
| `hasDerivedAnchor` | `DerivationClaim` → `ArtisticEntity` | `1` | **alegação indica entidade derivada.** Liga uma alegação de derivação à entidade que se diz derivar da origem (qualquer entidade artística): o lado derivado da alegação. Deve ser diferente da âncora de origem. |
| `hasDerivationType` | `DerivationClaim` → `DerivationType` | `1..*` | **alegação tipificada por tipo de derivação.** Classifica uma alegação de derivação com um ou mais conceitos do vocabulário de tipos de derivação (cover, sampling, tradução, paródia...). |
| `hasRegime` | `DerivationClaim` → `DerivationRegime` | `0..*` | **alegação registra regime de derivação.** Qualifica uma alegação de derivação com seu regime: a postura tomada diante da origem (lúdica, satírica, séria, reverente). |
| `hasTransformation` | `DerivationClaim` → `TransformationAspect` | `0..*` | **alegação detalha aspecto de transformação.** Liga uma alegação de derivação aos aspectos de transformação que a detalham, um por dimensão artística mantida, modificada, adicionada, removida ou recontextualizada. |
| `hasDimension` | `TransformationAspect` → `ArtisticDimension` | `1` | **aspecto incide sobre dimensão.** Diz de qual dimensão artística (melodia, letra, enredo, personagem, meio...) trata um aspecto de transformação. |
| `hasOperation` | `TransformationAspect` → `TransformationOperation` | `1` | **aspecto aplica operação.** Diz o que foi feito com a dimensão num aspecto de transformação: manter, modificar, adicionar, remover ou recontextualizar. |
| `aspectSourceSelection` | `TransformationAspect` → `Selection` | `0..1` | **aspecto aponta recorte de origem.** Aponta um aspecto de transformação para o trecho da origem em que a dimensão pode ser observada. |
| `aspectDerivedSelection` | `TransformationAspect` → `Selection` | `0..1` | **aspecto aponta recorte derivado.** Aponta um aspecto de transformação para o trecho da entidade derivada em que a dimensão transformada pode ser observada. |
| `aspectConcernsPattern` | `TransformationAspect` → `SituationPattern` | `0..*` | **aspecto envolve padrão situacional.** Liga um aspecto de transformação a um padrão situacional que ele afeta, quando a derivação mantém, altera ou desloca uma situação representada. |
| `derivationRealizedBy` | `DerivationClaim` → `CreativeAct` | `0..1` | **derivação realizada por ato criativo.** Liga uma alegação de derivação ao ato criativo que realizou a derivação (a gravação, escrita ou adaptação que produziu a entidade derivada). |
| `producesCreation` | `CreativeAct` → `ArtisticEntity` | `1..*` | **ato faz surgir entidade artística.** Liga um ato criativo às entidades artísticas que ele faz existir (obras, expressões, manifestações), inclusive as derivadas. |
| `hasContribution` | `CreativeAct` → `CreativeContribution` | `0..*` | **ato inclui contribuição.** Liga um ato criativo às contribuições que o compõem, uma por agente participante. |
| `contributionBy` | `CreativeContribution` → `CreativeAgent` | `1` | **contribuição feita por agente.** Liga uma contribuição criativa ao agente que a fez, identificado por um IRI externo (Wikidata, ISNI, MusicBrainz, schema.org). |
| `contributionTo` | `CreativeContribution` → `ArtisticEntity` | `1..*` | **contribuição é para entidade artística.** Liga uma contribuição criativa às entidades artísticas para as quais o agente contribuiu (a obra, a gravação, a edição). Com contributionBy, dá ao relator suas duas pontas mediadas. |
| `contributionRole` | `CreativeContribution` → `CreativeRole` | `1..*` | **contribuição qualificada por papel.** Qualifica uma contribuição criativa com um ou mais papéis do vocabulário de papéis criativos (compositor, intérprete, tradutor, remixador...). |

## Propriedades de dados

| Property | Label | Domain | Datatype | Meaning |
|---|---|---|---|---|
| `identifier` | identificador | — | `string` | Identificador local de um registro; recomenda-se URI estável. Não é identidade no mundo. |
| `textValue` | valor textual | — | `rdf:langString` | Texto legível (rótulos, descrições, explicações). Use literais marcados por idioma; o mesmo recurso pode ter um valor por idioma. |
| `selectorExpression` | expressão de seletor | `Selection` | `string` | Atalho compacto de seletor; prefira hasSelector com seletores W3C Web Annotation. |
| `sourceURL` | URL da fonte | `ReferenceSource` | `anyURI` | Endereço web de uma fonte de referência (notícia, artigo, base de dados, vídeo...). A disponibilidade não é garantida e o link não é alegação de credibilidade. |
| `externalLink` | link externo | — | `anyURI` | Endereço web onde a entidade representada pode ser consultada: página da obra, gravação, local exato de um item de evidência, relato de um caso. Usável em qualquer recurso; o link não é alegação de credibilidade. |
| `issuedDate` | data de publicação | — | `date` | Data de publicação quando conhecida. |
| `retrievedAt` | acessado em | — | `dateTime` | Momento de captura, para proveniência. |
| `confidenceScore` | grau de confiança | — | `decimal` | Confiança definida pela aplicação em [0,1]; não é probabilidade calibrada. |
| `isRequiredCondition` | é condição obrigatória | `PatternCondition` | `boolean` | Se uma condição de padrão é obrigatória (true) ou contextual (false). |
| `languageTag` | etiqueta de idioma | — | `string` | Etiqueta BCP 47 do idioma principal de um recurso, ex. en, pt-BR, es. |
| `versionLabel` | rótulo de versão | — | `string` | Rótulo de versão da aplicação. |
| `derivationExtent` | extensão da derivação | `DerivationClaim` | `rdf:langString` | Extensão livre do reaproveitamento (ex. "loop de 4 segundos", "enredo inteiro"); marcada por idioma. |
| `startDate` | data de início | `InterpretiveAct` ∪ `CreativeAct` ∪ `EmpiricalEvent` ∪ `EmpiricalSituation` | `rdfs:Literal` | Quando um ato, evento ou situação começou (ou aconteceu, se não tem duração). Ano, ano-mês, data ou data-hora. |
| `endDate` | data de término | `InterpretiveAct` ∪ `CreativeAct` ∪ `EmpiricalEvent` ∪ `EmpiricalSituation` | `rdfs:Literal` | Quando um ato, evento ou situação terminou. Ano, ano-mês, data ou data-hora. |
| `assessmentOutcome` | resultado da avaliação | `Assessment` | `string` | O que a avaliação conclui sobre a alegação: supports (apoia), partiallySupports (apoia em parte), challenges (contesta), inconclusive (inconclusiva) ou irrelevant (irrelevante). Registra o julgamento de quem avalia, não a verdade da alegação. |

## Vocabulários controlados (SKOS)

### `DerivationTypeScheme` — Tipos de derivação

Tipos não exclusivos de derivação agrupados em cinco famílias; uma alegação pode ter vários tipos. Fundamentados em Genette, Tillett/Smiraglia, Burkholder, Rajewsky, Hutcheon e Jenkins (ver derivation-typology.md).

| Conceito | Rótulo | Mais amplo | Definição | Literatura |
|---|---|---|---|---|
| `Rerealization` | re-realização | — | Nova realização de conteúdo substancialmente igual; na biblioteconomia, frequentemente nova expressão da mesma obra. | Tillett 1991; Smiraglia 2001; IFLA LRMoo 2024 |
| `Translation` | tradução | `Rerealization` | Transposição do conteúdo verbal para outra língua. Genette também a classifica como transformação séria (transposição). | Smiraglia 2001; Genette 1982 |
| `Performance` | performance / execução | `Rerealization` | Nova execução de obra existente (recital, encenação, gravação). | Smiraglia 2001 |
| `CoverVersion` | versão cover | `Performance` | Interpretação ou gravação de canção popular existente por outros intérpretes; termo sistematicamente ambíguo, por isso registre também as dimensões. O artista do cover é criador por direito próprio. | Mosser 2008; Mag Uidhir, Magnus & Magnus 2013 |
| `Arrangement` | arranjo | `Rerealization` | Reelaboração de instrumentação, harmonia ou forma mantendo a peça reconhecível. | Burkholder 1994 |
| `Transcription` | transcrição | `Rerealization` | Transferência para outra notação ou instrumento. | Burkholder 1994 |
| `Revision` | revisão / nova versão | `Rerealization` | Versão sucessiva pelos mesmos agentes ou autorizados (edição revista, director's cut, remasterização). | Smiraglia 2001 (successive derivations) |
| `Abridgment` | resumo / extração | `Rerealization` | Derivação que mantém parte reduzida da origem (resumo, excerto, radio edit). | Smiraglia 2001 (extractions) |
| `Amplification` | ampliação | `Rerealization` | Origem reproduzida com material acrescentado (edição anotada ou ilustrada, faixa de comentário). | Smiraglia 2001 (amplifications) |
| `Remake` | refilmagem / remake | `Rerealization` | Nova produção audiovisual baseada em produção anterior da mesma história. | Verevis 2006 |
| `ExtendedRemix` | remix estendido | `Rerealization` | Versão mais longa ou reeditada da mesma gravação que mantém sua identidade (ex. club mix, extended mix). | Navas 2012 (extended remix) |
| `Incorporation` | incorporação / copresença | — | Material da origem, ou referência explícita a ela, está presente num novo todo. | Genette 1982 (intertextuality); Burkholder 1994 |
| `Quotation` | citação | `Incorporation` | Reprodução explícita e reconhecível de excerto, verbal, musical ou visual. | Genette 1982; Burkholder 1994 |
| `Allusion` | alusão | `Incorporation` | Referência indireta cujo sentido pleno pressupõe reconhecer a origem. | Genette 1982 |
| `UnacknowledgedBorrowing` | empréstimo não declarado | `Incorporation` | Empréstimo literal apresentado sem reconhecimento da origem (o 'plagiat' de Genette); relação textual descritiva, não julgamento jurídico ou moral. | Genette 1982 |
| `Sampling` | sample | `Incorporation` | Reuso de trecho de gravação existente. | Schloss 2004; Navas 2012 |
| `Interpolation` | interpolação | `Incorporation` | Reexecução de trecho da origem dentro de obra nova, sem reusar a gravação. | Schloss 2004 |
| `Paraphrase` | paráfrase | `Incorporation` | Material de origem reelaborado em nova linha ou passagem, ainda rastreável. | Burkholder 1994 |
| `Medley` | medley / pot-pourri | `Incorporation` | Sucessão de várias peças ou excertos existentes. | Burkholder 1994 |
| `Collage` | colagem / mashup | `Incorporation` | Justaposição de várias origens num novo todo. | Burkholder 1994; Navas 2012 |
| `Remix` | remix | `Incorporation` | Recombinação seletiva ou reflexiva dos elementos de gravação existente num novo todo; o remixador é criador por direito próprio. | Navas 2012 (selective and reflexive remix) |
| `Appropriation` | apropriação | `Incorporation` | Reapresentação de obra ou imagem existente, frequentemente inteira, em novo contexto que altera seu sentido. | Navas 2012 |
| `Ekphrasis` | écfrase | `Incorporation` | Representação, numa mídia, de obra de outra mídia (ex. poema sobre pintura); referência intermidiática. | Rajewsky 2005 (intermedial reference) |
| `Transformation` | transformação | — | Derivação hipertextual que altera conteúdo, forma ou contexto da origem. | Genette 1982 (hypertextuality) |
| `Adaptation` | adaptação | `Transformation` | Transposição declarada e extensa de obra para outra forma, público ou contexto (transformação séria de Genette). | Hutcheon 2006; Genette 1982 |
| `IntermedialAdaptation` | adaptação intermidiática | `Adaptation` | Adaptação entre mídias (romance para filme, filme para jogo, canção para videoclipe, novelização). | Rajewsky 2005 (medial transposition); Hutcheon 2006 |
| `Parody` | paródia | `Transformation` | Transformação da origem em regime lúdico ou crítico; repetição com diferença crítica. | Genette 1982; Hutcheon 1985 |
| `Travesty` | travestimento | `Transformation` | Transformação satírica que mantém o conteúdo mas rebaixa estilo ou registro. | Genette 1982 |
| `Variation` | variação | `Transformation` | Transformações sucessivas de tema ou motivo dado. | Burkholder 1994 |
| `Imitation` | imitação | — | Derivação pela imitação da maneira ou estilo da origem, e não pela reelaboração do conteúdo. | Genette 1982 (hypertextuality) |
| `Pastiche` | pastiche | `Imitation` | Imitação de estilo em regime lúdico ou afetuoso. | Genette 1982; Dyer 2007 |
| `Caricature` | caricatura (charge) | `Imitation` | Imitação de estilo em regime satírico. | Genette 1982 |
| `SeriousImitation` | imitação séria (forgerie) | `Imitation` | Imitação que pretende ser tomada como da maneira da origem, ex. continuação apócrifa; não necessariamente fraude. | Genette 1982 |
| `Extension` | extensão | — | Obra nova que estende o mundo ficcional, a linha do tempo ou o elenco da origem. | Tillett 1991 (sequential); Jenkins 1992 |
| `Continuation` | continuação | `Extension` | Obra que continua a história da origem. | Tillett 1991 |
| `Sequel` | sequência | `Continuation` | Continuação situada depois da origem. | Tillett 1991 |
| `Prequel` | prequela | `Continuation` | Continuação situada antes da origem. | Tillett 1991 |
| `SpinOff` | spin-off / derivado | `Extension` | Obra centrada em elementos secundários (personagens, lugares) da origem. | Jenkins 1992 |
| `Crossover` | crossover | `Extension` | Obra que combina personagens ou mundos de duas ou mais origens. | Jenkins 1992 |
| `FanWork` | obra de fã | `Extension` | Derivação não oficial feita pelo público; tipifique também o mecanismo (paródia, continuação, crossover...). | Jenkins 1992 |

## Vocabulários controlados (SKOS)

### `ArtisticDimensionScheme` — Dimensões artísticas

Dimensões para anotação, agrupadas por família de mídia (narrativa, verbal, música, visual, audiovisual, transmidiática, paratexto).

| Conceito | Rótulo | Mais amplo | Definição | Literatura |
|---|---|---|---|---|
| `NarrativeDimension` | narrativa | — | Propriedades de história e de discurso de narrativas em qualquer mídia. | Chatman 1978; Genette 1972 |
| `PlotDimension` | enredo | `NarrativeDimension` | Sequência de eventos representados. | Chatman 1978 |
| `CharacterDimension` | personagem | `NarrativeDimension` | Agentes representados e seus traços. | Chatman 1978 |
| `SettingDimension` | ambientação | `NarrativeDimension` | Tempo e lugar representados. | Chatman 1978 |
| `SituationDimension` | situação representada | `NarrativeDimension` | Situações representadas, comparáveis via SituationPattern. | — |
| `NarrationDimension` | narração / voz | `NarrativeDimension` | Quem narra e de qual nível narrativo. | Genette 1972 |
| `FocalizationDimension` | focalização / ponto de vista | `NarrativeDimension` | Percepção ou saber que filtra a história. | Genette 1972 |
| `NarrativeTimeDimension` | tempo narrativo | `NarrativeDimension` | Ordem, duração e frequência dos eventos na narração. | Genette 1972 |
| `TextDimension` | texto verbal | — | Conteúdo verbal em qualquer mídia. | — |
| `LyricsDimension` | letra | `TextDimension` | Texto verbal cantado ou falado de canção. | — |
| `DialogueDimension` | diálogo | `TextDimension` | Falas atribuídas a personagens. | — |
| `DictionDimension` | dicção / registro | `TextDimension` | Vocabulário, registro e estilo verbal. | Genette 1982 |
| `VersificationDimension` | versificação | `TextDimension` | Métrica, rima e forma estrófica. | — |
| `LanguageDimension` | língua | `TextDimension` | Língua natural do conteúdo verbal. | — |
| `MusicDimension` | música e som | — | Parâmetros musicais e sonoros. | Burkholder 1994 |
| `MelodyDimension` | melodia | `MusicDimension` | Contorno de altura e ritmo de uma linha musical. | — |
| `HarmonyDimension` | harmonia | `MusicDimension` | Organização acordal e tonal. | — |
| `RhythmDimension` | ritmo / groove | `MusicDimension` | Organização métrica e rítmica. | — |
| `TempoDimension` | andamento | `MusicDimension` | Velocidade e suas variações. | — |
| `TimbreDimension` | timbre / instrumentação | `MusicDimension` | Fontes sonoras e sua cor. | — |
| `MusicalTextureDimension` | textura musical | `MusicDimension` | Relação entre linhas simultâneas (monofonia, homofonia, polifonia). | — |
| `MusicalFormDimension` | forma musical | `MusicDimension` | Estrutura em larga escala (verso–refrão, sonata, AABA). | — |
| `DynamicsDimension` | dinâmica | `MusicDimension` | Intensidade e suas variações. | — |
| `VocalDeliveryDimension` | interpretação vocal | `MusicDimension` | Maneira de cantar ou falar, fraseado, ornamentação. | Mag Uidhir, Magnus & Magnus 2013 |
| `RecordedSoundDimension` | som gravado | `MusicDimension` | A própria gravação sonora fixada (relevante para sample). | Schloss 2004 |
| `ProductionDimension` | produção / mixagem | `MusicDimension` | Processamento de estúdio, mixagem e desenho de som. | — |
| `VisualDimension` | visual | — | Propriedades formais e iconográficas de imagens fixas ou em movimento. | Panofsky 1939 |
| `VisualCompositionDimension` | composição visual | `VisualDimension` | Disposição dos elementos no quadro ou plano pictórico. | — |
| `ColorDimension` | cor | `VisualDimension` | Matiz, saturação, valor e paleta. | — |
| `ShapeDimension` | linha e forma | `VisualDimension` | Contornos, linhas, formas e volumes. | — |
| `SurfaceTextureDimension` | textura de superfície | `VisualDimension` | Qualidade de superfície real ou representada. | — |
| `SpaceDimension` | espaço e perspectiva | `VisualDimension` | Profundidade, perspectiva e escala. | — |
| `MaterialTechniqueDimension` | material e técnica | `VisualDimension` | Materiais e técnicas de feitura (óleo, afresco, processo fotográfico). | — |
| `IconographyDimension` | iconografia / motivo | `VisualDimension` | Temas convencionais, motivos, símbolos e atributos. | Panofsky 1939 |
| `PoseGestureDimension` | pose e gesto | `VisualDimension` | Postura corporal e gesto de figuras representadas. | Panofsky 1939 |
| `AudiovisualDimension` | audiovisual | — | Sistemas estilísticos de cinema, vídeo e outras mídias de imagem em movimento. | Bordwell & Thompson, Film Art |
| `MiseEnSceneDimension` | mise-en-scène | `AudiovisualDimension` | O que é posto diante da câmera. | Bordwell & Thompson, Film Art |
| `SetDesignDimension` | cenário e objetos | `MiseEnSceneDimension` | Cenários, locações e objetos de cena. | Bordwell & Thompson, Film Art |
| `CostumeMakeupDimension` | figurino e maquiagem | `MiseEnSceneDimension` | Figurino, maquiagem e cabelo. | Bordwell & Thompson, Film Art |
| `LightingDimension` | iluminação | `MiseEnSceneDimension` | Qualidade, direção e fonte da luz. | Bordwell & Thompson, Film Art |
| `ActingDimension` | atuação / marcação | `MiseEnSceneDimension` | Comportamento dos atores e movimento no espaço. | Bordwell & Thompson, Film Art |
| `CinematographyDimension` | fotografia / cinematografia | `AudiovisualDimension` | Qualidades fotográficas do plano. | Bordwell & Thompson, Film Art |
| `FramingDimension` | enquadramento / escala de plano | `CinematographyDimension` | Quadro, ângulo e escala do plano. | Bordwell & Thompson, Film Art |
| `CameraMovementDimension` | movimento de câmera | `CinematographyDimension` | Panorâmicas, travellings e outros enquadramentos móveis. | Bordwell & Thompson, Film Art |
| `EditingDimension` | montagem / edição | `AudiovisualDimension` | Junção de planos: transições, ritmo, continuidade. | Bordwell & Thompson, Film Art |
| `FilmSoundDimension` | som fílmico | `AudiovisualDimension` | Fala, música e efeitos e sua relação com a imagem. | Bordwell & Thompson, Film Art |
| `GeneralDimension` | transmidiática | — | Dimensões aplicáveis a qualquer mídia. | — |
| `ThemeDimension` | tema | `GeneralDimension` | Assuntos e sentidos postos em evidência. | — |
| `StyleDimension` | estilo | `GeneralDimension` | Maneira reconhecível de autor, gênero ou período. | Dyer 2007 |
| `GenreDimension` | gênero | `GeneralDimension` | Filiação genérica (arquitextualidade). | Genette 1982 |
| `ToneDimension` | tom / atmosfera | `GeneralDimension` | Coloração afetiva e atmosfera. | — |
| `MediumDimension` | mídia | `GeneralDimension` | Meio material ou técnico de realização. | Rajewsky 2005 |
| `ParatextDimension` | paratexto | — | Limiares em torno da obra: título, créditos, capas, prefácios. | Genette 1987 |
| `TitleDimension` | título | `ParatextDimension` | Título e nomeação. | Genette 1987 |
| `CreditsDimension` | créditos / atribuição | `ParatextDimension` | Autoria declarada e créditos. | Genette 1987 |
| `CoverArtDimension` | capa / cartaz | `ParatextDimension` | Embalagem, capa e imagens promocionais. | Genette 1987 |

## Vocabulários controlados (SKOS)

### `DerivationRegimeScheme` — Regimes de derivação

Postura da derivação em relação à origem, ortogonal ao tipo (a partir dos regimes de Genette).

| Conceito | Rótulo | Mais amplo | Definição | Literatura |
|---|---|---|---|---|
| `PlayfulRegime` | lúdico | — | Derivação voltada ao jogo ou divertimento. | Genette 1982 |
| `SatiricalRegime` | satírico / crítico | — | Derivação voltada a zombar ou criticar a origem ou seu mundo. | Genette 1982; Hutcheon 1985 |
| `SeriousRegime` | sério | — | Derivação sem objetivo cômico ou crítico. | Genette 1982 |
| `ReverentialRegime` | reverencial / homenagem | — | Derivação que homenageia explicitamente a origem (acréscimo da ARO, não está em Genette). | ARO |

## Vocabulários controlados (SKOS)

### `TransformationOperationScheme` — Operações de transformação

O que uma derivação faz com uma dimensão artística.

| Conceito | Rótulo | Mais amplo | Definição | Literatura |
|---|---|---|---|---|
| `Retained` | mantido | — | Dimensão mantida substancialmente como na origem. | — |
| `Modified` | modificado | — | Dimensão presente em ambas, mas alterada. | — |
| `Added` | acrescentado | — | Conteúdo da dimensão ausente na origem. | — |
| `Removed` | removido | — | Conteúdo da origem omitido na derivação. | — |
| `Recontextualized` | recontextualizado | — | Conteúdo mantido, mas posto em contexto que altera seu sentido. | — |

## Vocabulários controlados (SKOS)

### `CreativeRoleScheme` — Papéis criativos

Papéis que qualificam uma contribuição criativa; extensível.

| Conceito | Rótulo | Mais amplo | Definição | Literatura |
|---|---|---|---|---|
| `AuthorRole` | autor | — | Criador do conteúdo verbal ou narrativo. | — |
| `ComposerRole` | compositor | — | Criador do conteúdo musical. | — |
| `LyricistRole` | letrista | — | Autor da letra. | — |
| `PerformerRole` | intérprete | — | Agente que executa uma manifestação. | — |
| `ArrangerRole` | arranjador | — | Agente que produz um arranjo. | — |
| `TranslatorRole` | tradutor | — | Agente que produz uma tradução. | — |
| `AdapterRole` | adaptador | — | Agente que produz uma adaptação (ex. roteirista). | — |
| `ProducerRole` | produtor | — | Agente responsável pela produção de gravação ou obra. | — |
| `DirectorRole` | diretor | — | Agente que dirige obra audiovisual ou cênica. | — |
| `RemixerRole` | remixador | — | Agente que produz remix ou obra baseada em samples. | — |

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/reference-model.md)
