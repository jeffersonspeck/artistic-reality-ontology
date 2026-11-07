[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/foundation-and-mappings.md)

# Fundamentação ontológica e mapeamentos

- **UFO-A:** identidade, rigidez, continuantes, kinds/subkinds e dependência. Alguns estereótipos são compromissos provisórios e requerem revisão especializada.
- **UFO-B:** atos e eventos; descrições de eventos ficcionais *não* são eventos empíricos UFO-B.
- **UFO-C:** agência, intencionalidade, objetos sociais/informacionais, documentos e interpretação normativa fundamentam o modelo conceitualmente.
- **gUFO 1.0.0:** implementação OWL leve, majoritariamente de UFO-A e parte limitada da UFO-B. **Não** implementa integralmente a UFO-C. Não declaramos imports/equivalências que impliquem o contrário.
- **Outros artefatos UFO-C em OWL:** há publicação independente de UFO-C 1.1.0 pela Czech Technical University; não significa que esteja incluída na gUFO.
- **OntoUML:** modelo conceitual de referência. Os desenhos DOT são ilustrações, NÃO JSON nativo e ainda não passaram por verificador OntoUML.
- **OWL:** projeção operacional que preserva classes, predicados, rótulos e duas especializações, mas não toda semântica modal, de dependência, ficção, epistemologia revisável ou causalidade.
- **PROV-O:** alinhada desde a 0.3 por `rdfs:seeAlso` (ADR-031): `InterpretiveAct`/`CreativeAct` ~ `prov:Activity`, `producedByAct` ~ `prov:wasGeneratedBy`, `hasParticipant` ~ `prov:wasAssociatedWith`, `Agent` ~ `prov:Agent`. A ARO mantém termos próprios porque seus registros são alegações, não fatos de proveniência.
- **Dublin Core:** `citesSource` ~ `dcterms:references`; `ReferenceSource` ~ `dcterms:BibliographicResource`; `dcterms:` é recomendado para metadados bibliográficos das fontes.
- **W3C Web Annotation:** adotado na v0.2: `Selection hasSelector oa:Selector` (ADR-021), e o schema do anotador usa os mesmos formatos de seletor.
- **Agentes (0.3, ADR-029):** «category» `Agent` sobre o «kind» `Person` e o «collective» `Collective`; os «roleMixin»s `Analyst` e `CreativeAgent` são especializados por «role»s definidos em OWL como interseções (ex.: `PersonAnalyst` ≡ `Person` ⊓ `Analyst`). Os agentes continuam IRIs de ontologias externas (ADR-019, ADR-022); tipá-los como `aro:Person`/`aro:Collective` os coloca no padrão.
- **Derivação:** `DerivationClaim` liga-se por `rdfs:seeAlso` a `prov:wasDerivedFrom`, `schema:isBasedOn` e Wikidata `P144` (baseado em). **Não** são equivalências: essas propriedades afirmam a derivação como fato, enquanto a ARO representa uma alegação contestável feita por um agente. A hipertextualidade de Genette (transformação e imitação) e as relações obra-a-obra do IFLA LRMoo orientaram o vocabulário de tipos de derivação.
- **UFO e derivação:** `CreativeAct` é evento UFO-B; `CreativeContribution` é relator UFO-A que media o agente (`contributionBy`) e a entidade artística (`contributionTo`), fundado pelo ato (`hasContribution`); os vocabulários são «type»s de alta ordem cujas instâncias são conceitos SKOS.

## Alinhamentos (0.3)

Todos os alinhamentos são `rdfs:seeAlso` (ADR-031): apontam para o termo mais próximo em outro vocabulário sem importá-lo nem afirmar equivalência.

| ARO | Alinhado com | Por que não é equivalência |
|---|---|---|
| `Artwork`, `Expression`, `Manifestation` | `lrmoo:F1_Work`, `lrmoo:F2_Expression`, `lrmoo:F3_Manifestation` (IFLA LRMoo) | a ARO adota os níveis do LRM (ADR-028), mas não os compromissos CIDOC-CRM do LRMoo |
| `hasExpression`, `hasManifestation`/`embodiesExpression` | `lrmoo:R3_is_realised_in`, `lrmoo:R4_embodies` | mesmo motivo |
| `CreativeAct` | `prov:Activity`, `lrmoo:F28_Expression_Creation` | um ato criativo pode produzir vários níveis de uma vez |
| `Selection` | `oa:SpecificResource` | um recorte é uma entidade de domínio que pode ter vários seletores |
| `InterpretationRecord`, `hasPrimarySelection` | `oa:Annotation`, `oa:hasTarget` | uma interpretação é uma alegação com ato, justificativa e avaliação, não só uma anotação |
| `InterpretiveAct`, `producedByAct`, `hasParticipant` | `prov:Activity`, `prov:wasGeneratedBy`, `prov:wasAssociatedWith` | a ARO registra quem afirmou uma alegação, não a proveniência de dados |
| `Claim`, `Assessment` | `schema:Claim`, `schema:ClaimReview` | avaliações do schema.org têm notas e publicadores que a ARO não exige |
| `ReferenceSource`, `citesSource` | `dcterms:BibliographicResource`, `schema:CreativeWork`, `dcterms:references` | — |
| `Agent`, `Person`, `Collective` | `prov:Agent`, `foaf:Agent`, `foaf:Person`, `schema:Person`, `foaf:Group`, `schema:Organization`, `schema:MusicGroup` | agentes continuam IRIs externos |
| `DerivationClaim` | `prov:wasDerivedFrom`, `schema:isBasedOn`, `wdt:P144` | essas afirmam a derivação como fato |

## Limitações conhecidas

O modelo de referência e a projeção OWL **não são semanticamente equivalentes**. Rigidez forte da UFO, dependências históricas/simultâneas, justificativas revogáveis, mundos ficcionais, calibração de confiança e alegações causais não podem ser validadas apenas pelos axiomas OWL. Os estereótipos OntoUML foram revistos na 0.3 (um único kind para registros analíticos, categorias no lugar de uniões, padrão de papéis para agentes, relator com dois relata), mas ainda não verificados numa ferramenta OntoUML, e uma exportação JSON nativa OntoUML exige etapa separada de autoria/validação (o [schema de intercâmbio OntoUML](https://github.com/OntoUML/ontouml-schema) não tem relação com os JSON Schemas de aplicação em `schemas/`). O SHACL verifica necessidades estruturais em mundo fechado apenas quando executado por um motor SHACL. Os testes confirmam sintaxe, estrutura e comportamento das consultas, não a correção da teoria de domínio.

## Fontes
- Aguiar & Souza, *SABiOx: the Extended Systematic Approach for Building Ontologies* (2024): https://ceur-ws.org/Vol-3905/paper1.pdf
- Guia oficial SABiOx: https://nemo.inf.ufes.br/wp-content/uploads/sabiox-guide2024-09.pdf
- https://nemo.inf.ufes.br/en/projetos/ufo/
- https://nemo-ufes.github.io/gufo/
- https://onto.fel.cvut.cz/ontologies/ufo-c
- https://github.com/OntoUML/ontouml-schema

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/foundation-and-mappings.md)
