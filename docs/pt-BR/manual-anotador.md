[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/annotator-manual.md)

# Manual do Anotador ARO

Versão online: <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/>. Para rodar no seu computador, ver a [seção 2](#2-iniciar-o-anotador).

O Anotador ARO é uma ferramenta web para **instanciar a ontologia ARO** sem escrever RDF à mão. Com ele você registra obras, versões e trechos, interpretações, situações, padrões, casos reais e fontes, além de derivações entre obras. Tudo aparece num grafo que você abre passo a passo, e o trabalho é salvo em Turtle (`.ttl`).

## Sumário

1. [Requisitos e instalação](#1-requisitos-e-instalação)
2. [Iniciar o anotador](#2-iniciar-o-anotador)
3. [A tela](#3-a-tela)
4. [Primeira anotação, passo a passo](#4-primeira-anotação-passo-a-passo)
5. [Navegar no grafo](#5-navegar-no-grafo)
6. [Textos, idiomas e links](#6-textos-idiomas-e-links)
7. [Localizar trechos no texto da obra](#7-localizar-trechos-no-texto-da-obra)
8. [Validar](#8-validar)
9. [Salvar, carregar e exemplos](#9-salvar-carregar-e-exemplos)
10. [Imagem e PDF](#10-imagem-e-pdf)
11. [Depois de anotar: validação completa e consultas](#11-depois-de-anotar-validação-completa-e-consultas)
12. [Executar os testes do projeto](#12-executar-os-testes-do-projeto)
13. [Solução de problemas](#13-solução-de-problemas)

---

## 1. Requisitos e instalação

| Requisito | Para quê |
|---|---|
| **Python 3.10+** | servir o anotador e executar validação, consultas e testes |
| Navegador atual (Chrome, Edge, Firefox) | usar o anotador |
| Internet na primeira abertura | baixar as bibliotecas Cytoscape.js (grafo) e N3.js (Turtle) |

Na raiz do repositório:

```bash
python -m pip install -r requirements.txt
```

## 2. Iniciar o anotador

O anotador roda online em <https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/>. As anotações ficam no navegador até você salvá-las em `.ttl` (seção 9); os textos locais (seção 7) ficam no seu computador. Depois de uma atualização, recarregue com Ctrl+F5 se a página parecer desatualizada.

Para rodar no seu computador:

```bash
python scripts/annotator.py
```

- O comando serve a pasta do repositório em `http://localhost:8765/annotator/` e abre o navegador.
- Para parar, use **Ctrl+C** no terminal.
- **Outra porta:** `python scripts/annotator.py --port 9000`.
- **Sem abrir o navegador:** `python scripts/annotator.py --no-browser`.

> Por que um servidor? O anotador lê `ontology/src/aro.ttl`, `model/conceptual-model.json` e `validation/aro-shapes.ttl`. Por segurança, o navegador não permite essa leitura quando a página é aberta direto como arquivo. Nada é enviado para fora do seu computador.

## 3. A tela

| Área | Conteúdo |
|---|---|
| **Barra superior** | menus **Arquivo** (Novo, Carregar .ttl, Carregar exemplo, Salvar .ttl) · **Análise** (Validar, Consultas) · **Exibir** (Recolher às obras, Mostrar tudo, tipo de layout, Reorganizar, Nomes das relações, Textos completos) · **Exportar** (Imagem (PNG), Imprimir/PDF) · **Idioma** (interface e conteúdo) · **Salvar .ttl** sempre visível · à direita, os botões de painéis **Criar**, **Inspetor** e **Só o grafo** |
| **Painel esquerdo (Criar)** | seções recolhíveis: *Adicionar um nó* (classe + nome + ligação), *Obras e visibilidade* (**Obras exibidas**, **Nós ocultos**, contador de nós) e *Configurações* (IRI base dos seus dados) |
| **Centro** | o grafo; os resultados de validação e de consultas abrem em painéis flutuantes sobre ele |
| **Painel direito (Inspetor)** | o nó selecionado: classe e definição, botões de navegação, trecho, textos, links, dados, relações e "referenciado por" |
| **Rodapé** | mensagens (arquivo carregado, salvo…) |

**Mais espaço para o grafo.** Todos os painéis podem ser escondidos e redimensionados:

- **Painéis laterais:** os botões **Criar** e **Inspetor** (ou **«** / **»** em cada painel) mostram e escondem; um painel escondido deixa uma faixa fina com um botão para trazê-lo de volta. Arraste a linha entre o painel e o grafo para mudar a largura; clique duas vezes nessa linha para esconder o painel.
- **Só o grafo:** esconde os dois painéis laterais e reduz a barra superior aos menus; **Mostrar painéis**, no canto superior direito do grafo, restaura.
- **Painéis flutuantes** (Validação, Consultas): **–** minimiza para a barra de título (clique duplo no título também), **×** fecha, e arrastar a borda de cima muda a altura.

Larguras, painéis escondidos e alturas ficam guardados neste navegador.

As cores dos nós indicam o módulo da ontologia. Conceitos de vocabulário aparecem como etiquetas tracejadas, e recursos externos (pessoas, bandas, seletores) como elipses pontilhadas.

## 4. Primeira anotação, passo a passo

Exemplo: registrar que um trecho de uma canção representa uma situação, generalizá-la num padrão e ligar esse padrão a um caso real.

1. **A obra.** No painel esquerdo, escolha a classe *obra* (`Artwork`), digite o título e clique em **Criar**.
2. **A versão.** Com a obra selecionada, abra a aba **Filhos** e escolha *expressão* em `hasExpression`, por exemplo "Gravação de 1993" ou "Texto da letra" (IFLA LRM: expressão é uma realização com conteúdo próprio). Se a edição importa (um álbum, uma edição de livro), acrescente à expressão uma *manifestação* com `hasManifestation`.
3. **O trecho.** Selecione a expressão, abra a aba **Pais** e crie um *recorte* em `selectsFrom`: o novo recorte já fica ligado à expressão.
4. **Onde está o trecho.** No recorte, adicione `hasSelector` e escolha o tipo de seletor:
   - **FragmentSelector** com `line=27,30` para as linhas 28–30 de um texto;
   - **FragmentSelector** com `t=12,16` para os segundos 12–16 de um áudio ou vídeo;
   - **TextQuoteSelector** para uma citação literal.
5. **A interpretação.** Crie um *registro de interpretação* (`InterpretationRecord`) e adicione as relações:
   - `hasPrimarySelection` → o recorte;
   - `producedByAct` → um novo *ato interpretativo*, que por sua vez recebe `hasParticipant` → você, como *IRI externo* (por exemplo, seu ORCID ou Lattes, com tipo `schema:Person`).
6. **A situação.** No registro, adicione `describesSituation` → nova *descrição de situação* e escreva o texto em *Textos*, em um ou mais idiomas.
7. **O padrão.** Na situação, adicione `generalizesAs` → novo *padrão situacional*. No padrão, adicione `hasCondition` → *condições*.
8. **O caso real.** Crie um *caso empírico* e uma *fonte de referência* (com link em *Links* → `sourceURL`). Depois crie um *item de evidência* com `derivedFromSource` → a fonte.
9. **A alegação.** Crie uma *alegação de correspondência* com `assertsPattern` → o padrão e `assertsCase` → o caso. Por fim, crie uma *avaliação de evidência* com `assessesClaim` → a alegação de correspondência e `assessesEvidence` → o item de evidência, e escreva o que ela apoia e o que não apoia.
10. **Salvar.** Clique em **Validar** e depois em **Salvar .ttl**.

Para **derivações** (cover, sample, adaptação…), crie uma *alegação de derivação* e adicione:
- `hasSourceAnchor` e `hasDerivedAnchor`, cada um apontando para uma entidade artística (obra, expressão, manifestação ou recorte);
- `hasDerivationType`, escolhido numa lista em árvore, com definições;
- `hasTransformation`, com dimensão e operação;
- `hasJustification`, com a explicação (a mesma propriedade usada por todo tipo de alegação; assim também `citesSource`, `producedByAct` e, a partir de uma avaliação, `assessesClaim`).

**Adicionar filhos e pais a partir de um nó**
- Selecione um nó (clique nele, ou botão direito → **Adicionar filho…** / **Adicionar pai…**). O painel esquerdo mostra duas abas calculadas a partir do tipo do nó:
  - **Filhos**: novos nós para os quais este nó aponta (este → relação → novo), ex.: de uma obra, uma expressão por `hasExpression`;
  - **Pais**: novos nós que apontam para ele (novo → relação → este), ex.: de uma expressão, um recorte por `selectsFrom`.
- Cada relação permitida é um cartão com as classes como etiquetas; as **obrigatórias** vêm primeiro e as que já atingiram o **máximo** ficam esmaecidas. Clique numa etiqueta, digite o nome e tecle Enter: o nó é criado, ligado e selecionado.
- *Nó existente, conceito, outras opções…* num cartão liga, em vez disso, um nó existente, um conceito de vocabulário, um seletor ou um IRI externo.
- Sem nó selecionado, o painel lista todas as classes por módulo, para começar um nó solto (também em *Nó solto* quando há um nó selecionado).
- Passe o mouse sobre uma etiqueta para ler o que é a classe (módulo, natureza OntoUML, definição).

**Cartões dos nós:** cada nó mostra a classe ontológica no topo (na cor do módulo) e o texto embaixo; um selo conta os vizinhos ocultos. Passe o mouse sobre um nó ou uma relação para ver que tipo de elemento é e para que serve.

**Textos longos:** o inspetor é uma coluna de cartões recolhíveis; o cartão **Conteúdo** mostra o texto inteiro (textos longos aparecem cortados com **ver mais**). No grafo, use **Mostrar texto completo no grafo** (no painel ou no botão direito) para um nó, ou marque **Textos completos** no menu **Exibir** para todos; textos longos viram cartões mais largos.

**Como os formulários seguem a ontologia**
- *Adicionar relação* mostra só as propriedades cujo domínio aceita o nó. As **obrigatórias** (SHACL `minCount`) aparecem com `*`, e as que faltam ficam listadas num aviso amarelo. As que já atingiram o **máximo** (`maxCount`) deixam de aparecer.
- A aba **Pais** cria uma relação que **chega** ao nó, a partir de um nó novo ou (em *outras opções*) de um existente. Por exemplo, numa expressão: um novo recorte com `selectsFrom` para ela.
- Ao criar um nó novo numa relação, você pode escolher a classe da imagem ou **qualquer subclasse** (ex.: *descrição de estado intencional*).
- Em *Dados*, as propriedades específicas da classe aparecem direto; as gerais (identificador, etiqueta de idioma…) ficam em *Mais propriedades*.

> A ontologia **representa** alegações feitas por agentes; ela não decide se são verdadeiras. Use as avaliações e as contestações (`Challenge`, que pode visar qualquer alegação) para registrar apoio e divergência. Classes *abstratas* (`Claim`, `AnalyticalRecord`, `Assessment`, `ArtisticEntity`) não são oferecidas para criação: escolha uma de suas subclasses.

> **Arquivos da ARO 0.2** são convertidos ao abrir (ex.: a antiga *manifestação* vira *expressão*); a barra de status avisa. Salve para manter o arquivo convertido, ou rode `python scripts/migrate.py arquivo.ttl`.

## 5. Navegar no grafo

| Ação | Como |
|---|---|
| Selecionar | clique no nó; as relações dele ficam destacadas em azul |
| Abrir / fechar vizinhos | duplo clique, ou **Abrir / fechar vizinhos**; os vizinhos aparecem num anel em volta do nó, agrupados por relação. Borda dupla = há vizinhos ocultos |
| Reorganizar | **Árvore** (obras no topo) ou **Rede**, e então **Reorganizar** |
| Menos poluição visual | desmarque **Nomes das relações** |
| Ver só algumas obras | **Obras exibidas**: desmarque obras, ou use **Ver só esta obra** numa obra. O que é compartilhado com obras visíveis continua |
| Esconder um nó | **Esconder nó**; para trazê-lo de volta, use **mostrar** na lista *Nós ocultos* |
| Analisar um nó à parte | **Abrir em foco**: nova aba só com o nó e seus vizinhos (profundidade 1–3). As alterações são compartilhadas entre as abas |
| Recomeçar a visão | **Recolher às obras** ou **Mostrar tudo** |

## 6. Textos, idiomas e links

- **Interface:** português ou inglês. Os nomes de classes e conceitos vêm dos rótulos da própria ontologia.
- **Idioma do conteúdo:** é o idioma padrão dos textos que você escreve. A opção *outro…* aceita qualquer etiqueta BCP 47 (ex.: `es`, `ja`). Cada texto pode ter uma versão por idioma.
- **Links:** `externalLink` vale para qualquer nó (página da obra, gravação, local da evidência); `sourceURL` vale para fontes. Os links abrem em nova aba.
- **Pesquisar no Google:** aparece em situações, padrões, condições, casos, afirmações e hipóteses, e usa o texto do nó.

## 7. Localizar trechos no texto da obra

Para ver o trecho exato de cada recorte (por exemplo, as linhas de uma letra):

1. Selecione a **expressão** que representa o texto (ex.: "Texto da letra").
2. Clique em **Anexar .txt** e escolha a **sua cópia** do texto.
3. Selecione um recorte que tenha seletor `line=a,b`: o painel mostra as linhas numeradas. Linhas em branco não contam.
4. Se quiser, use **Gravar como citação** para copiar as linhas para um `TextQuoteSelector` nos seus dados.

O texto anexado fica **apenas no seu navegador**: não vai para o `.ttl` nem para o repositório. Para guardar cópias de textos protegidos junto ao projeto, use a pasta `private/`, que é ignorada pelo git.

## 8. Validar

**Validar** confere no navegador:
- cardinalidades (ex.: uma alegação de derivação precisa de tipo, origem e derivada);
- classes dos valores;
- textos com idioma;
- âncoras de derivação.

Clique num problema para ir até o nó. A validação completa (SHACL) está na seção 11.

### Consultas no navegador

O botão **Consultas (CQ/RQ)** abre um painel com todas as questões de competência (CQ) e de pesquisa (RQ):
1. escolha a pergunta (o texto aparece no idioma da interface);
2. clique em **Executar**: a consulta roda sobre as suas anotações atuais mais a ontologia e mostra uma tabela. Os resultados são os mesmos de `python scripts/query.py`;
3. clique num nó da tabela para ir até ele no grafo;
4. em **SPARQL (editável)** você pode adaptar a consulta antes de executar.

Os textos dos resultados seguem o **idioma do conteúdo** escolhido na barra; quando um texto não existe nesse idioma, aparece no idioma que tem.

O motor SPARQL (Oxigraph) é baixado no primeiro uso; para isso é preciso internet.

## 9. Salvar, carregar e exemplos

- **Salvar .ttl** baixa `aro-annotations.ttl`.
- **Carregar .ttl** abre qualquer arquivo da ARO para continuar ou só navegar.
- **Carregar exemplo** abre os estudos de caso (`examples/case-studies.ttl`). Os arquivos por obra (`examples/example_homem_na_estrada.ttl`, `examples/example_vidas_secas.ttl`) podem ser abertos em **Carregar .ttl**.
- **Rascunho automático:** o navegador guarda o trabalho atual entre sessões. **Novo** descarta o rascunho, mas antes pede confirmação.
- O **IRI base** define o endereço dos nós novos (ex.: `https://example.org/meu-projeto/`). Ao carregar um arquivo, ele passa a ser o do arquivo.

## 10. Imagem e PDF

- **Imagem (PNG):** baixa o grafo visível inteiro em alta resolução, com o mesmo visual da tela (cartões com classe, cor e texto, selos de vizinhos ocultos, relações do nó selecionado em destaque).
- **Imprimir / PDF:** monta uma página com o grafo e os detalhes do nó selecionado. No diálogo de impressão, escolha **Salvar como PDF**.

## 11. Depois de anotar: validação completa e consultas

```bash
python scripts/validate.py aro-annotations.ttl --lang pt-BR
```

O comando mostra `OK` ou uma linha por violação, com mensagem em português.

```bash
python scripts/query.py aro-annotations.ttl --query queries/RQ-01-passages-to-real-cases.rq --lang pt-BR
```

`--lang` escolhe o idioma preferido dos textos (padrão: `en`); textos sem versão nesse idioma aparecem no idioma que têm.

As consultas de `queries/` respondem às questões de competência (CQ-…) e às questões de pesquisa (RQ-01 a RQ-04). Elas estão descritas no [LEIA-ME](../../LEIA-ME.md#validar-e-consultar-seus-dados) e nos [estudos de caso](case-studies.md).

## 12. Executar os testes do projeto

```bash
python tests/test_project.py
```

O resultado esperado termina com `PASS: ...`. Os testes verificam:

| Verificação | O que garante |
|---|---|
| `scripts/build.py --check` | ontologia, SHACL, schemas, documentação de referência, diagramas e seções geradas do LEIA-ME/README estão de acordo com o catálogo `model/conceptual-model.json` |
| leitura em três formatos | `aro.ttl`, `aro.owl` e `aro.jsonld` têm as mesmas triplas |
| integridade do catálogo | classes, relações, pacotes e conceitos consistentes |
| política de idioma | todo termo tem rótulo, definição e comentário em `en` e `pt-BR` |
| JSON Schemas | exemplos válidos aceitos e inválidos rejeitados |
| SHACL | todos os exemplos são válidos, e dados errados de propósito são rejeitados |
| consultas | cada consulta SPARQL retorna resultados |
| estudos de caso | as questões de pesquisa dão as respostas esperadas, e os arquivos por obra estão atualizados e cobrem o arquivo completo |

Comandos auxiliares:

```bash
python scripts/build.py
```

Regenera tudo depois de alterar o catálogo.

```bash
python scripts/split_examples.py
```

Regenera os arquivos por obra depois de alterar `examples/case-studies.ttl`.

O anotador (JavaScript) ainda não tem testes automatizados; ele foi verificado manualmente no navegador.

## 13. Solução de problemas

| Sintoma | Causa provável e solução |
|---|---|
| "Não foi possível carregar a ontologia" | a página foi aberta como arquivo. Use `python scripts/annotator.py` |
| A página fica em branco ou o grafo não aparece | sem internet na primeira abertura (bibliotecas via CDN). Conecte-se e recarregue |
| "Address already in use" | a porta está ocupada. Use `--port 9000` |
| O duplo clique não abre os vizinhos | use o botão **Abrir / fechar vizinhos** no painel direito |
| Quero começar do zero | **Novo**; ou limpe os dados do site `localhost` no navegador |
| O trecho do texto não aparece | anexe o `.txt` na **expressão** ligada ao recorte (`selectsFrom`) e confira se o recorte tem seletor `line=a,b` |
| As etiquetas de idioma aparecem em minúsculas no navegador | é comportamento da biblioteca N3.js. O arquivo salvo usa `pt-BR` |

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/annotator-manual.md)
