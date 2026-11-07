<!-- Gerado por scripts/build.py a partir de model/conceptual-model.json. Não editar à mão. -->

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/reference-model.md)

# Modelo conceitual de referência

**Importante:** as anotações de estereótipos são compromissos provisórios, não comprovação de validação automática OntoUML. Os diagramas DOT/SVG são visualizações, não arquivos nativos de intercâmbio OntoUML.

## Como os estereótipos UFO são representados em OWL

| Estereótipo | Classes | UFO | OWL/TTL | Não expressável em OWL |
|---|---|---|---|---|
| «kind» | `Artwork`, `Manifestation`, `Selection`, `AnalysisUnit`, `InterpretationRecord`, `InterpretiveJustification`, `InterpretationChallenge`, `InterpretationAssessment`, `AssessmentCriterion`, `DepictedElement`, `SituationDescription`, `SituationPattern`, `PatternCondition`, `EmpiricalCase`, `EmpiricalClaim`, `ReferenceSource`, `EvidenceItem`, `CorrespondenceClaim`, `EvidenceAssessment`, `ExplanationHypothesis`, `DerivationClaim`, `TransformationAspect` | Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. | Declarada como `owl:Class`. | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| «subkind» | `DepictedAgent`, `IntentionalStateDescription` | Sortal rígido que especializa um kind e herda seu princípio de identidade. | `owl:Class` com `rdfs:subClassOf` a classe especializada. | A rigidez não é expressável; o axioma de subclasse é o único compromisso representado. |
| «event» | `InterpretiveAct`, `EmpiricalEvent`, `CreativeAct` | Perdurante (UFO-B): ocorrência que se desenrola no tempo e tem participantes; não é um objeto. | `owl:Class`; a participação é representada por propriedades de objeto. | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| «situation» | `EmpiricalSituation` | Situação (UFO-B): configuração de entidades que se dá num instante e pode disparar eventos ou resultar deles. | `owl:Class`. | O instante em que a situação se dá e seus constituintes não são representados. |
| «relator» | `CreativeContribution` | Relator (UFO-A): endurante existencialmente dependente das entidades que conecta; fundamento de verdade de uma relação material. | `owl:Class` com propriedades de objeto para seus relata; o SHACL impõe as cardinalidades de mediação. | Dependência existencial e a relação material derivada não são expressáveis em OWL. |
| «roleMixin» | `Analyst`, `CreativeAgent` | Não-sortal anti-rígido: classifica entidades de kinds diferentes por uma propriedade relacional (participar de um ato); não fornece identidade. | `owl:Class`; indivíduos de vocabulários externos são classificados nela por um raciocinador RDFS pelo `rdfs:range` da relação que os conecta. | A anti-rigidez (a entidade pode deixar de desempenhar o papel) não é expressável; qualquer IRI usado na relação é classificado. |
| «type» | `DerivationType`, `DerivationRegime`, `ArtisticDimension`, `TransformationOperation`, `CreativeRole` | Tipo de alta ordem: suas instâncias são elas mesmas tipos (tipos de derivação, dimensões, papéis…). | `owl:Class` cujas instâncias são conceitos SKOS (cada conceito é tipado como `skos:Concept` e como esta classe). | Em OWL 2 DL os conceitos são indivíduos, não classes; a instanciação multinível é aproximada, não representada. |

## Classes

### `Artwork` — obra

**Definição:** Criação artística identificável em diversas mídias e manifestações.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto social/informacional UFO-C (compromisso de domínio) |
| **Dependência** | historicamente da criação; não de uma cópia específica |
| **Em OWL/TTL** | `aro:Artwork a owl:Class`; domínio de: `hasManifestation`; imagem de: `realizesArtwork`, `hasSourceAnchor`, `hasDerivedAnchor`, `producesCreation` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
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
    skos:definition "Identifiable artistic creation across media and manifestations."@en,
        "Criação artística identificável em diversas mídias e manifestações."@pt-BR .
```

</details>

### `Manifestation` — manifestação

**Definição:** Expressão, versão ou realização específica de uma obra.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto persistente UFO-A; artefato informacional UFO-C |
| **Dependência** | identidade semântica relativa a uma obra |
| **Em OWL/TTL** | `aro:Manifestation a owl:Class`; domínio de: `realizesArtwork`; imagem de: `hasManifestation`, `selectsFrom`, `hasSourceAnchor`, `hasDerivedAnchor`, `producesCreation` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Manifestation a owl:Class ;
    rdfs:label "manifestation"@en,
        "manifestação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-A enduring object; UFO-C information artifact; dependency: semantic identity relative to an artwork"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto persistente UFO-A; artefato informacional UFO-C; dependência: identidade semântica relativa a uma obra"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    skos:definition "Specific expression, version or realization of an artwork."@en,
        "Expressão, versão ou realização específica de uma obra."@pt-BR .
```

</details>

### `Selection` — recorte

**Definição:** Seleção endereçável de uma parte de manifestação (não componente físico).

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C; categoria de domínio |
| **Dependência** | referência a manifestação e seletores |
| **Em OWL/TTL** | `aro:Selection a owl:Class`; domínio de: `selectsFrom`, `hasSelector`, `selectorExpression`; imagem de: `groupsSelection`, `hasPrimarySelection`, `hasSupportingSelection`, `hasSourceAnchor`, `hasDerivedAnchor`, `aspectSourceSelection`, `aspectDerivedSelection` |
| **SHACL** | `selectsFrom` (mín 1) |
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
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; domain category; dependency: reference to manifestation and selectors"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; categoria de domínio; dependência: referência a manifestação e seletores"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    rdfs:seeAlso oa:SpecificResource ;
    skos:definition "Addressable selected portion of a manifestation (not its physical component)."@en,
        "Seleção endereçável de uma parte de manifestação (não componente físico)."@pt-BR .
```

</details>

### `AnalysisUnit` — unidade de análise

**Definição:** Agrupamento intencional de recortes com finalidade analítica.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | referência organizacional a recortes |
| **Em OWL/TTL** | `aro:AnalysisUnit a owl:Class`; domínio de: `groupsSelection` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `artwork` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:AnalysisUnit a owl:Class ;
    rdfs:label "analysis unit"@en,
        "unidade de análise"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: organizational reference to selections"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: referência organizacional a recortes"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/artwork> ;
    skos:definition "Intentional grouping of selections for analytical purposes."@en,
        "Agrupamento intencional de recortes com finalidade analítica."@pt-BR .
```

</details>

### `InterpretationRecord` — registro de interpretação

**Definição:** Registro autoral persistente de uma interpretação de recorte.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C; não é evento |
| **Dependência** | recorte de ancoragem; ato interpretativo histórico |
| **Em OWL/TTL** | `aro:InterpretationRecord a owl:Class`; domínio de: `hasPrimarySelection`, `hasSupportingSelection`, `producedByAct`, `hasJustification`, `describesSituation`, `citesSource`, `supportsInterpretation`; imagem de: `challenges`, `assessesInterpretation`, `supportsInterpretation` |
| **SHACL** | `hasPrimarySelection` (mín 1, máx 1); `producedByAct` (mín 1, máx 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:InterpretationRecord a owl:Class ;
    rdfs:label "interpretation record"@en,
        "registro de interpretação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; not an event; dependency: anchor selection; historical interpretive act"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; não é evento; dependência: recorte de ancoragem; ato interpretativo histórico"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
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
| **Em OWL/TTL** | `aro:InterpretiveAct a owl:Class`; domínio de: `hasParticipant`; imagem de: `producedByAct`, `claimProducedByAct` |
| **SHACL** | `hasParticipant` (mín 1, IRI) |
| **Não expressável em OWL** | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| **Padrão gUFO (não importado)** | `rdfs:subClassOf gufo:Event` |
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
    skos:definition "Temporal intentional activity yielding interpretation records."@en,
        "Atividade intencional temporal que produz interpretações registradas."@pt-BR .
```

</details>

### `Analyst` — analista

**Definição:** Qualquer agente humano, identificado em vocabulário externo, na medida em que interpreta ou avalia. A identidade do agente é representada pelo vocabulário externo, não pela ARO.

| | |
|---|---|
| **UFO / OntoUML** | «roleMixin» — Não-sortal anti-rígido: classifica entidades de kinds diferentes por uma propriedade relacional (participar de um ato); não fornece identidade. |
| **Fundamentação** | não-sortal anti-rígido UFO-A (roleMixin); agentes são indivíduos de ontologias externas |
| **Dependência** | relacionalmente da participação num InterpretiveAct; identidade fornecida por tipos externos |
| **Em OWL/TTL** | `aro:Analyst a owl:Class`; indivíduos externos são classificados nela por um raciocinador RDFS pelo `rdfs:range` da relação que os conecta; imagem de: `hasParticipant` |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (a entidade pode deixar de desempenhar o papel) não é expressável; qualquer IRI usado na relação é classificado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:RoleMixin` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Agent`, `rdfs:seeAlso` `foaf:Person`, `rdfs:seeAlso` `schema:Person` |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:Analyst a owl:Class ;
    rdfs:label "analyst"@en,
        "analista"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): roleMixin; foundation: UFO-A anti-rigid non-sortal (roleMixin); agents are individuals of external ontologies; dependency: relationally on participation in an InterpretiveAct; identity supplied by external kinds"@en,
        "Estereótipo OntoUML (provisório): roleMixin; fundamentação: não-sortal anti-rígido UFO-A (roleMixin); agentes são indivíduos de ontologias externas; dependência: relacionalmente da participação num InterpretiveAct; identidade fornecida por tipos externos"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    rdfs:seeAlso prov:Agent,
        foaf:Person,
        schema:Person ;
    skos:definition "Any human agent, identified in an external vocabulary, insofar as they interpret or assess. Agent identity is represented by the external vocabulary, not by ARO."@en,
        "Qualquer agente humano, identificado em vocabulário externo, na medida em que interpreta ou avalia. A identidade do agente é representada pelo vocabulário externo, não pela ARO."@pt-BR .
```

</details>

### `InterpretiveJustification` — justificativa interpretativa

**Definição:** Argumento registrado que liga premissas a uma interpretação ou a uma alegação de derivação.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | interpretação ou alegação-alvo, premissas articuladas |
| **Em OWL/TTL** | `aro:InterpretiveJustification a owl:Class`; imagem de: `hasJustification`, `derivationJustifiedBy` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:InterpretiveJustification a owl:Class ;
    rdfs:label "interpretive justification"@en,
        "justificativa interpretativa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: target interpretation, articulated premises"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: interpretação ou alegação-alvo, premissas articuladas"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    skos:definition "Recorded argument connecting premises to an interpretation or to a derivation claim."@en,
        "Argumento registrado que liga premissas a uma interpretação ou a uma alegação de derivação."@pt-BR .
```

</details>

### `InterpretationChallenge` — contestação de interpretação

**Definição:** Crítica ou raciocínio alternativo registrado sobre interpretação.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | interpretação contestada e argumento |
| **Em OWL/TTL** | `aro:InterpretationChallenge a owl:Class`; domínio de: `challenges` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:InterpretationChallenge a owl:Class ;
    rdfs:label "interpretation challenge"@en,
        "contestação de interpretação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: challenged interpretation and argument"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: interpretação contestada e argumento"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    skos:definition "Recorded criticism or alternative reasoning about an interpretation."@en,
        "Crítica ou raciocínio alternativo registrado sobre interpretação."@pt-BR .
```

</details>

### `InterpretationAssessment` — avaliação de interpretação

**Definição:** Julgamento epistêmico ou axiológico explícito de interpretação.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | alvo e critérios |
| **Em OWL/TTL** | `aro:InterpretationAssessment a owl:Class`; domínio de: `assessesInterpretation`, `usesCriterion` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:InterpretationAssessment a owl:Class ;
    rdfs:label "interpretation assessment"@en,
        "avaliação de interpretação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: target and criteria"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: alvo e critérios"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    skos:definition "Explicit epistemic or axiological judgment of an interpretation."@en,
        "Julgamento epistêmico ou axiológico explícito de interpretação."@pt-BR .
```

</details>

### `AssessmentCriterion` — critério de avaliação

**Definição:** Regra especificada de avaliação epistêmica ou de valores.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional normativo/social UFO-C |
| **Dependência** | significado normativo especificado |
| **Em OWL/TTL** | `aro:AssessmentCriterion a owl:Class`; imagem de: `usesCriterion` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `interpretation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:AssessmentCriterion a owl:Class ;
    rdfs:label "assessment criterion"@en,
        "critério de avaliação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C normative/social information object; dependency: specified normative meaning"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional normativo/social UFO-C; dependência: significado normativo especificado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/interpretation> ;
    skos:definition "Specified epistemic or value-based assessment rule."@en,
        "Regra especificada de avaliação epistêmica ou de valores."@pt-BR .
```

</details>

### `DepictedElement` — elemento representado

**Definição:** Representação informacional de um referente na obra.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | representação UFO-C; não é entidade do mundo real |
| **Dependência** | contexto representacional |
| **Em OWL/TTL** | `aro:DepictedElement a owl:Class`; imagem de: `mentionsDepictedElement` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` |
| **Pacote** | `representation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DepictedElement a owl:Class ;
    rdfs:label "depicted element"@en,
        "elemento representado"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C representation; not a real-world entity; dependency: representational context"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: representação UFO-C; não é entidade do mundo real; dependência: contexto representacional"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/representation> ;
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
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C, não gufo:Situation |
| **Dependência** | suporte interpretativo e conteúdo conceitual |
| **Em OWL/TTL** | `aro:SituationDescription a owl:Class`; domínio de: `mentionsDepictedElement`, `generalizesAs`; imagem de: `describesSituation` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `representation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:SituationDescription a owl:Class ;
    rdfs:label "situation description"@en,
        "descrição de situação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object, not gufo:Situation; dependency: interpretive support and conceptual content"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C, não gufo:Situation; dependência: suporte interpretativo e conteúdo conceitual"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/representation> ;
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
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | condições definidoras; não idêntico a universal |
| **Em OWL/TTL** | `aro:SituationPattern a owl:Class`; domínio de: `hasCondition`; imagem de: `generalizesAs`, `assertsPattern`, `explainsPattern`, `aspectConcernsPattern` |
| **SHACL** | `hasCondition` (mín 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `pattern` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:SituationPattern a owl:Class ;
    rdfs:label "situation pattern"@en,
        "padrão situacional"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: defining conditions; not identical to universal"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: condições definidoras; não idêntico a universal"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/pattern> ;
    skos:definition "Reusable informational specification of situation conditions."@en,
        "Especificação informacional reutilizável de condições situacionais."@pt-BR .
```

</details>

### `PatternCondition` — condição de padrão

**Definição:** Condição individualizada obrigatória ou opcional de um padrão.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | padrão hospedeiro e especificação lógica |
| **Em OWL/TTL** | `aro:PatternCondition a owl:Class`; domínio de: `isRequiredCondition`; imagem de: `hasCondition` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `pattern` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:PatternCondition a owl:Class ;
    rdfs:label "pattern condition"@en,
        "condição de padrão"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: host pattern and logical specification"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: padrão hospedeiro e especificação lógica"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/pattern> ;
    skos:definition "Individuated mandatory or optional condition within a pattern."@en,
        "Condição individualizada obrigatória ou opcional de um padrão."@pt-BR .
```

</details>

### `EmpiricalCase` — caso empírico

**Definição:** Dossiê documentado sobre uma situação ou ocorrência real.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | descrição do caso e referente empírico |
| **Em OWL/TTL** | `aro:EmpiricalCase a owl:Class`; domínio de: `caseAboutSituation`, `caseAboutEvent`, `caseHasReference`; imagem de: `assertsCase` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EmpiricalCase a owl:Class ;
    rdfs:label "empirical case"@en,
        "caso empírico"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: case description and empirical referent"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: descrição do caso e referente empírico"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    skos:definition "Documented dossier about one real-world situation or occurrence."@en,
        "Dossiê documentado sobre uma situação ou ocorrência real."@pt-BR .
```

</details>

### `EmpiricalClaim` — afirmação empírica

**Definição:** Afirmação registrada e verificável acerca do mundo empírico.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | conteúdo da afirmação e referência empírica pretendida |
| **Em OWL/TTL** | `aro:EmpiricalClaim a owl:Class`; imagem de: `supportsClaim` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EmpiricalClaim a owl:Class ;
    rdfs:label "empirical claim"@en,
        "afirmação empírica"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: claim content and intended empirical reference"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: conteúdo da afirmação e referência empírica pretendida"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
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
| **Em OWL/TTL** | `aro:ReferenceSource a owl:Class`; domínio de: `sourceURL`; imagem de: `derivedFromSource`, `citesSource`, `referencesSource`, `caseHasReference`, `derivationReferencesSource` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
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
    skos:definition "Citable external resource: news, study, report, legal document, testimony, dataset, etc."@en,
        "Recurso externo citável: notícia, estudo, relatório, documento legal, relato, conjunto de dados etc."@pt-BR .
```

</details>

### `EvidenceItem` — item de evidência

**Definição:** Afirmação ou observação contextualizada extraída de uma fonte.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | fonte de referência e conteúdo observado |
| **Em OWL/TTL** | `aro:EvidenceItem a owl:Class`; domínio de: `derivedFromSource`; imagem de: `assessesEvidence` |
| **SHACL** | `derivedFromSource` (mín 1, máx 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EvidenceItem a owl:Class ;
    rdfs:label "evidence item"@en,
        "item de evidência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: reference source and observation content"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: fonte de referência e conteúdo observado"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    skos:definition "Extracted contextual assertion or observation from a reference source."@en,
        "Afirmação ou observação contextualizada extraída de uma fonte."@pt-BR .
```

</details>

### `CorrespondenceClaim` — alegação de correspondência

**Definição:** Alegação contestável de similaridade, instanciação ou relevância explicativa entre padrão e caso empírico.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C; não é relator UFO |
| **Dependência** | padrão/caso comparados e dimensões |
| **Em OWL/TTL** | `aro:CorrespondenceClaim a owl:Class`; domínio de: `assertsPattern`, `assertsCase`, `referencesSource`; imagem de: `assessesCorrespondence` |
| **SHACL** | `assertsPattern` (mín 1, máx 1); `assertsCase` (mín 1, máx 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CorrespondenceClaim a owl:Class ;
    rdfs:label "correspondence claim"@en,
        "alegação de correspondência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; not UFO relator; dependency: compared pattern/case and dimensions"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; não é relator UFO; dependência: padrão/caso comparados e dimensões"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    skos:definition "Contestable assertion of similarity, instantiation or explanatory relevance between pattern and empirical case."@en,
        "Alegação contestável de similaridade, instanciação ou relevância explicativa entre padrão e caso empírico."@pt-BR .
```

</details>

### `EvidenceAssessment` — avaliação de evidência

**Definição:** Julgamento de apoio, contestação ou irrelevância de evidência para afirmação específica.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | afirmação, evidência e critérios |
| **Em OWL/TTL** | `aro:EvidenceAssessment a owl:Class`; domínio de: `supportsClaim`, `assessesCorrespondence`, `assessesEvidence`, `assessesDerivation` |
| **SHACL** | `assessesEvidence` (mín 1) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:EvidenceAssessment a owl:Class ;
    rdfs:label "evidence assessment"@en,
        "avaliação de evidência"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: claim and evidence and criteria"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: afirmação, evidência e critérios"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
    skos:definition "Judgment whether evidence supports, challenges or is irrelevant to a specified claim."@en,
        "Julgamento de apoio, contestação ou irrelevância de evidência para afirmação específica."@pt-BR .
```

</details>

### `ExplanationHypothesis` — hipótese explicativa

**Definição:** Mecanismo ou fatores propostos para explicar fenômeno representado ou observado.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | explanandum explícito e conteúdo explicativo |
| **Em OWL/TTL** | `aro:ExplanationHypothesis a owl:Class`; domínio de: `explainsPattern` |
| **SHACL** | — |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `evidence` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:ExplanationHypothesis a owl:Class ;
    rdfs:label "explanation hypothesis"@en,
        "hipótese explicativa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: explicit explanandum and explanatory content"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: explanandum explícito e conteúdo explicativo"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/evidence> ;
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
| **Em OWL/TTL** | `aro:EmpiricalSituation a owl:Class`; imagem de: `caseAboutSituation` |
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
| **Em OWL/TTL** | `aro:EmpiricalEvent a owl:Class`; imagem de: `caseAboutEvent` |
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

**Definição:** Alegação contestável, feita por um agente, de que uma entidade artística (obra, manifestação ou recorte) deriva de outra de modos especificados. A entidade derivada é representada como criação por direito próprio; legalidade e originalidade estão fora do escopo da ontologia.

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C; nem relator UFO nem fato afirmado |
| **Dependência** | exatamente uma âncora de origem e uma derivada; tipificada por ao menos um tipo de derivação |
| **Em OWL/TTL** | `aro:DerivationClaim a owl:Class`; domínio de: `hasSourceAnchor`, `hasDerivedAnchor`, `hasDerivationType`, `hasRegime`, `hasTransformation`, `derivationJustifiedBy`, `derivationRealizedBy`, `claimProducedByAct`, `derivationReferencesSource`, `derivationExtent`; imagem de: `assessesDerivation` |
| **SHACL** | `hasSourceAnchor` (mín 1, máx 1); `hasDerivedAnchor` (mín 1, máx 1); `hasDerivationType` (mín 1, classe `DerivationType`); `hasRegime` (classe `DerivationRegime`); SPARQL: As âncoras da derivação devem ser Artwork, Manifestation ou Selection.; SPARQL: As âncoras de origem e derivada devem ser diferentes. |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Alinhamentos** | `rdfs:seeAlso` `prov:wasDerivedFrom`, `rdfs:seeAlso` `schema:isBasedOn`, `rdfs:seeAlso` `wdt:P144` |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:DerivationClaim a owl:Class ;
    rdfs:label "derivation claim"@en,
        "alegação de derivação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; not a UFO relator nor an asserted fact; dependency: exactly one source anchor and one derived anchor; typed by at least one derivation type"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; nem relator UFO nem fato afirmado; dependência: exatamente uma âncora de origem e uma derivada; tipificada por ao menos um tipo de derivação"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    rdfs:seeAlso prov:wasDerivedFrom,
        wdt:P144,
        schema:isBasedOn ;
    skos:definition "Contestable assertion, made by an agent, that one artistic entity (artwork, manifestation or selection) derives from another in specified ways. The derived entity is represented as a creation in its own right; legality and originality are outside the scope of the ontology."@en,
        "Alegação contestável, feita por um agente, de que uma entidade artística (obra, manifestação ou recorte) deriva de outra de modos especificados. A entidade derivada é representada como criação por direito próprio; legalidade e originalidade estão fora do escopo da ontologia."@pt-BR .
```

</details>

### `TransformationAspect` — aspecto de transformação

**Definição:** Registro do que ocorreu com uma dimensão artística numa derivação (mantida, modificada, acrescentada, removida ou recontextualizada).

| | |
|---|---|
| **UFO / OntoUML** | «kind» — Sortal rígido: fornece o princípio de identidade de suas instâncias, que não podem deixar de instanciá-lo enquanto existirem. |
| **Fundamentação** | objeto informacional UFO-C |
| **Dependência** | alegação de derivação hospedeira; uma dimensão e uma operação |
| **Em OWL/TTL** | `aro:TransformationAspect a owl:Class`; domínio de: `hasDimension`, `hasOperation`, `aspectSourceSelection`, `aspectDerivedSelection`, `aspectConcernsPattern`; imagem de: `hasTransformation` |
| **SHACL** | `hasDimension` (mín 1, máx 1, classe `ArtisticDimension`); `hasOperation` (mín 1, máx 1, classe `TransformationOperation`) |
| **Não expressável em OWL** | Rigidez e princípio de identidade não são expressáveis em OWL; a disjunção entre kinds não é declarada. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` — Como objeto informacional UFO-C, não tem contraparte específica na gUFO. |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:TransformationAspect a owl:Class ;
    rdfs:label "transformation aspect"@en,
        "aspecto de transformação"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): kind; foundation: UFO-C information object; dependency: host derivation claim; one dimension and one operation"@en,
        "Estereótipo OntoUML (provisório): kind; fundamentação: objeto informacional UFO-C; dependência: alegação de derivação hospedeira; uma dimensão e uma operação"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    skos:definition "Recorded statement of what happened to one artistic dimension in a derivation (retained, modified, added, removed or recontextualized)."@en,
        "Registro do que ocorreu com uma dimensão artística numa derivação (mantida, modificada, acrescentada, removida ou recontextualizada)."@pt-BR .
```

</details>

### `CreativeAct` — ato criativo

**Definição:** Atividade intencional temporal que dá origem a uma obra ou manifestação, inclusive derivadas.

| | |
|---|---|
| **UFO / OntoUML** | «event» — Perdurante (UFO-B): ocorrência que se desenrola no tempo e tem participantes; não é um objeto. |
| **Fundamentação** | evento UFO-B; ação intencional UFO-C |
| **Dependência** | agentes participantes e ocorrência temporal |
| **Em OWL/TTL** | `aro:CreativeAct a owl:Class`; domínio de: `producesCreation`, `hasContribution`; imagem de: `derivationRealizedBy` |
| **SHACL** | `producesCreation` (mín 1) |
| **Não expressável em OWL** | Extensão temporal e ordenação de eventos não são representadas nesta versão (sem propriedades de tempo). |
| **Padrão gUFO (não importado)** | `rdfs:subClassOf gufo:Event` |
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
    skos:definition "Intentional temporal activity that brings an artwork or manifestation into existence, including derivative ones."@en,
        "Atividade intencional temporal que dá origem a uma obra ou manifestação, inclusive derivadas."@pt-BR .
```

</details>

### `CreativeAgent` — agente criativo

**Definição:** Qualquer agente, identificado e descrito em vocabulário externo (PROV-O, FOAF, schema.org, Wikidata...), na medida em que contribui para um ato criativo. A identidade do agente é representada pelo vocabulário externo, não pela ARO.

| | |
|---|---|
| **UFO / OntoUML** | «roleMixin» — Não-sortal anti-rígido: classifica entidades de kinds diferentes por uma propriedade relacional (participar de um ato); não fornece identidade. |
| **Fundamentação** | não-sortal anti-rígido UFO-A (roleMixin); agentes são indivíduos de ontologias externas |
| **Dependência** | relacionalmente de uma CreativeContribution; identidade fornecida por tipos externos |
| **Em OWL/TTL** | `aro:CreativeAgent a owl:Class`; indivíduos externos são classificados nela por um raciocinador RDFS pelo `rdfs:range` da relação que os conecta; imagem de: `contributionBy` |
| **SHACL** | — |
| **Não expressável em OWL** | A anti-rigidez (a entidade pode deixar de desempenhar o papel) não é expressável; qualquer IRI usado na relação é classificado. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:RoleMixin` |
| **Alinhamentos** | `rdfs:seeAlso` `prov:Agent`, `rdfs:seeAlso` `foaf:Agent`, `rdfs:seeAlso` `schema:Person`, `rdfs:seeAlso` `schema:Organization` |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CreativeAgent a owl:Class ;
    rdfs:label "creative agent"@en,
        "agente criativo"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): roleMixin; foundation: UFO-A anti-rigid non-sortal (roleMixin); agents are individuals of external ontologies; dependency: relationally on a CreativeContribution; identity supplied by external kinds"@en,
        "Estereótipo OntoUML (provisório): roleMixin; fundamentação: não-sortal anti-rígido UFO-A (roleMixin); agentes são indivíduos de ontologias externas; dependência: relacionalmente de uma CreativeContribution; identidade fornecida por tipos externos"@pt-BR ;
    rdfs:isDefinedBy <https://w3id.org/aro/ontology/module/derivation> ;
    rdfs:seeAlso prov:Agent,
        foaf:Agent,
        schema:Organization,
        schema:Person ;
    skos:definition "Any agent, identified and described in an external vocabulary (PROV-O, FOAF, schema.org, Wikidata...), insofar as it contributes to a creative act. Agent identity is represented by the external vocabulary, not by ARO."@en,
        "Qualquer agente, identificado e descrito em vocabulário externo (PROV-O, FOAF, schema.org, Wikidata...), na medida em que contribui para um ato criativo. A identidade do agente é representada pelo vocabulário externo, não pela ARO."@pt-BR .
```

</details>

### `CreativeContribution` — contribuição criativa

**Definição:** Participação de um agente criativo num ato criativo sob um ou mais papéis.

| | |
|---|---|
| **UFO / OntoUML** | «relator» — Relator (UFO-A): endurante existencialmente dependente das entidades que conecta; fundamento de verdade de uma relação material. |
| **Fundamentação** | relator UFO-A; papel qualificado via CreativeRole |
| **Dependência** | existencialmente do ato e do agente |
| **Em OWL/TTL** | `aro:CreativeContribution a owl:Class`; relata ligados por propriedades de objeto; cardinalidades de mediação impostas pelo SHACL; domínio de: `contributionBy`, `contributionRole`; imagem de: `hasContribution` |
| **SHACL** | `contributionBy` (mín 1, máx 1, IRI); `contributionRole` (mín 1, classe `CreativeRole`) |
| **Não expressável em OWL** | Dependência existencial e a relação material derivada não são expressáveis em OWL. |
| **Padrão gUFO (não importado)** | `rdf:type gufo:Kind` + `rdfs:subClassOf gufo:Relator` (relata via `gufo:mediates`) |
| **Pacote** | `derivation` |

<details>
<summary>Turtle em `ontology/src/aro.ttl`</summary>

```turtle
aro:CreativeContribution a owl:Class ;
    rdfs:label "creative contribution"@en,
        "contribuição criativa"@pt-BR ;
    rdfs:comment "OntoUML stereotype (provisional): relator; foundation: UFO-A relator; role qualification via CreativeRole; dependency: existentially on the act and the agent"@en,
        "Estereótipo OntoUML (provisório): relator; fundamentação: relator UFO-A; papel qualificado via CreativeRole; dependência: existencialmente do ato e do agente"@pt-BR ;
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
| **Em OWL/TTL** | `aro:DerivationType a owl:Class`; instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasDerivationType` |
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
| **Em OWL/TTL** | `aro:DerivationRegime a owl:Class`; instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasRegime` |
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
| **Em OWL/TTL** | `aro:ArtisticDimension a owl:Class`; instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasDimension` |
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
| **Em OWL/TTL** | `aro:TransformationOperation a owl:Class`; instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `hasOperation` |
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
| **Em OWL/TTL** | `aro:CreativeRole a owl:Class`; instâncias são conceitos SKOS tipados como `skos:Concept` e como esta classe; imagem de: `contributionRole` |
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
| `hasManifestation` | `Artwork` → `Manifestation` | `1..*` | **obra se realiza por manifestação.** Liga uma obra a uma expressão, versão ou realização concreta dela (gravação, edição, apresentação, montagem de filme). Use para dizer por quais manifestações a obra existe. |
| `realizesArtwork` | `Manifestation` → `Artwork` | `1` | **manifestação realiza obra.** Liga uma manifestação à obra que ela realiza; lida do lado da manifestação, diz de qual obra esta gravação, edição ou apresentação é versão. |
| `selectsFrom` | `Selection` → `Manifestation` | `1` | **recorte referencia manifestação.** Liga um recorte à manifestação de onde ele é tirado. Todo recorte vem de exatamente uma manifestação, para que sua localização (linhas, segundos, região) tenha sentido. |
| `hasSelector` | `Selection` → `oa:Selector` | `0..*` | **recorte localizado por seletor W3C Web Annotation.** Liga um recorte a um seletor W3C Web Annotation que o localiza dentro da manifestação (fragmento de tempo, citação ou posição de texto, região de imagem, forma SVG). |
| `groupsSelection` | `AnalysisUnit` → `Selection` | `1..*` | **unidade agrupa recortes.** Liga uma unidade de análise aos recortes que ela agrupa, para que vários trechos sejam analisados juntos como uma unidade (uma cena, um refrão, um motivo). |
| `hasPrimarySelection` | `InterpretationRecord` → `Selection` | `1` | **interpretação se ancora em recorte.** Liga um registro de interpretação ao único recorte de que ele trata: o trecho da obra em que a interpretação se ancora. |
| `hasSupportingSelection` | `InterpretationRecord` → `Selection` | `0..*` | **interpretação usa recorte de apoio.** Liga um registro de interpretação a outros recortes citados em seu apoio, além do principal (outros trechos da mesma obra ou de outras). |
| `producedByAct` | `InterpretationRecord` → `InterpretiveAct` | `1` | **ato produz registro.** Liga um registro de interpretação ao ato interpretativo que o produziu, registrando quem interpretou, e quando, como fato histórico distinto do conteúdo da interpretação. |
| `hasParticipant` | `InterpretiveAct` → `Analyst` | `1..*` | **agente participa de ato.** Liga um ato interpretativo aos agentes (analistas) que participaram dele. Os agentes são identificados por IRIs externos (Wikidata, ORCID, FOAF, schema.org). |
| `hasJustification` | `InterpretationRecord` → `InterpretiveJustification` | `0..*` | **interpretação tem fundamentação.** Liga um registro de interpretação ao argumento que o sustenta: as premissas e o raciocínio que levam do trecho à interpretação. |
| `challenges` | `InterpretationChallenge` → `InterpretationRecord` | `1` | **contestação questiona interpretação.** Liga uma contestação ao registro de interpretação que ela critica ou para o qual propõe alternativa, de modo que a divergência fique registrada, e não apagada. |
| `assessesInterpretation` | `InterpretationAssessment` → `InterpretationRecord` | `1` | **avaliação incide sobre interpretação.** Liga uma avaliação de interpretação ao registro de interpretação que ela julga (plausibilidade, coerência, relevância...). |
| `usesCriterion` | `InterpretationAssessment` → `AssessmentCriterion` | `1..*` | **avaliação usa critérios.** Liga uma avaliação de interpretação aos critérios explícitos que ela aplica, para que a base do julgamento possa ser examinada e comparada. |
| `describesSituation` | `InterpretationRecord` → `SituationDescription` | `0..*` | **interpretação descreve situação.** Liga um registro de interpretação às descrições de situações representadas que ele produz: o que, segundo a interpretação, acontece no trecho. |
| `mentionsDepictedElement` | `SituationDescription` → `DepictedElement` | `0..*` | **descrição menciona elemento.** Liga uma descrição de situação aos elementos representados que ela envolve (personagens, lugares, objetos, grupos representados na obra). |
| `generalizesAs` | `SituationDescription` → `SituationPattern` | `0..*` | **descrição motiva abstração.** Liga uma descrição de situação a um padrão situacional abstraído dela: a configuração reutilizável que a situação representada é tomada como exemplo. |
| `hasCondition` | `SituationPattern` → `PatternCondition` | `1..*` | **padrão especifica condições.** Liga um padrão situacional às condições que o definem, cada uma individualizada para poder ser marcada como obrigatória ou opcional e comparada com casos reais. |
| `caseAboutSituation` | `EmpiricalCase` → `EmpiricalSituation` | `0..*` | **dossiê descreve situação real.** Liga um caso empírico (dossiê documentado) às situações do mundo real que ele documenta. |
| `caseAboutEvent` | `EmpiricalCase` → `EmpiricalEvent` | `0..*` | **dossiê descreve evento.** Liga um caso empírico (dossiê documentado) aos eventos do mundo real que ele documenta. |
| `assertsPattern` | `CorrespondenceClaim` → `SituationPattern` | `1` | **alegação referencia padrão.** Liga uma alegação de correspondência ao padrão situacional que ela compara com um caso real: o lado da arte na alegação de que arte e realidade se correspondem. |
| `assertsCase` | `CorrespondenceClaim` → `EmpiricalCase` | `1` | **alegação referencia caso.** Liga uma alegação de correspondência ao caso empírico que ela compara com um padrão: o lado da realidade na alegação de que arte e realidade se correspondem. |
| `derivedFromSource` | `EvidenceItem` → `ReferenceSource` | `1` | **evidência obtida de fonte.** Liga um item de evidência à fonte de referência de onde foi extraído, para que toda evidência possa ser rastreada até uma fonte citável. |
| `supportsClaim` | `EvidenceAssessment` → `EmpiricalClaim` | `0..1` | **avaliação examina afirmação.** Liga uma avaliação de evidência à afirmação empírica cujo apoio ela avalia. |
| `assessesCorrespondence` | `EvidenceAssessment` → `CorrespondenceClaim` | `0..1` | **avaliação examina correspondência.** Liga uma avaliação de evidência à alegação de correspondência (padrão ↔ caso) cujo apoio ela avalia. |
| `assessesEvidence` | `EvidenceAssessment` → `EvidenceItem` | `1..*` | **avaliação considera evidência.** Liga uma avaliação de evidência aos itens de evidência que ela pondera; toda avaliação considera pelo menos um item. |
| `citesSource` | `InterpretationRecord` → `ReferenceSource` | `0..*` | **interpretação cita fonte.** Liga um registro de interpretação diretamente a uma fonte de referência em que se apoia (crítica, entrevista, estudo), quando não se registra um item de evidência separado. |
| `referencesSource` | `CorrespondenceClaim` → `ReferenceSource` | `0..*` | **correspondência cita fonte.** Liga uma alegação de correspondência diretamente a uma fonte de referência em que se apoia. |
| `caseHasReference` | `EmpiricalCase` → `ReferenceSource` | `0..*` | **caso cita fontes.** Liga um caso empírico às fontes de referência que o documentam (notícias, relatórios, estudos, depoimentos). |
| `explainsPattern` | `ExplanationHypothesis` → `SituationPattern` | `0..*` | **hipótese explica padrão.** Liga uma hipótese explicativa ao padrão situacional que ela se propõe explicar (mecanismos ou fatores por trás da configuração recorrente). |
| `supportsInterpretation` | `InterpretationRecord` → `InterpretationRecord` | `0..*` | **interpretação apoia outra.** Liga um registro de interpretação a outra interpretação que ele apoia, formando cadeias de interpretações. |
| `hasSourceAnchor` | `DerivationClaim` → `Artwork` ∪ `Manifestation` ∪ `Selection` | `1` | **alegação indica entidade de origem.** Liga uma alegação de derivação à entidade de onde a derivação parte (obra, manifestação ou recorte): o lado de origem da alegação. |
| `hasDerivedAnchor` | `DerivationClaim` → `Artwork` ∪ `Manifestation` ∪ `Selection` | `1` | **alegação indica entidade derivada.** Liga uma alegação de derivação à entidade que se diz derivar da origem (obra, manifestação ou recorte): o lado derivado da alegação. Deve ser diferente da âncora de origem. |
| `hasDerivationType` | `DerivationClaim` → `DerivationType` | `1..*` | **alegação tipificada por tipo de derivação.** Classifica uma alegação de derivação com um ou mais conceitos do vocabulário de tipos de derivação (cover, sampling, tradução, paródia...). |
| `hasRegime` | `DerivationClaim` → `DerivationRegime` | `0..*` | **alegação registra regime de derivação.** Qualifica uma alegação de derivação com seu regime: a postura tomada diante da origem (lúdica, satírica, séria, reverente). |
| `hasTransformation` | `DerivationClaim` → `TransformationAspect` | `0..*` | **alegação detalha aspecto de transformação.** Liga uma alegação de derivação aos aspectos de transformação que a detalham, um por dimensão artística mantida, modificada, adicionada, removida ou recontextualizada. |
| `hasDimension` | `TransformationAspect` → `ArtisticDimension` | `1` | **aspecto incide sobre dimensão.** Diz de qual dimensão artística (melodia, letra, enredo, personagem, meio...) trata um aspecto de transformação. |
| `hasOperation` | `TransformationAspect` → `TransformationOperation` | `1` | **aspecto aplica operação.** Diz o que foi feito com a dimensão num aspecto de transformação: manter, modificar, adicionar, remover ou recontextualizar. |
| `aspectSourceSelection` | `TransformationAspect` → `Selection` | `0..1` | **aspecto aponta recorte de origem.** Aponta um aspecto de transformação para o trecho da origem em que a dimensão pode ser observada. |
| `aspectDerivedSelection` | `TransformationAspect` → `Selection` | `0..1` | **aspecto aponta recorte derivado.** Aponta um aspecto de transformação para o trecho da entidade derivada em que a dimensão transformada pode ser observada. |
| `aspectConcernsPattern` | `TransformationAspect` → `SituationPattern` | `0..*` | **aspecto envolve padrão situacional.** Liga um aspecto de transformação a um padrão situacional que ele afeta, quando a derivação mantém, altera ou desloca uma situação representada. |
| `derivationJustifiedBy` | `DerivationClaim` → `InterpretiveJustification` | `0..*` | **alegação de derivação explicada por argumento.** Liga uma alegação de derivação ao argumento que explica por que a derivação é afirmada (semelhanças encontradas, intenção documentada, créditos). |
| `derivationRealizedBy` | `DerivationClaim` → `CreativeAct` | `0..1` | **derivação realizada por ato criativo.** Liga uma alegação de derivação ao ato criativo que realizou a derivação (a gravação, escrita ou adaptação que produziu a entidade derivada). |
| `claimProducedByAct` | `DerivationClaim` → `InterpretiveAct` | `0..1` | **ato analítico que registrou a alegação.** Liga uma alegação de derivação ao ato analítico que a registrou, para que a alegação tenha autor e data como qualquer interpretação. |
| `derivationReferencesSource` | `DerivationClaim` → `ReferenceSource` | `0..*` | **alegação de derivação cita fonte.** Liga uma alegação de derivação às fontes de referência que documentam a derivação (créditos, entrevistas, encartes, estudos). |
| `assessesDerivation` | `EvidenceAssessment` → `DerivationClaim` | `0..1` | **avaliação examina alegação de derivação.** Liga uma avaliação de evidência à alegação de derivação cujo apoio ela avalia. |
| `producesCreation` | `CreativeAct` → `Artwork` ∪ `Manifestation` | `1..*` | **ato origina obra ou manifestação.** Liga um ato criativo às obras ou manifestações que ele faz existir, inclusive as derivadas. |
| `hasContribution` | `CreativeAct` → `CreativeContribution` | `0..*` | **ato inclui contribuição.** Liga um ato criativo às contribuições que o compõem, uma por agente participante. |
| `contributionBy` | `CreativeContribution` → `CreativeAgent` | `1` | **contribuição feita por agente.** Liga uma contribuição criativa ao agente que a fez, identificado por um IRI externo (Wikidata, ISNI, MusicBrainz, schema.org). |
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
