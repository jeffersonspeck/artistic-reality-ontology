// Graph view (Cytoscape.js). Shows only the "visible" subset of nodes. Opening a node
// places its hidden neighbours in a ring around it (grouped by relation), so the rest of
// the drawing does not move; "Layout" rearranges everything as a tree (works at the top)
// or as a force-directed network. A focus mode shows only the neighbourhood of one node.
//
// Nodes are drawn as HTML cards on a layer above the canvas (class name on top, text below,
// expandable); Cytoscape keeps the geometry, edges and events, with each node sized to its card.
// Hovering a node or an edge shows what kind of ontology element it is and what it is for.
// `cytoscape` is the global from the Cytoscape.js bundle (see index.html).

import { NS, localName } from "./ontology.js";

const STYLE = [
  // the node itself is invisible: its card (HTML layer) is what the user sees
  { selector: "node", style: {
      "shape": "round-rectangle", "width": "data(w)", "height": "data(h)",
      "background-opacity": 0, "border-width": 0, "label": "", "overlay-opacity": 0 } },
  { selector: "edge", style: {
      "label": "data(label)", "font-size": 9, "font-family": "Inter, system-ui, sans-serif", "color": "#64748b",
      "text-rotation": "autorotate", "text-background-color": "#f8fafc", "text-background-opacity": 0.9,
      "text-background-padding": 2, "text-background-shape": "round-rectangle",
      "curve-style": "bezier", "target-arrow-shape": "triangle", "arrow-scale": 0.8,
      "width": 1.3, "line-color": "#cbd5e1", "target-arrow-color": "#cbd5e1" } },
  // Relation names can be hidden to declutter; they reappear on the selected node's edges
  { selector: "edge.nolabel", style: { "label": "" } },
  { selector: "edge.highlight", style: { "line-color": "#2563eb", "target-arrow-color": "#2563eb", "width": 2.2, "label": "data(label)", "color": "#1d4ed8", "z-index": 10 } },
  { selector: "edge.hover", style: { "line-color": "#64748b", "target-arrow-color": "#64748b", "width": 2.2, "label": "data(label)" } },
  // Image export / printing: the HTML layer is not in the canvas, so nodes are drawn by Cytoscape
  { selector: "node.export", style: {
      "label": "data(label)", "font-size": 10, "font-family": "system-ui, sans-serif",
      "text-wrap": "wrap", "text-max-width": "data(tw)", "text-valign": "center", "text-halign": "center",
      "background-color": "data(color)", "background-opacity": 1, "border-width": 1, "border-color": "data(accent)", "color": "#0f172a" } },
  { selector: "node.export[kind = 'concept']", style: { "shape": "tag", "border-style": "dashed" } },
  { selector: "node.export[kind = 'external']", style: { "shape": "ellipse", "border-style": "dotted" } },
];

export class GraphView {
  constructor(container, { onSelect, onContext, describe }) {
    this.cy = cytoscape({ container, style: STYLE, wheelSensitivity: 0.3, minZoom: 0.1, maxZoom: 3 });
    this.container = container;
    this.describe = describe;    // (id) -> tooltip element for a node; (edge data) for an edge
    this.visible = new Set();
    this.edgeLabels = true;
    this.mode = "tree";          // layout used by "Layout": "tree" | "force"
    this.focus = null;           // IRI shown in focus mode
    this.hiddenNodes = new Set();   // nodes hidden one by one by the user
    this.hiddenWorks = new Set();   // artworks unticked in the "Works" list
    this.hidden = new Set();        // everything currently hidden (see updateHidden)
    this.fullText = new Set();   // nodes whose full text is shown in the graph
    this.textMode = "short";     // "short" (clamped text) | "full" (every text in full)
    this.cards = new Map();      // node id -> card element

    // HTML layer: follows pan and zoom with one transform; cards are placed at node positions
    this.layer = document.createElement("div");
    this.layer.className = "card-layer";
    this.stage = document.createElement("div");
    this.stage.className = "card-stage";
    this.layer.append(this.stage);
    container.append(this.layer);
    this.tip = document.createElement("div");
    this.tip.className = "graph-tip";
    this.tip.hidden = true;
    document.body.append(this.tip);

    this.cy.on("viewport", () => this.syncViewport());
    this.cy.on("position", "node", (e) => this.placeCard(e.target));
    this.cy.on("tap", "node", (e) => onSelect(e.target.id()));
    this.cy.on("tap", (e) => { if (e.target === this.cy) onSelect(null); });
    this.cy.on("dbltap", "node", (e) => this.toggle(e.target.id()));
    // right-click (or long press): context menu of the node, at the pointer position
    this.cy.on("cxttap", "node", (e) => {
      this.hideTip();
      if (!onContext) return;
      const at = this.clientPoint(e);
      onContext(e.target.id(), at);
    });
    // highlight the relations of the selected node, and mark its card
    this.cy.on("select unselect", "node", () => {
      this.cy.edges().removeClass("highlight");
      this.cy.$("node:selected").connectedEdges().addClass("highlight");
      for (const [id, card] of this.cards) card.classList.toggle("selected", this.cy.getElementById(id).selected());
    });
    // hover: lift the card and explain the element
    this.cy.on("mouseover", "node", (e) => {
      this.cards.get(e.target.id())?.classList.add("hover");
      this.showTip(this.describe?.({ node: e.target.id() }), e);
    });
    this.cy.on("mouseout", "node", (e) => { this.cards.get(e.target.id())?.classList.remove("hover"); this.hideTip(); });
    this.cy.on("mouseover", "edge", (e) => { e.target.addClass("hover"); this.showTip(this.describe?.({ edge: e.target.data() }), e); });
    this.cy.on("mouseout", "edge", (e) => { e.target.removeClass("hover"); this.hideTip(); });
    this.cy.on("mousemove", (e) => { if (!this.tip.hidden) this.moveTip(e); });
    this.cy.on("grab pan zoom", () => this.hideTip());
  }

  clientPoint(e) {
    const ev = e.originalEvent;
    if (ev && "clientX" in ev) return { clientX: ev.clientX, clientY: ev.clientY };
    const box = this.container.getBoundingClientRect();
    const p = e.target.renderedPosition ? e.target.renderedPosition() : e.renderedPosition;
    return { clientX: box.left + p.x, clientY: box.top + p.y };
  }

  // ---------------------------------------------------------------- tooltip
  showTip(content, e) {
    if (!content) return;
    this.tip.replaceChildren(content);
    this.tip.hidden = false;
    this.moveTip(e);
  }
  moveTip(e) {
    const { clientX, clientY } = this.clientPoint(e);
    const w = this.tip.offsetWidth, hgt = this.tip.offsetHeight;
    let x = clientX + 16, y = clientY + 16;
    if (x + w > window.innerWidth - 8) x = clientX - w - 16;
    if (y + hgt > window.innerHeight - 8) y = clientY - hgt - 16;
    this.tip.style.left = `${Math.max(8, x)}px`;
    this.tip.style.top = `${Math.max(8, y)}px`;
  }
  hideTip() { this.tip.hidden = true; }

  // ---------------------------------------------------------------- cards
  syncViewport() {
    const { x, y } = this.cy.pan();
    this.stage.style.transform = `translate(${x}px, ${y}px) scale(${this.cy.zoom()})`;
  }

  placeCard(node) {
    const card = this.cards.get(node.id());
    if (!card) return;
    const p = node.position();
    card.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
  }

  /** Card element of a node: class name on top (coloured by module), text, hidden-neighbour badge. */
  card(id, d) {
    const el = document.createElement("div");
    el.className = `node-card kind-${d.kind}${d.full ? " full" : ""}${d.focus ? " focus" : ""}`;
    el.style.setProperty("--tint", d.color);
    el.style.setProperty("--accent", d.accent);
    const kind = document.createElement("div");
    kind.className = "nc-kind";
    kind.textContent = d.kindLabel;
    const title = document.createElement("div");
    title.className = "nc-title";
    title.textContent = d.title;
    el.append(kind, title);
    if (d.hiddenCount) {
      const badge = document.createElement("span");
      badge.className = "nc-badge";
      badge.textContent = `+${d.hiddenCount}`;
      el.append(badge);
    }
    return el;
  }

  /** Bind the data/ontology and the current languages, then redraw. */
  render(data, ontology, uiLang, contentLang, { relayout = false } = {}) {
    this.data = data; this.ontology = ontology; this.uiLang = uiLang; this.contentLang = contentLang;
    const all = new Set(data.nodes());
    this.updateHidden();
    for (const id of [...this.visible]) if (!all.has(id) || this.hidden.has(id)) this.visible.delete(id);

    const positions = {};
    this.cy.nodes().forEach((n) => { positions[n.id()] = { ...n.position() }; });

    // cards first: they are measured to size the nodes
    this.cards.clear();
    const infos = {};
    const cards = [];
    for (const id of this.visible) {
      const d = { ...this.nodeData(id), hiddenCount: this.hiddenCount(id), focus: id === this.focus };
      infos[id] = d;
      const card = this.card(id, d);
      this.cards.set(id, card);
      cards.push(card);
    }
    this.stage.replaceChildren(...cards);
    const sizes = {};
    for (const [id, card] of this.cards) sizes[id] = { w: card.offsetWidth, h: card.offsetHeight };

    const elements = [];
    for (const id of this.visible) {
      const d = infos[id];
      elements.push({ group: "nodes", position: positions[id],
        data: { id, w: sizes[id].w || 120, h: sizes[id].h || 40, tw: Math.max(80, (sizes[id].w || 120) - 16),
                label: `${d.kindLabel}\n${d.title}`, color: d.color, accent: d.accent, kind: d.kind } });
    }
    for (const id of this.visible) {
      for (const { prop, target } of data.outgoing(id)) {
        if (this.visible.has(target)) {
          elements.push({ group: "edges", classes: this.edgeLabels ? "" : "nolabel",
                          data: { id: `${id}|${prop}|${target}`, source: id, target, prop, label: localName(prop) } });
        }
      }
    }
    const selected = this.cy.$(":selected").map((n) => n.id());
    this.cy.elements().remove();
    this.cy.add(elements);
    selected.forEach((id) => this.cy.getElementById(id).select());
    const unplaced = this.cy.nodes().filter((n) => !positions[n.id()]);
    if (relayout || unplaced.length === this.cy.nodes().length) this.layout();
    else if (unplaced.length) this.placeAround(unplaced);
    this.cy.nodes().forEach((n) => this.placeCard(n));
    this.syncViewport();
  }

  /** What a node's card shows: kind (class label), title, colours, full or clamped text. */
  nodeData(id) {
    const o = this.ontology;
    if (o.isConcept(id)) {
      const scheme = o.conceptTypes(id).find((t) => o.classes[t]);
      return { kind: "concept", kindLabel: scheme ? o.label(scheme, this.uiLang) : "concept",
               title: o.label(id, this.uiLang), color: "#f8fafc", accent: "#64748b" };
    }
    const types = this.data.types(id);
    const cls = types.find((t) => o.classes[t]);
    const name = this.data.name(id, this.contentLang) || localName(id);
    if (!cls) {
      return { kind: "external", kindLabel: types.length ? shortIri(types[0]) : "IRI", title: name, color: "#ffffff", accent: "#94a3b8" };
    }
    const pkg = o.packageOf(cls);
    const full = this.textMode === "full" || this.fullText.has(id);
    return { kind: "individual", kindLabel: o.label(cls, this.uiLang), title: name, full: full && name.length > 60,
             color: o.packageColor(pkg), accent: o.packageAccent(pkg) };
  }

  /** Neighbours of a node, hidden nodes excluded. */
  neighbours(id) {
    return [...new Set([...this.data.outgoing(id).map((r) => r.target), ...this.data.incoming(id).map((r) => r.source)])]
      .filter((n) => !this.hidden.has(n));
  }

  /**
   * Nodes that belong to one work: walk the graph from the artwork, keeping other
   * artworks as end points, not entering vocabulary concepts, following only outgoing
   * relations from shared acts and sources, and from a situation pattern only its
   * conditions and the claims/hypotheses about it (same rules as scripts/split_examples.py).
   */
  workScope(start) {
    const A = NS.aro;
    const seen = new Set([start]);
    const stack = [start];
    while (stack.length) {
      const node = stack.pop();
      const types = this.data.types(node);
      if (node !== start && types.includes(A + "Artwork")) continue;
      if (node.startsWith(A)) continue;
      let next = this.data.outgoing(node).map((r) => r.target);
      if (types.includes(A + "SituationPattern")) {
        next = next.concat(this.data.incoming(node)
          .filter((r) => r.prop === A + "assertsPattern" || r.prop === A + "explainsPattern").map((r) => r.source));
      } else if (!types.includes(A + "InterpretiveAct") && !types.includes(A + "ReferenceSource")) {
        next = next.concat(this.data.incoming(node).map((r) => r.source));
      }
      for (const n of next) if (!seen.has(n)) { seen.add(n); stack.push(n); }
    }
    return seen;
  }

  /** Recompute the hidden set: hidden works (and what only they use) plus nodes hidden one by one. */
  updateHidden() {
    const hidden = new Set(this.hiddenNodes);
    if (this.hiddenWorks.size) {
      const works = this.data.nodes().filter((n) => this.data.types(n).includes(NS.aro + "Artwork"));
      const kept = new Set();
      works.filter((w) => !this.hiddenWorks.has(w)).forEach((w) => this.workScope(w).forEach((n) => kept.add(n)));
      for (const w of this.hiddenWorks) {
        hidden.add(w);
        this.workScope(w).forEach((n) => { if (!kept.has(n)) hidden.add(n); });
      }
    }
    this.hidden = hidden;
  }

  hiddenCount(id) {
    return this.neighbours(id).filter((n) => !this.visible.has(n)).length;
  }

  hasHidden(id) {
    return this.hiddenCount(id) > 0;
  }

  /** Open a closed node (show all neighbours) or close an open one (hide leaf neighbours). */
  toggle(id) {
    const ns = this.neighbours(id);
    if (ns.some((n) => !this.visible.has(n))) {
      this.opening = id;
      ns.forEach((n) => this.visible.add(n));
    } else {
      // hide neighbours that would otherwise be connected only through this node
      for (const n of ns) {
        const others = this.neighbours(n).filter((m) => m !== id && this.visible.has(m));
        if (others.length === 0 && n !== this.focus) this.visible.delete(n);
      }
    }
    this.render(this.data, this.ontology, this.uiLang, this.contentLang);
    this.opening = null;
  }

  /**
   * Place new nodes without moving the existing ones: each goes on a ring around the node
   * being opened (or around its first visible neighbour), grouped by relation so that,
   * e.g., all aspects of a derivation sit together. Rings grow until there is free space.
   */
  placeAround(newNodes) {
    const byParent = new Map();
    newNodes.forEach((n) => {
      const parent = (this.opening && n.neighborhood(`node[id = "${cssEscape(this.opening)}"]`).nonempty())
        ? this.cy.getElementById(this.opening)
        : n.neighborhood("node").filter((m) => !newNodes.has(m))[0];
      const key = parent ? parent.id() : "";
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(n);
    });
    const occupied = this.cy.nodes().filter((n) => !newNodes.has(n)).map((n) => n.position());
    for (const [pid, kids] of byParent) {
      const centre = pid ? this.cy.getElementById(pid).position() : { x: 0, y: 0 };
      // group by relation name so related nodes are adjacent on the ring
      kids.sort((a, b) => this.relationTo(pid, a.id()).localeCompare(this.relationTo(pid, b.id())));
      let radius = 230;
      const step = (2 * Math.PI) / Math.max(kids.length, 6);
      kids.forEach((k, i) => {
        let pos;
        for (let tries = 0; tries < 6; tries++) {
          const angle = -Math.PI / 2 + i * step + tries * 0.15;
          pos = { x: centre.x + (radius + tries * 90) * Math.cos(angle), y: centre.y + (radius + tries * 90) * Math.sin(angle) };
          if (occupied.every((o) => Math.hypot(o.x - pos.x, o.y - pos.y) > 150)) break;
        }
        k.position(pos);
        occupied.push(pos);
      });
    }
    this.cy.animate({ fit: { eles: this.cy.nodes(), padding: 40 } }, { duration: 250 });
  }

  /** Name of the relation linking two nodes (either direction), for ordering. */
  relationTo(a, b) {
    const out = this.data.outgoing(a).find((r) => r.target === b);
    if (out) return localName(out.prop);
    const inc = this.data.incoming(a).find((r) => r.source === b);
    return inc ? "~" + localName(inc.prop) : "";
  }

  show(id) {
    this.visible.add(id);
  }

  showAll() {
    this.updateHidden();
    this.data.nodes().filter((n) => !this.hidden.has(n)).forEach((n) => this.visible.add(n));
  }

  /** Start view: artworks (or, if none, nodes that nothing points to). */
  showRoots() {
    this.focus = null;
    this.visible.clear();
    this.roots().forEach((n) => this.visible.add(n));
  }

  roots() {
    const nodes = this.data.nodes();
    this.updateHidden();
    let roots = nodes.filter((n) => this.data.types(n).includes(NS.aro + "Artwork") && !this.hidden.has(n));
    if (!roots.length) roots = nodes.filter((n) => this.data.incoming(n).length === 0);
    return roots.length ? roots : nodes.slice(0, 20);
  }

  /** Focus mode: only `id` and the nodes within `depth` relations of it. */
  setFocus(id, depth = 1) {
    this.focus = id;
    this.visible = new Set([id]);
    let frontier = [id];
    for (let d = 0; d < depth; d++) {
      const next = [];
      for (const n of frontier) for (const m of this.neighbours(n)) if (!this.visible.has(m)) { this.visible.add(m); next.push(m); }
      frontier = next;
    }
  }

  /** Rearrange everything: a top-down tree from the works/focus node, or a force-directed network. */
  layout() {
    if (!this.cy.nodes().length) return;
    if (this.mode === "tree") {
      const roots = this.focus ? this.cy.getElementById(this.focus)
        : this.cy.nodes().filter((n) => this.data.types(n.id()).includes(NS.aro + "Artwork"));
      this.cy.layout({ name: "breadthfirst", directed: false, roots: roots.nonempty() ? roots : undefined,
                       circle: !!this.focus, spacingFactor: 1.1, padding: 30, animate: false, avoidOverlap: true }).run();
    } else {
      this.cy.layout({ name: "cose", animate: false, nodeRepulsion: 16000, idealEdgeLength: 150, padding: 30, randomize: true }).run();
    }
  }

  setEdgeLabels(on) {
    this.edgeLabels = on;
    this.cy.edges().toggleClass("nolabel", !on);
  }

  select(id) {
    this.cy.$(":selected").unselect();
    const n = this.cy.getElementById(id);
    if (n.nonempty()) { n.select(); this.cy.animate({ center: { eles: n } }, { duration: 200 }); }
  }

  fit() {
    this.cy.fit(undefined, 30);
  }

  /** PNG data URL of the whole graph (used for image export and printing). */
  png() {
    // the cards live outside the canvas: draw plain labelled boxes for the picture
    const nodes = this.cy.nodes();
    nodes.addClass("export");
    try { return this.cy.png({ full: true, scale: 2, bg: "#ffffff" }); }
    finally { nodes.removeClass("export"); }
  }
}

export function shortIri(iri) {
  for (const [p, ns] of Object.entries(NS)) if (iri.startsWith(ns)) return `${p}:${iri.slice(ns.length)}`;
  return localName(iri);
}

function cssEscape(s) {
  return s.replace(/["\\]/g, "\\$&");
}
