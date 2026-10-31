// Screen layout of the annotator: toolbar menus, side panels that can be hidden and resized,
// and floating panels (validation, queries) over the graph that can be minimized, closed and resized.
// The layout is remembered in this browser only; it never goes into the saved .ttl.

import { t } from "./i18n.js";

const LAYOUT_KEY = "aro-annotator-layout";
const MIN_SIDE = 180;                       // narrowest width of a side panel, in pixels
const DEFAULTS = { left: 260, right: 380, leftHidden: false, rightHidden: false, compact: false, float: {} };

let layout = { ...DEFAULTS };
let topZ = 4;                               // stacking order of the floating panels

function load() {
  try { layout = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(LAYOUT_KEY)) }; } catch { layout = { ...DEFAULTS }; }
}
function save() {
  try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch { /* storage unavailable */ }
}

/** Apply widths and visibility to the page (CSS variables and body classes). */
function apply() {
  const main = document.querySelector("main");
  main.style.setProperty("--left-w", `${layout.left}px`);
  main.style.setProperty("--right-w", `${layout.right}px`);
  document.body.classList.toggle("left-hidden", layout.leftHidden);
  document.body.classList.toggle("right-hidden", layout.rightHidden);
  document.body.classList.toggle("compact", layout.compact);
  document.querySelector("#toggle-left")?.classList.toggle("on", !layout.leftHidden);
  document.querySelector("#toggle-right")?.classList.toggle("on", !layout.rightHidden);
}

/** Show or hide a side panel ("left" | "right"); without a value it toggles. */
export function setPanel(side, visible) {
  const key = side === "left" ? "leftHidden" : "rightHidden";
  layout[key] = visible === undefined ? !layout[key] : !visible;
  save(); apply();
}

/** Graph-only view: both side panels hidden and the toolbar reduced to one thin bar; again to restore. */
export function toggleMaximized() {
  const maximized = layout.leftHidden && layout.rightHidden && layout.compact;
  Object.assign(layout, { leftHidden: !maximized, rightHidden: !maximized, compact: !maximized });
  save(); apply();
}

/** Drag a splitter to resize the side panel next to it; double-click hides that panel. */
function splitter(el, side) {
  el.addEventListener("dblclick", () => setPanel(side, false));
  el.addEventListener("pointerdown", (e) => {
    if (e.target !== el) return;               // the reopen button inside a collapsed splitter
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const startX = e.clientX, start = layout[side];
    const max = () => Math.max(MIN_SIDE, window.innerWidth * 0.6);
    const move = (ev) => {
      const dx = side === "left" ? ev.clientX - startX : startX - ev.clientX;
      layout[side] = Math.round(Math.min(max(), Math.max(MIN_SIDE, start + dx)));
      apply();
    };
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); save(); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  });
}

/** Toolbar menus (<details class="menu">): only one open at a time, closed by clicking elsewhere or Esc. */
function menus() {
  const all = [...document.querySelectorAll("details.menu")];
  for (const m of all) {
    m.addEventListener("toggle", () => { if (m.open) all.forEach((o) => { if (o !== m) o.open = false; }); });
    // an action closes its menu; checkboxes and selects keep it open to change several options
    m.querySelector(".menu-body").addEventListener("click", (e) => { if (e.target.closest("button")) m.open = false; });
  }
  document.addEventListener("mousedown", (e) => { for (const m of all) if (!m.contains(e.target)) m.open = false; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") all.forEach((m) => { m.open = false; }); });
}

/**
 * Wire the layout. `resized` is called whenever the graph area changes size
 * (the graph library must be told to redraw at the new size).
 */
export function initLayout(resized) {
  load();
  menus();
  splitter(document.querySelector("#split-left"), "left");
  splitter(document.querySelector("#split-right"), "right");
  document.querySelector("#toggle-left").addEventListener("click", () => setPanel("left"));
  document.querySelector("#toggle-right").addEventListener("click", () => setPanel("right"));
  document.querySelector("#maximize").addEventListener("click", toggleMaximized);
  document.querySelector("#restore").addEventListener("click", toggleMaximized);
  for (const b of document.querySelectorAll("[data-show-panel]")) b.addEventListener("click", () => setPanel(b.dataset.showPanel, true));
  for (const b of document.querySelectorAll("[data-hide-panel]")) b.addEventListener("click", () => setPanel(b.dataset.hidePanel, false));
  apply();
  // the graph follows every change of its area: panels, window size, toolbar wrapping
  new ResizeObserver(() => resized()).observe(document.querySelector("#graph"));
}

/**
 * Fill a floating panel over the graph: a title bar with minimize and close buttons and a
 * grip on the top edge to change its height (remembered per panel).
 */
export function floatPanel(panel, title, ...content) {
  const id = panel.id;
  const body = document.createElement("div");
  body.className = "float-body";
  body.append(...content.filter(Boolean));

  const grip = document.createElement("div");
  grip.className = "float-grip";
  grip.title = t("resizePanel");

  const head = document.createElement("div");
  head.className = "float-head";
  const h3 = document.createElement("h3");
  h3.textContent = title;
  const min = button("–", t("minimize"), () => panel.classList.toggle("minimized"));
  const close = button("×", t("close"), () => { panel.replaceChildren(); panel.classList.remove("minimized"); panel.style.height = ""; });
  head.append(h3, min, close);
  head.addEventListener("dblclick", (e) => { if (e.target === head || e.target === h3) panel.classList.toggle("minimized"); });

  panel.classList.remove("minimized");
  panel.replaceChildren(grip, head, body);
  // the panel opened or clicked last comes to the front when two overlap
  const front = () => { panel.style.zIndex = String(++topZ); };
  front();
  panel.onpointerdown = front;
  if (layout.float[id]) panel.style.height = `${layout.float[id]}px`;

  // drag the top edge: the panel is anchored at the bottom, so moving up makes it taller
  grip.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    const startY = e.clientY, start = panel.getBoundingClientRect().height;
    const limit = panel.parentElement.getBoundingClientRect().height - 24;
    const move = (ev) => {
      panel.classList.remove("minimized");
      panel.style.height = `${Math.round(Math.min(limit, Math.max(80, start + startY - ev.clientY)))}px`;
    };
    const up = () => {
      grip.removeEventListener("pointermove", move); grip.removeEventListener("pointerup", up);
      layout.float[id] = parseInt(panel.style.height, 10); save();
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
  });
  return body;
}

function button(text, title, onclick) {
  const b = document.createElement("button");
  b.className = "icon";
  b.textContent = text;
  b.title = title;
  b.setAttribute("aria-label", title);
  b.addEventListener("click", onclick);
  return b;
}
