[← Back to README](../README.md) · [← Voltar para o LEIA-ME](../LEIA-ME.md)

# OntoUML

| File | Content |
|---|---|
| [`model/conceptual-model.json`](conceptual-model.json) | ARO catalog (classes, stereotypes, relations, vocabularies); every artifact is generated from it by `scripts/build.py` |
| [`model/ontouml/aro.ontouml.json`](ontouml/aro.ontouml.json) | OntoUML exchange file in the official OntoUML JSON format (schema 1.0.2), generated from the catalog |
| [`model/diagrams/ontouml/`](diagrams/ontouml/) | OntoUML class diagrams (DOT, SVG, PNG), generated from the catalog |

The exchange file is valid against the OntoUML JSON Schema and well formed: `python scripts/verify_ontouml.py` reports 0 errors, and `scripts/verify_ontouml.mjs` gives the same result with the official ontouml-js 1.0.0 library. The 33 warnings are associations between information objects that keep no relation stereotype (ADR-032).

Diagrams and modelling choices: [docs/en/ontouml.md](../docs/en/ontouml.md) · [docs/pt-BR/ontouml.md](../docs/pt-BR/ontouml.md).

---

O arquivo de intercâmbio é válido no OntoUML JSON Schema e bem formado: `python scripts/verify_ontouml.py` relata 0 erros, e `scripts/verify_ontouml.mjs` dá o mesmo resultado com a biblioteca oficial ontouml-js 1.0.0. Os 33 avisos são associações entre objetos informacionais sem estereótipo de relação (ADR-032).

[← Back to README](../README.md) · [← Voltar para o LEIA-ME](../LEIA-ME.md)
