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
const NEW_NODE_RADIUS = 70;    // distance from a placed neighbour at which a newly opened node appears
const SPHERE_POINTS = 24;      // positions around a node before the next, wider shell

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** The i-th point of evenly spread shells around `c` (Fibonacci sphere). */
function spherePoint(c, i) {
  const k = i % SPHERE_POINTS, r = NEW_NODE_RADIUS * (1 + Math.floor(i / SPHERE_POINTS) * 0.6);
  const y = 1 - (2 * (k + 0.5)) / SPHERE_POINTS, ring = Math.sqrt(1 - y * y), a = k * Math.PI * (3 - Math.sqrt(5));
  return { x: c.x + r * ring * Math.cos(a), y: c.y + r * y, z: c.z + r * ring * Math.sin(a) };
}

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
      // the node "radius" is half the card's diagonal: arrows stop at the edge of the card
      .nodeRelSize(1)
      .nodeVal((n) => n.r ** 3)
      .nodeLabel((n) => n.tip)
      .linkColor(linkColor)
      .linkDirectionalArrowColor(linkColor)
      .linkWidth((l) => (l.highlight ? 1.2 : 0.4))
      .linkOpacity(0.8)
      .linkDirectionalArrowLength(5)
      .linkDirectionalArrowRelPos(1)
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

  /** PNG data URL of the 3D view as it is on screen (same camera angle and zoom), `scale` times sharper. */
  png(scale = 2) {
    const renderer = this.fg.renderer();
    const ratio = renderer.getPixelRatio();
    renderer.setPixelRatio(Math.max(ratio, scale));
    renderer.render(this.fg.scene(), this.fg.camera());   // read the canvas right after drawing it
    const url = renderer.domElement.toDataURL("image/png");
    renderer.setPixelRatio(ratio);
    renderer.render(this.fg.scene(), this.fg.camera());
    return url;
  }

  close() {
    this.resizer?.disconnect();
    this.fg?._destructor?.();
    this.el?.remove();
    this.fg = null;
    this.framed = false;
  }

  /** Rebuild the scene from the 2D view (after nodes are opened, closed, edited or relabelled). */
  update(view) {
    if (!this.fg) return;
    this.view = view;
    for (const n of this.fg.graphData().nodes) {
      if (n.x !== undefined) this.positions.set(n.id, { x: n.x, y: n.y, z: n.z });
    }
    const selected = new Set(view.cy.$("node:selected").map((n) => n.id()));
    const around = new Map();      // placed neighbour -> how many new nodes were put around it
    const nodes = view.cy.nodes().map((n) => {
      const card = view.cards.get(n.id());
      const kind = card?.querySelector(".nc-kind")?.textContent || "";
      const title = card?.querySelector(".nc-title")?.textContent || n.id();
      const r = card ? (Math.hypot(card.offsetWidth, card.offsetHeight) / 2) * SCALE : 4;
      const node = { id: n.id(), r, tip: escapeHtml(kind ? `${kind}: ${title}` : title) };
      const known = this.positions.get(n.id());
      // nodes already placed stay where they are; new ones are set around a placed neighbour
      if (known) return { ...node, ...known, fx: known.x, fy: known.y, fz: known.z };
      const near = n.neighborhood("node").toArray().map((m) => this.positions.get(m.id())).find(Boolean);
      if (!near) return node;
      const i = around.get(near) || 0;
      around.set(near, i + 1);
      const p = spherePoint(near, i);
      this.positions.set(n.id(), p);
      return { ...node, ...p, fx: p.x, fy: p.y, fz: p.z };
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
    this.fg.graphData({ nodes, links });   // the warm-up ticks lay it out right away
    // the camera is framed once, when the view opens; afterwards it stays where the user left it
    if (!this.framed && nodes.length) {
      this.framed = true;
      setTimeout(() => this.fg?.zoomToFit(400, 30), 100);
    }
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

  /**
   * A node as its 2D card, drawn on a sprite that always faces the camera. Cards take part in
   * the depth test, so whatever is nearer the camera (another card or a relation) covers what
   * is behind it. Relations start at the centre of the card, though, and the half of them that
   * comes towards the camera would run over the card's own text: before each frame the card is
   * therefore moved towards the camera by its radius (and scaled down by the same perspective
   * factor, so it looks unchanged), which puts its own relations behind it.
   */
  sprite(node) {
    const card = this.view.cards.get(node.id);
    if (!card || !card.offsetWidth) return null;      // default sphere
    const T = this.three;
    const canvas = cardCanvas(card, 2);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    // alphaTest: the transparent margin around the card neither shows nor hides anything
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.5 }));
    const w = (canvas.width / 2) * SCALE, h = (canvas.height / 2) * SCALE;
    sprite.scale.set(w, h, 1);
    const group = new T.Group();       // positioned by the layout at the node; the sprite moves inside it
    group.add(sprite);
    const toCamera = new T.Vector3(), centre = new T.Vector3();
    sprite.onBeforeRender = (renderer, scene, camera) => {
      group.getWorldPosition(centre);
      toCamera.copy(camera.position).sub(centre);
      const distance = toCamera.length();
      const shift = Math.min(node.r, distance * 0.5);
      sprite.position.copy(toCamera.normalize().multiplyScalar(shift));
      const k = (distance - shift) / distance;   // same apparent size from the nearer position
      sprite.scale.set(w * k, h * k, 1);
      sprite.updateMatrixWorld();
      sprite.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, sprite.matrixWorld);
    };
    return group;
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
