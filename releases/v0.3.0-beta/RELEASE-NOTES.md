[← Releases](../README.md)

# ARO 0.3.0-beta

🇺🇸 [English](#english) · 🇧🇷 [Português](#português)

## English

**SABiOx cycle 3 — beta, under development.** Claims share one abstraction, the UFO top level is revised, and artistic entities follow IFLA LRM. **Breaking changes** for 0.2 data: run `python scripts/migrate.py file.ttl` (the annotator converts older files when it opens them).

| | |
|---|---|
| Version IRI | `https://w3id.org/aro/ontology/0.3.0-beta` |
| Prior version | `https://w3id.org/aro/ontology/0.2.1-beta` |
| Files | `aro.ttl`, `aro.owl`, `aro.jsonld` (full ontology), `modules/<package>.ttl` (eight packages), `aro-shapes.ttl` (SHACL) |
| Size | 50 classes (7 «kind», 24 «subkind», 2 «category», 1 «collective», 2 «roleMixin», 4 «role», 3 «event», 1 «situation», 1 «relator», 5 «type»), 45 object properties, 15 datatype properties, 5 SKOS vocabularies |

**Main changes since 0.2**
- **One abstraction for claims (ADR-026):** `Claim` generalizes interpretations, derivations, correspondences, empirical claims, hypotheses and challenges; `producedByAct`, `hasJustification`, `citesSource`, `assessesClaim` and `challenges` replace nine kind-specific relations.
- **UFO top level (ADR-027):** analytical records are «subkind»s of one «kind», `AnalyticalRecord`; the categories `ArtisticEntity` and `Agent` replace union ranges; ultimate sortals are disjoint and abstract classes are disjoint unions, checked with an OWL RL reasoner.
- **IFLA LRM (ADR-028):** `Artwork` → `Expression` → `Manifestation` (optional) → `Selection`; the 0.2 `Manifestation` is now `Expression`.
- **Agents (ADR-029):** `Person` and `Collective` with the roles `PersonAnalyst`, `CollectiveAnalyst`, `PersonCreator`, `CollectiveCreator`; agents are still external IRIs.
- **Relator and time (ADR-030):** `contributionTo` gives `CreativeContribution` its second relatum; `startDate`/`endDate` date acts, events and situations.
- **Alignments (ADR-031):** W3C Web Annotation, PROV-O, LRMoo, schema.org, FOAF and Dublin Core, as `rdfs:seeAlso`.
- **Validation and queries:** OntoUML JSON export valid against the official OntoUML JSON Schema and well formed (0 errors; ADR-009, ADR-032); every competency question CQ-01–CQ-21 has a SPARQL query with expected answers tested; assessment outcomes and epistemic vs value criteria (ADR-033).
- **Tools and documentation:** migration script, agreement script, OntoUML verifier, evaluation protocol, updated annotator.

Full list: [CHANGELOG](../../CHANGELOG.md).

**Status:** beta. OntoUML model validated and verified automatically; layout and checks in an OntoUML editor still pending (ADR-009); expert and real-case evaluation planned in the [evaluation protocol](../../docs/en/evaluation-protocol.md).

## Português

**Ciclo SABiOx 3 — beta, em desenvolvimento.** As alegações compartilham uma abstração, o topo UFO foi revisto e as entidades artísticas seguem o IFLA LRM. **Mudanças incompatíveis** para dados 0.2: rode `python scripts/migrate.py arquivo.ttl` (o anotador converte arquivos antigos ao abri-los).

| | |
|---|---|
| IRI da versão | `https://w3id.org/aro/ontology/0.3.0-beta` |
| Versão anterior | `https://w3id.org/aro/ontology/0.2.1-beta` |
| Arquivos | `aro.ttl`, `aro.owl`, `aro.jsonld` (ontologia completa), `modules/<pacote>.ttl` (oito pacotes), `aro-shapes.ttl` (SHACL) |
| Tamanho | 50 classes (7 «kind», 24 «subkind», 2 «category», 1 «collective», 2 «roleMixin», 4 «role», 3 «event», 1 «situation», 1 «relator», 5 «type»), 45 propriedades de objeto, 15 propriedades de dados, 5 vocabulários SKOS |

**Principais mudanças desde a 0.2**
- **Uma abstração para alegações (ADR-026):** `Claim` generaliza interpretações, derivações, correspondências, afirmações empíricas, hipóteses e contestações; `producedByAct`, `hasJustification`, `citesSource`, `assessesClaim` e `challenges` substituem nove relações específicas.
- **Topo UFO (ADR-027):** registros analíticos são «subkind»s de um único «kind», `AnalyticalRecord`; as categorias `ArtisticEntity` e `Agent` substituem imagens em união; sortais últimos são disjuntos e classes abstratas são uniões disjuntas, verificados com um raciocinador OWL RL.
- **IFLA LRM (ADR-028):** `Artwork` → `Expression` → `Manifestation` (opcional) → `Selection`; a `Manifestation` da 0.2 agora é `Expression`.
- **Agentes (ADR-029):** `Person` e `Collective` com os papéis `PersonAnalyst`, `CollectiveAnalyst`, `PersonCreator`, `CollectiveCreator`; agentes continuam IRIs externos.
- **Relator e tempo (ADR-030):** `contributionTo` dá a `CreativeContribution` seu segundo relatum; `startDate`/`endDate` datam atos, eventos e situações.
- **Alinhamentos (ADR-031):** W3C Web Annotation, PROV-O, LRMoo, schema.org, FOAF e Dublin Core, como `rdfs:seeAlso`.
- **Validação e consultas:** exportação OntoUML JSON válida no JSON Schema oficial da OntoUML e bem formada (0 erros; ADR-009, ADR-032); toda questão de competência CQ-01–CQ-21 tem consulta SPARQL com respostas esperadas testadas; resultado das avaliações e critérios epistêmicos vs de valor (ADR-033).
- **Ferramentas e documentação:** script de migração, script de concordância, verificador OntoUML, protocolo de avaliação, anotador atualizado.

Lista completa: [CHANGELOG](../../CHANGELOG.md).

**Status:** beta. Modelo OntoUML validado e verificado automaticamente; falta diagramar e verificar num editor OntoUML (ADR-009); avaliação por especialistas e com casos reais planejada no [protocolo de avaliação](../../docs/pt-BR/evaluation-protocol.md).
