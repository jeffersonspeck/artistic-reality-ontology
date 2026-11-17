// Creation dialog: "Create node". Everything it offers comes from the ontology.
//
//   1. What to create  - from a node, only the relations its class allows (children: this ->
//                        relation -> new; parents: new -> relation -> this) and the classes that
//                        may fill them; without a node, every class that can be instantiated.
//   2. Fill in         - the text of the node, then what the ontology REQUIRES for it to exist
//                        (sh:minCount in validation/aro-shapes.ttl): each requirement is filled by
//                        an existing compatible node, a vocabulary concept, an agent, or a new
//                        node, which in turn shows its own requirements. Optional data (dates,
//                        confidence, outcome...) can be given now; other relations later.
//
// "Create" stays disabled until every requirement is met. The new nodes are then checked with
// the same rules as Analysis > Validate; if the ontology rejects them, nothing is kept.

import { NS, localName } from "./ontology.js";
import { t, uiLanguage } from "./i18n.js";
import { validate } from "./validate.js";

const MAX_DEPTH = 3;
const GUIDE = "https://github.com/jeffersonspeck/artistic-reality-ontology/blob/main/docs/";   // nested new nodes shown in the dialog; deeper requirements are completed later
const PERSON = NS.aro + "Person", COLLECTIVE = NS.aro + "Collective";

let D = null;   // helpers from app.js (state, h, limits, ...), see initCreator

/** Give the dialog access to the annotator's state and helpers. */
export function initCreator(deps) { D = deps; }

/** Open the dialog. from: node to link to; dir: "child" | "parent"; prop, cls: preselected relation and class. */
export function openCreator(opts = {}) {
  new Creator(opts).open();
}

class Creator {
  constructor({ from = null, dir = null, prop = null, cls = null }) {
    const o = D.state.ontology;
    this.from = from;
    const individual = from && D.state.data.types(from).some((x) => o.classes[x]);
    this.dir = from ? (dir || (individual ? "child" : "parent")) : null;
    this.prop = prop;
    this.cls = cls;
    this.text = "";
    this.lang = D.state.contentLang;
    this.values = {};     // datatype property IRI -> value typed now
    this.filter = "";
    this.slots = [];
    this.problems = [];
    if (cls) this.slots = this.requiredSlots(cls, this.contextFills(), 0);
  }

  // ---------------------------------------------------------------- ontology
  get o() { return D.state.ontology; }

  /** Required relations satisfied by the link to the context node (and its declared inverse). */
  contextFills() {
    if (!this.from || !this.prop) return new Set();
    if (this.dir === "parent") return new Set([this.prop]);          // new -> prop -> from
    const inverse = this.o.inverseOf(this.prop);                     // from -> prop -> new
    return new Set(inverse ? [inverse] : []);
  }

  /** What the ontology requires of a new node of `cls`: one slot per property with sh:minCount > 0. */
  requiredSlots(cls, filled, depth) {
    const o = this.o, seen = new Set(), slots = [], suggested = new Set();
    for (const s of D.shapes()) {
      if (!s.target || s.min === null || s.min < 1 || !o.isA([cls], s.target)) continue;
      if (seen.has(s.path) || filled.has(s.path) || !o.objectProps[s.path]) continue;
      seen.add(s.path);
      const { min, max } = D.limits([cls], s.path);
      const p = o.objectProps[s.path];
      const range = s.cls ? [s.cls] : p.range;
      const vocab = range.find((r) => o.isVocabularyClass(r));
      const agent = range.every((r) => o.isAgentClass(r));
      const slot = { prop: s.path, min, max, range, depth, kind: vocab ? "vocab" : agent ? "agent" : "node", vocab,
                     mode: null, value: "", newCls: null, newName: "", children: [], agentType: PERSON, agentIri: "" };
      if (slot.kind === "node") {
        slot.existing = this.candidates(range);
        slot.creatable = D.creatableClasses(range);
        slot.mode = slot.existing.length ? "existing" : "new";
        // suggest a different node in each slot (e.g. a derivation's source and derived anchors)
        slot.value = slot.existing.find((n) => !suggested.has(n)) || slot.existing[0] || "";
        suggested.add(slot.value);
        if (slot.mode === "new") this.chooseNewClass(slot, slot.creatable[0]);
      } else if (slot.kind === "agent") {
        slot.existing = D.state.data.nodes().filter((n) => D.state.data.types(n).some((x) => D.AGENT_TYPES.includes(x)));
        slot.mode = slot.existing.length ? "existing" : "new";
        slot.value = slot.existing[0] || "";
      } else {
        slot.value = "";   // the user picks a concept
      }
      slots.push(slot);
    }
    return slots;
  }

  /** Nodes of the annotations that may fill a slot of these classes. */
  candidates(range) {
    return D.state.data.nodes().filter((n) => n !== this.from && range.some((r) => this.o.isA(D.state.data.types(n), r)));
  }

  chooseNewClass(slot, cls) {
    slot.newCls = cls || null;
    const inverse = this.o.inverseOf(slot.prop);
    slot.children = cls && slot.depth + 1 < MAX_DEPTH
      ? this.requiredSlots(cls, new Set(inverse ? [inverse] : []), slot.depth + 1) : [];
    slot.deferred = cls && slot.depth + 1 >= MAX_DEPTH && this.requiredSlots(cls, new Set(), slot.depth + 1).length > 0;
  }

  /** Requirements not yet met, as readable labels. */
  missing(slots = this.slots, prefix = "") {
    const o = this.o, lang = uiLanguage(), out = [];
    for (const s of slots) {
      const name = prefix + o.label(s.prop, lang);
      if (s.kind === "vocab" || s.mode === "existing") { if (!s.value) out.push(name); continue; }
      if (s.kind === "agent") { if (!s.agentIri.trim() && !s.newName.trim()) out.push(name); continue; }
      if (!s.newCls) { out.push(name); continue; }
      out.push(...this.missing(s.children, `${name} › `));
    }
    // SHACL-SPARQL rule of derivations: the source and derived anchors must differ
    if (!prefix && this.cls && o.isA([this.cls], NS.aro + "DerivationClaim")) {
      const anchor = (p) => {
        if (this.from && this.dir === "parent" && this.prop === p) return this.from;
        const s = slots.find((x) => x.prop === p);
        return s && s.mode === "existing" ? s.value : null;
      };
      const a = anchor(NS.aro + "hasSourceAnchor"), b = anchor(NS.aro + "hasDerivedAnchor");
      if (a && a === b) out.push(t("cr_sameAnchors"));
    }
    return out;
  }

  // ---------------------------------------------------------------- dialog
  open() {
    const h = D.h;
    this.dialog = h("dialog", { class: "creator" });
    this.dialog.addEventListener("close", () => this.dialog.remove());
    this.dialog.addEventListener("click", (e) => { if (e.target === this.dialog) this.dialog.close(); });   // backdrop
    document.body.append(this.dialog);
    this.render();
    this.dialog.showModal();
  }

  render() {
    const h = D.h;
    const scroll = { left: this.dialog.querySelector(".cr-left")?.scrollTop, right: this.dialog.querySelector(".cr-right")?.scrollTop };
    this.dialog.replaceChildren(
      h("header", { class: "cr-head" }, h("h2", {}, t("cr_title")),
        h("a", { href: uiLanguage() === "pt-BR" ? `${GUIDE}pt-BR/guia-de-anotacao.md` : `${GUIDE}en/annotation-guide.md`,
                 target: "_blank", rel: "noopener", class: "small" }, t("cr_guide")),
        h("button", { class: "icon", title: t("close"), onclick: () => this.dialog.close() }, "×")),
      h("div", { class: "cr-body" },
        h("section", { class: "cr-left" }, h("h3", {}, t("cr_step1")), ...this.leftColumn()),
        h("section", { class: "cr-right" }, h("h3", {}, t("cr_step2")), ...this.rightColumn())),
      this.footer());
    if (scroll.left) this.dialog.querySelector(".cr-left").scrollTop = scroll.left;
    if (scroll.right) this.dialog.querySelector(".cr-right").scrollTop = scroll.right;
  }

  pick(prop, cls, dir = this.dir) {
    this.prop = prop; this.cls = cls; this.dir = dir; this.problems = [];
    this.slots = cls ? this.requiredSlots(cls, this.contextFills(), 0) : [];
    this.render();
  }

  // ---------------------------------------------------------------- 1. what to create
  leftColumn() {
    const h = D.h, o = this.o, lang = uiLanguage();
    const out = [];
    if (this.from) {
      out.push(h("div", { class: "cr-from" }, h("span", { class: "muted small" }, t("cr_from")), D.nodePill(this.from),
        h("button", { class: "link small", onclick: () => { this.from = null; this.dir = null; this.pick(null, null); } }, t("cr_standaloneLink"))));
      const types = D.typesOf(this.from);
      const individual = types.some((x) => o.classes[x]);
      const children = individual ? D.childOptions(this.from, types).filter((op) => op.classes.length) : [];
      const parents = D.parentOptions(types).filter((op) => op.classes.length);
      if (this.dir === "child" && !children.length) this.dir = "parent";
      out.push(h("div", { class: "tabs" },
        h("button", { class: `tab${this.dir === "child" ? " on" : ""}`, disabled: !children.length, onclick: () => this.pick(null, null, "child") },
          t("children"), h("span", { class: "count" }, children.length)),
        h("button", { class: `tab${this.dir === "parent" ? " on" : ""}`, disabled: !parents.length, onclick: () => this.pick(null, null, "parent") },
          t("parents"), h("span", { class: "count" }, parents.length))));
      out.push(h("p", { class: "muted small" }, t(this.dir === "child" ? "childrenHelp" : "parentsHelp")));
      for (const op of this.dir === "child" ? children : parents) out.push(this.relationOption(op));
    } else {
      if (D.state.selected && D.state.data.nodes().includes(D.state.selected)) {
        out.push(h("button", { class: "link small", onclick: () => { this.from = D.state.selected; this.dir = null; this.pick(null, null, null); } },
          `${t("cr_linkFromSelected")}: ${D.displayName(D.state.selected)}`));
      }
      const filter = h("input", { type: "search", class: "filter", placeholder: t("cr_filter"), value: this.filter });
      const list = h("div", {});
      const draw = () => {
        const q = this.filter.trim().toLowerCase();
        list.replaceChildren(...o.packages.map((p) => {
          const classes = Object.values(o.classes).filter((c) => c.package === p.name && o.isCreatable(c.iri))
            .filter((c) => !q || `${o.label(c.iri, lang)} ${c.name}`.toLowerCase().includes(q));
          if (!classes.length) return null;
          return h("div", { class: "cr-pkg" },
            h("div", { class: "pkg-name", style: `color:${o.packageAccent(p.name)}` }, o.packageLabel(p.name, lang)),
            ...classes.map((c) => this.classOption(null, c.iri)));
        }).filter(Boolean));
      };
      filter.addEventListener("input", () => { this.filter = filter.value; draw(); });
      draw();
      out.push(filter, list);
    }
    out.push(h("details", { class: "subtle cr-cannot" }, h("summary", {}, t("cr_cannotTitle")), h("p", { class: "muted small" }, t("cr_cannot"))));
    return out;
  }

  relationOption(op) {
    const h = D.h, o = this.o, lang = uiLanguage(), p = op.prop;
    const flow = op.dir === "child" ? `${t("thisNode")} → ${o.label(p.iri, lang)} → ${t("newNode2")}`
                                    : `${t("newNode2")} → ${o.label(p.iri, lang)} → ${t("thisNode")}`;
    const desc = o.relationDescription(p.iri, lang);
    return h("div", { class: `cr-rel${op.full ? " disabled" : ""}` },
      h("div", { class: "cr-rel-head" }, h("strong", {}, o.label(p.iri, lang)),
        op.required ? h("span", { class: "badge-req" }, t("required")) : null,
        op.full ? h("span", { class: "badge-full" }, t("maxReached")) : null),
      h("div", { class: "muted small" }, flow),
      desc ? h("p", { class: "cr-def" }, desc) : null,
      op.full ? h("p", { class: "muted small" }, t("cr_fullHelp")) : h("div", {}, ...op.classes.map((c) => this.classOption(p.iri, c))));
  }

  classOption(prop, cls) {
    const h = D.h, o = this.o, lang = uiLanguage();
    const on = this.cls === cls && (prop === null || this.prop === prop);
    return h("button", { class: `cr-class${on ? " on" : ""}`, style: `--accent:${o.packageAccent(o.packageOf(cls))}`, onclick: () => this.pick(prop, cls) },
      h("span", { class: "cr-class-name" }, o.label(cls, lang)),
      h("span", { class: "cr-class-def" }, o.definition(cls, lang)));
  }

  // ---------------------------------------------------------------- 2. fill in
  rightColumn() {
    const h = D.h, o = this.o, lang = uiLanguage();
    if (!this.cls) return [h("p", { class: "muted" }, t("cr_pickLeft"))];
    const cls = this.cls, pkg = o.packageOf(cls);
    const out = [];
    // what this is
    out.push(h("div", { class: "cr-card", style: `--accent:${o.packageAccent(pkg)}` },
      h("div", { class: "cr-kind" }, `${o.packageLabel(pkg, lang)} · «${o.classes[cls].stereotype}»`),
      h("div", { class: "cr-name" }, o.label(cls, lang)),
      h("p", {}, o.definition(cls, lang)),
      this.from && this.prop ? h("p", { class: "cr-link" }, h("strong", {}, `${t("cr_link")}: `),
        this.dir === "child" ? `${D.displayName(this.from)} → ${o.label(this.prop, lang)} → ${t("newNode2")}`
                             : `${t("newNode2")} → ${o.label(this.prop, lang)} → ${D.displayName(this.from)}`) : null));
    // text
    const text = h("textarea", { rows: 3, placeholder: o.label(cls, lang) });
    text.value = this.text;
    text.addEventListener("input", () => { this.text = text.value; });
    const lang_ = D.langSelect(this.lang);
    lang_.addEventListener("change", () => { this.lang = lang_.value; });
    out.push(this.field(t("cr_text"), t("cr_textHelp"), h("div", { class: "row" }, text, lang_)));
    // required
    out.push(h("h4", {}, t("cr_required")), h("p", { class: "muted small" }, t("cr_requiredHelp")));
    const auto = [...this.contextFills()].filter((p) => D.limits([cls], p).min > 0);
    for (const p of auto) out.push(h("div", { class: "cr-slot done" }, h("strong", {}, o.label(p, lang)), " — ",
      h("span", { class: "muted small" }, `${t("cr_automatic")}: ${D.displayName(this.from)}`)));
    if (!this.slots.length && !auto.length) out.push(h("p", { class: "muted small" }, t("cr_noRequired")));
    out.push(...this.slots.map((s) => this.slotView(s)));
    // optional data
    const data = this.optionalData(cls);
    if (data.length) out.push(h("h4", {}, t("cr_optional")), ...data);
    // later
    const later = o.propertiesFor([cls]).filter((p) => !(D.limits([cls], p.iri).min > 0) && !this.contextFills().has(p.iri));
    if (later.length) {
      out.push(h("h4", {}, t("cr_later")), h("div", { class: "chips" }, later.map((p) =>
        h("span", { class: "chip", title: o.relationDescription(p.iri, lang) }, o.label(p.iri, lang)))));
    }
    return out;
  }

  field(label, help, control) {
    const h = D.h;
    return h("div", { class: "cr-field" }, h("label", {}, label), help ? h("p", { class: "muted small" }, help) : null, control);
  }

  cardinality(s) {
    if (s.max === 1 && s.min === 1) return t("cr_exactlyOne");
    return t("cr_atLeast").replace("{n}", s.min);
  }

  slotView(s) {
    const h = D.h, o = this.o, lang = uiLanguage();
    const box = h("div", { class: "cr-slot" + (this.missing([s]).length ? "" : " done") },
      h("div", { class: "cr-slot-head" }, h("strong", {}, o.label(s.prop, lang)), h("span", { class: "badge-req" }, this.cardinality(s)),
        h("code", {}, localName(s.prop))),
      h("p", { class: "cr-def" }, o.relationDescription(s.prop, lang)));
    const rerender = () => this.render();
    if (s.kind === "vocab") {
      const sel = h("select", {}, h("option", { value: "" }, t("cr_chooseConcept")), ...D.conceptOptions(s.vocab));
      sel.value = s.value;
      const help = h("p", { class: "muted small" }, s.value ? o.definition(s.value, lang) : "");
      sel.addEventListener("change", () => { s.value = sel.value; rerender(); });
      box.append(sel, help);
      return box;
    }
    const modes = [];
    if (s.existing.length) modes.push(["existing", t("cr_existing")]);
    modes.push(["new", s.kind === "agent" ? t("cr_agentNew") : t("cr_new")]);
    const mode = h("div", { class: "seg" }, ...modes.map(([v, l]) =>
      h("button", { class: s.mode === v ? "on" : "", onclick: () => {
        s.mode = v;
        if (v === "existing") s.value = s.existing[0] || "";
        if (v === "new" && s.kind === "node" && !s.newCls) this.chooseNewClass(s, s.creatable[0]);
        rerender();
      } }, l)));
    box.append(mode);
    if (!s.existing.length) box.append(h("p", { class: "muted small" }, t("cr_noneYet")));
    if (s.mode === "existing") {
      const sel = h("select", {}, ...s.existing.map((n) => h("option", { value: n }, D.displayName(n))));
      sel.value = s.value;
      sel.addEventListener("change", () => { s.value = sel.value; this.updateFooter(); });
      box.append(sel);
    } else if (s.kind === "agent") {
      const type = h("select", {}, [PERSON, COLLECTIVE].map((c) => h("option", { value: c }, o.label(c, lang))));
      type.value = s.agentType;
      type.addEventListener("change", () => { s.agentType = type.value; });
      const name = h("input", { placeholder: t("cr_agentName"), value: s.newName });
      name.addEventListener("input", () => { s.newName = name.value; this.updateFooter(); });
      const iri = h("input", { type: "url", placeholder: t("cr_agentIri"), value: s.agentIri });
      iri.addEventListener("input", () => { s.agentIri = iri.value; this.updateFooter(); });
      box.append(h("div", { class: "row" }, type, name), iri, h("p", { class: "muted small" }, t("cr_agentHelp")));
    } else {
      const cls = h("select", {}, ...s.creatable.map((c) => h("option", { value: c }, o.label(c, lang))));
      cls.value = s.newCls || "";
      cls.addEventListener("change", () => { this.chooseNewClass(s, cls.value); rerender(); });
      const name = h("input", { placeholder: t("cr_newNodeName"), value: s.newName });
      name.addEventListener("input", () => { s.newName = name.value; });
      box.append(h("div", { class: "row" }, cls, name));
      if (s.newCls) box.append(h("p", { class: "muted small" }, o.definition(s.newCls, lang)));
      if (s.children.length) box.append(h("div", { class: "cr-nested" }, ...s.children.map((c) => this.slotView(c))));
      if (s.deferred) box.append(h("p", { class: "muted small" }, t("cr_depthLimit")));
    }
    return box;
  }

  /** Datatype properties specific to the class (dates, confidence, outcome, ...), typed now or later. */
  optionalData(cls) {
    const h = D.h, o = this.o, lang = uiLanguage();
    const props = o.dataPropertiesFor([cls]).filter((p) => p.domain && p.iri !== NS.aro + "textValue");
    return props.map((p) => {
      const allowed = o.catalog.datatype_properties.find((d) => NS.aro + d.name === p.iri)?.shacl?.in;
      let control;
      if (allowed) {
        control = h("select", {}, h("option", { value: "" }, "—"), ...allowed.map((v) => h("option", { value: v }, v)));
      } else if (p.range === NS.xsd + "boolean") {
        control = h("select", {}, h("option", { value: "" }, "—"), h("option", { value: "true" }, t("cr_yes")), h("option", { value: "false" }, t("cr_no")));
      } else {
        const hint = p.range === NS.rdfs + "Literal" ? t("cr_dateHint") : p.range === NS.xsd + "decimal" ? "0.0 – 1.0" : localName(p.range || "");
        control = h("input", { type: "text", placeholder: hint });
      }
      control.value = this.values[p.iri] || "";
      control.addEventListener("input", () => { this.values[p.iri] = control.value; });
      control.addEventListener("change", () => { this.values[p.iri] = control.value; });
      return this.field(o.label(p.iri, lang), o.definition(p.iri, lang), control);
    });
  }

  // ---------------------------------------------------------------- footer and creation
  footer() {
    const h = D.h;
    this.status = h("div", { class: "cr-status" });
    this.createBtn = h("button", { class: "primary", onclick: () => this.create() }, t("cr_create"));
    const foot = h("footer", { class: "cr-foot" }, this.status,
      h("button", { onclick: () => this.dialog.close() }, t("cr_cancel")), this.createBtn);
    this.updateFooter();
    return foot;
  }

  updateFooter() {
    const h = D.h;
    if (!this.status) return;
    const missing = this.cls ? this.missing() : [];
    this.createBtn.disabled = !this.cls || missing.length > 0;
    if (this.problems.length) {
      this.status.replaceChildren(h("strong", { class: "required" }, t("cr_invalid")), h("ul", {}, ...this.problems.map((p) => h("li", {}, p))));
    } else if (!this.cls) {
      this.status.replaceChildren(h("span", { class: "muted" }, t("cr_pickLeft")));
    } else if (missing.length) {
      this.status.replaceChildren(h("span", { class: "required" }, `${t("cr_missing")}: ${missing.join("; ")}`));
    } else {
      this.status.replaceChildren(h("span", { class: "ok" }, t("cr_ready")));
    }
  }

  create() {
    if (this.createBtn.disabled) return;
    const data = D.state.data, o = this.o, created = [];
    const make = (cls, name) => { const n = data.createNode(cls, name.trim(), this.lang); created.push(n); return n; };
    const main = make(this.cls, this.text);
    for (const [iri, value] of Object.entries(this.values)) {
      if (!String(value).trim()) continue;
      data.addTyped(main, iri, String(value).trim(), D.datatypeFor(o.dataProps[iri], String(value).trim()));
    }
    if (this.from && this.prop) {
      if (this.dir === "child") {
        data.link(this.from, this.prop, main);
        const inverse = o.inverseOf(this.prop);
        if (inverse && D.limits([this.cls], inverse).min > 0) data.link(main, inverse, this.from);
      } else {
        data.link(main, this.prop, this.from);
      }
    }
    const fill = (node, s) => {
      if (s.kind === "vocab" || s.mode === "existing") { data.link(node, s.prop, s.value); return; }
      if (s.kind === "agent") {
        const agent = s.agentIri.trim() || data.freshIri(s.newName.trim() || "agent");
        data.addType(agent, s.agentType);
        if (s.newName.trim()) data.addTyped(agent, NS.schema + "name", s.newName.trim(), null);
        created.push(agent);
        data.link(node, s.prop, agent);
        return;
      }
      const child = make(s.newCls, s.newName);
      data.link(node, s.prop, child);
      const inverse = o.inverseOf(s.prop);
      if (inverse && D.limits([s.newCls], inverse).min > 0) data.link(child, inverse, node);
      for (const c of s.children) fill(child, c);
    };
    for (const s of this.slots) fill(main, s);

    // the same rules as Analysis > Validate, on the new nodes only (deeper requirements excepted)
    this.problems = validate(data, o, uiLanguage())
      .filter((p) => created.includes(p.node) && !this.isDeferred(p.node))
      .map((p) => `${D.displayName(p.node)}: ${p.message}`);
    if (this.problems.length) {
      created.forEach((n) => data.deleteNode(n));   // nothing is kept
      this.updateFooter();
      return;
    }
    created.forEach((n) => D.state.graph.show(n));
    if (this.from) D.state.graph.show(this.from);
    this.dialog.close();
    D.focusNode(main);
  }

  /** New nodes created at the depth limit may still miss their own requirements (completed later). */
  isDeferred(node) {
    const types = D.state.data.types(node);
    const walk = (slots) => slots.some((s) => (s.deferred && types.includes(s.newCls)) || walk(s.children));
    return walk(this.slots);
  }
}
