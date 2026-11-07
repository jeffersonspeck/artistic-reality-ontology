[← Back to README](../README.md) · [← Voltar para o LEIA-ME](../LEIA-ME.md)

# Releases / Versões

Each folder is a **frozen** version of the ontology: it is never changed after publication, so it can be cited and compared. The current version lives in [`ontology/src/`](../ontology/src/).

Cada pasta é uma versão **congelada** da ontologia: nunca é alterada depois de publicada, para poder ser citada e comparada. A versão atual fica em [`ontology/src/`](../ontology/src/).

| Version / Versão | Date / Data | Status | Version IRI | Notes / Notas |
|---|---|---|---|---|
| [v1.0.0](v1.0.0/) | 2026-11-07 | stable / estável | `https://w3id.org/aro/ontology/1.0.0` | [RELEASE-NOTES](v1.0.0/RELEASE-NOTES.md) |
| [v0.3.0-beta](v0.3.0-beta/) | 2026-11-06 | beta · superseded / substituída | `https://w3id.org/aro/ontology/0.3.0-beta` | [RELEASE-NOTES](v0.3.0-beta/RELEASE-NOTES.md) |
| [v0.2.1-beta](v0.2.1-beta/) | 2026-11-06 | beta · superseded / substituída | `https://w3id.org/aro/ontology/0.2.1-beta` | [RELEASE-NOTES](v0.2.1-beta/RELEASE-NOTES.md) |
| [v0.2.0-beta](v0.2.0-beta/) | 2026-10-30 | beta · superseded / substituída | `https://w3id.org/aro/ontology/0.2.0-beta` | [RELEASE-NOTES](v0.2.0-beta/RELEASE-NOTES.md) |
| [v0.1.0](v0.1.0/) | 2026-10-30 | baseline / linha de base | `https://w3id.org/aro/ontology/0.1.0` | [RELEASE-NOTES](v0.1.0/RELEASE-NOTES.md) |

## Files in a release / Arquivos de uma versão

| File / Arquivo | Content / Conteúdo |
|---|---|
| `aro.ttl`, `aro.owl`, `aro.jsonld` | full ontology in Turtle, RDF/XML and JSON-LD / ontologia completa em Turtle, RDF/XML e JSON-LD |
| `modules/<package>.ttl` | one module per package (from 0.2.0-beta) / um módulo por pacote (a partir da 0.2.0-beta) |
| `aro-shapes.ttl` | SHACL constraints of that version / restrições SHACL daquela versão |
| `RELEASE-NOTES.md` | what changed, in English and Portuguese / o que mudou, em inglês e português |

## Making a release / Publicar uma versão

```bash
python scripts/build.py --release
```

The command:
1. checks that the generated files are up to date;
2. copies `ontology/src/` and the SHACL shapes into `releases/v<version>/`;
3. creates a `RELEASE-NOTES.md` template.

It refuses to overwrite an existing release. To publish a new one, first change `version` (and `ontology.prior_version`) in `model/conceptual-model.json`, run `python scripts/build.py`, then `--release`.

O comando:
1. confere se os arquivos gerados estão atualizados;
2. copia `ontology/src/` e as formas SHACL para `releases/v<versão>/`;
3. cria um modelo de `RELEASE-NOTES.md`.

Ele recusa sobrescrever uma versão existente. Para publicar uma nova, mude primeiro `version` (e `ontology.prior_version`) em `model/conceptual-model.json`, rode `python scripts/build.py` e depois `--release`.
