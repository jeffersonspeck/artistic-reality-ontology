[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/design-decisions.md)

# Registro de decisões de projeto

| ID | Decisão | Consequência | Estado |
|---|---|---|---|
| ADR-001 | Interpretação ancorada é InterpretationRecord, não Recorte (na v0.1 chamada de "derivação"; o termo passa a designar o ADR-011) | Recorte principal explícito | Adotada (renomeada na v0.2) |
| ADR-002 | Interpretações podem ser conflitantes | Nenhum sentido único por recorte | Adotada |
| ADR-003 | Mundos representado e empírico são distintos | Classes distintas para descrição e situação real | Adotada |
| ADR-004 | Fonte é reutilizável e independente | Citações muitos-para-muitos; pode apoiar ou contestar | Adotada |
| ADR-005 | Evidência avalia uma afirmação específica | EvidenceAssessment explícita | Adotada |
| ADR-006 | Correspondência é alegação informacional, não relator UFO | Avaliação antes de atribuir status epistêmico | Adotada |
| ADR-007 | OWL aproxima semântica de referência | SHACL e regras de processo complementam | Adotada |
| ADR-008 | Sem importação integral da UFO-C em OWL | Fundamentação conceitual documentada | Adotada |
| ADR-009 | JSON nativo OntoUML somente após validar | DOT/SVG são visualizações | Aberta |
| ADR-010 | Definir identidade de proposições abstratas e registros | Evitar equívoco de identidade | Aberta |
| ADR-011 | Derivação entre obras é alegação contestável (DerivationClaim), não propriedade que afirma fato | Alegações podem ser citadas, avaliadas com evidências e contestadas; prov:wasDerivedFrom, schema:isBasedOn e Wikidata P144 ligados apenas por rdfs:seeAlso | Adotada |
| ADR-012 | Sem compromisso ontológico sobre se cover/tradução é obra nova ou nova manifestação | Cada alegação declara o nível pelas âncoras (Artwork, Manifestation ou Selection) | Adotada |
| ADR-013 | Cada elo de uma cadeia de derivação é representado como alegação separada; sem axioma de transitividade (sem owl:TransitiveProperty); cadeias são recuperadas por consulta | Cada elo mantém evidência e situação próprias (CQ-14) | Adotada |
| ADR-014 | Legalidade, autorização e originalidade das derivações estão fora do escopo da ontologia; derivações são representadas com as explicações que os agentes dão para elas | Sem vocabulário de autorização; obras derivadas são criações por direito próprio; o "plagiat" de Genette chama-se UnacknowledgedBorrowing | Adotada (revista na v0.2) |
| ADR-015 | Cada alegação liga exatamente uma âncora de origem e uma derivada | Mashups e obras com várias origens usam várias alegações | Adotada |
| ADR-016 | Tipos de derivação, dimensões, operações, papéis e situações são conceitos SKOS tipificados por classes de alta ordem | Vocabulários extensíveis sem mudar o esquema; estereótipo OntoUML «type» provisório | Adotada |
| ADR-017 | model/conceptual-model.json é a fonte única; scripts/build.py gera OWL, SHACL, schemas, documentação de referência e diagramas | Testes falham se os artefatos gerados divergirem do catálogo | Adotada |
| ADR-018 | A postura da derivação (homenagem, crítica da paródia, jogo) é eixo separado DerivationRegime, não tipo | Tipos descrevem mecanismo; regimes descrevem postura (a partir de Genette) | Adotada |
| ADR-019 | CreativeAgent é «roleMixin»; os agentes em si não são modelados | Qualquer IRI de agente externo (PROV-O, FOAF, schema.org, Wikidata) é aceito; o SHACL exige apenas IRI | Adotada |
| ADR-020 | Dimensões artísticas formam hierarquia SKOS por família de mídia | Ferramentas de anotação podem oferecer listas por mídia; usar o conceito mais específico | Adotada |
| ADR-021 | Recortes são localizados por seletores W3C Web Annotation (oa:Selector) via hasSelector; selectorExpression é só atalho | Interoperável com ferramentas de anotação (fragmentos de mídia, citação/posição de texto, SVG) | Adotada |
| ADR-022 | Analyst é «roleMixin», como CreativeAgent | Analistas são IRIs de agentes externos; o SHACL exige apenas IRI | Adotada |
| ADR-023 | O schema de troca do anotador (schemas/derivation-annotation.schema.json) é gerado a partir dos vocabulários SKOS | Ferramentas de anotação não divergem do vocabulário da ontologia | Adotada |
| ADR-024 | Política de idioma: todos os IRIs e termos em inglês; toda classe, propriedade, conceito, esquema, comentário, mensagem SHACL e metadado da ontologia tem literais en e pt-BR; o conteúdo registrado (textValue, derivationExtent, textos do anotador) aceita qualquer idioma BCP 47 | rdf:langString exigido pelo SHACL; testes verificam a cobertura en/pt-BR de todos os termos | Adotada |

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/design-decisions.md)
| ADR-025 | Estrutura do repositório com versão em desenvolvimento e versões congeladas (como no OntoMI): `ontology/src/` guarda a ontologia gerada e um módulo por pacote; `releases/v<versão>/` guarda cópias imutáveis com notas de versão; cada versão tem `owl:versionIRI` e aponta a anterior com `owl:priorVersion` | Versões citáveis e comparáveis; `build.py --release` se recusa a sobrescrever uma versão | Adotada |
