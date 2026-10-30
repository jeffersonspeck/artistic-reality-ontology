// ARO Annotator: wires the ontology, the user's data, the graph view and the inspector.
// Everything runs in the browser; files are only read from and saved to the user's disk.

import { loadOntology, NS, localName } from "./ontology.js";
import { Data } from "./data.js";
import { GraphView, shortIri } from "./graph.js";
import { validate, readShapes } from "./validate.js";
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
const AGENT_TYPES = [NS.schema + "Person", NS.schema + "MusicGroup", NS.schema + "Organization", NS.foaf + "Person", NS.prov + "Agent"];

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
  renderClassPicker();
}

/** Class picker grouped by package; vocabulary types and agent role mixins are created through relations. */
function renderClassPicker() {
  const o = state.ontology;
  const suffix = uiLanguage() === "pt-BR" ? "pt" : "en";
  const groups = o.packages.map((p) => {
    const options = Object.values(o.classes)
      .filter((c) => c.package === p.name && !o.isVocabularyClass(c.iri) && !o.isAgentClass(c.iri))
      .map((c) => h("option", { value: c.iri, title: o.definition(c.iri, uiLanguage()) }, o.label(c.iri, uiLanguage())));
    return h("optgroup", { label: p["label_" + suffix] }, options);
  });
  $("#class-select").replaceChildren(...groups);
  updateClassHelp();
}

function updateClassHelp() {
  const iri = $("#class-select").value;
  $("#class-help").textContent = iri ? state.ontology.definition(iri, uiLanguage()) : "";
}

// ------------------------------------------------------------------ inspector
function renderInspector() {
  const box = $("#inspector");
  const id = state.selected;
  if (!id || !state.data.nodes().includes(id)) { box.replaceChildren(h("p", { class: "muted" }, t("emptyInspector"))); return; }
  const o = state.ontology;
  // Panels return optional sections as null; drop them before inserting
  const show = (parts) => box.replaceChildren(...parts.filter(Boolean));
  if (o.isConcept(id)) return show(conceptPanel(id));
  const types = state.data.types(id);
  if (!types.some((x) => o.classes[x])) return show(externalPanel(id, types));
  show(individualPanel(id, types));
}

/** Open/close neighbours (same as double-click), open the node alone in a focus tab, hide it. */
function toggleButton(id) {
  const isWork = state.data.types(id).includes(NS.aro + "Artwork");
  return h("div", {},
    h("p", { class: "row" },
      h("button", { onclick: () => { state.graph.toggle(id); state.graph.select(id); } }, "⊕ " + t("toggleNeighbours")),
      h("button", { onclick: async () => { await saveDraft(); window.open(`?focus=${encodeURIComponent(id)}`, "_blank"); } }, t("focusOpen"))),
    h("p", { class: "row" },
      isWork ? h("button", { onclick: () => onlyWork(id) }, "◎ " + t("onlyThisWork")) : null,
      id !== state.graph.focus ? h("button", { onclick: () => hideNode(id) }, "⊘ " + t("hideNode")) : null));
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

/** On a Manifestation: attach / remove the local text. */
function sourceTextSection(id, types) {
  if (!state.ontology.isA(types, NS.aro + "Manifestation")) return null;
  const text = localTexts()[id];
  const input = h("input", { type: "file", accept: ".txt,text/plain", hidden: true });
  input.addEventListener("change", async () => {
    const f = input.files[0]; if (!f) return;
    setLocalText(id, await f.text()); renderInspector();
  });
  return section(t("sourceText"),
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

function conceptPanel(id) {
  const o = state.ontology, lang = uiLanguage();
  return [h("h2", {}, o.label(id, lang)), toggleButton(id), h("p", { class: "muted" }, t("readOnly")),
          h("p", {}, o.definition(id, lang)), h("p", { class: "iri" }, shortIri(id)), incomingSection(id)];
}

function externalPanel(id, types) {
  return [h("h2", {}, state.data.name(id, state.contentLang) || localName(id)),
          toggleButton(id),
          h("p", { class: "muted" }, t("external")),
          h("p", { class: "iri" }, h("a", { href: id, target: "_blank", rel: "noopener" }, id)),
          types.length ? h("p", {}, types.map(shortIri).join(", ")) : null,
          incomingSection(id), deleteButton(id)];
}

function individualPanel(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const cls = types.find((x) => o.classes[x]);
  const name = state.data.name(id, state.contentLang) || localName(id);
  return [
    h("h2", {}, name),
    h("p", {}, h("span", { class: "badge", style: `background:${o.packageColor(o.packageOf(cls))}` }, o.label(cls, lang)),
      " ", h("span", { class: "muted small" }, o.definition(cls, lang))),
    h("p", { class: "iri" }, id),
    toggleButton(id),
    SEARCHABLE.some((c) => o.isA(types, c)) ? googleButton(id) : null,
    excerptSection(id, types),
    sourceTextSection(id, types),
    textsSection(id, types),
    linksSection(id, types),
    selectorFields(id, types),
    otherDataSection(id, types),
    relationsSection(id, types),
    incomingSection(id),
    incomingForm(id, types),
    deleteButton(id),
  ];
}

/** Opens a Google search for the node's text in the content language (to investigate real cases). */
function googleButton(id) {
  const query = state.data.name(id, state.contentLang) || localName(id);
  const url = "https://www.google.com/search?q=" + encodeURIComponent(query);
  return h("p", {}, h("a", { class: "button", href: url, target: "_blank", rel: "noopener" }, "🔎 " + t("searchGoogle")));
}

function section(title, ...children) {
  return h("section", { class: "panel" }, h("h3", {}, title), ...children);
}

function langSelect(selected) {
  const langs = [...new Set([...CONTENT_LANGUAGES, selected])];
  return h("select", { class: "lang" }, langs.map((l) => h("option", { value: l, selected: l === selected }, l)));
}

/** Language-tagged texts (aro:textValue, aro:derivationExtent...), one value per language allowed. */
function textsSection(id, types) {
  const o = state.ontology;
  const props = o.dataPropertiesFor(types).filter((p) => p.range === LANGSTRING);
  if (!props.length) return null;
  const items = state.data.literals(id).filter((l) => props.some((p) => p.iri === l.prop)).map((l) =>
    h("li", {}, h("span", { class: "lang-tag" }, l.lang || "—"), " ", h("span", { class: "muted small" }, o.label(l.prop, uiLanguage()) + ": "),
      l.value, " ", h("button", { class: "link", onclick: () => { state.data.removeQuad(l.quad); changed(); } }, t("remove"))));
  const prop = h("select", {}, props.map((p) => h("option", { value: p.iri }, o.label(p.iri, uiLanguage()))));
  const text = h("textarea", { rows: 2 });
  const lang = langSelect(state.contentLang);
  const add = h("button", { onclick: () => {
    if (!text.value.trim()) return;
    state.data.addText(id, prop.value, text.value.trim(), lang.value); changed();
  } }, t("addText"));
  return section(t("texts"), h("ul", {}, items), h("div", { class: "form" }, prop, text, h("div", { class: "row" }, lang, add)));
}

/** Web links (aro:externalLink, aro:sourceURL): clickable so the source or evidence can be consulted. */
function linksSection(id, types) {
  const o = state.ontology;
  const props = o.dataPropertiesFor(types).filter((p) => p.range === ANYURI);
  const values = state.data.literals(id).filter((l) => props.some((p) => p.iri === l.prop));
  const items = values.map((l) => h("li", {}, "🔗 ", h("a", { href: l.value, target: "_blank", rel: "noopener" }, l.value),
    " ", h("span", { class: "muted small" }, `(${o.label(l.prop, uiLanguage())})`), " ",
    h("button", { class: "link", onclick: () => { state.data.removeQuad(l.quad); changed(); } }, t("remove"))));
  const prop = h("select", {}, props.map((p) => h("option", { value: p.iri }, o.label(p.iri, uiLanguage()))));
  const url = h("input", { type: "url", placeholder: t("linkUrl") });
  const add = h("button", { onclick: () => {
    if (!/^https?:\/\//.test(url.value.trim())) return url.focus();
    state.data.addTyped(id, prop.value, url.value.trim(), ANYURI); changed();
  } }, t("addLink"));
  return section(t("links"), values.length ? h("ul", {}, items) : h("p", { class: "muted small" }, t("noLinksHint")),
                 h("div", { class: "row" }, prop, url, add));
}

/**
 * Remaining datatype properties (dates, confidence, condition flags...). Properties whose
 * rdfs:domain fits the node are shown directly; general ones (no domain) are folded away.
 */
function otherDataSection(id, types) {
  const o = state.ontology;
  const props = o.dataPropertiesFor(types).filter((p) => p.range !== LANGSTRING && p.range !== ANYURI);
  if (!props.length) return null;
  const shown = state.data.literals(id).filter((l) => props.some((p) => p.iri === l.prop));
  const items = shown.map((l) => h("li", {}, h("span", { class: "muted small" }, o.label(l.prop, uiLanguage()) + ": "), l.value, " ",
    h("button", { class: "link", onclick: () => { state.data.removeQuad(l.quad); changed(); } }, t("remove"))));
  const form = (list) => {
    const prop = h("select", {}, list.map((p) => h("option", { value: p.iri, title: o.definition(p.iri, uiLanguage()) },
      `${o.label(p.iri, uiLanguage())} (${shortIri(p.range || "")})`)));
    const value = h("input", { type: "text", placeholder: t("value") });
    const add = h("button", { onclick: () => {
      if (!value.value.trim()) return;
      const p = o.dataProps[prop.value];
      state.data.addTyped(id, p.iri, value.value.trim(), p.range); changed();
    } }, t("add"));
    return h("div", { class: "row" }, prop, value, add);
  };
  const specific = props.filter((p) => p.domain);
  const general = props.filter((p) => !p.domain);
  return section(t("data"), h("ul", {}, items),
    specific.length ? form(specific) : null,
    general.length ? h("details", {}, h("summary", {}, t("moreProperties")), form(general)) : null);
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
  return [...all].filter((c) => !o.isVocabularyClass(c) && !o.isAgentClass(c));
}

/** For W3C selector nodes: show and edit oa:value / oa:exact / oa:start ... */
function selectorFields(id, types) {
  if (!types.some((x) => x.startsWith(NS.oa))) return null;
  const items = state.data.literals(id).map((l) => h("li", {}, shortIri(l.prop), ": ", h("code", {}, l.value)));
  return section(t("selector"), h("ul", {}, items));
}

/** Outgoing relations and the form to add a new one, adapted to the property's range. */
function relationsSection(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const items = state.data.outgoing(id).map(({ prop, target, quad }) => h("li", {},
    h("span", { class: "muted small" }, (o.objectProps[prop] ? o.label(prop, lang) : shortIri(prop)) + " → "),
    h("button", { class: "link", onclick: () => focusNode(target) }, displayName(target)), " ",
    h("button", { class: "link danger", onclick: () => { state.data.removeQuad(quad); changed(); } }, t("remove"))));

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
    ? h("p", { class: "required" }, `${t("missingRequired")}: ${missing.map((p) => p.name).join(", ")}`) : null;
  return section(t("relations"), warning, h("ul", {}, items),
    props.length ? [h("h4", {}, t("addRelation")), prop, targetBox] : null);
}

/**
 * Relations arriving at this node: properties whose rdfs:range accepts it. The source is an
 * existing node of the property's domain (not yet at its SHACL maximum) or a new one.
 */
function incomingForm(id, types) {
  const o = state.ontology, lang = uiLanguage();
  const props = o.propertiesTargeting(types)
    .filter((p) => p.domain.some((d) => o.classes[d] && !o.isVocabularyClass(d)))
    .sort((a, b) => o.label(a.iri, lang).localeCompare(o.label(b.iri, lang)));
  if (!props.length) return null;
  const prop = h("select", {}, props.map((p) => h("option", { value: p.iri, title: o.definition(p.iri, lang) },
    `${o.label(p.iri, lang)} (${p.name})`)));
  const box = h("div", { class: "form" });
  const draw = () => {
    const p = o.objectProps[prop.value];
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
        inner.replaceChildren(sel, h("button", { onclick: () => {
          state.data.link(sel.value, p.iri, id); state.graph.show(sel.value); changed();
        } }, t("add")));
      } else {
        const cls = h("select", {}, classes.map((c) => h("option", { value: c }, o.label(c, lang))));
        const name = h("input", { placeholder: t("nodeName") });
        inner.replaceChildren(cls, name, h("button", { onclick: () => {
          const n = state.data.createNode(cls.value, name.value.trim(), state.contentLang);
          state.data.link(n, p.iri, id); state.graph.show(n); changed();
        } }, t("add")));
      }
    };
    mode.addEventListener("change", drawInner);
    if (mode.options.length) drawInner();
    box.replaceChildren(h("label", {}, t("sourceNode")), mode, inner);
  };
  prop.addEventListener("change", draw);
  draw();
  return section(t("addAsTarget"), h("p", { class: "muted small" }, t("addAsTargetHelp")), prop, box);
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
  const o = state.ontology;
  const items = state.data.incoming(id).map(({ prop, source }) => h("li", {},
    h("button", { class: "link", onclick: () => focusNode(source) }, displayName(source)),
    h("span", { class: "muted small" }, " — " + (o.objectProps[prop] ? o.label(prop, uiLanguage()) : shortIri(prop)))));
  return items.length ? section(t("incoming"), h("ul", {}, items)) : null;
}

function deleteButton(id) {
  return h("p", {}, h("button", { class: "danger", onclick: () => {
    if (!confirm(t("confirmDelete"))) return;
    state.data.deleteNode(id); state.selected = null; changed();
  } }, t("deleteNode")));
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
function createFromPicker() {
  const cls = $("#class-select").value;
  const name = $("#node-name").value.trim();
  if (!cls) return;
  const id = state.data.createNode(cls, name, state.contentLang);
  $("#node-name").value = "";
  focusNode(id);
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
    status(`${t("loaded")}: ${label} (${n} ${t("triples")})`);
    savePrefs();
  } catch (err) {
    alert(`${t("loadError")}\n${err.message}`);
  }
}

function runValidation() {
  const problems = validate(state.data, state.ontology, uiLanguage());
  const list = problems.length
    ? h("ul", {}, problems.map((p) => h("li", {}, h("button", { class: "link", onclick: () => focusNode(p.node) }, displayName(p.node)), " — ", p.message)))
    : h("p", {}, "✅ " + t("validationOk"));
  $("#validation").replaceChildren(h("h3", {}, t("validationTitle"), " ",
    h("button", { class: "link", onclick: () => $("#validation").replaceChildren() }, t("close"))), list, h("p", { class: "muted small" }, t("validationNote")));
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
  state.graph = new GraphView($("#graph"), { onSelect: (id) => { state.selected = id; renderInspector(); } });
  state.graph.data = state.data;   // the Data object is kept; loading a file only replaces its store

  // Toolbar events
  $("#ui-lang").addEventListener("change", (e) => { setUiLanguage(e.target.value); savePrefs(); renderToolbar(); changed(); });
  $("#content-lang").addEventListener("change", (e) => {
    let lang = e.target.value;
    if (lang === "__other") lang = (prompt(t("otherLanguagePrompt")) || "").trim() || state.contentLang;
    state.contentLang = lang; savePrefs(); renderToolbar(); changed();
  });
  $("#base-iri").addEventListener("change", (e) => { state.data.base = e.target.value.trim() || state.data.base; savePrefs(); });
  $("#class-select").addEventListener("change", updateClassHelp);
  $("#create").addEventListener("click", createFromPicker);
  $("#node-name").addEventListener("keydown", (e) => { if (e.key === "Enter") createFromPicker(); });
  $("#new").addEventListener("click", () => { if (confirm(t("confirmNew"))) { state.data.clear(); state.graph.visible.clear(); state.graph.hiddenWorks.clear(); state.graph.hiddenNodes.clear(); state.selected = null; changed(); } });
  $("#load").addEventListener("click", () => $("#file").click());
  $("#file").addEventListener("change", async (e) => { const f = e.target.files[0]; if (f) loadText(await f.text(), f.name); e.target.value = ""; });
  $("#example").addEventListener("click", async () => loadText(await fetch("../examples/case-studies.ttl").then((r) => r.text()), "case-studies.ttl"));
  $("#save").addEventListener("click", saveFile);
  $("#validate").addEventListener("click", runValidation);
  $("#layout-mode").addEventListener("change", (e) => { state.graph.mode = e.target.value; state.graph.layout(); });
  $("#relayout").addEventListener("click", () => state.graph.layout());
  $("#edge-labels").addEventListener("change", (e) => state.graph.setEdgeLabels(e.target.checked));
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
  if (details) details.querySelectorAll("button, select, input, textarea, .form, h4").forEach((el) => el.remove());
  $("#print-area").replaceChildren(
    h("h1", {}, state.graph.focus ? `${t("focusTitle")}: ${displayName(state.graph.focus)}` : t("title")),
    h("p", { class: "muted small" }, `${t("printedOn")} ${new Date().toLocaleString(uiLanguage())}`),
    h("img", { src: state.graph.png(), alt: "graph" }),
    details ? h("div", { class: "print-details" }, ...details.childNodes) : null);
  setTimeout(() => window.print(), 100);   // let the image load first
}

main();
