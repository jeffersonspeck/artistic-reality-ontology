[← Releases](../README.md)

# ARO 0.2.0-beta

🇺🇸 [English](#english) · 🇧🇷 [Português](#português)

## English

**SABiOx cycle 2 — beta, under development.** Derivation between works, explained claims, annotator support and a single source of truth.

| | |
|---|---|
| Version IRI | `https://w3id.org/aro/ontology/0.2.0-beta` |
| Prior version | `https://w3id.org/aro/ontology/0.1.0` |
| Files | `aro.ttl`, `aro.owl`, `aro.jsonld` (full ontology), `modules/<package>.ttl` (one per package), `aro-shapes.ttl` (SHACL) |
| Size | 36 classes, 49 object properties, 5 SKOS vocabularies (40 derivation types, 4 regimes, 56 dimensions, 5 operations, 10 roles) |

**Main changes since 0.1.0**
- **Derivation module:** `DerivationClaim` with anchors at artwork, manifestation or selection level, `TransformationAspect` (dimension + operation), creative acts and roles. Literature-grounded types and regimes.
- **Explained claims:** derivations are represented with justifications, sources and evidence assessments; legality and originality are out of scope.
- **Agents from external ontologies:** `Analyst` and `CreativeAgent` are «roleMixin»s.
- **W3C Web Annotation selectors** for selections; `aro:externalLink` for consultable links.
- **Language policy:** English IRIs, full en/pt-BR labels, definitions and comments; multilingual content (`rdf:langString`).
- **Versioning:** `owl:versionIRI` and `owl:priorVersion`; ontology in `ontology/src/`, releases in `releases/`.
- **Tooling:** generator, SHACL validation and query scripts, web annotator, case studies (*Homem na Estrada*, *Vidas Secas*) with research-question queries.

Full list: [CHANGELOG](../../CHANGELOG.md).

**Status:** beta. Terms may still change; OntoUML stereotypes are provisional; no expert or real-case evaluation yet.

## Português

**Ciclo SABiOx 2 — beta, em desenvolvimento.** Derivação entre obras, alegações explicadas, suporte ao anotador e fonte única de verdade.

| | |
|---|---|
| IRI da versão | `https://w3id.org/aro/ontology/0.2.0-beta` |
| Versão anterior | `https://w3id.org/aro/ontology/0.1.0` |
| Arquivos | `aro.ttl`, `aro.owl`, `aro.jsonld` (ontologia completa), `modules/<pacote>.ttl` (um por pacote), `aro-shapes.ttl` (SHACL) |
| Tamanho | 36 classes, 49 propriedades de objeto, 5 vocabulários SKOS (40 tipos de derivação, 4 regimes, 56 dimensões, 5 operações, 10 papéis) |

**Principais mudanças desde a 0.1.0**
- **Módulo de derivação:** `DerivationClaim` com âncoras em nível de obra, manifestação ou recorte, `TransformationAspect` (dimensão + operação), atos e papéis criativos. Tipos e regimes fundamentados na literatura.
- **Alegações explicadas:** derivações são representadas com justificativas, fontes e avaliações de evidência; legalidade e originalidade estão fora do escopo.
- **Agentes de ontologias externas:** `Analyst` e `CreativeAgent` são «roleMixin»s.
- **Seletores W3C Web Annotation** para recortes; `aro:externalLink` para links de consulta.
- **Política de idioma:** IRIs em inglês, rótulos, definições e comentários completos em en/pt-BR; conteúdo multilíngue (`rdf:langString`).
- **Versionamento:** `owl:versionIRI` e `owl:priorVersion`; ontologia em `ontology/src/`, versões em `releases/`.
- **Ferramentas:** gerador, scripts de validação SHACL e consultas, anotador web, estudos de caso (*Homem na Estrada*, *Vidas Secas*) com consultas das questões de pesquisa.

Lista completa: [CHANGELOG](../../CHANGELOG.md).

**Status:** beta. Os termos ainda podem mudar; os estereótipos OntoUML são provisórios; ainda sem avaliação por especialistas ou com casos reais.
