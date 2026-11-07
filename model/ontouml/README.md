# OntoUML exchange file

- `aro.ontouml.json` — the ARO model as an OntoUML project (classes, generalizations and associations with their stereotypes and multiplicities), **generated** by `scripts/build.py` from `model/conceptual-model.json`. Datatype attributes and external classes (`oa:Selector`) are not part of it.
- `ontouml-schema-1.0.2.json` — the official [OntoUML JSON Schema](https://w3id.org/ontouml/schema) 1.0.2, copied unchanged from the npm package `ontouml-schema` (OntoUML project, Apache License 2.0, https://github.com/OntoUML/ontouml-schema), used to validate the export.

Check both with:

```bash
python scripts/verify_ontouml.py --warnings
```

The OntoUML JSON can be imported by OntoUML tools that read this schema (e.g. the OntoUML server and the Visual Paradigm plugin) for diagram layout and further verification.
