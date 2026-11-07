[← Releases](../README.md)

# ARO 1.0.0

[English](#english) · [Português](#português)

## English

**First stable version.** The 0.3 model is frozen as 1.0.0 without the provisional marks. No class, relation, domain, range or SHACL constraint changed, so data written for 0.3.0-beta is valid as it is.

| | |
|---|---|
| Version IRI | `https://w3id.org/aro/ontology/1.0.0` |
| Prior version | `https://w3id.org/aro/ontology/0.3.0-beta` |
| Files | `aro.ttl`, `aro.owl`, `aro.jsonld` (full ontology), `modules/<package>.ttl` (eight packages), `aro-shapes.ttl` (SHACL) |
| Size | 50 classes (7 «kind», 24 «subkind», 2 «category», 1 «collective», 2 «roleMixin», 4 «role», 3 «event», 1 «situation», 1 «relator», 5 «type»), 45 object properties, 15 datatype properties, 5 SKOS vocabularies |

**Changes since 0.3.0-beta**
- **OntoUML commitments:** class comments read "OntoUML stereotype: …" instead of "provisional"; the vocabulary types and the «instantiation» relations lose the provisional mark. The OntoUML export (`model/ontouml/aro.ontouml.json`) is valid against the official OntoUML JSON Schema and well formed, checked with `scripts/verify_ontouml.py` and the official ontouml-js 1.0.0 library (0 errors; the 33 warnings are plain associations, ADR-032).
- **Documentation:** reference model, OntoUML pages, ADR-009/ADR-016, SABiOx plan and compilation, README/LEIA-ME and `CITATION.cff` describe the stable version; the UFO notes for «kind», «event» and «situation» mention the disjointness of ultimate sortals and the `startDate`/`endDate` dates already in the model.
- **Examples:** the *Homem na Estrada* annotation (`examples/aro_homem_na_estrada_realidade_social.ttl`) follows the current structure and declares `dcterms:conformsTo` 1.0.0; older 0.2 annotations were removed.
- **Annotator:** online at <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/>; fixes to the focus tab, dragging nodes with several tabs open and the node counter; PNG and PDF exports look like the graph on screen.

Full list: [CHANGELOG](../../CHANGELOG.md).

**Known limitations** (see [requirements](../../docs/en/requirements.md)): no vocabulary yet separates similarity, possibility and divergence inside a correspondence claim (FR-10); PROV-O is an alignment, not a formal provenance model (NFR-03); the w3id redirect is not registered (NFR-02). Evaluation with experts and real cases follows the [evaluation protocol](../../docs/en/evaluation-protocol.md).

## Português

**Primeira versão estável.** O modelo da 0.3 é congelado como 1.0.0, sem as marcas de provisório. Nenhuma classe, relação, domínio, imagem ou restrição SHACL mudou; dados feitos para a 0.3.0-beta continuam válidos como estão.

| | |
|---|---|
| IRI da versão | `https://w3id.org/aro/ontology/1.0.0` |
| Versão anterior | `https://w3id.org/aro/ontology/0.3.0-beta` |
| Arquivos | `aro.ttl`, `aro.owl`, `aro.jsonld` (ontologia completa), `modules/<pacote>.ttl` (oito pacotes), `aro-shapes.ttl` (SHACL) |
| Tamanho | 50 classes (7 «kind», 24 «subkind», 2 «category», 1 «collective», 2 «roleMixin», 4 «role», 3 «event», 1 «situation», 1 «relator», 5 «type»), 45 propriedades de objeto, 15 propriedades de dados, 5 vocabulários SKOS |

**Mudanças desde a 0.3.0-beta**
- **Compromissos OntoUML:** os comentários das classes dizem "Estereótipo OntoUML: …" em vez de "provisório"; os tipos de vocabulário e as relações «instantiation» perdem a marca de provisório. A exportação OntoUML (`model/ontouml/aro.ontouml.json`) é válida no OntoUML JSON Schema oficial e bem formada, conferida com o `scripts/verify_ontouml.py` e a biblioteca oficial ontouml-js 1.0.0 (0 erros; os 33 avisos são associações simples, ADR-032).
- **Documentação:** modelo de referência, páginas OntoUML, ADR-009/ADR-016, plano e compilado SABiOx, README/LEIA-ME e `CITATION.cff` descrevem a versão estável; as notas UFO de «kind», «event» e «situation» citam a disjunção entre sortais últimos e as datas `startDate`/`endDate`, que já estavam no modelo.
- **Exemplos:** a anotação de *Homem na Estrada* (`examples/aro_homem_na_estrada_realidade_social.ttl`) segue a estrutura atual e declara `dcterms:conformsTo` 1.0.0; as anotações antigas da 0.2 foram removidas.
- **Anotador:** online em <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/>; correções na aba de foco, no arraste de nós com várias abas abertas e no contador de nós; as exportações PNG e PDF têm o visual do grafo na tela.

Lista completa: [CHANGELOG](../../CHANGELOG.md).

**Limitações conhecidas** (ver [requisitos](../../docs/pt-BR/requirements.md)): ainda não há vocabulário que separe semelhança, possibilidade e divergência dentro de uma alegação de correspondência (FR-10); o PROV-O é um alinhamento, não um modelo formal de proveniência (NFR-03); o redirecionamento w3id não está registrado (NFR-02). A avaliação por especialistas e com casos reais segue o [protocolo de avaliação](../../docs/pt-BR/evaluation-protocol.md).

[← Releases](../README.md)
