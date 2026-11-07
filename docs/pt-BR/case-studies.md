[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/case-studies.md)

# Estudos de caso: *Homem na Estrada* e *Vidas Secas*

Dois exemplos completos de instanciação. O arquivo [`examples/case-studies.ttl`](../../examples/case-studies.ttl) traz as duas obras juntas; cada obra também tem seu próprio arquivo, autossuficiente: [`example_homem_na_estrada.ttl`](../../examples/example_homem_na_estrada.ttl) e [`example_vidas_secas.ttl`](../../examples/example_vidas_secas.ttl). Eles são gerados por `python scripts/split_examples.py`, que copia em cada arquivo os padrões, casos e fontes compartilhados. Os estudos respondem a quatro questões de pesquisa em SPARQL ([`queries/RQ-*.rq`](../../queries/)).

| Obra | Mídia | Recortes | Derivação |
|---|---|---|---|
| *Homem na Estrada*, Racionais MC's, álbum *Raio X do Brasil* (1993), escrita por Mano Brown | canção (rap) | 15 eventos localizados por faixa de linhas da letra | sample de *Ela Partiu* (Tim Maia) |
| *Vidas Secas*, Graciliano Ramos (1938) | romance | 4 capítulos (Mudança, Cadeia, Contas, Fuga) | adaptação para o cinema por Nelson Pereira dos Santos (1963) |

## Método e limites

- **Nenhum trecho da letra ou do romance é armazenado.** Cada recorte é um *evento* da narrativa. Na canção, ele é localizado pelas linhas em que acontece (geralmente 2 a 8), na transcrição da letra fornecida pelo pesquisador. No romance, o recorte é um capítulo.
- **As descrições das situações são paráfrases e representam a leitura de um analista** (`InterpretationRecord`), não o conteúdo da obra. O `aro:confidenceScore` indica a segurança dessa leitura.
- **Os casos empíricos citam fontes reais e públicas**, com URLs conferidas quando o exemplo foi escrito.
- **As alegações de correspondência afirmam semelhança ou possibilidade.** Não afirmam que a obra narra um evento real específico, nem que exista causalidade. Cada avaliação de evidência diz o que apoia e o que não apoia.

## Homem na Estrada — eventos e leitura

Os números de linha seguem a transcrição LyricFind da letra (151 linhas, contando os refrões e excluindo os créditos). Cada evento é localizado por um fragmento RFC 5147 (`line=a,b`) e por uma expressão legível.

| Evento | Linhas | Situação representada (leitura) | Padrão | Confiança |
|---|---|---|---|---|
| 1 | 1–7 | Um homem sai da prisão e recomeça a vida, querendo provar que mudou | Barreiras à reintegração após a prisão | 0,95 |
| 2 | 8–9 | Lembranças dolorosas da FEBEM na infância | Institucionalização de jovens pobres | 0,95 |
| 3 | 22–26 | Barraco mal acabado num barranco instável, com esgoto no quintal e risco de desabar com a chuva | Moradia precária sem saneamento ou água | 0,95 |
| 4 | 28–30 | O IBGE esteve lá uma única vez, contou os barracos e não retornou | Ausência de serviços públicos na periferia | 0,9 |
| 5 | 31–38 | O corpo de uma mulher assassinada fica horas na rua; o IML chega dez horas atrasado | Ausência de serviços públicos na periferia | 0,95 |
| 6 | 46–50 | Desempregado, com má reputação por ter sido preso, ninguém confia nele | Barreiras à reintegração após a prisão | 0,95 |
| 7 | 57–58 | Falta água há cinco dias, e a falta é rotina | Moradia precária sem saneamento ou água | 0,95 |
| 8 | 62–66 | Um homem embriagado que agrediu a mãe é linchado pelos vizinhos | Linchamento como punição popular | 0,9 |
| 9 | 73–76 | Crianças disputam comida com animais na feira e só vão à escola para comer | Fome infantil e dependência da merenda | 0,9 |
| 10 | 80–87 | Um amigo que vendia cocaína a jovens ricos é morto na escola e vira notícia sensacionalista | Violência letal do varejo de drogas | 0,85 |
| 11 | 103–108 | Após assaltos, a favela é acusada e o nome dele entra na lista de suspeitos | Reintegração; violência do Estado | 0,9 |
| 12 | 111–118 | Os antecedentes são expostos; ele será sempre chamado de ex-presidiário | Barreiras à reintegração após a prisão | 0,9 |
| 13 | 119–123 | Não confia na polícia, espera ser agredido e não socorrido, e faz a própria segurança | Violência arbitrária ou letal de agentes do Estado | 0,95 |
| 14 | 132–137 | De madrugada a polícia invade o barraco, decidida a matá-lo, embora ele não estivesse no crime | Violência arbitrária ou letal de agentes do Estado | 0,9 |
| 15 | 148–151 | Relato em tom de notícia: um homem é encontrado morto na estrada do M'Boi Mirim; a polícia atribui a morte a quadrilhas e cita sua ficha criminal | Violência do Estado (vítima retratada como infratora) | 0,85 |

**Leituras plurais.** O evento 15 tem uma justificativa e uma contestação registradas:
- **Justificativa:** a sequência invasão policial → morte contrasta com a versão da polícia, e a leitura toma essa versão como criminalização da vítima.
- **Contestação** (`Challenge`): a letra deixa os autores implícitos, então a versão do relato não pode ser excluída dentro da própria narrativa.

Instituições e lugares reais que aparecem na letra são representados como `DepictedElement`: FEBEM, IBGE, IML e a Estrada do M'Boi Mirim.

As leituras citam análises acadêmicas da canção: o artigo da [Intexto/UFRGS](https://seer.ufrgs.br/index.php/intexto/article/view/150581) e o [TCC da UFPB](https://repositorio.ufpb.br/jspui/handle/123456789/31862) sobre violência policial na música.

**Criação e derivação:** Mano Brown (Pedro Paulo Soares Pereira; autor e letrista) e Racionais MC's (intérpretes) aparecem como agentes externos (DBpedia). A faixa faz sample de *Ela Partiu*, de Tim Maia, conforme o [artigo sobre o álbum](https://en.wikipedia.org/wiki/Raio-X_do_Brasil).

## Vidas Secas — capítulos e leitura

| Capítulo | Situação representada (leitura) | Padrão |
|---|---|---|
| 1 «Mudança» | Uma família de trabalhadores rurais atravessa o sertão seco em busca de onde sobreviver | Migração forçada pela seca |
| 3 «Cadeia» | Um soldado provoca Fabiano, que é preso, espancado e passa a noite na cadeia sem ter cometido crime | Violência arbitrária ou letal de agentes do Estado |
| 10 «Contas» | As contas do patrão, com juros que Fabiano não consegue conferir, o mantêm endividado | Exploração por dívidas e contas opacas |
| 13 «Fuga» | Com nova seca, a família parte esperando vida melhor nas cidades do sul | Migração forçada pela seca |

**Derivação:** o filme de Nelson Pereira dos Santos (1963) é representado como `IntermedialAdaptation` em regime sério. A mídia está registrada como modificada e as situações como mantidas, inclusive os padrões de violência do Estado e de migração pela seca (confiança 0,7). A alegação cita o [artigo sobre o filme](https://en.wikipedia.org/wiki/Barren_Lives_(film)).

## Padrões e correspondências com o mundo real

| Padrão | Obras | Caso real | Fonte | O que a avaliação apoia |
|---|---|---|---|---|
| Violência arbitrária ou letal de agentes do Estado contra um homem pobre | ambas | Mortes decorrentes de intervenção policial no Brasil | [FBSP, Anuário 2021](https://forumseguranca.org.br/wp-content/uploads/2021/07/4-as-mortes-decorrentes-de-intervencao-policial-no-brasil-em-2020.pdf) | que a situação é possível e recorrente; não que a canção narre um evento real |
| idem | ambas | Massacre do Carandiru (1992) | [enciclopédia](https://pt.wikipedia.org/wiki/Massacre_do_Carandiru) | possibilidade real no contexto histórico da canção |
| Barreiras à reintegração após a prisão | *Homem na Estrada* | Reincidência e reintegração de egressos | [IPEA, 2015](https://repositorio.ipea.gov.br/bitstream/11058/7510/1/RP_Reincid%c3%aancia_2015.pdf) | apoio parcial: o relatório não mede recusa de emprego por antecedentes |
| Moradia urbana precária sem saneamento ou água | *Homem na Estrada* | Falta de coleta de esgoto no Brasil | [Poder360 / Trata Brasil](https://www.poder360.com.br/brasil/100-milhoes-de-brasileiros-nao-tem-coleta-de-esgotos-em-casa/) | escala nacional, décadas depois; não o bairro específico |
| Migração forçada pela seca | *Vidas Secas* | Campos de concentração de retirantes no Ceará (1932) | [FAPESP](https://revistapesquisa.fapesp.br/memorias-da-seca/), [Diário do Nordeste](https://diariodonordeste.verdesmares.com.br/ceara/campo-de-concentracao-que-abrigou-16-mil-retirantes-no-ceara-deve-ter-predios-e-ruinas-tombados-1.3258221) | documentação histórica; a família do romance é ficcional |

Cinco padrões ainda **não têm caso real** e ficam como pontos abertos de pesquisa:
- ausência de serviços públicos na periferia;
- institucionalização de jovens pobres;
- linchamento;
- fome infantil;
- violência do varejo de drogas.

O padrão de exploração por dívidas de *Vidas Secas* também está sem caso.

Há ainda uma `ExplanationHypothesis` para o padrão de violência do Estado ("policiamento seletivo de populações pobres e negras"). Ela está representada como hipótese, não como causa estabelecida.

## Questões de pesquisa e respostas

Para executar:

```bash
python scripts/query.py examples/case-studies.ttl --query queries/RQ-01-passages-to-real-cases.rq
```

| ID | Questão de pesquisa | Resposta nos estudos de caso |
|---|---|---|
| RQ-01 | Que trechos de uma obra representam situações alegadas correspondentes a casos reais documentados, e onde consultar a fonte? | 18 linhas: 9 eventos da canção (com faixa de linhas) e 3 capítulos do romance, ligados a 5 casos reais, cada um com URL, em ordem narrativa. |
| RQ-02 | Que padrões situacionais se repetem em obras independentes? | O padrão de **violência arbitrária ou letal de agentes do Estado** aparece nas duas obras. |
| RQ-03 | Como cada correspondência é sustentada (evidência, fonte, avaliação)? | 6 linhas, cada uma com a evidência, a URL e a avaliação do que é e do que não é apoiado. |
| RQ-04 | Que derivações mantêm um padrão da origem que tem correspondência com casos reais? | A adaptação para o cinema de *Vidas Secas* mantém a violência do Estado (2 casos reais) e a migração pela seca (1 caso). |

Os testes (`python tests/test_project.py`) verificam essas respostas.

## Como continuar no anotador

```bash
python scripts/annotator.py
```

Carregue `examples/case-studies.ttl` em **Carregar .ttl**. Depois:
- na expressão "Texto da letra", use **Anexar .txt** com a sua cópia da letra: cada evento passa a mostrar as linhas correspondentes;
- acrescente eventos ou ajuste as faixas de linha;
- revise ou conteste as leituras com uma `Challenge`;
- acrescente casos e fontes, sobretudo para os padrões que ainda não têm caso;
- salve um novo arquivo.

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/case-studies.md)
