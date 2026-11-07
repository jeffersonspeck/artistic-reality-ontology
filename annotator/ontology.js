// Loads ontology/src/aro.ttl and model/conceptual-model.json and builds the indexes the
// annotator needs: class hierarchy, property domains/ranges, vocabularies and labels.
// N3 is the global provided by the N3.js browser bundle (see index.html).

export const NS = {
  aro: "https://w3id.org/aro/ontology#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  owl: "http://www.w3.org/2002/07/owl#",
  skos: "http://www.w3.org/2004/02/skos/core#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  sh: "http://www.w3.org/ns/shacl#",
  oa: "http://www.w3.org/ns/oa#",
  schema: "https://schema.org/",
  foaf: "http://xmlns.com/foaf/0.1/",
  prov: "http://www.w3.org/ns/prov#",
  dcterms: "http://purl.org/dc/terms/",
};

const RDF_TYPE = NS.rdf + "type";

// Accent colours of the packages (darker companions of the catalog's pastel colours)
const PACKAGE_ACCENTS = {
  artwork: "#2563eb", interpretation: "#7c3aed", representation: "#b45309",
  pattern: "#db2777", evidence: "#059669", derivation: "#ea580c",
};

/** Parse a Turtle string into an N3.Store. */
export function parseTurtle(text, baseIRI) {
  const store = new N3.Store();
  store.addQuads(new N3.Parser({ baseIRI }).parse(text));
  return store;
}

/** Literal values of subject/predicate grouped by lower-cased language tag (N3.js lower-cases tags), e.g. {en, "pt-br"}. */
function byLanguage(store, subject, predicate) {
  const out = {};
  for (const o of store.getObjects(subject, predicate, null)) {
    if (o.termType === "Literal") out[(o.language || "").toLowerCase()] = o.value;
  }
  return out;
}

/** Members of an RDF list starting at `head` (used for owl:unionOf). */
function listMembers(store, head) {
  const items = [];
  let node = head;
  while (node && node.value !== NS.rdf + "nil") {
    const first = store.getObjects(node, NS.rdf + "first", null)[0];
    if (first) items.push(first.value);
    node = store.getObjects(node, NS.rdf + "rest", null)[0];
  }
  return items;
}

/** A domain or range: a named class, or the members of an owl:unionOf blank node. */
function classRefs(store, term) {
  if (!term) return [];
  if (term.termType === "NamedNode") return [term.value];
  const union = store.getObjects(term, NS.owl + "unionOf", null)[0];
  return union ? listMembers(store, union) : [];
}

export class Ontology {
  constructor(store, catalog) {
    this.store = store;
    this.catalog = catalog;
    this.packages = catalog.packages;
    this.classes = {};       // IRI -> {iri, name, package, stereotype}
    this.parents = {};       // IRI -> [superclass IRIs]
    this.objectProps = {};   // IRI -> {iri, name, domain: [IRIs], range: [IRIs]}
    this.dataProps = {};     // IRI -> {iri, name, domain: [IRIs] | null, range: IRI}
    this.concepts = {};      // high-order class IRI -> [concept IRIs]

    for (const c of catalog.classes) {
      const iri = NS.aro + c.name;
      this.classes[iri] = { iri, name: c.name, package: c.package, stereotype: c.stereotype };
      this.parents[iri] = store.getObjects(iri, NS.rdfs + "subClassOf", null).map((o) => o.value);
    }
    for (const q of store.getQuads(null, RDF_TYPE, NS.owl + "ObjectProperty", null)) {
      const iri = q.subject.value;
      this.objectProps[iri] = {
        iri, name: iri.slice(NS.aro.length),
        domain: classRefs(store, store.getObjects(iri, NS.rdfs + "domain", null)[0]),
        range: classRefs(store, store.getObjects(iri, NS.rdfs + "range", null)[0]),
      };
    }
    for (const q of store.getQuads(null, RDF_TYPE, NS.owl + "DatatypeProperty", null)) {
      const iri = q.subject.value;
      const domain = store.getObjects(iri, NS.rdfs + "domain", null)[0];
      this.dataProps[iri] = {
        iri, name: iri.slice(NS.aro.length),
        domain: domain ? classRefs(store, domain) : null,
        range: store.getObjects(iri, NS.rdfs + "range", null)[0]?.value,
      };
    }
    // Vocabulary concepts are typed by their high-order class (e.g. aro:DerivationType)
    for (const iri of Object.keys(this.classes)) {
      if (this.classes[iri].stereotype === "type") {
        this.concepts[iri] = store.getSubjects(RDF_TYPE, iri, null).map((s) => s.value);
      }
    }
  }

  /** Human label of any ontology term in the requested language (falls back to en, then local name). */
  label(iri, lang) {
    const labels = { ...byLanguage(this.store, iri, NS.skos + "prefLabel"), ...byLanguage(this.store, iri, NS.rdfs + "label") };
    return labels[lang.toLowerCase()] || labels.en || localName(iri);
  }

  definition(iri, lang) {
    const defs = byLanguage(this.store, iri, NS.skos + "definition");
    const comments = byLanguage(this.store, iri, NS.rdfs + "comment");
    const l = lang.toLowerCase();
    return defs[l] || defs.en || comments[l] || comments.en || "";
  }

  /** Superclasses of a class, including itself. */
  ancestors(iri) {
    const seen = new Set();
    const stack = [iri];
    while (stack.length) {
      const c = stack.pop();
      if (seen.has(c)) continue;
      seen.add(c);
      stack.push(...(this.parents[c] || []));
    }
    return seen;
  }

  /** True if an individual with the given types belongs to class `target`. */
  isA(types, target) {
    return types.some((t) => this.ancestors(t).has(target));
  }

  /** Object properties whose domain accepts an individual with these types. */
  propertiesFor(types) {
    return Object.values(this.objectProps).filter((p) => p.domain.some((d) => this.isA(types, d)));
  }

  /** Datatype properties usable on an individual with these types (no domain = usable anywhere). */
  dataPropertiesFor(types) {
    return Object.values(this.dataProps).filter((p) => !p.domain || p.domain.some((d) => this.isA(types, d)));
  }

  /** A class and all its subclasses (direct or indirect). */
  withSubclasses(iri) {
    return Object.keys(this.classes).filter((c) => this.ancestors(c).has(iri));
  }

  /** Object properties whose range accepts an individual with these types (relations arriving at it). */
  propertiesTargeting(types) {
    return Object.values(this.objectProps).filter((p) => p.range.some((r) => this.isA(types, r)));
  }

  isVocabularyClass(iri) {
    return this.classes[iri]?.stereotype === "type";
  }

  isAgentClass(iri) {
    return this.classes[iri]?.stereotype === "roleMixin";
  }

  isConcept(iri) {
    return this.store.getQuads(iri, RDF_TYPE, NS.skos + "Concept", null).length > 0;
  }

  /** Types an ontology concept has (needed by validation for sh:class checks). */
  conceptTypes(iri) {
    return this.store.getObjects(iri, RDF_TYPE, null).map((o) => o.value);
  }

  packageOf(classIri) {
    return this.classes[classIri]?.package;
  }

  packageColor(pkg) {
    return this.packages.find((p) => p.name === pkg)?.color || "#e2e8f0";
  }

  /** Strong colour of a package, for text and accents on cards (the catalog colour is a pastel tint). */
  packageAccent(pkg) {
    return PACKAGE_ACCENTS[pkg] || "#475569";
  }

  /** IRI of a package's module (declared in the ontology with label and description). */
  moduleIri(pkg) {
    return `https://w3id.org/aro/ontology/module/${pkg}`;
  }

  /** Label of a package (module) in the interface language, read from the ontology. */
  packageLabel(pkg, lang) {
    return pkg ? this.label(this.moduleIri(pkg), lang) : "";
  }

  /** What a package (module) covers, read from the ontology (dcterms:description). */
  packageDescription(pkg, lang) {
    if (!pkg) return "";
    const d = byLanguage(this.store, this.moduleIri(pkg), NS.dcterms + "description");
    return d[lang.toLowerCase()] || d.en || "";
  }

  /** rdfs:comment of a term (for classes: OntoUML stereotype, UFO foundation, dependency). */
  comment(iri, lang) {
    const c = byLanguage(this.store, iri, NS.rdfs + "comment");
    return c[lang.toLowerCase()] || c.en || "";
  }

  /** Catalog entry of a class (stereotype), or null. */
  classInfo(iri) {
    return this.catalog.classes.find((c) => NS.aro + c.name === iri) || null;
  }

  /** What a relation is for: its skos:definition in the ontology. */
  relationDescription(iri, lang) {
    return this.definition(iri, lang);
  }
}

export function localName(iri) {
  const i = Math.max(iri.lastIndexOf("#"), iri.lastIndexOf("/"));
  return i >= 0 ? iri.slice(i + 1) : iri;
}

/** Fetch and index the ontology plus the catalog (for packages, colours and stereotypes). */
export async function loadOntology(ttlUrl, catalogUrl) {
  const [ttl, catalog] = await Promise.all([
    fetch(ttlUrl).then((r) => { if (!r.ok) throw new Error(ttlUrl); return r.text(); }),
    fetch(catalogUrl).then((r) => { if (!r.ok) throw new Error(catalogUrl); return r.json(); }),
  ]);
  const ontology = new Ontology(parseTurtle(ttl, NS.aro), catalog);
  ontology.ttlText = ttl;   // raw Turtle, loaded again by the SPARQL engine (queries.js)
  ontology.shapesText = await fetch("../validation/aro-shapes.ttl").then((r) => (r.ok ? r.text() : ""));
  return ontology;
}
