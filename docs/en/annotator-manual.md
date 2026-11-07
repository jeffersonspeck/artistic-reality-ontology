[← Back to README](../../README.md) · [Português](../pt-BR/manual-anotador.md)

# ARO Annotator manual

> 🖊️ **Open the online annotator:** <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/> (nothing to install; to run it on your computer, see [section 2](#2-starting-the-annotator)).

The ARO Annotator is a web tool to **instantiate the ARO ontology** without writing RDF by hand. With it you record works, versions and passages, interpretations, situations, patterns, real cases and sources, as well as derivations between works. Everything appears in a graph that you open step by step, and your work is saved as Turtle (`.ttl`).

## Contents

1. [Requirements and installation](#1-requirements-and-installation)
2. [Starting the annotator](#2-starting-the-annotator)
3. [The screen](#3-the-screen)
4. [First annotation, step by step](#4-first-annotation-step-by-step)
5. [Navigating the graph](#5-navigating-the-graph)
6. [Texts, languages and links](#6-texts-languages-and-links)
7. [Locating passages in the work's text](#7-locating-passages-in-the-works-text)
8. [Validating](#8-validating)
9. [Saving, loading and examples](#9-saving-loading-and-examples)
10. [Image and PDF](#10-image-and-pdf)
11. [After annotating: full validation and queries](#11-after-annotating-full-validation-and-queries)
12. [Running the project tests](#12-running-the-project-tests)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Requirements and installation

| Requirement | For |
|---|---|
| **Python 3.10+** | serving the annotator and running validation, queries and tests |
| A current browser (Chrome, Edge, Firefox) | using the annotator |
| Internet the first time | downloading the Cytoscape.js (graph) and N3.js (Turtle) libraries |

At the repository root:

```bash
python -m pip install -r requirements.txt
```

## 2. Starting the annotator

**Online:** open <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/>. Nothing to install; your annotations stay in your browser until you save them as a `.ttl` file (section 9), and local texts (section 7) never leave your computer. After a new version is published, reload with **Ctrl+F5** if the page looks outdated.

**On your computer:**

```bash
python scripts/annotator.py
```

- The command serves the repository at `http://localhost:8765/annotator/` and opens the browser.
- To stop it, press **Ctrl+C** in the terminal.
- **Another port:** `python scripts/annotator.py --port 9000`.
- **Without opening the browser:** `python scripts/annotator.py --no-browser`.

> Why a server? The annotator reads `ontology/src/aro.ttl`, `model/conceptual-model.json` and `validation/aro-shapes.ttl`. For security, browsers do not allow this when the page is opened directly as a file. Nothing is sent outside your computer.

## 3. The screen

| Area | Contents |
|---|---|
| **Top bar** | menus **File** (New, Load .ttl, Load example, Save .ttl) · **Analysis** (Validate, Queries) · **View** (Collapse to works, Show all, layout type, Layout, Relation names, Full texts) · **Export** (Image (PNG), Print/PDF) · **Language** (interface and content) · **Save .ttl** always visible · on the right, the panel buttons **Create**, **Inspector** and **Graph only** |
| **Left panel (Create)** | folding sections: *Add a node* (class + name + link), *Works and visibility* (**Works shown**, **Hidden nodes**, node counter) and *Settings* (base IRI of your data) |
| **Centre** | the graph; validation and query results open as floating panels over it |
| **Right panel (Inspector)** | the selected node: class and definition, navigation buttons, excerpt, texts, links, data, relations and "referenced by" |
| **Footer** | messages (file loaded, saved…) |

**More room for the graph.** Every panel can be hidden and resized:

- **Side panels:** the **Create** and **Inspector** buttons (or **«** / **»** in each panel) show and hide them; a hidden panel leaves a thin rail with a button to bring it back. Drag the line between a panel and the graph to change its width; double-click that line to hide the panel.
- **Graph only:** hides both side panels and reduces the top bar to its menus; **Show panels**, at the top right of the graph, restores them.
- **Floating panels** (Validation, Queries): **–** minimizes to the title bar (double-clicking the title also works), **×** closes, and dragging the top edge changes the height.

Widths, hidden panels and heights are remembered in this browser.

Node colours indicate the ontology module. Vocabulary concepts appear as dashed tags, and external resources (people, bands, selectors) as dotted ellipses.

## 4. First annotation, step by step

Example: record that a passage of a song represents a situation, generalize it as a pattern and link that pattern to a real case.

1. **The work.** In the left panel, choose the *artwork* class (`Artwork`), type the title and click **Create**.
2. **The version.** With the work selected, open the **Children** tab and choose *expression* under `hasExpression`, e.g. "1993 recording" or "Lyric text" (IFLA LRM: an expression is a realization with its own content). If the edition matters (an album, a book edition), add a *manifestation* to the expression with `hasManifestation`.
3. **The passage.** Select the expression, open the **Parents** tab and create a *selection* under `selectsFrom`: the new selection is already linked to the expression.
4. **Where the passage is.** On the selection, add `hasSelector` and choose the selector type:
   - **FragmentSelector** with `line=27,30` for lines 28–30 of a text;
   - **FragmentSelector** with `t=12,16` for seconds 12–16 of audio or video;
   - **TextQuoteSelector** for a literal quotation.
5. **The interpretation.** Create an *interpretation record* (`InterpretationRecord`) and add the relations:
   - `hasPrimarySelection` → the selection;
   - `producedByAct` → a new *interpretive act*, which in turn gets `hasParticipant` → you, as an *external IRI* (e.g. your ORCID, typed `schema:Person`).
6. **The situation.** On the record, add `describesSituation` → a new *situation description* and write its text under *Texts*, in one or more languages.
7. **The pattern.** On the situation, add `generalizesAs` → a new *situation pattern*. On the pattern, add `hasCondition` → *conditions*.
8. **The real case.** Create an *empirical case* and a *reference source* (with a link under *Links* → `sourceURL`). Then create an *evidence item* with `derivedFromSource` → the source.
9. **The claim.** Create a *correspondence claim* with `assertsPattern` → the pattern and `assertsCase` → the case. Finally, create an *evidence assessment* with `assessesClaim` → the correspondence claim and `assessesEvidence` → the evidence item, and write what it supports and what it does not.
10. **Save.** Click **Validate**, then **Save .ttl**.

For **derivations** (cover, sample, adaptation…), create a *derivation claim* and add:
- `hasSourceAnchor` and `hasDerivedAnchor`, each pointing to an artistic entity (artwork, expression, manifestation or selection);
- `hasDerivationType`, chosen from a tree list with definitions;
- `hasTransformation`, with a dimension and an operation;
- `hasJustification`, with the explanation (the same property used by every kind of claim; so are `citesSource`, `producedByAct` and, from an assessment, `assessesClaim`).

**Adding children and parents from a node**
- Select a node (click it, or right-click → **Add child…** / **Add parent…**). The left panel shows two tabs computed from the node's type:
  - **Children**: new nodes this node points to (this → relation → new), e.g. from an artwork, an expression by `hasExpression`;
  - **Parents**: new nodes that point to it (new → relation → this), e.g. from an expression, a selection by `selectsFrom`.
- Each allowed relation is a card with its classes as chips; **required** relations come first, relations already at their **maximum** are greyed. Click a chip, type the name, press Enter: the node is created, linked and selected.
- *Existing node, concept, other options…* in a card links an existing node, a vocabulary concept, a selector or an external IRI instead.
- With no node selected, the panel lists every class by module, to start a standalone node (also under *Standalone node* while a node is selected).
- Hover a chip to read what the class is (module, OntoUML nature, definition).

**Node cards:** each node shows its ontology class on top (in the module's colour) and its text below; a badge counts hidden neighbours. Hover a node or a relation to see what kind of element it is and what it is for.

**Long texts:** the inspector is a column of foldable cards; the **Content** card shows the full text (long texts are clamped with **show more**). In the graph, use **Show full text in the graph** (panel or right-click) for one node, or tick **Full texts** in the **View** menu for all; long texts become wider cards.

**How the forms follow the ontology**
- *Add relation* shows only properties whose domain fits the node. **Required** ones (SHACL `minCount`) are marked `*`, and missing ones are listed in a yellow notice. Those already at their **maximum** (`maxCount`) are no longer offered.
- The **Parents** tab creates a relation that **arrives** at the node, from a new node or (under *other options*) an existing one. For example, on an expression: a new selection with `selectsFrom` pointing to it.
- When creating a new node in a relation, you can choose the range class or **any subclass** (e.g. *intentional state description*).
- Under *Data*, class-specific properties are shown directly; general ones (identifier, language tag…) are under *More properties*.

> The ontology **represents** claims made by agents; it does not decide whether they are true. Use assessments and challenges (`Challenge`, which can target any claim) to record support and disagreement. *Abstract* classes (`Claim`, `AnalyticalRecord`, `Assessment`, `ArtisticEntity`) are not offered for creation: choose one of their subclasses.

> **Files from ARO 0.2** are converted when opened (e.g. the old *manifestation* becomes an *expression*); the status bar says so. Save to keep the converted file, or run `python scripts/migrate.py file.ttl`.

## 5. Navigating the graph

| Action | How |
|---|---|
| Select | click a node; its relations are highlighted in blue |
| Open / close neighbours | double-click, or **Open / close neighbours**; neighbours appear in a ring around the node, grouped by relation. Double border = hidden neighbours |
| Rearrange | **Tree** (works at the top) or **Network**, then **Layout** |
| Less clutter | untick **Relation names** |
| Show only some works | **Works shown**: untick works, or use **Show only this work** on a work. Whatever is shared with visible works stays |
| Hide a node | **Hide node**; to bring it back, use **show** in the *Hidden nodes* list |
| Analyse one node apart | **Open in focus ↗**: a new tab with only the node and its neighbours (depth 1–3). Changes are shared between tabs |
| Start the view again | **Collapse to works** or **Show all** |

## 6. Texts, languages and links

- **Interface:** English or Portuguese. Class and concept names come from the ontology's own labels.
- **Content language:** the default language of the texts you write. *other…* accepts any BCP 47 tag (e.g. `es`, `ja`). Each text may have one version per language.
- **Links:** `externalLink` works on any node (work page, recording, evidence location); `sourceURL` is for sources. Links open in a new tab.
- **Search on Google:** appears on situations, patterns, conditions, cases, claims and hypotheses, and uses the node's text.

## 7. Locating passages in the work's text

To see the exact passage of each selection (for example, the lines of song lyrics):

1. Select the **expression** representing the text (e.g. "Lyric text").
2. Click **Attach .txt** and choose **your own copy** of the text.
3. Select a selection that has a `line=a,b` selector: the panel shows the numbered lines. Blank lines are not counted.
4. Optionally, use **Store as quotation** to copy the lines into a `TextQuoteSelector` in your data.

The attached text stays **only in your browser**: it is not written to the `.ttl` nor to the repository. To keep copies of protected texts next to the project, use the `private/` folder, which git ignores.

## 8. Validating

**Validate** checks, in the browser:
- cardinalities (e.g. a derivation claim needs a type, a source and a derived anchor);
- the classes of values;
- texts with a language tag;
- derivation anchors.

Click a problem to jump to the node. Full validation (SHACL) is in section 11.

### Queries in the browser

The **Queries (CQ/RQ)** button opens a panel with every competency question (CQ) and research question (RQ):
1. choose the question (shown in the interface language);
2. click **Run**: the query runs over your current annotations plus the ontology and shows a table. The results are the same as `python scripts/query.py`;
3. click a node in the table to go to it in the graph;
4. under **SPARQL (editable)** you can adapt the query before running it.

Texts in the results follow the **content language** chosen on the toolbar; a text missing in that language is shown in the language it has.

The SPARQL engine (Oxigraph) is downloaded on first use, which needs internet.

## 9. Saving, loading and examples

- **Save .ttl** downloads `aro-annotations.ttl`.
- **Load .ttl** opens any ARO file to continue it or just to browse it.
- **Load example** opens the case studies (`examples/case-studies.ttl`). The per-work files (`examples/example_homem_na_estrada.ttl`, `examples/example_vidas_secas.ttl`) can be opened with **Load .ttl**.
- **Automatic draft:** the browser keeps the current work between sessions. **New** discards the draft, after asking for confirmation.
- The **base IRI** sets the address of new nodes (e.g. `https://example.org/my-project/`). When you load a file, it becomes that file's base.

## 10. Image and PDF

- **Image (PNG):** downloads the whole visible graph at high resolution.
- **Print / PDF:** builds a page with the graph and the details of the selected node. In the print dialog, choose **Save as PDF**.

## 11. After annotating: full validation and queries

```bash
python scripts/validate.py aro-annotations.ttl
```

The command prints `OK` or one line per violation; add `--lang pt-BR` for Portuguese messages.

```bash
python scripts/query.py aro-annotations.ttl --query queries/RQ-01-passages-to-real-cases.rq --lang pt-BR
```

`--lang` sets the preferred language of texts (default `en`); texts without a version in that language are shown in the language they have.

The queries in `queries/` answer the competency questions (CQ-…) and the research questions (RQ-01 to RQ-04). They are described in the [README](../../README.md#validating-and-querying-your-data) and in the [case studies](case-studies.md).

## 12. Running the project tests

```bash
python tests/test_project.py
```

The expected output ends with `PASS: ...`. The tests check:

| Check | What it guarantees |
|---|---|
| `scripts/build.py --check` | ontology, SHACL, schemas, reference docs, diagrams and the generated README/LEIA-ME sections match the catalog `model/conceptual-model.json` |
| parsing in three formats | `aro.ttl`, `aro.owl` and `aro.jsonld` have the same triples |
| catalog integrity | classes, relations, packages and concepts are consistent |
| language policy | every term has a label, definition and comment in `en` and `pt-BR` |
| JSON Schemas | valid examples accepted and invalid ones rejected |
| SHACL | every example is valid, and deliberately wrong data is rejected |
| queries | every SPARQL query returns results |
| case studies | the research questions give the expected answers, and the per-work files are up to date and cover the full file |

Helper commands:

```bash
python scripts/build.py
```

Regenerates everything after changing the catalog.

```bash
python scripts/split_examples.py
```

Regenerates the per-work files after changing `examples/case-studies.ttl`.

The annotator (JavaScript) has no automated tests yet; it was checked manually in the browser.

## 13. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| "Could not load the ontology" | the page was opened as a file. Use `python scripts/annotator.py` |
| Blank page or no graph | no internet on first use (libraries come from a CDN). Connect and reload |
| "Address already in use" | the port is busy. Use `--port 9000` |
| Double-click does not open neighbours | use the **Open / close neighbours** button in the right panel |
| I want to start from scratch | **New**; or clear the site data of `localhost` in the browser |
| The text excerpt does not appear | attach the `.txt` to the **expression** linked to the selection (`selectsFrom`) and check that the selection has a `line=a,b` selector |
| Language tags look lower-case in the browser | that is how the N3.js library works. The saved file uses `pt-BR` |

---

[← Back to README](../../README.md) · [Português](../pt-BR/manual-anotador.md)
