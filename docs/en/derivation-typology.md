[← Back to README](../../README.md) · [Português](../pt-BR/derivation-typology.md)

# Derivation typology: grounding and review

The full concept list (definitions and literature per concept) is generated in [reference-model.md](reference-model.md#controlled-vocabularies-skos). This document explains **why** the typology has its shape. The Portuguese version ([pt-BR](../pt-BR/derivation-typology.md)) is the primary text and carries the full bibliography.

## Three combined traditions

| Tradition | Question answered | Use in ARO |
|---|---|---|
| Poetics — Genette (1982) | *How* does one text relate to another? Copresence (intertextuality: quotation, allusion, plagiarism) vs hypertextual derivation by **transformation** or **imitation**, each in a playful, satirical or serious regime. | Families *Incorporation*, *Transformation*, *Imitation*; separate **regime** axis. |
| Library science — Tillett (1991), Smiraglia (2001), IFLA LRMoo (2024) | Is the derivative the *same work* in a new expression or a *new work*? Derivative relationships (editions, translations, amplifications, extractions, adaptations, performances) and sequential ones. | Families *Re-realization* and *Extension*; derivation level via anchors (ADR-012). |
| Medium-specific — Burkholder (1994) music; Rajewsky (2005) intermediality; Hutcheon (1985, 2006); Schloss (2004), Navas (2012) sampling/remix; Mosser (2008), Mag Uidhir, Magnus & Magnus (2013) covers; Verevis (2006) remakes; Jenkins (1992) fan works | Which concrete procedures occur in each medium? | Specific concepts (sampling, interpolation, paraphrase, medley, ekphrasis, remake, crossover…). |

Families organize navigation; they are not disjoint classes. One claim may carry several types.

## Review in v0.2

- `Parody` moved from *Imitation* to *Transformation* (Genette; Hutcheon).
- `Allusion` moved from *Imitation* to *Incorporation* (Genette's intertextuality).
- `Homage` removed as a type and replaced by the orthogonal `DerivationRegime` axis (playful, satirical/critical, serious, reverential) with `hasRegime`.
- *Material reuse* renamed *Incorporation / copresence*; added unacknowledged borrowing (Genette's "plagiat", descriptive), paraphrase, medley, collage/mashup, appropriation, ekphrasis.
- Added `Performance` (with `CoverVersion` beneath it), `Revision`, `Abridgment`, `Amplification`, `Remake`, `Travesty`, `Caricature`, `SeriousImitation` (*forgerie*, not fraud), `Variation`, `Sequel`, `Prequel`, `SpinOff`, `Crossover`.
- `FanWork` is kept, but annotators should also type its mechanism (Jenkins: fan work is defined by production context).

Resolved points: `Remix` is split after Navas (2012) into `ExtendedRemix` (re-realization) and `Remix` (selective/reflexive, incorporation); "plagiarism" is named `UnacknowledgedBorrowing`. Legality and originality are outside the scope of the ontology (ADR-014): remixers, cover artists, translators and adapters are represented as creators in their own right, and each derivation is represented with its explanation (`hasJustification`, `citesSource`, assessments via `assessesClaim`).

## Dimensions for the annotator

56 dimensions in 7 families (narrative, verbal, music and sound, visual, audiovisual, cross-media, paratext), linked by `skos:broader` so an annotator can offer per-medium lists. Use the most specific concept available.

## Annotator format

`schemas/derivation-annotation.schema.json` is generated from the vocabularies, so types, regimes, dimensions and operations only accept existing concepts. Selection-level anchors require a W3C Web Annotation selector. Example: `examples/synthetic-derivation-annotation.json`.

## Agents

`CreativeAgent` and `Analyst` are «roleMixin»s: persons and collectives are represented by external ontologies, not by ARO. Any agent IRI from another ontology (PROV-O, FOAF, schema.org, Wikidata) may be used with `contributionBy`; an RDFS reasoner classifies it as `CreativeAgent` from the `rdfs:range`. SHACL only requires an IRI.

---

[← Back to README](../../README.md) · [Português](../pt-BR/derivation-typology.md)
