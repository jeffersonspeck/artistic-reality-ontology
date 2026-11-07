[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/derivation-typology.md)

# Tipologia de derivação: fundamentação e revisão

A lista completa de conceitos (com definições e a literatura de cada um) é gerada em [reference-model.md](reference-model.md#vocabulários-controlados-skos). Este documento explica **por que** a tipologia tem essa forma.

## Três tradições combinadas

| Tradição | Pergunta que responde | Uso na ARO |
|---|---|---|
| Poética — Genette (1982) | *Como* um texto se relaciona com outro? Copresença (intertextualidade: citação, alusão, plágio) vs. derivação hipertextual por **transformação** ou **imitação**, cada uma em regime lúdico, satírico ou sério. | Famílias *Incorporação*, *Transformação*, *Imitação*; eixo separado de **regime**. |
| Biblioteconomia — Tillett (1991), Smiraglia (2001), IFLA LRMoo (2024) | A derivada é a *mesma obra* em nova expressão ou uma *obra nova*? Relações derivativas (edições, traduções, ampliações, extrações, adaptações, performances) e sequenciais (continuações). | Família *Re-realização* e *Extensão*; nível da derivação via âncoras (ADR-012). |
| Mídias específicas — Burkholder (1994) para música; Rajewsky (2005) para intermidialidade; Hutcheon (1985, 2006); Schloss (2004) e Navas (2012) para sample/remix; Mosser (2008) e Mag Uidhir, Magnus & Magnus (2013) para covers; Verevis (2006) para remakes; Jenkins (1992) para obras de fãs | Quais procedimentos concretos ocorrem em cada mídia? | Conceitos específicos (sample, interpolação, paráfrase, medley, écfrase, remake, crossover…). |

As famílias são **organização para navegação**, não classes disjuntas: uma alegação pode ter vários tipos (ex. obra de fã + sequência; tradução é re-realização para a biblioteconomia e transformação séria para Genette — a ARO a classifica em re-realização e a definição menciona a dupla leitura).

## Revisão feita na v0.2 (o que mudou e por quê)

| Antes | Problema | Agora | Base |
|---|---|---|---|
| `Parody` em *Imitação* | Em Genette a paródia é **transformação** (lúdica) de um texto; Hutcheon a define como repetição com diferença crítica | `Parody` em *Transformação* | Genette 1982; Hutcheon 1985 |
| `Allusion` em *Imitação* | Alusão é **copresença** (intertextualidade), não imitação de estilo | `Allusion` em *Incorporação* | Genette 1982 |
| `Homage` como tipo | Homenagem é **postura/função**, não mecanismo: um cover, uma citação ou um pastiche podem ser homenagens | Novo eixo `DerivationRegime` (lúdico, satírico/crítico, sério, reverencial) e relação `hasRegime` | Regimes de Genette 1982; "reverencial" é acréscimo da ARO |
| Família *Reaproveitamento de material* | Nome cobria só reuso literal | *Incorporação / copresença*, incluindo citação, alusão, empréstimo não declarado, sample, interpolação, paráfrase, medley, colagem/mashup, remix, apropriação, écfrase | Genette 1982; Burkholder 1994; Rajewsky 2005 |
| — | Faltavam relações derivativas clássicas da biblioteconomia | `Performance`, `Revision`, `Abridgment`, `Amplification`, `Remake` | Smiraglia 2001; Verevis 2006 |
| — | Faltavam tipos hipertextuais de Genette | `Travesty`, `Caricature`, `SeriousImitation` (*forgerie*, que **não** significa fraude) | Genette 1982 |
| — | Faltavam procedimentos musicais | `Paraphrase`, `Medley`, `Variation` | Burkholder 1994 |
| `Continuation` sem subtipos; `FanWork` como mecanismo | Obra de fã é definida pelo **contexto de produção**, não pelo mecanismo | `Sequel`, `Prequel`, `SpinOff`, `Crossover`; `FanWork` mantido, mas a definição pede tipificar também o mecanismo | Tillett 1991 (relações sequenciais); Jenkins 1992 |
| `CoverVersion` direto em *Re-realização* | "Cover" é sistematicamente ambíguo | `CoverVersion` ⊂ `Performance`; registrar dimensões (ex. `VocalDeliveryDimension`) para desambiguar | Mosser 2008; Mag Uidhir, Magnus & Magnus 2013 |

**Decisões dos pontos em aberto:**

- **Remix** foi dividido segundo Navas (2012): `ExtendedRemix` (versão estendida/reeditada da mesma gravação) em *Re-realização*; `Remix` (seletivo ou reflexivo, recombina elementos num novo todo) em *Incorporação*.
- **Plágio** virou `UnacknowledgedBorrowing` (empréstimo não declarado): é a relação textual descrita por Genette, sem julgamento jurídico ou moral.
- **Legalidade fora do escopo** (ADR-014): licitude, autorização e originalidade das derivações não são representadas. Remixadores, artistas de cover, tradutores e adaptadores são criadores por direito próprio; cada derivação é **representada com a explicação dada pelos agentes** (`hasJustification` → `Justification`, fontes e avaliações de evidência).

## Dimensões para o anotador

56 dimensões em 7 famílias, cada uma com `skos:broader`, para o anotador oferecer listas por mídia:

- **Narrativa** (Chatman 1978; Genette 1972): enredo, personagem, ambientação, situação, narração/voz, focalização, tempo narrativo.
- **Verbal**: letra, diálogo, dicção/registro, versificação, língua.
- **Música e som** (parâmetros usados em Burkholder 1994): melodia, harmonia, ritmo, andamento, timbre, textura, forma, dinâmica, interpretação vocal, som gravado, produção/mixagem.
- **Visual** (elementos formais; Panofsky 1939 para iconografia): composição, cor, linha/forma, textura, espaço, material/técnica, iconografia/motivo, pose/gesto.
- **Audiovisual** (sistemas de Bordwell & Thompson, *Film Art*): mise-en-scène (cenário, figurino, iluminação, atuação), fotografia (enquadramento, movimento de câmera), montagem, som fílmico.
- **Transmidiática**: tema, estilo, gênero (arquitextualidade), tom, mídia.
- **Paratexto** (Genette 1987): título, créditos, capa/cartaz.

Para o anotador: use o conceito mais específico possível; os mais gerais (ex. `VisualDimension`) servem quando a anotação é grossa. Um `TransformationAspect` pode apontar recortes (`aspectSourceSelection`/`aspectDerivedSelection`), que no futuro usarão seletores W3C Web Annotation.

## Formato para o anotador

`schemas/derivation-annotation.schema.json` é gerado pelo `build.py` a partir dos vocabulários: os campos `derivationTypes`, `regimes`, `dimension` e `operation` só aceitam conceitos existentes. Âncoras de nível `Selection` exigem um seletor W3C Web Annotation (`FragmentSelector` para tempo `t=` ou região `xywh=`, `TextQuoteSelector`, `TextPositionSelector`, `SvgSelector`). Cada aspecto pode ter seletores de origem e de derivada, padrão situacional, confiança e nota. Exemplo: `examples/synthetic-derivation-annotation.json`.

## Agentes

`CreativeAgent` e `Analyst` são «roleMixin»: pessoas e coletivos são representados por ontologias externas, não pela ARO. Qualquer IRI de agente vindo de outra ontologia (PROV-O `prov:Agent`, FOAF, schema.org `Person`/`Organization`/`MusicGroup`, Wikidata) pode ser usado em `contributionBy`; um raciocinador RDFS o classifica como `CreativeAgent` pelo `rdfs:range`. O SHACL exige apenas que seja um IRI (não um nó em branco), para permitir ligação externa.

## Referências

Nenhuma referência é de pré-print (arXiv); todas são livros, periódicos com revisão por pares ou normas institucionais. Dados bibliográficos marcados com † devem ser conferidos no original.

- BORDWELL, D.; THOMPSON, K. *Film Art: An Introduction*. New York: McGraw-Hill (várias edições).
- BURKHOLDER, J. P. The uses of existing music: musical borrowing as a field. *Notes*, v. 50, n. 3, p. 851–870, 1994.
- CHATMAN, S. *Story and Discourse: Narrative Structure in Fiction and Film*. Ithaca: Cornell University Press, 1978.
- DYER, R. *Pastiche*. London: Routledge, 2007.
- GENETTE, G. *Figures III* [Discours du récit]. Paris: Seuil, 1972.
- GENETTE, G. *Palimpsestes: la littérature au second degré*. Paris: Seuil, 1982. (Trad. ingl. *Palimpsests*, University of Nebraska Press, 1997.)
- GENETTE, G. *Seuils*. Paris: Seuil, 1987.
- HUTCHEON, L. *A Theory of Parody*. New York: Methuen, 1985.
- HUTCHEON, L. *A Theory of Adaptation*. New York: Routledge, 2006.
- IFLA; CIDOC CRM SIG. *LRMoo: object-oriented definition and mapping from the IFLA Library Reference Model*, v. 1.0, 2024 (v. 1.1.1 em 2026). Inclui a propriedade R2 *is derivative of*.
- JENKINS, H. *Textual Poachers: Television Fans and Participatory Culture*. New York: Routledge, 1992.
- MAG UIDHIR, C.; MAGNUS, P. D.; MAGNUS, C. Judging covers. *Journal of Aesthetics and Art Criticism*, v. 71, n. 4, p. 361–370, 2013.
- MOSSER, K. "Cover songs": ambiguity, multivalence, polysemy. *Popular Musicology Online*, 2008.
- NAVAS, E. *Remix Theory: The Aesthetics of Sampling*. Wien: Springer, 2012.
- PANOFSKY, E. *Studies in Iconology*. New York: Oxford University Press, 1939.
- RAJEWSKY, I. O. Intermediality, intertextuality, and remediation: a literary perspective on intermediality. *Intermédialités*, n. 6, p. 43–64, 2005.
- SCHLOSS, J. G. *Making Beats: The Art of Sample-Based Hip-Hop*. Middletown: Wesleyan University Press, 2004.
- SMIRAGLIA, R. P. *The Nature of "A Work": Implications for the Organization of Knowledge*. Lanham: Scarecrow, 2001.
- TILLETT, B. B. A taxonomy of bibliographic relationships. *Library Resources & Technical Services*, v. 35, 1991. † (número/páginas variam entre fontes secundárias)
- VEREVIS, C. *Film Remakes*. Edinburgh: Edinburgh University Press, 2006.

---

[← Voltar para o LEIA-ME](../../LEIA-ME.md) · [English](../en/derivation-typology.md)
