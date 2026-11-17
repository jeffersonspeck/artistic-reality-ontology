// 3D view of the graph: the same visible nodes and relations as the 2D view, in a space that
// can be rotated (drag), zoomed (wheel) and panned (right drag), so that relations running back
// and forth between nodes stand apart in depth. Nodes are the 2D cards drawn as sprites that
// always face the camera; a click selects a node, a double click opens or closes its neighbours.
// The library (3d-force-graph on three.js) is loaded from the CDN only when the view is opened.

import { cardCanvas } from "./graph.js";

const FORCE_GRAPH = "https://cdn.jsdelivr.net/npm/3d-force-graph@1.80.1/+esm";
const THREE = "https://cdn.jsdelivr.net/npm/three@0.186.1/+esm";   // the version 3d-force-graph imports
const SCALE = 0.25;            // world units per CSS pixel of a card
const DOUBLE_CLICK_MS = 350;

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export class Graph3D {
  /** host: element that receives the 3D canvas; onSelect(id|null); onToggle(id) opens/closes neighbours. */
  constructor(host, { onSelect, onToggle }) {
    this.host = host;
    this.onSelect = onSelect;
    this.onToggle = onToggle;
    this.fg = null;
    this.positions = new Map();   // node id -> last 3D position, kept across updates
    this.lastClick = null;
  }

  get active() { return !!this.fg; }

  /** Load the library (first time only) and show the graph of `view` (a GraphView). */
  async open(view) {
    if (this.fg) return;
    const [{ default: ForceGraph3D }, three] = await Promise.all([import(FORCE_GRAPH), import(THREE)]);
    this.three = three;
    this.view = view;
    this.el = document.createElement("div");
    this.el.className = "graph3d";    this.host.append(this.el);
    const linkColor = (l) => (l.highlight ? "#2563eb" : "#94a3b8");
    this.fg = new ForceGraph3D(this.el, { controlType: "orbit" })
      .width(this.el.clientWidth).height(this.el.clientHeight)
      .backgroundColor("#f8fafc")
      .showNavInfo(false)
      .warmupTicks(150)            // lay the graph out before the first frame...
      .cooldownTime(3000)          // ...then let it settle for a few seconds
      .nodeThreeObject((n) => this.sprite(n))
      .nodeLabel((n) => n.tip)
      .linkColor(linkColor)
      .linkDirectionalArrowColor(linkColor)
      .linkWidth((l) => (l.highlight ? 1.2 : 0.4))
      .linkOpacity(0.8)
      .linkDirectionalArrowLength(5)
      .linkDirectionalArrowRelPos(0.85)
      .linkCurvature((l) => l.curvature)
      .linkLabel((l) => escapeHtml(l.label))
      .onNodeClick((n) => this.click(n))
      .onBackgroundClick(() => this.onSelect(null));
    this.fg.d3Force("link").distance(70);
    this.fg.d3Force("charge").strength(-160);
    this.resizer = new ResizeObserver(() => this.fg?.width(this.el.clientWidth).height(this.el.clientHeight));
    this.resizer.observe(this.el);
    this.update(view);
  }

  close() {
    this.resizer?.disconnect();
    this.fg?._destructor?.();
    this.el?.remove();
    this.fg = null;
  }

  /** Rebuild the scene from the 2D view (after nodes are opened, closed, edited or relabelled). */
  update(view) {
    if (!this.fg) return;
    this.view = view;
    for (const n of this.fg.graphData().nodes) this.positions.set(n.id, { x: n.x, y: n.y, z: n.z });
    const selected = new Set(view.cy.$("node:selected").map((n) => n.id()));
    const nodes = view.cy.nodes().map((n) => {
      const card = view.cards.get(n.id());
      const kind = card?.querySelector(".nc-kind")?.textContent || "";
      const title = card?.querySelector(".nc-title")?.textContent || n.id();
      return { id: n.id(), tip: escapeHtml(kind ? `${kind}: ${title}` : title), ...this.positions.get(n.id()) };
    });
    // edges between the same two nodes are bent apart, as in 2D
    const pairs = new Map();
    view.cy.edges().forEach((e) => {
      const key = [e.source().id(), e.target().id()].sort().join("\u0000");
      pairs.set(key, (pairs.get(key) || 0) + 1);
    });
    const seen = new Map();
    const links = view.cy.edges().map((e) => {
      const source = e.source().id(), target = e.target().id();
      const key = [source, target].sort().join("\u0000");
      const i = seen.get(key) || 0;
      seen.set(key, i + 1);
      const count = pairs.get(key);
      return { source, target, label: e.data("label"),
               highlight: selected.has(source) || selected.has(target),
               curvature: count > 1 ? 0.25 * (i - (count - 1) / 2) * (source < target ? 1 : -1) : 0 };
    });
    // frame the graph when the view opens or nodes without a 3D position appear
    const reframe = !this.fg.graphData().nodes.length || nodes.some((n) => n.x === undefined);
    this.fg.graphData({ nodes, links });   // the warm-up ticks lay it out right away
    if (reframe) this.fg.zoomToFit(400, 30);
  }

  /** Redraw the cards and relation colours after the selection changed. */
  refresh() {
    if (!this.fg) return;
    const selected = new Set(this.view.cy.$("node:selected").map((n) => n.id()));
    for (const l of this.fg.graphData().links) {
      l.highlight = selected.has(l.source.id ?? l.source) || selected.has(l.target.id ?? l.target);
    }
    this.fg.nodeThreeObject(this.fg.nodeThreeObject());
    this.fg.linkColor(this.fg.linkColor()).linkWidth(this.fg.linkWidth());
  }

  /** A node as its 2D card, drawn on a sprite that always faces the camera. */
  sprite(node) {
    const card = this.view.cards.get(node.id);
    if (!card || !card.offsetWidth) return null;      // default sphere
    const T = this.three;
    const canvas = cardCanvas(card, 2);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    // as in 2D, cards are drawn over the relations (which start at their centres); among
    // themselves they are drawn from the farthest to the nearest, so near cards stay on top
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false }));
    sprite.renderOrder = 20;           // 3d-force-graph draws relations and arrows with order 10
    sprite.scale.set((canvas.width / 2) * SCALE, (canvas.height / 2) * SCALE, 1);
    return sprite;
  }

  click(node) {
    const now = Date.now();
    if (this.lastClick && this.lastClick.id === node.id && now - this.lastClick.time < DOUBLE_CLICK_MS) {
      this.lastClick = null;
      this.onToggle(node.id);
      return;
    }
    this.lastClick = { id: node.id, time: now };
    this.onSelect(node.id);
  }
}
