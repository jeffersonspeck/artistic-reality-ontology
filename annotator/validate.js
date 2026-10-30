// Light, in-browser checks driven by validation/aro-shapes.ttl. They cover the
// constraints most useful while annotating (cardinality, sh:class, sh:nodeKind,
// language-tagged text) plus the two derivation-anchor SPARQL rules. Complete SHACL
// validation remains `python scripts/validate.py` (pyshacl).

import { NS, parseTurtle } from "./ontology.js";

const SH = NS.sh;
const RDF_TYPE = NS.rdf + "type";
const ANCHOR_CLASSES = [NS.aro + "Artwork", NS.aro + "Manifestation", NS.aro + "Selection"];

/** Read property shapes: [{target, targetSubjectsOf, path, min, max, cls, nodeKind, datatype, message}]. */
export function readShapes(text) {
  if (!text) return [];
  const g = parseTurtle(text, NS.aro);
  const one = (s, p) => g.getObjects(s, SH + p, null)[0]?.value;
  const shapes = [];
  for (const node of g.getSubjects(RDF_TYPE, SH + "NodeShape", null)) {
    const target = one(node, "targetClass");
    const targetSubjectsOf = one(node, "targetSubjectsOf");
    for (const ps of g.getObjects(node, SH + "property", null)) {
      const messages = {};
      for (const m of g.getObjects(ps, SH + "message", null)) messages[m.language.toLowerCase()] = m.value;
      shapes.push({
        target, targetSubjectsOf, messages,
        path: one(ps, "path"),
        min: one(ps, "minCount") !== undefined ? Number(one(ps, "minCount")) : null,
        max: one(ps, "maxCount") !== undefined ? Number(one(ps, "maxCount")) : null,
        cls: one(ps, "class"), nodeKind: one(ps, "nodeKind"), datatype: one(ps, "datatype"),
      });
    }
  }
  return shapes;
}

/** Return a list of {node, message} problems for the current data. */
export function validate(data, ontology, lang) {
  const shapes = ontology._shapes || (ontology._shapes = readShapes(ontology.shapesText));
  const store = data.store;
  const typesOf = (iri) => {
    const own = store.getObjects(iri, RDF_TYPE, null).map((o) => o.value);
    return own.length ? own : ontology.conceptTypes(iri);   // vocabulary concepts live in the ontology
  };
  const short = (iri) => iri.replace(NS.aro, "aro:");
  const problems = [];

  for (const shape of shapes) {
    // Focus nodes: instances of the target class (with subclasses), or subjects of a property
    let focus = [];
    if (shape.target) {
      focus = data.nodes().filter((n) => ontology.isA(store.getObjects(n, RDF_TYPE, null).map((o) => o.value), shape.target));
    } else if (shape.targetSubjectsOf) {
      focus = store.getSubjects(shape.targetSubjectsOf, null, null).map((s) => s.value);
    }
    for (const n of focus) {
      const values = store.getObjects(n, shape.path, null);
      const where = short(shape.path);
      if (shape.min !== null && values.length < shape.min)
        problems.push({ node: n, message: `${where}: ${lang === "pt-BR" ? "mínimo" : "minimum"} ${shape.min}` });
      if (shape.max !== null && values.length > shape.max)
        problems.push({ node: n, message: `${where}: ${lang === "pt-BR" ? "máximo" : "maximum"} ${shape.max}` });
      for (const v of values) {
        if (shape.cls && !(v.termType === "NamedNode" && ontology.isA(typesOf(v.value), shape.cls)))
          problems.push({ node: n, message: `${where} → ${short(shape.cls)}` });
        if (shape.nodeKind === SH + "IRI" && v.termType !== "NamedNode")
          problems.push({ node: n, message: `${where}: IRI` });
        if (shape.datatype === NS.rdf + "langString" && !(v.termType === "Literal" && v.language))
          problems.push({ node: n, message: shape.messages[lang.toLowerCase()] || shape.messages.en || `${where}: language tag` });
      }
    }
  }

  // SHACL-SPARQL rules of DerivationClaim, re-implemented here
  for (const claim of data.nodes().filter((n) => data.types(n).includes(NS.aro + "DerivationClaim"))) {
    const src = store.getObjects(claim, NS.aro + "hasSourceAnchor", null).map((o) => o.value);
    const der = store.getObjects(claim, NS.aro + "hasDerivedAnchor", null).map((o) => o.value);
    for (const a of [...src, ...der]) {
      if (!ANCHOR_CLASSES.some((c) => ontology.isA(data.types(a), c)))
        problems.push({ node: claim, message: lang === "pt-BR"
          ? "As âncoras da derivação devem ser Artwork, Manifestation ou Selection."
          : "Derivation anchors must be an Artwork, Manifestation or Selection." });
    }
    if (src.some((s) => der.includes(s)))
      problems.push({ node: claim, message: lang === "pt-BR"
        ? "As âncoras de origem e derivada devem ser diferentes." : "Source and derived anchors must differ." });
  }
  return problems;
}
