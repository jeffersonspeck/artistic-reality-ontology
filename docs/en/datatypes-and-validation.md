[← Back to README](../../README.md) · [Português](../pt-BR/datatypes-and-validation.md)

# Datatypes and validation policy

| Property | XSD | Notes |
|---|---|---|
| identifier | string | stable URI recommended; local IDs are not world identity |
| textValue | rdf:langString | multilingual labels use RDF language tags where suitable |
| selectorExpression | string | compact shortcut; prefer `hasSelector` with W3C Web Annotation selectors (oa:FragmentSelector, oa:TextQuoteSelector, oa:TextPositionSelector, oa:SvgSelector) |
| sourceURL | anyURI | bibliographic URI; no guarantee of availability |
| issuedDate | date | publication date when known |
| retrievedAt | dateTime | capture provenance |
| confidenceScore | decimal | application-defined, never probability without calibration |
| isRequiredCondition | boolean | mandatory vs contextual pattern condition |
| languageTag | string | use BCP 47 values such as en, pt-BR |
| versionLabel | string | application-level label |

JSON Schema 2020-12 validates application records; SHACL targets RDF data. OWL uses open-world assumptions and therefore alone does not enforce database-like mandatory fields. JSON Schema sourceURI uses `format: uri`; validators must enable format checking explicitly.

Do not conflate metadata presence with evidential reliability.

---

[← Back to README](../../README.md) · [Português](../pt-BR/datatypes-and-validation.md)
