[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/foundation-and-mappings.md)

# Fundamentação ontológica e mapeamentos

- **UFO-A:** identidade, rigidez, continuantes, kinds/subkinds e dependência. Alguns estereótipos são compromissos provisórios e requerem revisão especializada.
- **UFO-B:** atos e eventos; descrições de eventos ficcionais *não* são eventos empíricos UFO-B.
- **UFO-C:** agência, intencionalidade, objetos sociais/informacionais, documentos e interpretação normativa fundamentam o modelo conceitualmente.
- **gUFO 1.0.0:** implementação OWL leve, majoritariamente de UFO-A e parte limitada da UFO-B. **Não** implementa integralmente a UFO-C. Não declaramos imports/equivalências que impliquem o contrário.
- **Outros artefatos UFO-C em OWL:** há publicação independente de UFO-C 1.1.0 pela Czech Technical University; não significa que esteja incluída na gUFO.
- **OntoUML:** modelo conceitual de referência. Os desenhos DOT são ilustrações, NÃO JSON nativo e ainda não passaram por verificador OntoUML.
- **OWL:** projeção operacional que preserva classes, predicados, rótulos e duas especializações, mas não toda semântica modal, de dependência, ficção, epistemologia revisável ou causalidade.
- **PROV-O:** recomendada para proveniência em próximo incremento, após revisão.
- **Dublin Core:** recomendado para metadados bibliográficos.
- **W3C Web Annotation:** adotado na v0.2: `Selection hasSelector oa:Selector` (ADR-021), e o schema do anotador usa os mesmos formatos de seletor.
- **Agentes:** `Analyst` e `CreativeAgent` são «roleMixin»s; os agentes em si vêm de ontologias externas (ADR-019, ADR-022).
- **Derivação (v0.2):** `DerivationClaim` liga-se por `rdfs:seeAlso` a `prov:wasDerivedFrom`, `schema:isBasedOn` e Wikidata `P144` (baseado em). **Não** são equivalências: essas propriedades afirmam a derivação como fato, enquanto a ARO representa uma alegação contestável feita por um agente. As relações de derivação obra-obra da IFLA LRMoo/FRBRoo e a hipertextualidade de Genette (transformação vs. imitação) inspiraram o vocabulário de tipos; o alinhamento formal está pendente.
- **UFO e derivação:** `CreativeAct` é evento UFO-B, `CreativeContribution` é relator UFO-A entre ato e agente, `CreativeAgent` é «roleMixin» que aceita agentes de ontologias externas (`rdfs:seeAlso` prov:Agent, foaf:Agent, schema:Person, schema:Organization) sem modelá-los; as classes de vocabulário são «type»s de alta ordem provisórios. Ver [tipologia de derivação](derivation-typology.md) para a literatura dos vocabulários.

## Limitações conhecidas

O modelo de referência e a projeção OWL **não são semanticamente equivalentes**. Rigidez forte da UFO, dependências históricas/simultâneas, justificativas revogáveis, mundos ficcionais, calibração de confiança e alegações causais não podem ser validadas apenas pelos axiomas OWL. Alguns estereótipos OntoUML são preliminares, e uma exportação JSON nativa OntoUML exige etapa separada de autoria/validação (o [schema de intercâmbio OntoUML](https://github.com/OntoUML/ontouml-schema) não tem relação com os JSON Schemas de aplicação em `schemas/`). O SHACL verifica necessidades estruturais em mundo fechado apenas quando executado por um motor SHACL. Os testes confirmam sintaxe, estrutura e comportamento das consultas, não a correção da teoria de domínio.

## Fontes
- Aguiar & Souza, *SABiOx: the Extended Systematic Approach for Building Ontologies* (2024): https://ceur-ws.org/Vol-3905/paper1.pdf
- Guia oficial SABiOx: https://nemo.inf.ufes.br/wp-content/uploads/sabiox-guide2024-09.pdf
- https://nemo.inf.ufes.br/en/projetos/ufo/
- https://nemo-ufes.github.io/gufo/
- https://onto.fel.cvut.cz/ontologies/ufo-c
- https://github.com/OntoUML/ontouml-schema

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/foundation-and-mappings.md)
