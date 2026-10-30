[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/datatypes-and-validation.md)

# Tipos de dados e política de validação

| Propriedade | XSD | Observações |
|---|---|---|
| identifier | string | URI estável recomendada; ID local não é identidade no mundo |
| textValue | rdf:langString | etiquetas multilíngues via marcação de idioma RDF |
| selectorExpression | string | atalho compacto; prefira `hasSelector` com seletores W3C Web Annotation (oa:FragmentSelector, oa:TextQuoteSelector, oa:TextPositionSelector, oa:SvgSelector) |
| sourceURL | anyURI | endereço documental sem garantia de disponibilidade |
| issuedDate | date | data de publicação quando conhecida |
| retrievedAt | dateTime | proveniência de captura |
| confidenceScore | decimal | definido pela aplicação; não equivale a probabilidade sem calibração |
| isRequiredCondition | boolean | condição obrigatória vs contextual |
| languageTag | string | usar BCP 47, ex. en e pt-BR |
| versionLabel | string | etiqueta de versão da aplicação |

JSON Schema 2020-12 valida registros; SHACL valida dados RDF. OWL adota hipótese de mundo aberto, logo não impõe isoladamente campos obrigatórios típicos de banco de dados. A checagem `format: uri` requer ativação explícita no validador.

Metadados completos não significam confiabilidade da evidência.

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/datatypes-and-validation.md)
