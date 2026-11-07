// Cross-check of the OntoUML export with the official ontouml-js library (ADR-009, ADR-032).
// Same rules as scripts/verify_ontouml.py, evaluated with the library's own classification
// of stereotypes (identity providers, rigidity, sortality, allowed stereotypes per relation).
//
//   npm install --prefix .ontouml ontouml-js@1.0.0
//   NODE_PATH=.ontouml/node_modules node scripts/verify_ontouml.mjs model/ontouml/aro.ontouml.json
//
// ("ontouml-js" is not a dependency of the repository; the folder .ontouml is git-ignored.)
import fs from "node:fs";
import * as O from "ontouml-js";

const file = process.argv[2];
const text = fs.readFileSync(file, "utf8");
O.serializationUtils?.validate?.(text);
const project = O.serializationUtils?.parse ? O.serializationUtils.parse(text) : O.parse(text);
const classes = project.getAllClasses ? project.getAllClasses() : project.classes;
const relations = project.getAllBinaryRelations ? project.getAllBinaryRelations() : project.binaryRelations;
const name = (c) => (c?.getName ? c.getName() : c?.name?.en) || c?.id;
const errors = [], warnings = [];

for (const c of classes) {
  const st = c.stereotype;
  if (!st) { errors.push(`${name(c)}: no stereotype`); continue; }
  const allowed = c.getAllowedStereotypes?.();
  if (allowed && !allowed.includes(st)) errors.push(`${name(c)}: stereotype «${st}» not allowed for its nature ${JSON.stringify(c.restrictedTo)} (allowed: ${allowed.join(", ")})`);
  if (c.isSortal() && !c.isIdentityProvider()) {
    const ids = c.getIdentityProviderAncestors();
    if (ids.length !== 1) errors.push(`${name(c)}: sortal must specialize exactly one identity provider (ultimate sortal), found ${ids.length}: ${ids.map(name).join(", ")}`);
  }
  if (c.isIdentityProvider() && c.getIdentityProviderAncestors().length > 0)
    errors.push(`${name(c)}: an ultimate sortal cannot specialize another (${c.getIdentityProviderAncestors().map(name).join(", ")})`);
  if (c.isRigid() || c.isSemiRigid()) {
    const ar = c.getAntiRigidAncestors();
    if (ar.length) errors.push(`${name(c)}: rigid type specializes anti-rigid ${ar.map(name).join(", ")}`);
  }
  if (c.isNonSortal()) {
    const s = c.getSortalAncestors();
    if (s.length) errors.push(`${name(c)}: non-sortal specializes sortal ${s.map(name).join(", ")}`);
    if (!c.isAbstract) warnings.push(`${name(c)}: non-sortal should be abstract`);
    if (c.getSortalDescendants().length === 0) errors.push(`${name(c)}: non-sortal without sortal specializations`);
  }
  if (c.isRole() || c.isRoleMixin()) {
    // a role (mixin) needs a relational dependency, declared on it or on an ancestor
    const own = [c, ...(c.getAncestors ? c.getAncestors() : [])];
    const dep = relations.some((r) => own.some((k) => r.getSourceAsClass?.() === k || r.getTargetAsClass?.() === k)
      && (r.isMediation() || r.isParticipation() || r.isExternalDependence?.() || r.stereotype === "material" || r.stereotype === null));
    if (!dep) errors.push(`${name(c)}: role without relational dependency`);
  }
  if (c.isEventType?.() && c.getAncestors?.().some((a) => a.isEndurantType?.()))
    errors.push(`${name(c)}: event type specializes an endurant type`);
}

for (const r of relations) {
  const s = r.getSourceAsClass(), t = r.getTargetAsClass();
  const label = `${name(s)} —${r.stereotype ? "«" + r.stereotype + "» " : ""}${name(r)}→ ${name(t)}`;
  const allowed = r.getAllowedStereotypes?.();
  if (r.stereotype && allowed && !allowed.includes(r.stereotype))
    errors.push(`${label}: stereotype not allowed between these classes (allowed: ${allowed.join(", ")})`);
  if (!r.stereotype) warnings.push(`${label}: no relation stereotype`);
}

// relators must mediate at least two entities (sum of lower bounds of mediated ends >= 2)
for (const c of classes.filter((c) => c.isRelator())) {
  const meds = relations.filter((r) => r.isMediation() && (r.getSourceAsClass() === c));
  const lower = meds.reduce((n, r) => n + (parseInt(String(r.targetEnd.cardinality?.value ?? r.targetEnd.cardinality).split("..")[0], 10) || 0), 0);
  if (lower < 2) errors.push(`${name(c)}: relator mediates fewer than two entities (lower bounds sum ${lower})`);
}

console.log(JSON.stringify({ classes: classes.length, relations: relations.length, errors, warnings }, null, 2));
process.exit(errors.length ? 1 : 0);
