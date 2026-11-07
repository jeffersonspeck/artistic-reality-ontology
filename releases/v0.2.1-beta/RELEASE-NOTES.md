[← Releases](../README.md)

# ARO 0.2.1-beta

🇺🇸 [English](#english) · 🇧🇷 [Português](#português)

## English

**Documentation release — beta, under development.** Every relation and module now says, in the ontology itself and in English and Portuguese, what it is for. No class, relation, domain, range or constraint changed: data valid for 0.2.0-beta is valid for 0.2.1-beta.

| | |
|---|---|
| Version IRI | `https://w3id.org/aro/ontology/0.2.1-beta` |
| Prior version | `https://w3id.org/aro/ontology/0.2.0-beta` |
| Files | `aro.ttl`, `aro.owl`, `aro.jsonld` (full ontology), `modules/<package>.ttl` (one per package), `aro-shapes.ttl` (SHACL) |
| Size | 36 classes, 49 object properties, 5 SKOS vocabularies (40 derivation types, 4 regimes, 56 dimensions, 5 operations, 10 roles) |

**Changes since 0.2.0-beta**
- **Relation definitions:** each of the 49 object properties has a `skos:definition` in English and Portuguese explaining what it links and why (before, only a short `rdfs:label`).
- **Modules in the ontology:** the six modules (`https://w3id.org/aro/ontology/module/<package>`) are declared in `aro.ttl` with label and description (`dcterms:description`) in both languages and linked by `dcterms:hasPart`; each class and relation states its module with `rdfs:isDefinedBy`. Module files carry the same description.
- **Reference model:** the relation tables of `docs/*/reference-model.md` show each relation's definition.
- **Annotator:** hover descriptions, relation cards and module names are read from these definitions in the ontology.

Full list: [CHANGELOG](../../CHANGELOG.md).

**Status:** beta. Terms may still change; OntoUML stereotypes are provisional; no expert or real-case evaluation yet.

## Português

**Versão de documentação — beta, em desenvolvimento.** Toda relação e todo módulo agora dizem, na própria ontologia e em inglês e português, para que servem. Nenhuma classe, relação, domínio, imagem ou restrição mudou: dados válidos para a 0.2.0-beta são válidos para a 0.2.1-beta.

| | |
|---|---|
| IRI da versão | `https://w3id.org/aro/ontology/0.2.1-beta` |
| Versão anterior | `https://w3id.org/aro/ontology/0.2.0-beta` |
| Arquivos | `aro.ttl`, `aro.owl`, `aro.jsonld` (ontologia completa), `modules/<pacote>.ttl` (um por pacote), `aro-shapes.ttl` (SHACL) |
| Tamanho | 36 classes, 49 propriedades de objeto, 5 vocabulários SKOS (40 tipos de derivação, 4 regimes, 56 dimensões, 5 operações, 10 papéis) |

**Mudanças desde a 0.2.0-beta**
- **Definições das relações:** cada uma das 49 propriedades de objeto tem `skos:definition` em inglês e português explicando o que liga e por quê (antes havia só um `rdfs:label` curto).
- **Módulos na ontologia:** os seis módulos (`https://w3id.org/aro/ontology/module/<pacote>`) são declarados em `aro.ttl` com rótulo e descrição (`dcterms:description`) nos dois idiomas e ligados por `dcterms:hasPart`; cada classe e relação indica seu módulo com `rdfs:isDefinedBy`. Os arquivos de módulo trazem a mesma descrição.
- **Modelo de referência:** as tabelas de relações de `docs/*/reference-model.md` mostram a definição de cada relação.
- **Anotador:** as descrições ao passar o mouse, os cartões de relação e os nomes dos módulos são lidos dessas definições na ontologia.

Lista completa: [CHANGELOG](../../CHANGELOG.md).

**Status:** beta. Os termos ainda podem mudar; os estereótipos OntoUML são provisórios; ainda sem avaliação por especialistas ou com casos reais.
