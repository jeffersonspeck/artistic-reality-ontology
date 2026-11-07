[← Back to README](../README.md) · [← Voltar para o LEIA-ME](../LEIA-ME.md)

# ARO Annotator / Anotador ARO

🇺🇸 [English](#english) · 🇧🇷 [Português](#português)

> Full step-by-step manual / Manual completo passo a passo: [English](../docs/en/annotator-manual.md) · [Português](../docs/pt-BR/manual-anotador.md)

---

## English

A web tool to **instantiate the ARO ontology** while reading, listening to or watching a work: you create artworks, selections, interpretations, situations, derivations and sources, link them according to the ontology, and see everything as a **graph that you open step by step**. Your annotations are saved as a Turtle file that can be loaded again, validated and queried.

### Start

```bash
python scripts/annotator.py
```

This serves the repository on `http://localhost:8765/annotator/` and opens the browser (the annotator reads `ontology/src/aro.ttl`, so it must be served from the repository root, not opened as a file). An internet connection is needed the first time to load the two libraries (Cytoscape.js and N3.js).

### Use

| Action | How |
|---|---|
| Add nodes (children / parents) | Select a node: the left panel shows, from its type, the **Children** it may have (this → relation → new) and the **Parents** that may point to it (new → relation → this), one card per relation allowed by the ontology, with its classes as chips (required relations flagged, full ones greyed). Pick a class, type a name, Enter. *Existing node, concept, other options…* links an existing node, a vocabulary concept, a selector or an external IRI. With nothing selected, the panel lists every class by module to start a standalone node. A filter narrows relations and classes. |
| Right-click a node | Menu: **Add child… / Add parent…** (opens the left panel on that node), show/shorten the full text, open/close neighbours, open in focus, hide. |
| Node cards and hover | Each node is a card with the name of its ontology class on top (coloured by module) and its text below; a badge shows how many neighbours are hidden. Hovering a node explains what kind of element it is (class, module, OntoUML nature, definition); hovering a relation explains it. Class chips and node pills in the panels have the same description. |
| Long texts | The inspector is a column of foldable cards (content, texts, references and links, data, relations, referenced by); long texts are clamped with **show more**. In the graph, long texts are shortened; show one in full (button or right-click) or tick **Full texts** to show all. |
| Schema-driven forms | Every form follows the ontology: *Add relation* and the **Children** tab list only properties whose domain fits the node; the **Parents** tab lists properties whose range accepts it (e.g. a new selection that `selectsFrom` this manifestation); new nodes can be of the range class or any subclass; properties at their SHACL maximum are no longer offered, and missing required ones are starred and listed in yellow. |
| Edit a node | Click it. The right panel shows its class and definition, texts, links, data and relations. |
| Open / close neighbours | Double-click the node, or **Open / close neighbours** in the right panel. Hidden neighbours appear in a ring around the node, grouped by relation, without moving the rest of the drawing. Nodes with hidden neighbours have a double border; the relations of the selected node are highlighted. |
| Layout | **Tree** (works at the top, then what hangs from them) or **Network** (force-directed), then **Layout**. **Relation names** hides or shows edge labels. |
| Show only some works | Left panel → **Works shown**: untick a work to hide it together with everything that only it uses (shared patterns, cases and sources stay while another shown work uses them). On an artwork, **Show only this work** unticks all the others. |
| More room for the graph | Toolbar actions are grouped in menus (File, Analysis, View, Export, Language). **Create** / **Inspector** show or hide the side panels; drag the line next to a panel to resize it (double-click hides it). **Graph only** leaves the whole screen to the graph. Validation and query panels can be minimized (**–**), closed (**×**) and resized from their top edge. The layout is remembered in the browser. |
| Hide a node | **Hide node** in the right panel; hidden nodes are listed on the left with **show** to bring them back. |
| Focus on one node | **Open in focus ↗** opens a new tab with only that node and its neighbours (depth 1–3). Changes made in either tab are shared. |
| Image / PDF | **Image (PNG)** downloads the current graph. **Print / PDF** prints the graph plus the selected node's details; choose "Save as PDF" in the print dialog. |
| Locate passages in your own text | On a manifestation (e.g. the lyrics), **Attach .txt** loads your own copy of the text. Each selection with a line selector (`line=a,b`) then shows its lines (blank lines are not counted). **Store as quotation** copies them into a `TextQuoteSelector` in your data. The text stays only in your browser. |
| Add a relation | Right panel → *Add relation*. Only properties whose domain fits the node are offered; the target adapts to the range: an existing or new node, a **vocabulary concept** (derivation type, dimension, role…, shown as a hierarchy with definitions), a **W3C selector** (time `t=`, region `xywh=`, text quote/position, SVG), or an **external agent IRI** (Wikidata, schema.org, FOAF…). |
| Texts in several languages | *Texts*: one value per language (`aro:textValue`, `aro:derivationExtent`). The **content language** selector sets the default; *other…* accepts any BCP 47 tag. |
| Links | *Links*: `aro:externalLink` (any node: work page, recording, evidence location) and `aro:sourceURL` (reference sources). Links open in a new tab. |
| Investigate | Situations, patterns, empirical cases, claims and hypotheses have **Search on Google** with their text in the content language. |
| Queries (CQ/RQ) | **Queries (CQ/RQ)** lists every query of `queries/` with the question it answers (in the interface language), runs it over your current annotations plus the ontology — same results as `python scripts/query.py` — and shows a table; annotated nodes in the results are clickable. The SPARQL can be edited before running. Engine: Oxigraph (WebAssembly), loaded on first use. |
| Validate | **Validate** runs in-browser checks (cardinality, classes, language tags, derivation anchors) and lists problems; click one to jump to the node. Full SHACL: `python scripts/validate.py file.ttl`. |
| Save / load | **Save .ttl** downloads `aro-annotations.ttl`; **Load .ttl** opens any ARO Turtle file to browse or continue it; **Load example** opens `examples/synthetic-derivation.ttl`. A draft is also kept in the browser between sessions. |
| Languages | **Interface**: English or Português (class and concept names come from the ontology's own labels). **Content language**: language of the texts you write. |

### Files

| File | Role |
|---|---|
| `index.html`, `style.css` | page layout |
| `app.js` | toolbar actions, creation panel, inspector, save/load |
| `layout.js` | toolbar menus, hideable and resizable panels, floating panels |
| `ontology.js` | loads `aro.ttl` and the catalog; class hierarchy, domains/ranges, vocabularies, labels |
| `data.js` | the user's annotations (N3 store), Turtle import/export |
| `graph.js` | graph view with open/close of neighbours (Cytoscape.js) |
| `queries.js` | runs the CQ/RQ SPARQL queries in the browser (Oxigraph) |
| `validate.js` | light checks driven by `validation/aro-shapes.ttl` |
| `i18n.js` | interface strings in English and Portuguese |

Nothing is sent to a server: files are read from and saved to your computer.

---

## Português

Ferramenta web para **instanciar a ontologia ARO** enquanto se lê, ouve ou assiste a uma obra: você cria obras, recortes, interpretações, situações, derivações e fontes, liga-os conforme a ontologia e vê tudo como um **grafo que se abre passo a passo**. As anotações são salvas em Turtle e podem ser carregadas de novo, validadas e consultadas.

### Iniciar

```bash
python scripts/annotator.py
```

O comando serve o repositório em `http://localhost:8765/annotator/` e abre o navegador (o anotador lê `ontology/src/aro.ttl`, por isso precisa ser servido a partir da raiz do repositório, não aberto como arquivo). Na primeira vez é preciso internet para carregar as duas bibliotecas (Cytoscape.js e N3.js).

### Uso

| Ação | Como |
|---|---|
| Adicionar nós (filhos / pais) | Selecione um nó: o painel esquerdo mostra, a partir do tipo dele, os **Filhos** que pode ter (este → relação → novo) e os **Pais** que podem apontar para ele (novo → relação → este), um cartão por relação permitida pela ontologia, com as classes como etiquetas (obrigatórias sinalizadas, as já cheias esmaecidas). Escolha a classe, digite o nome, Enter. *Nó existente, conceito, outras opções…* liga um nó existente, um conceito de vocabulário, um seletor ou um IRI externo. Sem seleção, o painel lista todas as classes por módulo para começar um nó solto. Um filtro restringe relações e classes. |
| Botão direito num nó | Menu: **Adicionar filho… / Adicionar pai…** (abre o painel esquerdo nesse nó), mostrar/encurtar o texto completo, abrir/fechar vizinhos, abrir em foco, esconder. |
| Cartões dos nós e passar o mouse | Cada nó é um cartão com o nome da classe ontológica no topo (na cor do módulo) e o texto embaixo; um selo mostra quantos vizinhos estão ocultos. Passar o mouse sobre um nó explica que tipo de elemento ele é (classe, módulo, natureza OntoUML, definição); sobre uma relação, explica a relação. As etiquetas de classe e os nós citados nos painéis têm a mesma descrição. |
| Textos longos | O inspetor é uma coluna de cartões recolhíveis (conteúdo, textos, referências e links, dados, relações, referenciado por); textos longos aparecem cortados com **ver mais**. No grafo, textos longos aparecem encurtados; mostre um por inteiro (botão ou botão direito) ou marque **Textos completos** para mostrar todos. |
| Formulários guiados pelo esquema | Todo formulário segue a ontologia: *Adicionar relação* e a aba **Filhos** listam só propriedades cujo domínio aceita o nó; a aba **Pais** lista propriedades cuja imagem o aceita (ex.: um novo recorte que `selectsFrom` esta manifestação); nós novos podem ser da classe da imagem ou de qualquer subclasse; propriedades no máximo do SHACL deixam de ser oferecidas, e as obrigatórias que faltam aparecem com asterisco e listadas em amarelo. |
| Editar um nó | Clique nele. O painel direito mostra classe e definição, textos, links, dados e relações. |
| Abrir / fechar vizinhos | Clique duas vezes no nó, ou **Abrir / fechar vizinhos** no painel direito. Os vizinhos ocultos aparecem num anel em volta do nó, agrupados por relação, sem mover o resto do desenho. Nós com vizinhos ocultos têm borda dupla; as relações do nó selecionado ficam destacadas. |
| Layout | **Árvore** (obras no topo, depois o que se liga a elas) ou **Rede** (força), e então **Reorganizar**. **Nomes das relações** esconde ou mostra os rótulos das arestas. |
| Ver só algumas obras | Painel esquerdo → **Obras exibidas**: desmarque uma obra para escondê-la junto com tudo o que só ela usa (padrões, casos e fontes compartilhados continuam enquanto outra obra exibida os usar). Numa obra, **Ver só esta obra** desmarca todas as outras. |
| Mais espaço para o grafo | As ações da barra ficam em menus (Arquivo, Análise, Exibir, Exportar, Idioma). **Criar** / **Inspetor** mostram ou escondem os painéis laterais; arraste a linha ao lado de um painel para redimensioná-lo (clique duplo esconde). **Só o grafo** deixa a tela inteira para o grafo. Os painéis de validação e de consultas podem ser minimizados (**–**), fechados (**×**) e redimensionados pela borda de cima. O layout fica guardado no navegador. |
| Esconder um nó | **Esconder nó** no painel direito; os nós ocultos ficam listados à esquerda, com **mostrar** para trazê-los de volta. |
| Foco num nó | **Abrir em foco ↗** abre uma nova aba só com aquele nó e seus vizinhos (profundidade 1–3). Alterações feitas em qualquer aba são compartilhadas. |
| Imagem / PDF | **Imagem (PNG)** baixa o grafo atual. **Imprimir / PDF** imprime o grafo e os detalhes do nó selecionado; no diálogo de impressão escolha "Salvar como PDF". |
| Localizar trechos no seu texto | Numa manifestação (ex.: a letra), **Anexar .txt** carrega a sua cópia do texto. Cada recorte com seletor de linhas (`line=a,b`) passa a mostrar as linhas correspondentes (linhas em branco não contam). **Gravar como citação** copia essas linhas para um `TextQuoteSelector` nos seus dados. O texto fica só no seu navegador. |
| Adicionar relação | Painel direito → *Adicionar relação*. Só aparecem propriedades cujo domínio aceita o nó; o destino se adapta à imagem: nó existente ou novo, **conceito de vocabulário** (tipo de derivação, dimensão, papel…, em hierarquia e com definições), **seletor W3C** (tempo `t=`, região `xywh=`, citação/posição de texto, SVG) ou **IRI de agente externo** (Wikidata, schema.org, FOAF…). |
| Textos em vários idiomas | *Textos*: um valor por idioma (`aro:textValue`, `aro:derivationExtent`). O seletor **idioma do conteúdo** define o padrão; *outro…* aceita qualquer etiqueta BCP 47. |
| Links | *Links*: `aro:externalLink` (qualquer nó: página da obra, gravação, local da evidência) e `aro:sourceURL` (fontes de referência). Os links abrem em nova aba. |
| Investigar | Situações, padrões, casos empíricos, afirmações e hipóteses têm **Pesquisar no Google** com o texto no idioma do conteúdo. |
| Consultas (CQ/RQ) | **Consultas (CQ/RQ)** lista todas as consultas de `queries/` com a pergunta que respondem (no idioma da interface), executa sobre as suas anotações atuais mais a ontologia — mesmos resultados que `python scripts/query.py` — e mostra uma tabela; os nós anotados nos resultados são clicáveis. O SPARQL pode ser editado antes de executar. Motor: Oxigraph (WebAssembly), carregado no primeiro uso. |
| Validar | **Validar** executa verificações no navegador (cardinalidade, classes, idioma, âncoras de derivação) e lista os problemas; clique num deles para ir ao nó. SHACL completo: `python scripts/validate.py arquivo.ttl --lang pt-BR`. |
| Salvar / carregar | **Salvar .ttl** baixa `aro-annotations.ttl`; **Carregar .ttl** abre qualquer arquivo Turtle da ARO para navegar ou continuar; **Carregar exemplo** abre `examples/synthetic-derivation.ttl`. Um rascunho também fica guardado no navegador entre sessões. |
| Idiomas | **Interface**: English ou Português (nomes de classes e conceitos vêm dos rótulos da própria ontologia). **Idioma do conteúdo**: idioma dos textos que você escreve. |

### Arquivos

| Arquivo | Papel |
|---|---|
| `index.html`, `style.css` | estrutura da página |
| `app.js` | ações da barra, painel de criação, inspetor, salvar/carregar |
| `layout.js` | menus da barra, painéis que escondem e redimensionam, painéis flutuantes |
| `ontology.js` | carrega `aro.ttl` e o catálogo; hierarquia, domínios/imagens, vocabulários, rótulos |
| `data.js` | as anotações do usuário (store N3), importação/exportação Turtle |
| `graph.js` | grafo com abrir/fechar vizinhos (Cytoscape.js) |
| `queries.js` | executa as consultas SPARQL das CQ/RQ no navegador (Oxigraph) |
| `validate.js` | verificações leves guiadas por `validation/aro-shapes.ttl` |
| `i18n.js` | textos da interface em inglês e português |

Nada é enviado a servidor: os arquivos são lidos e salvos no seu computador.

---

[← Back to README](../README.md) · [← Voltar para o LEIA-ME](../LEIA-ME.md)
