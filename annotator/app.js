// ARO Annotator: wires the ontology, the user's data, the graph view and the inspector.
// Everything runs in the browser; files are only read from and saved to the user's disk.

import { loadOntology, NS, localName } from "./ontology.js";
import { Data } from "./data.js";
import { GraphView, shortIri } from "./graph.js";
import { validate, readShapes } from "./validate.js";
import { queryIndex, queryText, runSelect } from "./queries.js";
import { initLayout, floatPanel, setPanel } from "./layout.js";
import { t, setUiLanguage, uiLanguage, UI_LANGUAGES, CONTENT_LANGUAGES } from "./i18n.js";

const DRAFT_KEY = "aro-annotator-draft";
const PREFS_KEY = "aro-annotator-prefs";
const LANGSTRING = NS.rdf + "langString";
const ANYURI = NS.xsd + "anyURI";

// Classes whose nodes offer a "Search on Google" button (represented situations and real-world cases)
const SEARCHABLE = ["SituationDescription", "IntentionalStateDescription", "SituationPattern", "PatternCondition",
  "EmpiricalSituation", "EmpiricalEvent", "EmpiricalCase", "EmpiricalClaim", "ExplanationHypothesis", "DepictedElement"]
  .map((n) => NS.aro + n);

// W3C Web Annotation selector shapes offered for aro:hasSelector, with their value fields
const SELECTORS = {
  FragmentSelector: [["value", "t=12,16  |  xywh=10,10,200,120"]],
  TextQuoteSelector: [["exact", "…"], ["prefix", ""], ["suffix", ""]],
  TextPositionSelector: [["start", "0"], ["end", "100"]],
  SvgSelector: [["value", "<svg>…</svg>"]],
};

// External agent types offered when a relation points to a «roleMixin» (Analyst, CreativeAgent)
// aro:Person / aro:Collective place the agent in the OntoUML role pattern (ADR-029); the others are external
const AGENT_TYPES = [NS.aro + "Person", NS.aro + "Collective", NS.schema + "Person", NS.schema + "MusicGroup",
  NS.schema + "Organization", NS.foaf + "Person", NS.prov + "Agent"];

const state = { ontology: null, data: new Data(), graph: null, selected: null, contentLang: "en" };
const $ = (sel) => document.querySelector(sel);

/** Tiny DOM helper: h("button", {onclick}, "text", child...). */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) el.append(c.nodeType ? c : String(c));
  return el;
}

// ------------------------------------------------------------------ preferences / draft
function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch { return {}; }
}
function savePrefs() {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify({ ui: uiLanguage(), content: state.contentLang, base: state.data.base })); } catch { /* storage unavailable */ }
}
async function saveDraft() {
  try { localStorage.setItem(DRAFT_KEY, await state.data.toTurtle()); } catch { /* storage unavailable */ }
}

/** Call after every change to the data: redraw, refresh the inspector, keep a local draft. */
function changed(opts) {
  state.graph.render(state.data, state.ontology, uiLanguage(), state.contentLang, opts);
  renderInspector();
  renderWorksPanel();
  renderAddPanel();
  // shown / total nodes (hidden works and nodes are not counted as shown)
  $("#count").textContent = `${state.graph.visible.size} / ${state.data.nodes().length} ${t("nodes")}`;
  saveDraft();
}

// ------------------------------------------------------------------ toolbar
function renderToolbar() {
  document.title = t("title");
  $("#app-title").textContent = t("title");
  for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll("[data-i18n-title]")) el.title = t(el.dataset.i18nTitle);

  const ui = $("#ui-lang");
  ui.replaceChildren(...Object.entries(UI_LANGUAGES).map(([v, l]) => h("option", { value: v, selected: v === uiLanguage() }, l)));
  const content = $("#content-lang");
  const langs = [...new Set([...CONTENT_LANGUAGES, state.contentLang])];
  content.replaceChildren(...langs.map((l) => h("option", { value: l, selected: l === state.contentLang }, l)),
                          h("option", { value: "__other" }, t("otherLanguage")));
  $("#base-iri").value = state.data.base;
}

// ------------------------------------------------------------------ hover descriptions
// One floating tooltip for the panels (the graph has its own, same look): hovering a class
// chip, a node pill or a badge explains what kind of ontology element it is and what it is for.
const uiTip = h("div", { class: "graph-tip", hidden: true });
document.body.append(uiTip);

/** Show `build()` (an element) as a tooltip while the pointer is over `el`. */
function tip(el, build) {
  el.addEventListener("mouseenter", (e) => { const c = build(); if (!c) return; uiTip.replaceChildren(c); uiTip.hidden = false; placeTip(e); });
  el.addEventListener("mousemove", placeTip);
  el.addEventListener("mouseleave", () => { uiTip.hidden = true; });
  el.addEventListener("mousedown", () => { uiTip.hidden = true; });
  return el;
}
function placeTip(e) {
  const w = uiTip.offsetWidth, hh = uiTip.offsetHeight;
  let x = e.clientX + 14, y = e.clientY + 14;
  if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
  if (y + hh > window.innerHeight - 8) y = e.clientY - hh - 14;
  uiTip.style.left = `${Math.max(8, x)}px`;
  uiTip.style.top = `${Math.max(8, y)}px`;
}

/** What a class is: label, module, OntoUML nature and definition. */
function classTip(cls) {
  const o = state.ontology, lang = uiLanguage();
  const info = o.classInfo(cls);
  const pkg = o.packageOf(cls);
  return h("div", {},
    h("div", { class: "tip-head" },
      h("span", { class: "chip", style: chipStyle(cls) }, o.label(cls, lang)),
      h("span", { class: "tip-mod" }, o.packageLabel(pkg, lang))),
    h("p", { class: "tip-def" }, o.definition(cls, lang)),
    info?.stereotype ? h("p", { class: "tip-meta" }, t("stereo_" + info.stereotype)) : null,
    o.comment(cls, lang) ? h("p", { class: "tip-onto" }, o.comment(cls, lang)) : null,
    o.packageDescription(pkg, lang) ? h("p", { class: "tip-mod-desc" }, h("strong", {}, o.packageLabel(pkg, lang) + ": "), o.packageDescription(pkg, lang)) : null,
    h("p", { class: "tip-iri" }, shortIri(cls)));
}

/** Tooltip of a graph node or edge (passed to the graph view). */
function describe({ node, edge }) {
  const o = state.ontology, lang = uiLanguage();
  if (edge) {
    const p = o.objectProps[edge.prop];
    const desc = o.relationDescription(edge.prop, lang);
    return h("div", {},
      h("div", { class: "tip-head" }, h("strong", {}, p ? o.label(edge.prop, lang) : shortIri(edge.prop))),
      h("p", { class: "tip-def" }, short(displayName(edge.source), 50), " → ", short(displayName(edge.target), 50)),
      desc ? h("p", { class: "tip-meta" }, desc) : null,
      h("p", { class: "tip-iri" }, shortIri(edge.prop)));
  }
  const hidden = state.graph.hiddenCount(node);
  const foot = h("p", { class: "tip-foot" }, hidden ? `+${hidden} ${t("tipHidden")} · ` : "", t("tipOpen"));
  if (o.isConcept(node)) {
    const scheme = o.conceptTypes(node).find((x) => o.classes[x]);
    return h("div", {},
      h("div", { class: "tip-head" }, h("span", { class: "chip concept" }, t("conceptOf")),
        scheme ? h("span", { class: "tip-mod" }, o.label(scheme, lang)) : null),
      h("strong", {}, o.label(node, lang)),
      h("p", { class: "tip-def" }, o.definition(node, lang)),
      scheme ? h("p", { class: "tip-meta" }, o.definition(scheme, lang)) : null, foot);
  }
  const cls = state.data.types(node).find((x) => o.classes[x]);
  if (!cls) {
    return h("div", {}, h("div", { class: "tip-head" }, h("span", { class: "chip concept" }, t("externalShort"))),
      h("p", { class: "tip-def" }, t("external")), h("p", { class: "tip-iri" }, node), foot);
  }
  const box = classTip(cls);
  box.prepend(h("strong", { class: "tip-title" }, short(displayName(node), 120)));
  box.append(foot);
  return box;
}

/** Inline style of a class chip: the module's tint and accent. */
function chipStyle(cls) {
  const o = state.ontology, pkg = o.packageOf(cls);
  return `--tint:${o.packageColor(pkg)};--accent:${o.packageAccent(pkg)}`;
}

/** A class chip with its hover description. */
function classChip(cls, attrs = {}) {
  return tip(h(attrs.onclick ? "button" : "span", { ...attrs, class: `chip ${attrs.class || ""}`, style: chipStyle(cls) },
    state.ontology.label(cls, uiLanguage())), () => classTip(cls));
}

/** A clickable pill for a node (relations, lists): class colour, name, hover description. */
function nodePill(id) {
  const o = state.ontology;
  const cls = state.data.types(id).find((x) => o.classes[x]);
  const style = cls ? chipStyle(cls) : "--tint:#f8fafc;--accent:#64748b";
  return tip(h("button", { class: "pill", style, onclick: () => focusNode(id) },
    cls ? h("span", { class: "pill-kind" }, o.label(cls, uiLanguage())) : null,
    h("span", { class: "pill-name" }, short(displayName(id), 70))), () => describe({ node: id }));
}

// ------------------------------------------------------------------ add nodes (children / parents)
// The left panel starts from the selected node: its type decides, by the ontology's domains
// and ranges, which new nodes can hang from it (children: this → relation → new) and which
// can point to it (parents: new → relation → this). Without a selection, a standalone node.
const addUi = { tab: "children", filter: "", open: null };

function renderAddPanel() {
  uiTip.hidden = true;   // its anchor is about to be replaced
  const box = $("#add-panel");
  if (!box || !state.ontology) return;
  const id = state.selected && state.data.nodes().includes(state.selected) ? state.selected : null;
  const o = state.ontology;
  const isIndividual = id && state.data.types(id).some((x) => o.classes[x]);
  if (!id || (!isIndividual && !o.isConcept(id))) { box.replaceChildren(...standaloneCreator(true)); return; }

  const types = typesOf(id);
  const children = isIndividual ? childOptions(id, types) : [];
  const parents = parentOptions(types);
  if (addUi.tab === "children" && !children.length) addUi.tab = "parents";
  const tabs = h("div", { class: "tabs" },
    tabButton("children", "↓ " + t("children"), children.length),
    tabButton("parents", "↑ " + t("parents"), parents.length));
  const filter = h("input", { type: "search", class: "filter", placeholder: t("filterPlaceholder"), value: addUi.filter });
  const list = h("div", { class: "rel-list" });
  const options = addUi.tab === "children" ? children : parents;
  const draw = () => {
    const q = addUi.filter.trim().toLowerCase();
    const shown = options.filter((op) => !q || op.search.includes(q));
    list.replaceChildren(...(shown.length ? shown.map((op) => relationCard(id, op))
      : [h("p", { class: "muted small" }, options.length ? t("noMatch") : t(addUi.tab === "children" ? "noChildren" : "noParents"))]));
  };
  filter.addEventListener("input", () => { addUi.filter = filter.value; draw(); });
  draw();
  box.replaceChildren(
    h("div", { class: "add-from" },
      h("span", { class: "add-from-label" }, t("addFrom")),
      nodePill(id),
      h("button", { class: "icon", title: t("clearContext"), onclick: () => { state.selected = null; state.graph.cy.$(":selected").unselect(); changed(); } }, "×")),
    tabs,
    h("p", { class: "muted small" }, t(addUi.tab === "children" ? "childrenHelp" : "parentsHelp")),
    filter, list,
    h("details", { class: "subtle" }, h("summary", {}, t("standalone")), ...standaloneCreator(false)));
}

function tabButton(key, label, count) {
  return h("button", { class: `tab${addUi.tab === key ? " on" : ""}`, disabled: !count,
    onclick: () => { addUi.tab = key; addUi.open = null; renderAddPanel(); } }, label, h("span", { class: "count" }, count));
}

/** Relations from this node to a new one, with what may fill them (SHACL maximum respected). */
function childOptions(id, types) {
  const o = state.ontology, lang = uiLanguage();
  return o.propertiesFor(types).map((p) => {
    const { min, max } = limits(types, p.iri);
    const count = countOf(id, p.iri);
    return { dir: "child", prop: p, classes: creatableClasses(p.range), count, required: (min ?? 0) > count,
             full: max !== null && count >= max, search: searchText(p, p.range) };
  }).sort((a, b) => (b.required - a.required) || (a.full - b.full) || o.label(a.prop.iri, lang).localeCompare(o.label(b.prop.iri, lang)));
}

/** Relations from a new node to this one (rdfs:range accepts it). */
function parentOptions(types) {
  const o = state.ontology, lang = uiLanguage();
  return o.propertiesTargeting(types)
    .filter((p) => p.domain.some((d) => o.classes[d] && !o.isVocabularyClass(d)))
    .map((p) => ({ dir: "parent", prop: p, classes: creatableClasses(p.domain), search: searchText(p, p.domain) }))
    .sort((a, b) => o.label(a.prop.iri, lang).localeCompare(o.label(b.prop.iri, lang)));
}

function searchText(p, classes) {
  const o = state.ontology, lang = uiLanguage();
  return [o.label(p.iri, lang), p.name, ...classes.flatMap((c) => o.classes[c] ? o.withSubclasses(c).map((k) => o.label(k, lang)) : [shortIri(c)])]
    .join(" ").toLowerCase();
}

/** One relation the ontology allows: a card with the classes that can be created through it. */
function relationCard(id, op) {
  const o = state.ontology, lang = uiLanguage(), p = op.prop;
  const key = `${op.dir}|${p.iri}`;
  const here = h("span", { class: "flow-here" }, t("thisNode"));
  const nw = h("span", { class: "flow-new" }, t("newNode2"));
  const flow = h("div", { class: "flow" }, ...(op.dir === "child" ? [here, " → ", nw] : [nw, " → ", here]));
  const head = h("div", { class: "rel-head" },
    h("strong", {}, o.label(p.iri, lang)),
    op.required ? h("span", { class: "badge-req" }, t("required")) : null,
    op.count ? h("span", { class: "badge-count", title: t("alreadyLinked") }, `${op.count} ${t("alreadyLinked")}`) : null,
    op.full ? h("span", { class: "badge-full" }, t("maxReached")) : null);
  const desc = o.relationDescription(p.iri, lang);
  const showDesc = desc && desc.toLowerCase() !== o.label(p.iri, lang).toLowerCase();
  const body = h("div", { class: "rel-body" });
  const card = h("div", { class: `rel-card${op.full ? " disabled" : ""}${addUi.open?.key === key ? " open" : ""}` },
    head, h("div", { class: "rel-meta" }, flow, h("code", {}, p.name)), showDesc ? h("p", { class: "rel-desc" }, desc) : null);
  if (op.full) return card;

  // chips: one per class that a new node may have
  const chips = h("div", { class: "chips" }, op.classes.map((c) =>
    classChip(c, { class: addUi.open?.key === key && addUi.open.cls === c ? "on" : "", onclick: () => {
      addUi.open = addUi.open?.key === key && addUi.open.cls === c ? null : { key, cls: c }; renderAddPanel();
    } })));
  if (op.classes.length) card.append(chips);
  // the inline form of the chosen class
  if (addUi.open?.key === key && addUi.open.cls) {
    const cls = addUi.open.cls;
    const name = h("input", { type: "text", placeholder: `${t("nodeName")} — ${o.label(cls, lang)}` });
    const create = () => {
      const n = createLinked(cls, name.value.trim(), { dir: op.dir === "child" ? "in" : "out", prop: p, node: id });
      addUi.open = null;
      state.graph.show(n);
      focusNode(n);
    };
    name.addEventListener("keydown", (e) => { if (e.key === "Enter") create(); if (e.key === "Escape") { addUi.open = null; renderAddPanel(); } });
    body.append(h("p", { class: "muted small" }, o.definition(cls, lang)),
      h("div", { class: "row" }, name, h("button", { class: "primary", onclick: create }, t("create"))));
    setTimeout(() => name.focus(), 0);
  }
  // other ways to fill it: existing node, vocabulary concept, selector, external IRI
  const more = h("details", { class: "subtle" }, h("summary", {}, op.classes.length ? t("otherOptions") : t("chooseTarget")));
  more.addEventListener("toggle", () => {
    if (more.open && more.childElementCount === 1) {
      more.append(h("div", { class: "form" }, ...(op.dir === "child" ? targetForm(id, o.objectProps[p.iri]) : sourceForm(id, p))));
    }
  });
  card.append(body, more);
  return card;
}

/** Without a context node: every creatable class, grouped by module, as chips. */
function standaloneCreator(withHelp) {
  const o = state.ontology, lang = uiLanguage();
  const out = [];
  if (withHelp) out.push(h("p", { class: "muted small" }, t("standaloneHelp")));
  const open = addUi.open?.key === "standalone" ? addUi.open.cls : null;
  for (const p of o.packages) {
    const classes = Object.values(o.classes).filter((c) => c.package === p.name && o.isCreatable(c.iri));
    if (!classes.length) continue;
    out.push(h("div", { class: "pkg" },
      tip(h("div", { class: "pkg-name", style: `color:${o.packageAccent(p.name)}` }, o.packageLabel(p.name, lang)),
        () => h("div", {}, h("strong", {}, o.packageLabel(p.name, lang)), h("p", { class: "tip-def" }, o.packageDescription(p.name, lang)))),
      h("div", { class: "chips" }, classes.map((c) => classChip(c.iri, { class: open === c.iri ? "on" : "", onclick: () => {
        addUi.open = open === c.iri ? null : { key: "standalone", cls: c.iri }; renderAddPanel();
      } })))));
    if (open && o.packageOf(open) === p.name) {
      const name = h("input", { type: "text", placeholder: `${t("nodeName")} — ${o.label(open, lang)}` });
      const create = () => { const n = state.data.createNode(open, name.value.trim(), state.contentLang); addUi.open = null; focusNode(n); };
      name.addEventListener("keydown", (e) => { if (e.key === "Enter") create(); });
      out.push(h("div", { class: "inline-create" }, h("p", { class: "muted small" }, o.definition(open, lang)),
        h("div", { class: "row" }, name, h("button", { class: "primary", onclick: create }, t("create")))));
      setTimeout(() => name.focus(), 0);
    }
  }
  return out;
}

// ------------------------------------------------------------------ inspector
// The inspector is a column of light cards: a header (class, module, title, definition),
// a bar of actions, then foldable cards for content, texts, references, data and relations.
// Long texts are clamped and can be expanded; the fold state of each card is remembered.
function renderInspector() {
  uiTip.hidden = true;
  const box = $("#inspector");
  const id = state.selected;
  if (!id || !state.data.nodes().includes(id)) { box.replaceChildren(h("div", { class: "empty" }, h("p", {}, t("emptyInspector")))); return; }
  const o = state.ontology;
  // Panels return optional sections as null; drop them before inserting
  const show = (parts) => box.replaceChildren(...parts.filter(Boolean));
  if (o.isConcept(id)) return show(conceptPanel(id));
  const types = state.data.types(id);
  if (!types.some((x) => o.classes[x])) return show(externalPanel(id, types));
  show(individualPanel(id, types));
}

/** Bar of actions on a node: neighbours, add child/parent, focus tab, only this work, hide, search, delete. */
function actionBar(id, { individual = false, deletable = true, search = false } = {}) {
  const isWork = state.data.types(id).includes(NS.aro + "Artwork");
  const act = (icon, label, onclick, cls = "") => tip(h("button", { class: `act ${cls}`, "aria-label": label, onclick }, h("span", {}, icon), h("small", {}, label)),
    () => h("div", {}, label));
  const query = state.data.name(id, state.contentLang) || localName(id);
  return h("div", { class: "actions" },
    act("⊕", t("actNeighbours"), () => { state.graph.toggle(id); state.graph.select(id); }),
    individual ? act("↓", t("children"), () => openAddPanel(id, "children")) : null,
    act("↑", t("parents"), () => openAddPanel(id, "parents")),
    act("↗", t("actFocus"), async () => { await saveDraft(); window.open(`?focus=${encodeURIComponent(id)}`, "_blank"); }),
    isWork ? act("◎", t("actOnlyWork"), () => onlyWork(id)) : null,
    id !== state.graph.focus ? act("⊘", t("actHide"), () => hideNode(id)) : null,
    search ? act("🔎", "Google", () => window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank", "noopener")) : null,
    deletable ? act("🗑", t("actDelete"), () => {
      if (!confirm(t("confirmDelete"))) return;
      state.data.deleteNode(id); state.selected = null; changed();
    }, "danger") : null);
}

/** Clamp `el` to `lines` lines with a "show more / less" switch (shown only when the text overflows). */
function expandable(el, lines) {
  el.classList.add("clamp");
  el.style.setProperty("--lines", lines);
  const more = h("button", { class: "link more", hidden: true }, t("showMore"));
  more.addEventListener("click", () => {
    const open = el.classList.toggle("expanded");
    more.textContent = t(open ? "showLess" : "showMore");
  });
  requestAnimationFrame(() => { if (el.scrollHeight > el.clientHeight + 2) more.hidden = false; });
  return h("div", { class: "expandable" }, el, more);
}

function header(kind, title, def, iri, style = "") {
  return h("div", { class: "insp-head", style },
    h("div", { class: "insp-kind" }, ...kind),
    h("h2", { class: "insp-title" }, title),
    def ? expandable(h("p", { class: "insp-def" }, def), 2) : null,
    h("p", { class: "iri" }, iri));
}

function conceptPanel(id) {
  const o = state.ontology, lang = uiLanguage();
  const scheme = o.conceptTypes(id).find((x) => o.classes[x]);
  return [header([h("span", { class: "chip concept" }, t("conceptOf")), scheme ? h("span", { class: "tip-mod" }, o.label(scheme, lang)) : null],
                 o.label(id, lang), o.definition(id, lang), shortIri(id)),
          actionBar(id, { deletable: false }),
          h("p", { class: "muted small" }, t("readOnly")),
          incomingSection(id)];
}

function externalPanel(id, types) {
  return [header([h("span", { class: "chip concept" }, t("externalShort")), ...types.map((x) => h("span", { class: "tip-mod" }, shortIri(x)))],
                 state.data.name(id, state.contentLang) || localName(id), t("external"),
                 h("a", { href: id, target: "_blank", rel: "noopener" }, id)),
          actionBar(id),
          incomingSection(id)];
}

function individualPanel(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const cls = types.find((x) => o.classes[x]);
  const name = state.data.name(id, state.contentLang) || localName(id);
  const info = o.classInfo(cls);
  return [
    header([classChip(cls), h("span", { class: "tip-mod" }, o.packageLabel(o.packageOf(cls), lang)),
            info?.stereotype ? tip(h("span", { class: "stereo" }, `«${info.stereotype}»`), () => h("div", {}, t("stereo_" + info.stereotype))) : null],
           short(name, 160), o.definition(cls, lang), id, chipStyle(cls)),
    actionBar(id, { individual: true, search: SEARCHABLE.some((c) => o.isA(types, c)) }),
    contentSection(id),
    excerptSection(id, types),
    sourceTextSection(id, types),
    textsSection(id, types),
    linksSection(id, types),
    selectorFields(id, types),
    otherDataSection(id, types),
    relationsSection(id, types),
    incomingSection(id),
  ];
}

const sectionState = {};   // card title -> open?, kept while the page is open

/** A foldable card: section(title, {count, open}, ...children); the options object may be left out. */
function section(title, opts, ...children) {
  if (!opts || opts.nodeType || Array.isArray(opts) || typeof opts !== "object") { children.unshift(opts); opts = {}; }
  const open = sectionState[title] ?? (opts.open ?? true);
  const d = h("details", { class: "card", open },
    h("summary", {}, h("span", { class: "card-title" }, title), opts.count ? h("span", { class: "count" }, opts.count) : null),
    h("div", { class: "card-body" }, ...children));
  d.addEventListener("toggle", () => { sectionState[title] = d.open; });
  return d;
}

/** A form folded under a "+ label" line inside a card. */
function addForm(label, ...children) {
  return h("details", { class: "subtle add" }, h("summary", {}, "＋ " + label), h("div", { class: "form" }, ...children));
}

/** Small × button that removes a statement. */
function removeButton(quad) {
  return h("button", { class: "x", title: t("remove"), "aria-label": t("remove"), onclick: () => { state.data.removeQuad(quad); changed(); } }, "×");
}

// ------------------------------------------------------------------ hiding works and nodes
function artworks() {
  return state.data.nodes().filter((n) => state.data.types(n).includes(NS.aro + "Artwork"))
    .sort((a, b) => displayName(a).localeCompare(displayName(b)));
}

/** Hide every other work (and what only they use), keeping `id`. */
function onlyWork(id) {
  state.graph.hiddenWorks = new Set(artworks().filter((w) => w !== id));
  state.graph.show(id);
  changed();
  state.graph.select(id);
}

function hideNode(id) {
  state.graph.hiddenNodes.add(id);
  if (state.selected === id) state.selected = null;
  changed();
}

/** Left panel: a checkbox per work, and the list of nodes hidden one by one. */
function renderWorksPanel() {
  const g = state.graph;
  const works = artworks();
  const boxes = works.map((w) => {
    const box = h("input", { type: "checkbox", checked: !g.hiddenWorks.has(w) });
    box.addEventListener("change", () => {
      if (box.checked) { g.hiddenWorks.delete(w); g.show(w); } else g.hiddenWorks.add(w);
      changed();
    });
    return h("label", {}, box, displayName(w));
  });
  const all = h("button", { class: "link", onclick: () => { g.hiddenWorks.clear(); works.forEach((w) => g.show(w)); changed(); } }, t("allWorks"));
  $("#works").replaceChildren(...(works.length ? [h("h3", {}, t("works"), " ", all), ...boxes] : []));

  const hidden = [...g.hiddenNodes];
  $("#hidden-list").replaceChildren(...(hidden.length ? [
    h("h3", {}, `${t("hiddenNodes")} (${hidden.length})`),
    h("ul", {}, hidden.map((n) => h("li", {}, displayName(n), " ",
      h("button", { class: "link", onclick: () => { g.hiddenNodes.delete(n); g.show(n); changed(); } }, t("showAgain"))))),
    h("button", { class: "link", onclick: () => { hidden.forEach((n) => g.show(n)); g.hiddenNodes.clear(); changed(); } }, t("showAllHidden")),
  ] : []));
}

// ------------------------------------------------------------------ local source texts
// A researcher may attach their own copy of a work's text (e.g. lyrics) to a manifestation.
// It is kept only in this browser's storage, never in the saved .ttl or in the repository,
// and is used to show the lines a selection points to.
const TEXTS_KEY = "aro-annotator-texts";

function localTexts() {
  try { return JSON.parse(localStorage.getItem(TEXTS_KEY)) || {}; } catch { return {}; }
}
function setLocalText(manifestation, text) {
  const all = localTexts();
  if (text === null) delete all[manifestation]; else all[manifestation] = text;
  try { localStorage.setItem(TEXTS_KEY, JSON.stringify(all)); } catch { alert("Browser storage unavailable."); }
}
/** Lines of a local text: blank lines removed, so numbering matches a transcription's lyric lines. */
function textLines(text) {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

/** On an Expression (the lyric text, the novel's text...): attach / remove the local text. */
function sourceTextSection(id, types) {
  if (!state.ontology.isA(types, NS.aro + "Expression")) return null;
  const text = localTexts()[id];
  const input = h("input", { type: "file", accept: ".txt,text/plain", hidden: true });
  input.addEventListener("change", async () => {
    const f = input.files[0]; if (!f) return;
    setLocalText(id, await f.text()); renderInspector();
  });
  return section(t("sourceText"), { open: !!text },
    text ? h("p", {}, `${textLines(text).length} ${t("textAttached")}`) : null,
    h("div", { class: "row" }, input, h("button", { onclick: () => input.click() }, t("attachText")),
      text ? h("button", { class: "danger", onclick: () => { setLocalText(id, null); renderInspector(); } }, t("removeText")) : null),
    h("p", { class: "muted small" }, t("textNote")));
}

/** Line range of a selection from its RFC 5147 selector ("line=a,b" = lines a+1..b). */
function lineRange(selection) {
  for (const { prop, target } of state.data.outgoing(selection)) {
    if (prop !== NS.aro + "hasSelector") continue;
    const value = state.data.literals(target).find((l) => l.prop === NS.oa + "value")?.value || "";
    const m = /^line=(\d+),(\d+)$/.exec(value);
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return null;
}

/** On a Selection: show the lines it points to, taken from the manifestation's local text. */
function excerptSection(id, types) {
  if (!state.ontology.isA(types, NS.aro + "Selection")) return null;
  const range = lineRange(id);
  const manifestation = state.data.outgoing(id).find((r) => r.prop === NS.aro + "selectsFrom")?.target;
  const text = manifestation && localTexts()[manifestation];
  const quotes = state.data.outgoing(id).filter((r) => r.prop === NS.aro + "hasSelector")
    .map((r) => state.data.literals(r.target).find((l) => l.prop === NS.oa + "exact")?.value).filter(Boolean);
  if (!range && !quotes.length) return null;
  const children = [];
  if (range && text) {
    const lines = textLines(text).slice(range[0], range[1]);
    children.push(h("ol", { class: "excerpt", start: range[0] + 1 }, lines.map((l) => h("li", {}, l))));
    if (!quotes.length) children.push(h("button", { onclick: () => {
      const sel = state.data.freshIri("quote");
      state.data.addType(sel, NS.oa + "TextQuoteSelector");
      state.data.addTyped(sel, NS.oa + "exact", lines.join("\n"), null);
      state.data.link(id, NS.aro + "hasSelector", sel); changed();
    } }, t("saveQuote")));
  } else if (range) {
    children.push(h("p", { class: "muted small" }, `line ${range[0] + 1}–${range[1]}. ${t("excerptNone")}`));
  }
  quotes.forEach((q) => children.push(h("blockquote", {}, q)));
  return section(t("excerpt"), ...children);
}

function langSelect(selected) {
  const langs = [...new Set([...CONTENT_LANGUAGES, selected])];
  return h("select", { class: "lang" }, langs.map((l) => h("option", { value: l, selected: l === selected }, l)));
}

/** Language-tagged texts (aro:textValue, aro:derivationExtent...), one value per language allowed. */
function textsSection(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const props = o.dataPropertiesFor(types).filter((p) => p.range === LANGSTRING);
  if (!props.length) return null;
  const values = state.data.literals(id).filter((l) => props.some((p) => p.iri === l.prop));
  const items = values.map((l) => h("div", { class: "item text-item" },
    h("div", { class: "item-head" }, h("span", { class: "lang-tag" }, l.lang || "—"),
      h("span", { class: "item-label" }, o.label(l.prop, lang)), removeButton(l.quad)),
    expandable(h("div", { class: "item-text", lang: l.lang || undefined }, l.value), 3)));
  const prop = h("select", {}, props.map((p) => h("option", { value: p.iri }, o.label(p.iri, lang))));
  const text = h("textarea", { rows: 3 });
  const tag = langSelect(state.contentLang);
  const add = h("button", { class: "primary", onclick: () => {
    if (!text.value.trim()) return;
    state.data.addText(id, prop.value, text.value.trim(), tag.value); changed();
  } }, t("addText"));
  return section(t("texts"), { count: values.length },
    values.length ? items : h("p", { class: "muted small" }, t("noTexts")),
    addForm(t("addText"), prop, text, h("div", { class: "row" }, tag, add)));
}

/** Web links (aro:externalLink, aro:sourceURL) as reference cards, so the source or evidence can be consulted. */
function linksSection(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const props = o.dataPropertiesFor(types).filter((p) => p.range === ANYURI);
  if (!props.length) return null;
  const values = state.data.literals(id).filter((l) => props.some((p) => p.iri === l.prop));
  const items = values.map((l) => {
    let host = l.value, path = "";
    try { const u = new URL(l.value); host = u.hostname.replace(/^www\./, ""); path = u.pathname + u.search; } catch { /* not a URL */ }
    return h("div", { class: "item ref-card" },
      h("a", { class: "ref-link", href: l.value, target: "_blank", rel: "noopener", title: l.value },
        h("span", { class: "ref-icon" }, "↗"),
        h("span", { class: "ref-text" }, h("strong", {}, host), path && path !== "/" ? h("span", { class: "ref-path" }, path) : null)),
      h("span", { class: "item-label" }, o.label(l.prop, lang)), removeButton(l.quad));
  });
  const prop = h("select", {}, props.map((p) => h("option", { value: p.iri }, o.label(p.iri, lang))));
  const url = h("input", { type: "url", placeholder: t("linkUrl") });
  const add = h("button", { class: "primary", onclick: () => {
    if (!/^https?:\/\//.test(url.value.trim())) return url.focus();
    state.data.addTyped(id, prop.value, url.value.trim(), ANYURI); changed();
  } }, t("addLink"));
  return section(t("references"), { count: values.length },
    values.length ? items : h("p", { class: "muted small" }, t("noLinksHint")),
    addForm(t("addLink"), prop, h("div", { class: "row" }, url, add)));
}

/**
 * Remaining datatype properties (dates, confidence, condition flags...). Properties whose
 * rdfs:domain fits the node are shown directly; general ones (no domain) are folded away.
 */
function otherDataSection(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const props = o.dataPropertiesFor(types).filter((p) => p.range !== LANGSTRING && p.range !== ANYURI);
  if (!props.length) return null;
  const shown = state.data.literals(id).filter((l) => props.some((p) => p.iri === l.prop));
  const items = shown.map((l) => h("div", { class: "kv" }, h("span", { class: "item-label" }, o.label(l.prop, lang)),
    h("span", { class: "kv-value" }, l.value), removeButton(l.quad)));
  const form = (list) => {
    const prop = h("select", {}, list.map((p) => h("option", { value: p.iri, title: o.definition(p.iri, lang) },
      `${o.label(p.iri, lang)} (${shortIri(p.range || "")})`)));
    // closed lists from the catalog (e.g. assessmentOutcome) become a choice; other values are typed
    const allowedValues = (iri) => o.catalog.datatype_properties.find((d) => NS.aro + d.name === iri)?.shacl?.in;
    let value;
    const slot = h("span", { class: "grow" });
    const drawValue = () => {
      const allowed = allowedValues(prop.value);
      value = allowed ? h("select", {}, allowed.map((v) => h("option", { value: v }, v)))
                      : h("input", { type: "text", placeholder: t("value") });
      slot.replaceChildren(value);
    };
    prop.addEventListener("change", drawValue); drawValue();
    const add = h("button", { class: "primary", onclick: () => {
      if (!value.value.trim()) return;
      const p = o.dataProps[prop.value];
      state.data.addTyped(id, p.iri, value.value.trim(), datatypeFor(p, value.value.trim())); changed();
    } }, t("add"));
    return h("div", { class: "form" }, prop, h("div", { class: "row" }, slot, add));
  };
  const specific = props.filter((p) => p.domain);
  const general = props.filter((p) => !p.domain);
  return section(t("data"), { count: shown.length, open: shown.length > 0 }, items,
    specific.length ? addForm(t("addData"), form(specific)) : null,
    general.length ? addForm(t("moreProperties"), form(general)) : null);
}

/** Datatype of a typed value; dates (rdfs:Literal range) take the most precise XSD date type that fits. */
function datatypeFor(prop, value) {
  if (prop.range !== NS.rdfs + "Literal") return prop.range;
  if (/^-?\d{4}$/.test(value)) return NS.xsd + "gYear";
  if (/^-?\d{4}-\d{2}$/.test(value)) return NS.xsd + "gYearMonth";
  if (/^-?\d{4}-\d{2}-\d{2}$/.test(value)) return NS.xsd + "date";
  if (/^-?\d{4}-\d{2}-\d{2}T/.test(value)) return NS.xsd + "dateTime";
  return null;   // validation will report it
}

// ------------------------------------------------------------------ schema constraints
// Cardinalities come from the SHACL shapes (validation/aro-shapes.ttl), so the forms offer
// only what the ontology allows and flag what it requires.
function shapes() {
  const o = state.ontology;
  return o._shapes || (o._shapes = readShapes(o.shapesText));
}

/** {min, max} for property `prop` on an individual with `types` (null = unconstrained). */
function limits(types, prop) {
  let min = null, max = null;
  for (const s of shapes()) {
    if (s.path !== prop || !s.target || !state.ontology.isA(types, s.target)) continue;
    if (s.min !== null) min = Math.max(min ?? 0, s.min);
    if (s.max !== null) max = Math.min(max ?? Infinity, s.max);
  }
  return { min, max };
}

/** How many values `node` already has for `prop`. */
function countOf(node, prop) {
  return state.data.outgoing(node).filter((r) => r.prop === prop).length;
}

/** A class with all its subclasses, minus vocabulary types and agent role mixins (created elsewhere). */
function creatableClasses(classes) {
  const o = state.ontology;
  const all = new Set();
  classes.filter((c) => o.classes[c]).forEach((c) => o.withSubclasses(c).forEach((k) => all.add(k)));
  return [...all].filter((c) => o.isCreatable(c));
}

/** For W3C selector nodes: show and edit oa:value / oa:exact / oa:start ... */
function selectorFields(id, types) {
  if (!types.some((x) => x.startsWith(NS.oa))) return null;
  const items = state.data.literals(id).map((l) => h("div", { class: "kv" }, h("span", { class: "item-label" }, shortIri(l.prop)), h("code", {}, l.value)));
  return section(t("selector"), items);
}

/** One relation line: relation name, the node at the other end (clickable), remove. */
function relationRow(prop, other, quad, arrow) {
  const o = state.ontology;
  const label = o.objectProps[prop] ? o.label(prop, uiLanguage()) : shortIri(prop);
  return h("div", { class: "rel-row" },
    tip(h("span", { class: "rel-label" }, arrow, " ", label), () => describe({ edge: arrow === "→" ? { prop, source: state.selected, target: other } : { prop, source: other, target: state.selected } })),
    nodePill(other), quad ? removeButton(quad) : null);
}

/** Outgoing relations and the form to add a new one, adapted to the property's range. */
function relationsSection(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const out = state.data.outgoing(id);
  const items = out.map(({ prop, target, quad }) => relationRow(prop, target, quad, "→"));

  // Properties allowed by rdfs:domain, minus those already at their SHACL maximum;
  // required ones (sh:minCount) are starred and listed while missing.
  const all = o.propertiesFor(types).sort((a, b) => o.label(a.iri, lang).localeCompare(o.label(b.iri, lang)));
  const missing = all.filter((p) => (limits(types, p.iri).min ?? 0) > countOf(id, p.iri));
  const props = all.filter((p) => { const { max } = limits(types, p.iri); return max === null || countOf(id, p.iri) < max; });
  const prop = h("select", {}, props.map((p) => h("option", { value: p.iri, title: o.definition(p.iri, lang) },
    `${missing.includes(p) ? "* " : ""}${o.label(p.iri, lang)} (${p.name})`)));
  const firstMissing = props.find((p) => missing.includes(p));
  if (firstMissing) prop.value = firstMissing.iri;
  const targetBox = h("div", { class: "form" });
  const refresh = () => targetBox.replaceChildren(...targetForm(id, o.objectProps[prop.value]));
  prop.addEventListener("change", refresh);
  refresh();
  const warning = missing.length
    ? h("p", { class: "required" }, `${t("missingRequired")}: ${missing.map((p) => o.label(p.iri, lang)).join(", ")}`) : null;
  return section(t("relations"), { count: out.length }, warning,
    items.length ? items : h("p", { class: "muted small" }, t("noRelations")),
    props.length ? addForm(t("addRelation"), prop, targetBox) : null);
}

/**
 * Source chooser for a relation arriving at node `id` through property `p`: an existing node
 * of the property's domain (not yet at its SHACL maximum) or a new one.
 */
function sourceForm(id, p) {
  const o = state.ontology, lang = uiLanguage();
  const sources = state.data.nodes().filter((n) => n !== id && p.domain.some((d) => o.isA(state.data.types(n), d))
    && !state.data.outgoing(n).some((r) => r.prop === p.iri && r.target === id)
    && (() => { const { max } = limits(state.data.types(n), p.iri); return max === null || countOf(n, p.iri) < max; })());
  const classes = creatableClasses(p.domain);
  const mode = h("select", {},
    sources.length ? h("option", { value: "existing" }, t("existingNode")) : null,
    classes.length ? h("option", { value: "new" }, t("newNode")) : null);
  const inner = h("div", { class: "form" });
  const drawInner = () => {
    if (mode.value === "existing") {
      const sel = h("select", {}, sources.map((n) => h("option", { value: n }, displayName(n))));
      inner.replaceChildren(sel, h("button", { class: "primary", onclick: () => {
        state.data.link(sel.value, p.iri, id); state.graph.show(sel.value); changed();
      } }, t("add")));
    } else {
      const cls = h("select", {}, classes.map((c) => h("option", { value: c }, o.label(c, lang))));
      const name = h("input", { placeholder: t("nodeName") });
      inner.replaceChildren(cls, name, h("button", { class: "primary", onclick: () => {
        const n = state.data.createNode(cls.value, name.value.trim(), state.contentLang);
        state.data.link(n, p.iri, id); state.graph.show(n); changed();
      } }, t("add")));
    }
  };
  mode.addEventListener("change", drawInner);
  if (mode.options.length) drawInner();
  return [h("label", {}, t("sourceNode")), mode, inner];
}

/** Target chooser for a relation: selector, vocabulary concept, external agent, or ARO individual. */
function targetForm(id, prop) {
  if (!prop) return [];
  const o = state.ontology, lang = uiLanguage();

  // 1. W3C Web Annotation selector (range oa:Selector)
  if (prop.range.includes(NS.oa + "Selector")) {
    const type = h("select", {}, Object.keys(SELECTORS).map((s) => h("option", { value: s }, s)));
    const fields = h("div", { class: "form" });
    const draw = () => fields.replaceChildren(...SELECTORS[type.value].map(([f, ph]) => h("input", { name: f, placeholder: `oa:${f}  ${ph}` })));
    type.addEventListener("change", draw); draw();
    return [h("label", {}, t("selectorType")), type, fields, h("button", { onclick: () => {
      const values = [...fields.querySelectorAll("input")].filter((i) => i.value.trim());
      if (!values.length) return;
      const sel = state.data.freshIri("selector");
      state.data.addType(sel, NS.oa + type.value);
      for (const i of values) {
        const integer = i.name === "start" || i.name === "end";
        state.data.addTyped(sel, NS.oa + i.name, i.value.trim(), integer ? NS.xsd + "nonNegativeInteger" : null);
      }
      state.data.link(id, prop.iri, sel); state.graph.show(sel); changed();
    } }, t("add"))];
  }

  // 2. Controlled vocabulary concept (range is a high-order «type» class)
  const vocab = prop.range.find((r) => o.isVocabularyClass(r));
  if (vocab) {
    const concepts = conceptOptions(vocab);
    const sel = h("select", {}, concepts);
    const help = h("p", { class: "muted small" });
    const explain = () => { help.textContent = o.definition(sel.value, lang); };
    sel.addEventListener("change", explain); explain();
    return [h("label", {}, t("concept")), sel, help, h("button", { onclick: () => {
      state.data.link(id, prop.iri, sel.value); state.graph.show(sel.value); changed();
    } }, t("add"))];
  }

  // 3. Existing compatible nodes, a new node, or (for agent role mixins) an external IRI
  const compatible = state.data.nodes().filter((n) => n !== id && prop.range.some((r) => o.isA(state.data.types(n), r)));
  const mode = h("select", {});
  const box = h("div", { class: "form" });
  const modes = [];
  if (compatible.length) modes.push(["existing", t("existingNode")]);
  const creatable = creatableClasses(prop.range);   // range classes and their subclasses
  if (creatable.length) modes.push(["new", t("newNode")]);
  if (prop.range.some((r) => o.isAgentClass(r) || !o.classes[r])) modes.push(["external", t("externalIri")]);
  mode.replaceChildren(...modes.map(([v, l]) => h("option", { value: v }, l)));

  const draw = () => {
    if (mode.value === "existing") {
      const sel = h("select", {}, compatible.map((n) => h("option", { value: n }, displayName(n))));
      box.replaceChildren(sel, h("button", { onclick: () => { state.data.link(id, prop.iri, sel.value); state.graph.show(sel.value); changed(); } }, t("add")));
    } else if (mode.value === "new") {
      const cls = h("select", {}, creatable.map((c) => h("option", { value: c }, o.label(c, lang))));
      const name = h("input", { placeholder: t("nodeName") });
      box.replaceChildren(cls, name, h("button", { onclick: () => {
        const n = state.data.createNode(cls.value, name.value.trim(), state.contentLang);
        state.data.link(id, prop.iri, n); state.graph.show(n); changed();
      } }, t("add")));
    } else {
      const iri = h("input", { type: "url", placeholder: "https://www.wikidata.org/entity/Q…" });
      const type = h("select", {}, h("option", { value: "" }, "—"), AGENT_TYPES.map((x) => h("option", { value: x }, shortIri(x))));
      const name = h("input", { placeholder: t("externalName") });
      box.replaceChildren(iri, h("div", { class: "row" }, h("label", {}, t("externalType")), type), name, h("button", { onclick: () => {
        const target = iri.value.trim() || state.data.freshIri(name.value.trim() || "agent");
        if (type.value) state.data.addType(target, type.value);
        if (name.value.trim()) state.data.addTyped(target, NS.schema + "name", name.value.trim(), null);
        state.data.link(id, prop.iri, target); state.graph.show(target); changed();
      } }, t("add")));
    }
  };
  mode.addEventListener("change", draw); draw();
  return [h("label", {}, t("target")), mode, box];
}

/** Concepts of a vocabulary as <option>s, indented under their broader concept. */
function conceptOptions(vocabClass) {
  const o = state.ontology, lang = uiLanguage();
  const concepts = o.concepts[vocabClass];
  const broader = (c) => o.store.getObjects(c, NS.skos + "broader", null)[0]?.value;
  const children = (p) => concepts.filter((c) => broader(c) === p).sort((a, b) => o.label(a, lang).localeCompare(o.label(b, lang)));
  const out = [];
  const walk = (c, depth) => {
    out.push(h("option", { value: c, title: o.definition(c, lang) }, "  ".repeat(depth) + o.label(c, lang)));
    children(c).forEach((k) => walk(k, depth + 1));
  };
  children(undefined).forEach((c) => walk(c, 0));
  return out;
}

function incomingSection(id) {
  const items = state.data.incoming(id).map(({ prop, source, quad }) => relationRow(prop, source, quad, "←"));
  return items.length ? section(t("incoming"), { count: items.length }, items) : null;
}

function displayName(id) {
  const o = state.ontology;
  if (o.isConcept(id)) return o.label(id, uiLanguage());
  return state.data.name(id, state.contentLang) || localName(id);
}

/** Select a node, making it visible in the graph first. */
function focusNode(id) {
  state.graph.show(id);
  state.selected = id;
  changed();
  state.graph.select(id);
}

// ------------------------------------------------------------------ actions
// ------------------------------------------------------------------ creating linked nodes
/** Types of any node: its rdf:types, or for a vocabulary concept, its types in the ontology. */
function typesOf(n) {
  const own = state.data.types(n);
  return own.length ? own : state.ontology.conceptTypes(n);
}

/** True if node `n` may fill a slot whose allowed classes are `classes` (rdfs:domain or rdfs:range). */
function fits(n, classes) {
  const o = state.ontology, types = typesOf(n);
  return classes.some((c) => o.isA(types, c)
    // agents come from external vocabularies: an untyped-by-ARO resource can fill a «roleMixin» slot
    || (o.isAgentClass(c) && !types.some((x) => o.classes[x]) && !o.isConcept(n)));
}

/** Create a node of `cls` named `name` and, optionally, link it as described by `link`. */
function createLinked(cls, name, link) {
  const id = state.data.createNode(cls, name, state.contentLang);
  if (link) {
    if (link.dir === "out") state.data.link(id, link.prop.iri, link.node);
    else state.data.link(link.node, link.prop.iri, id);
    state.graph.show(link.node);
  }
  return id;
}

// ------------------------------------------------------------------ right-click menu
function closeContextMenu() {
  $("#context-menu").hidden = true;
}

/** Context menu of a node: create a linked node, show full text, neighbours, focus, hide. */
function showContextMenu(id, event) {
  const menu = $("#context-menu");
  const item = (label, action) => h("button", { class: "item", onclick: () => { closeContextMenu(); action(); } }, label);
  const isIndividual = state.data.types(id).some((x) => state.ontology.classes[x]);
  const full = state.graph.fullText.has(id);
  menu.replaceChildren(
    h("div", { class: "muted small", style: "padding:4px 8px" }, short(displayName(id), 60)),
    isIndividual ? item("↓ " + t("addChild"), () => openAddPanel(id, "children")) : null,
    isIndividual || state.ontology.isConcept(id) ? item("↑ " + t("addParent"), () => openAddPanel(id, "parents")) : null,
    item((full ? "↤ " : "↦ ") + t(full ? "hideFullText" : "showFullText"), () => {
      if (full) state.graph.fullText.delete(id); else state.graph.fullText.add(id);
      changed();
    }),
    item("⊕ " + t("toggleNeighbours"), () => { state.graph.toggle(id); state.graph.select(id); }),
    item(t("focusOpen"), async () => { await saveDraft(); window.open(`?focus=${encodeURIComponent(id)}`, "_blank"); }),
    id !== state.graph.focus ? item("⊘ " + t("hideNode"), () => hideNode(id)) : null);
  menu.hidden = false;
  // keep the menu inside the window
  const x = Math.min(event.clientX, window.innerWidth - 380), y = Math.min(event.clientY, window.innerHeight - 260);
  menu.style.left = `${Math.max(4, x)}px`;
  menu.style.top = `${Math.max(4, y)}px`;
  state.selected = id; renderInspector(); renderAddPanel(); state.graph.select(id);
}

/** Open the left panel on the children or parents that the node's type allows. */
function openAddPanel(id, tab) {
  setPanel("left", true);
  addUi.tab = tab; addUi.filter = ""; addUi.open = null;
  focusNode(id);
  const section = $("#add-panel").closest("details");
  if (section) section.open = true;
  $("#add-panel").scrollIntoView({ block: "start", behavior: "smooth" });
}

/** Inspector: the node's main text, readable and expandable, with a switch for the graph card. */
function contentSection(id) {
  const lits = state.data.literals(id).filter((l) => l.prop === NS.aro + "textValue");
  if (!lits.length) return null;
  const main = lits.find((l) => l.lang === state.contentLang.toLowerCase()) || lits.find((l) => l.lang === "en") || lits[0];
  const full = state.graph.fullText.has(id);
  return section(t("content"),
    expandable(h("div", { class: "content-card", lang: main.lang || undefined }, main.value), 8),
    main.value.length > 60 ? h("button", { class: "link", onclick: () => {
      if (full) state.graph.fullText.delete(id); else state.graph.fullText.add(id);
      changed();
    } }, t(full ? "hideFullText" : "showFullText")) : null);
}

async function saveFile() {
  const ttl = await state.data.toTurtle();
  const url = URL.createObjectURL(new Blob([ttl], { type: "text/turtle" }));
  const a = h("a", { href: url, download: "aro-annotations.ttl" });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status(t("saved"));
}

function loadText(text, label) {
  try {
    const n = state.data.loadTurtle(text);
    $("#base-iri").value = state.data.base;   // new nodes will use the loaded file's namespace
    state.graph.hiddenWorks.clear(); state.graph.hiddenNodes.clear();   // a new file starts fully shown
    state.graph.showRoots();
    state.selected = null;
    changed({ relayout: true });
    status(`${t("loaded")}: ${label} (${n} ${t("triples")})` + (state.data.migrated ? ` · ${t("migratedNote")}` : ""));
    savePrefs();
  } catch (err) {
    alert(`${t("loadError")}\n${err.message}`);
  }
}

// ------------------------------------------------------------------ CQ / RQ queries
/** Panel listing the queries of queries/ (questions in the interface language), editable and runnable. */
async function openQueries() {
  const panel = $("#queries-panel");
  if (panel.childElementCount) { panel.replaceChildren(); return; }   // the button toggles the panel
  let list;
  try { list = await queryIndex(); } catch (err) { status(`${t("queryError")} ${err.message}`); return; }
  const pt = uiLanguage() === "pt-BR";
  const select = h("select", {}, list.map((q, i) => h("option", { value: i }, `${q.id} — ${pt ? q.question_pt : q.question_en}`)));
  const editor = h("textarea", { rows: 10, spellcheck: "false" });
  const output = h("div", {});
  // loading a query is asynchronous: "Run" waits for it, so it always runs the chosen query
  let loading = null;
  const load = () => (loading = queryText(list[Number(select.value)].file).then((text) => {
    editor.value = withLanguage(text); output.replaceChildren();
  }));
  select.addEventListener("change", load);
  const run = h("button", { class: "primary", onclick: async () => { await loading; executeQuery(editor.value, output); } }, t("run"));
  // texts and labels in the results follow the content language (falling back to others)
  const withLanguage = (text) => text.replace(/VALUES \?lang \{ "[^"]*" \}/g, `VALUES ?lang { "${state.contentLang}" }`);
  floatPanel(panel, t("queriesTitle"),
    h("p", { class: "muted small" }, t("queriesNote")),
    h("div", { class: "row" }, select, run),
    h("details", {}, h("summary", {}, t("showSparql")), editor),
    output);
  await load();
}

/** Run one SELECT query over the annotations + ontology and show a table of results. */
async function executeQuery(sparql, output) {
  output.replaceChildren(h("p", { class: "muted small" }, t("loadingEngine")));
  try {
    const { vars, rows } = await runSelect(sparql, await state.data.toTurtle(), state.ontology.ttlText);
    if (!rows.length) { output.replaceChildren(h("p", {}, t("noRows"))); return; }
    const nodes = new Set(state.data.nodes());
    // IRIs of annotated nodes become links that select the node in the graph
    const cell = (term) => {
      if (!term) return h("td", {});
      if (term.termType === "NamedNode") {
        return h("td", {}, nodes.has(term.value)
          ? h("button", { class: "link", onclick: () => focusNode(term.value) }, displayName(term.value))
          : (state.ontology.isConcept(term.value) ? state.ontology.label(term.value, uiLanguage()) : shortIri(term.value)));
      }
      return h("td", {}, term.value);
    };
    output.replaceChildren(
      h("p", { class: "muted small" }, `${rows.length} ${t("rows")}`),
      h("table", { class: "results" }, h("tr", {}, vars.map((v) => h("th", {}, v))),
        rows.map((r) => h("tr", {}, r.map(cell)))));
  } catch (err) {
    output.replaceChildren(h("p", { class: "error" }, `${t("queryError")} ${err.message || err}`));
  }
}

function runValidation() {
  const problems = validate(state.data, state.ontology, uiLanguage());
  const list = problems.length
    ? h("ul", {}, problems.map((p) => h("li", {}, h("button", { class: "link", onclick: () => focusNode(p.node) }, displayName(p.node)), " — ", p.message)))
    : h("p", {}, "✅ " + t("validationOk"));
  floatPanel($("#validation"), t("validationTitle"), list, h("p", { class: "muted small" }, t("validationNote")));
}

function status(msg) {
  $("#status").textContent = msg;
}

// ------------------------------------------------------------------ start-up
async function main() {
  const prefs = loadPrefs();
  setUiLanguage(prefs.ui || (navigator.language?.startsWith("pt") ? "pt-BR" : "en"));
  state.contentLang = prefs.content || uiLanguage();
  if (prefs.base) state.data.base = prefs.base;
  try {
    state.ontology = await loadOntology("../ontology/src/aro.ttl", "../model/conceptual-model.json");
  } catch (err) {
    document.body.replaceChildren(h("p", { class: "error" }, t("startError"), h("br"), String(err.message || err)));
    return;
  }
  state.graph = new GraphView($("#graph"), {
    onSelect: (id) => { closeContextMenu(); state.selected = id; addUi.open = null; renderInspector(); renderAddPanel(); },
    onContext: (id, event) => showContextMenu(id, event),
    describe,
  });
  // menus, hideable/resizable panels; the graph is redrawn whenever its area changes size
  initLayout(() => state.graph.cy.resize());
  // the browser's own menu is replaced by the node menu inside the graph
  $("#graph").addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeContextMenu(); });
  document.addEventListener("mousedown", (e) => { if (!$("#context-menu").contains(e.target)) closeContextMenu(); });
  state.graph.data = state.data;   // the Data object is kept; loading a file only replaces its store

  // Toolbar events
  $("#ui-lang").addEventListener("change", (e) => { setUiLanguage(e.target.value); savePrefs(); renderToolbar(); changed(); });
  $("#content-lang").addEventListener("change", (e) => {
    let lang = e.target.value;
    if (lang === "__other") lang = (prompt(t("otherLanguagePrompt")) || "").trim() || state.contentLang;
    state.contentLang = lang; savePrefs(); renderToolbar(); changed();
  });
  $("#base-iri").addEventListener("change", (e) => { state.data.base = e.target.value.trim() || state.data.base; savePrefs(); });
  $("#new").addEventListener("click", () => { if (confirm(t("confirmNew"))) { state.data.clear(); state.graph.visible.clear(); state.graph.hiddenWorks.clear(); state.graph.hiddenNodes.clear(); state.selected = null; changed(); } });
  $("#load").addEventListener("click", () => $("#file").click());
  $("#file").addEventListener("change", async (e) => { const f = e.target.files[0]; if (f) loadText(await f.text(), f.name); e.target.value = ""; });
  $("#example").addEventListener("click", async () => loadText(await fetch("../examples/case-studies.ttl").then((r) => r.text()), "case-studies.ttl"));
  $("#save").addEventListener("click", saveFile);
  $("#save-menu").addEventListener("click", saveFile);
  $("#validate").addEventListener("click", runValidation);
  $("#queries").addEventListener("click", openQueries);
  $("#layout-mode").addEventListener("change", (e) => { state.graph.mode = e.target.value; state.graph.layout(); });
  $("#relayout").addEventListener("click", () => state.graph.layout());
  $("#edge-labels").addEventListener("change", (e) => state.graph.setEdgeLabels(e.target.checked));
  $("#full-text").addEventListener("change", (e) => { state.graph.textMode = e.target.checked ? "full" : "short"; changed(); });
  $("#show-all").addEventListener("click", () => { state.graph.showAll(); changed({ relayout: true }); });
  $("#show-works").addEventListener("click", () => { state.graph.showRoots(); changed({ relayout: true }); });
  $("#export-png").addEventListener("click", exportPng);
  $("#print").addEventListener("click", printView);

  renderToolbar();
  // Restore the last session's draft, if any
  let draft = null;
  try { draft = localStorage.getItem(DRAFT_KEY); } catch { /* storage unavailable */ }
  if (draft) { state.data.loadTurtle(draft); if (prefs.base) state.data.base = prefs.base; }

  // Focus mode (?focus=<IRI>): only that node and its neighbourhood, in its own tab
  const focus = new URLSearchParams(location.search).get("focus");
  if (focus && state.data.nodes().includes(focus)) startFocus(focus);
  else state.graph.showRoots();
  changed({ relayout: true });

  // Keep tabs in sync: another tab (e.g. a focus tab) saved the draft
  window.addEventListener("storage", (e) => {
    if (e.key !== DRAFT_KEY || !e.newValue) return;
    state.data.loadTurtle(e.newValue);
    if (state.graph.focus) state.graph.setFocus(state.graph.focus, Number($("#focus-depth")?.value || 1));
    changed();
  });
}

/** Turn this tab into a focus view of one node, with a depth selector and a way out. */
function startFocus(id) {
  state.selected = id;
  state.graph.setFocus(id, 1);
  document.body.classList.add("focus-mode");
  const depth = h("select", { id: "focus-depth" }, [1, 2, 3].map((d) => h("option", { value: d }, d)));
  depth.addEventListener("change", () => { state.graph.setFocus(id, Number(depth.value)); changed({ relayout: true }); });
  $("#focus-bar").replaceChildren(
    h("strong", {}, `${t("focusTitle")}: `), short(displayName(id), 90), " · ", t("depth"), " ", depth, " ",
    h("a", { href: location.pathname, class: "button" }, t("closeFocus")));
  document.title = `${t("focusTitle")}: ${short(displayName(id), 50)}`;
}

function short(text, n) {
  return text.length > n ? text.slice(0, n - 1) + "…" : text;
}

// ------------------------------------------------------------------ image / print
function download(url, filename) {
  const a = h("a", { href: url, download: filename });
  document.body.append(a); a.click(); a.remove();
}

/** Download the whole graph as a PNG image. */
function exportPng() {
  download(state.graph.png(), state.graph.focus ? `aro-focus-${localName(state.graph.focus)}.png` : "aro-graph.png");
}

/**
 * Print (or "Save as PDF" in the browser's print dialog): a page with the graph image
 * and, when a node is selected, its details as shown in the inspector.
 */
function printView() {
  const details = state.selected ? $("#inspector").cloneNode(true) : null;
  if (details) {
    details.querySelectorAll(".actions, details.subtle, button:not(.pill), select, input, textarea, .form, h4").forEach((el) => el.remove());
    details.querySelectorAll("details").forEach((d) => { d.open = true; });
  }
  $("#print-area").replaceChildren(
    h("h1", {}, state.graph.focus ? `${t("focusTitle")}: ${displayName(state.graph.focus)}` : t("title")),
    h("p", { class: "muted small" }, `${t("printedOn")} ${new Date().toLocaleString(uiLanguage())}`),
    h("img", { src: state.graph.png(), alt: "graph" }),
    details ? h("div", { class: "print-details" }, ...details.childNodes) : null);
  setTimeout(() => window.print(), 100);   // let the image load first
}

main();
