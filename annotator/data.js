// The user's annotations: an N3.Store holding only instance data (never the ontology).
// Provides node creation, literals, relations, Turtle import/export and labels.

import { NS, localName, parseTurtle } from "./ontology.js";

const { namedNode, literal, quad } = N3.DataFactory;
const RDF_TYPE = NS.rdf + "type";

// Prefixes written in saved Turtle files
const PREFIXES = {
  aro: NS.aro, oa: NS.oa, schema: NS.schema, foaf: NS.foaf, prov: NS.prov,
  rdf: NS.rdf, rdfs: NS.rdfs, xsd: NS.xsd, dcterms: NS.dcterms,
};

// Properties read as a display name for external agents and other resources
// (selections usually have no name, so their selector expression - e.g. "lines 28-30" - is used)
const NAME_PROPERTIES = [NS.schema + "name", NS.foaf + "name", NS.rdfs + "label", NS.aro + "textValue", NS.aro + "selectorExpression"];

// ------------------------------------------------------------------ migration from ARO 0.2
// Same rules as scripts/migrate.py: renames of 0.3 (Claim, IFLA LRM levels) applied to the
// text before parsing, then each CreativeContribution gets the entities its act produced.
const RENAMES = [
  ["hasManifestation", "hasExpression"], ["Manifestation", "Expression"],
  ["InterpretiveJustification", "Justification"], ["InterpretationChallenge", "Challenge"],
  ["InterpretationAssessment", "CriteriaAssessment"], ["claimProducedByAct", "producedByAct"],
  ["derivationJustifiedBy", "hasJustification"], ["derivationReferencesSource", "citesSource"],
  ["referencesSource", "citesSource"], ["caseHasReference", "citesSource"],
  ["assessesCorrespondence", "assessesClaim"], ["assessesInterpretation", "assessesClaim"],
  ["assessesDerivation", "assessesClaim"], ["supportsClaim", "assessesClaim"],
];
const NEW_TERMS = ["Expression", "hasExpression", "embodiesExpression", "contributionTo", "assessesClaim", "Claim", "Challenge"];
const LRM_RENAMES = new Set(["hasManifestation", "Manifestation"]);
const term = (name) => new RegExp(String.raw`(aro:|<https://w3id\.org/aro/ontology#)` + name + String.raw`(?=[\s;,.>)\]]|$)`, "gm");

/** Rewrite 0.2 terms as 0.3 ones; returns {text, changed}. */
export function migrateText(text) {
  const current = NEW_TERMS.some((t) => term(t).test(text));
  let out = text;
  for (const [oldName, newName] of RENAMES) {
    if (current && LRM_RENAMES.has(oldName)) continue;   // already 0.3: these are the LRM terms
    out = out.replace(term(oldName), (_, prefix) => prefix + newName);
  }
  return { text: out, changed: out !== text };
}

export class Data {
  constructor(base = "https://example.org/my-project/") {
    this.base = base;
    this.store = new N3.Store();
  }

  // ---------------------------------------------------------------- nodes
  /** Create an individual of `classIri`, named in `lang`; returns its IRI. */
  createNode(classIri, name, lang) {
    const iri = this.freshIri(name || localName(classIri));
    this.store.addQuad(quad(namedNode(iri), namedNode(RDF_TYPE), namedNode(classIri)));
    if (name) this.addText(iri, NS.aro + "textValue", name, lang);
    return iri;
  }

  /** A new IRI under the base, derived from a readable slug and unique in the store. */
  freshIri(name) {
    const slug = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "node";
    let iri = this.base + slug;
    for (let i = 2; this.store.countQuads(namedNode(iri), null, null, null) > 0; i++) iri = `${this.base}${slug}-${i}`;
    return iri;
  }

  types(iri) {
    return this.store.getObjects(namedNode(iri), namedNode(RDF_TYPE), null).map((o) => o.value);
  }

  addType(iri, typeIri) {
    this.store.addQuad(quad(namedNode(iri), namedNode(RDF_TYPE), namedNode(typeIri)));
  }

  /** Every IRI that appears as subject or object of a relation (graph nodes). */
  nodes() {
    const set = new Set();
    for (const q of this.store.getQuads(null, null, null, null)) {
      if (q.subject.termType === "NamedNode") set.add(q.subject.value);
      if (q.object.termType === "NamedNode" && q.predicate.value !== RDF_TYPE) set.add(q.object.value);
    }
    return [...set];
  }

  /** Remove a node and every triple that mentions it. */
  deleteNode(iri) {
    const n = namedNode(iri);
    this.store.removeQuads(this.store.getQuads(n, null, null, null));
    this.store.removeQuads(this.store.getQuads(null, null, n, null));
  }

  // ---------------------------------------------------------------- literals
  /** Add a language-tagged text (aro:textValue, aro:derivationExtent...). */
  addText(iri, prop, value, lang) {
    this.store.addQuad(quad(namedNode(iri), namedNode(prop), literal(value, lang)));
  }

  /** Add a typed literal (e.g. an xsd:anyURI link, an oa:value). */
  addTyped(iri, prop, value, datatypeIri) {
    const lit = datatypeIri && datatypeIri !== NS.xsd + "string" ? literal(value, namedNode(datatypeIri)) : literal(value);
    this.store.addQuad(quad(namedNode(iri), namedNode(prop), lit));
  }

  /** Literal statements of a node: [{prop, value, lang, datatype, quad}]. */
  literals(iri) {
    return this.store.getQuads(namedNode(iri), null, null, null)
      .filter((q) => q.object.termType === "Literal")
      .map((q) => ({ prop: q.predicate.value, value: q.object.value, lang: q.object.language,
                     datatype: q.object.datatype?.value, quad: q }));
  }

  removeQuad(q) {
    this.store.removeQuad(q);
  }

  // ---------------------------------------------------------------- relations
  link(s, p, o) {
    this.store.addQuad(quad(namedNode(s), namedNode(p), namedNode(o)));
  }

  /** Outgoing object relations: [{prop, target, quad}] (rdf:type excluded). */
  outgoing(iri) {
    return this.store.getQuads(namedNode(iri), null, null, null)
      .filter((q) => q.object.termType === "NamedNode" && q.predicate.value !== RDF_TYPE)
      .map((q) => ({ prop: q.predicate.value, target: q.object.value, quad: q }));
  }

  incoming(iri) {
    return this.store.getQuads(null, null, namedNode(iri), null)
      .filter((q) => q.predicate.value !== RDF_TYPE)
      .map((q) => ({ prop: q.predicate.value, source: q.subject.value, quad: q }));
  }

  // ---------------------------------------------------------------- display
  /** Display name: a name/text in the preferred language, then any language, then the local name. */
  name(iri, lang) {
    for (const p of NAME_PROPERTIES) {
      const lits = this.store.getObjects(namedNode(iri), namedNode(p), null).filter((o) => o.termType === "Literal");
      // N3.js lower-cases language tags, so compare case-insensitively
      const hit = lits.find((o) => o.language === lang.toLowerCase()) || lits.find((o) => o.language === "en") || lits[0];
      if (hit) return hit.value;
    }
    return null;
  }

  // ---------------------------------------------------------------- files
  /** Serialize the annotations as Turtle (returns a Promise<string>). */
  toTurtle() {
    return new Promise((resolve, reject) => {
      const writer = new N3.Writer({ prefixes: { ...PREFIXES, ex: this.base } });
      writer.addQuads(this.store.getQuads(null, null, null, null));
      // N3.js lower-cases language tags; restore the conventional case of regions (pt-br -> pt-BR)
      const canonical = (ttl) => ttl.replace(/"@([a-z]{2,3})-([a-z]{2})\b/g, (_, l, r) => `"@${l}-${r.toUpperCase()}`);
      writer.end((err, result) => (err ? reject(err) : resolve(
        "# ARO annotations. Validate with: python scripts/validate.py <this-file>.ttl\n" + canonical(result))));
    });
  }

  /** Replace the current data with the content of a Turtle file. */
  loadTurtle(text) {
    const migrated = migrateText(text);
    const store = parseTurtle(migrated.text, this.base);
    this.store = store;
    const completed = this.addContributionTargets();
    this.migrated = migrated.changed || completed;
    // Reuse the dominant namespace of the loaded subjects as the base for new nodes
    const first = store.getSubjects(namedNode(RDF_TYPE), null, null).find((s) => s.termType === "NamedNode");
    if (first) {
      const iri = first.value;
      this.base = iri.slice(0, Math.max(iri.lastIndexOf("/"), iri.lastIndexOf("#")) + 1) || this.base;
    }
    return store.size;
  }

  /** Relator's second end (0.3): each contribution is to what its creative act produced. */
  addContributionTargets() {
    const A = NS.aro;
    let added = false;
    for (const c of this.store.getSubjects(namedNode(RDF_TYPE), namedNode(A + "CreativeContribution"), null)) {
      if (this.store.countQuads(c, namedNode(A + "contributionTo"), null, null)) continue;
      for (const act of this.store.getSubjects(namedNode(A + "hasContribution"), c, null)) {
        for (const t of this.store.getObjects(act, namedNode(A + "producesCreation"), null)) {
          this.store.addQuad(quad(c, namedNode(A + "contributionTo"), t));
          added = true;
        }
      }
    }
    return added;
  }

  clear() {
    this.store = new N3.Store();
  }
}
