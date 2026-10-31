// Graph view (Cytoscape.js). Shows only the "visible" subset of nodes. Opening a node
// places its hidden neighbours in a ring around it (grouped by relation), so the rest of
// the drawing does not move; "Layout" rearranges everything as a tree (works at the top)
// or as a force-directed network. A focus mode shows only the neighbourhood of one node.
// `cytoscape` is the global from the Cytoscape.js bundle (see index.html).

import { NS, localName } from "./ontology.js";

const STYLE = [
  { selector: "node", style: {
      "label": "data(label)", "font-size": 10, "font-family": "system-ui, sans-serif",
      "text-wrap": "wrap", "text-max-width": 130, "text-valign": "center", "text-halign": "center",
      "shape": "round-rectangle", "width": "label", "height": "label", "padding": 9,
      "background-color": "data(color)", "border-width": 1, "border-color": "#475569", "color": "#0f172a" } },
  // Nodes with hidden neighbours get a double border as an "open me" cue
  { selector: "node[?closed]", style: { "border-width": 3, "border-style": "double" } },
  // Vocabulary concepts and external resources are visually secondary
  { selector: "node[kind = 'concept']", style: { "shape": "tag", "background-color": "#f1f5f9", "border-style": "dashed" } },
  { selector: "node[kind = 'external']", style: { "shape": "ellipse", "background-color": "#ffffff", "border-style": "dotted" } },
  { selector: "node[?card]", style: { "text-max-width": 300, "text-justification": "left", "padding": 14, "font-size": 11 } },
  { selector: "node[?focus]", style: { "border-color": "#7c3aed", "border-width": 4 } },
  { selector: "node:selected", style: { "border-color": "#2563eb", "border-width": 3 } },
  { selector: "edge", style: {
      "label": "data(label)", "font-size": 8, "color": "#475569", "text-rotation": "autorotate",
      "text-background-color": "#ffffff", "text-background-opacity": 0.85, "text-background-padding": 1,
      "curve-style": "bezier", "target-arrow-shape": "triangle", "arrow-scale": 0.7,
      "width": 1.2, "line-color": "#94a3b8", "target-arrow-color": "#94a3b8" } },
  // Relation names can be hidden to declutter; they reappear on the selected node's edges
  { selector: "edge.nolabel", style: { "label": "" } },
  { selector: "edge.highlight", style: { "line-color": "#2563eb", "target-arrow-color": "#2563eb", "width": 2, "label": "data(label)" } },
];

export class GraphView {
  constructor(container, { onSelect, onContext }) {
    this.cy = cytoscape({ container, style: STYLE, wheelSensitivity: 0.3, minZoom: 0.1, maxZoom: 3 });
    this.visible = new Set();
    this.edgeLabels = true;
    this.mode = "tree";          // layout used by "Layout": "tree" | "force"
    this.focus = null;           // IRI shown in focus mode
    this.hiddenNodes = new Set();   // nodes hidden one by one by the user
    this.hiddenWorks = new Set();   // artworks unticked in the "Works" list
    this.hidden = new Set();        // everything currently hidden (see updateHidden)
    this.cy.on("tap", "node", (e) => onSelect(e.target.id()));
    this.cy.on("tap", (e) => { if (e.target === this.cy) onSelect(null); });
    this.cy.on("dbltap", "node", (e) => this.toggle(e.target.id()));
    // right-click (or long press): context menu of the node, at the pointer position
    this.cy.on("cxttap", "node", (e) => {
      if (!onContext) return;
      // pointer position in the window (falls back to the node position, e.g. on touch)
      const box = container.getBoundingClientRect();
      const ev = e.originalEvent;
      const at = ev && "clientX" in ev ? { clientX: ev.clientX, clientY: ev.clientY }
        : { clientX: box.left + e.target.renderedPosition().x, clientY: box.top + e.target.renderedPosition().y };
      onContext(e.target.id(), at);
    });
    this.fullText = new Set();   // nodes whose full text is shown in the graph
    this.textMode = "short";     // "short" (truncated labels) | "full" (every text in full)
    // highlight the relations of the selected node
    this.cy.on("select unselect", "node", () => {
      this.cy.edges().removeClass("highlight");
      this.cy.$("node:selected").connectedEdges().addClass("highlight");
    });
  }

  /** Bind the data/ontology and the current languages, then redraw. */
  render(data, ontology, uiLang, contentLang, { relayout = false } = {}) {
    this.data = data; this.ontology = ontology; this.uiLang = uiLang; this.contentLang = contentLang;
    const all = new Set(data.nodes());
    this.updateHidden();
    for (const id of [...this.visible]) if (!all.has(id) || this.hidden.has(id)) this.visible.delete(id);

    const positions = {};
    this.cy.nodes().forEach((n) => { positions[n.id()] = { ...n.position() }; });
    const elements = [];
    for (const id of this.visible) {
      elements.push({ group: "nodes", position: positions[id],
                      data: { id, ...this.nodeData(id), closed: this.hasHidden(id), focus: id === this.focus } });
    }
    for (const id of this.visible) {
      for (const { prop, target } of data.outgoing(id)) {
        if (this.visible.has(target)) {
          elements.push({ group: "edges", classes: this.edgeLabels ? "" : "nolabel",
                          data: { id: `${id}|${prop}|${target}`, source: id, target, label: localName(prop) } });
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
  }

  /** Label, colour and kind of a node (individual, vocabulary concept, external resource). */
  nodeData(id) {
    const o = this.ontology;
    if (o.isConcept(id)) return { label: o.label(id, this.uiLang), color: "#f1f5f9", kind: "concept" };
    const types = this.data.types(id);
    const cls = types.find((t) => o.classes[t]);
    const name = this.data.name(id, this.contentLang) || localName(id);
    if (!cls) {
      const typeLabel = types.length ? shortIri(types[0]) : "";
      return { label: typeLabel ? `${truncate(name, 50)}\n${typeLabel}` : truncate(name, 50), color: "#ffffff", kind: "external" };
    }
    // Long texts are truncated unless the node (or the whole graph) shows full text;
    // a full long text is drawn as a wider, left-aligned "content card"
    const full = this.textMode === "full" || this.fullText.has(id);
    const card = full && name.length > 60;
    return { label: `${full ? name : truncate(name, 60)}\n‹${o.label(cls, this.uiLang)}›`, card,
             color: o.packageColor(o.packageOf(cls)), kind: "individual" };
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

  hasHidden(id) {
    return this.neighbours(id).some((n) => !this.visible.has(n));
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
      let radius = 170;
      const step = (2 * Math.PI) / Math.max(kids.length, 6);
      kids.forEach((k, i) => {
        let pos;
        for (let tries = 0; tries < 6; tries++) {
          const angle = -Math.PI / 2 + i * step + tries * 0.15;
          pos = { x: centre.x + (radius + tries * 70) * Math.cos(angle), y: centre.y + (radius + tries * 70) * Math.sin(angle) };
          if (occupied.every((o) => Math.hypot(o.x - pos.x, o.y - pos.y) > 110)) break;
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
                       circle: !!this.focus, spacingFactor: 1.15, padding: 30, animate: false, avoidOverlap: true }).run();
    } else {
      this.cy.layout({ name: "cose", animate: false, nodeRepulsion: 12000, idealEdgeLength: 120, padding: 30, randomize: true }).run();
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
    return this.cy.png({ full: true, scale: 2, bg: "#ffffff" });
  }
}

export function shortIri(iri) {
  for (const [p, ns] of Object.entries(NS)) if (iri.startsWith(ns)) return `${p}:${iri.slice(ns.length)}`;
  return localName(iri);
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function cssEscape(s) {
  return s.replace(/["\\]/g, "\\$&");
}
