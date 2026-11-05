# Relatório da anotação *Homem na Estrada — realidade social sustentada por evidências*

## 1. Entrega e procedência

A nova anotação está em [`examples/aro_homem_na_estrada_realidade_social.ttl`](../../examples/aro_homem_na_estrada_realidade_social.ttl). Ela foi iniciada a partir de [`examples/aro_homem_na_estrada_refeita.ttl`](../../examples/aro_homem_na_estrada_refeita.ttl), que permaneceu inalterado.

A versão nova é autossuficiente: contém obra, manifestações, recortes, interpretações, situações representadas, padrões, condições, casos empíricos, fontes, itens de evidência, afirmações, correspondências, avaliações e hipóteses. Ela não importa o grafo anterior e usa um namespace próprio (`https://example.org/aro-homem-na-estrada-realidade/`), evitando mistura acidental entre as duas anotações.

## 2. Correção conceitual principal

O problema do arquivo de partida estava na formulação da camada empírica. Muitas `EmpiricalClaim` apenas repetiam o conteúdo estatístico de uma fonte — por exemplo, “o IBGE contou X” — e as `EvidenceAssessment` se concentravam em dizer que o dado atual não comprovava o episódio ficcional ou o período da música.

Na nova anotação, a unidade avaliada é o **padrão social representado**. A pergunta deixou de ser “esta estatística comprova o que aconteceu com o personagem?” e passou a ser “a fonte sustenta que este tipo de situação existe ou persiste no mundo social?”.

Assim:

- a data da obra e a data da fonte continuam registradas, mas a distância temporal não invalida uma alegação de recorrência ou persistência;
- nenhuma fonte é tratada como documento do personagem, do bairro ou do episódio ficcional;
- uma estatística não é usada para inferir detalhes que ela não mediu;
- a avaliação declara separadamente o que a evidência apoia e o que não apoia;
- componentes sem sustentação direta não recebem correspondências artificiais.

## 3. Exemplo central: IBGE, favelas e políticas públicas

O novo padrão é `padraoPrecariedadeConhecida`: **“Precariedade urbana conhecida por dados públicos, mas não superada por políticas e serviços”**.

A cadeia representa duas observações complementares:

1. o Censo produz dados detalhados sobre população, água, esgotamento e outras condições em favelas e comunidades urbanas;
2. o próprio IBGE caracteriza esses territórios como expressão da incompletude ou precariedade de políticas governamentais, infraestrutura, serviços, equipamentos e proteção ambiental.

A `EmpiricalClaim` não acusa o IBGE de negligência e não atribui ao instituto a execução de saneamento, habitação ou assistência. Ela afirma algo mais preciso e verificável: **a produção de dados torna a precariedade visível, mas medir não equivale a implementar ou completar políticas públicas, e os déficits persistem nos territórios medidos**.

A avaliação registra apoio forte a essa coexistência e rejeita três extrapolações: responsabilizar o IBGE pela execução dos serviços, identificar a comunidade ficcional e homogeneizar todas as favelas.

## 4. Arquitetura e dependências usadas

O grafo segue as dependências documentadas pela ARO e exigidas pelos shapes:

| Camada | Dependência representada |
|---|---|
| Obra | `Artwork` → `Manifestation` |
| Recorte | `Selection` → `Manifestation` por `selectsFrom` |
| Interpretação | `InterpretationRecord` → exatamente um `Selection` e um `InterpretiveAct` |
| Situação representada | `InterpretationRecord` → `SituationDescription` |
| Generalização | `SituationDescription` → `SituationPattern` → pelo menos uma `PatternCondition` |
| Caso empírico | `EmpiricalCase` → `EmpiricalSituation` e `ReferenceSource` |
| Evidência | `EvidenceItem` → exatamente uma `ReferenceSource` |
| Correspondência | `CorrespondenceClaim` → exatamente um `SituationPattern` e um `EmpiricalCase` |
| Avaliação | `EvidenceAssessment` → um ou mais `EvidenceItem`; também examina a `EmpiricalClaim` e a `CorrespondenceClaim` específicas |
| Hipótese | `ExplanationHypothesis` → `SituationPattern`, mantida separada da descrição e da correspondência |

A cadeia empírica adotada em todos os oito casos é:

`ReferenceSource → EvidenceItem → EmpiricalClaim / EmpiricalCase → CorrespondenceClaim → EvidenceAssessment`

## 5. Inventário do grafo

| Classe ARO | Instâncias |
|---|---:|
| `Artwork` | 1 |
| `Manifestation` | 2 |
| `CreativeAct` | 1 |
| `CreativeContribution` | 2 |
| `AnalysisUnit` | 1 |
| `Selection` | 15 |
| `InterpretiveAct` | 1 |
| `InterpretationRecord` | 15 |
| `InterpretiveJustification` | 15 |
| `InterpretationChallenge` | 2 |
| `SituationDescription` | 15 |
| `SituationPattern` | 9 |
| `PatternCondition` | 18 |
| `ReferenceSource` | 9 |
| `EvidenceItem` | 9 |
| `EmpiricalSituation` | 8 |
| `EmpiricalCase` | 8 |
| `EmpiricalClaim` | 8 |
| `CorrespondenceClaim` | 8 |
| `EvidenceAssessment` | 8 |
| `ExplanationHypothesis` | 2 |

O arquivo contém 678 triplas RDF.

## 6. Recortes e padrões

Os 15 recortes não reproduzem versos; guardam apenas coordenadas RFC 5147 e descrições temáticas.

| Recortes | Leitura principal | Padrão |
|---|---|---|
| 1, 6 e 12 | recomeço, trabalho e permanência do rótulo penal | Reinserção dificultada por estigma e barreiras de trabalho |
| 2 | memória de institucionalização juvenil | Socioeducação desigual e direitos incompletos |
| 3, 4 e 7 | moradia, saneamento, dados públicos e água instável | Precariedade conhecida, mas não superada |
| 5 | violência contra mulher e resposta tardia | Violência contra mulheres e limites institucionais |
| 8 | punição coletiva | Linchamento como punição extrajudicial |
| 9 | privação alimentar de crianças | Fome infantil e escola como proteção alimentar |
| 10 | morte jovem, economia ilícita e exposição da morte | Morte jovem; economia ilícita e mídia |
| 11, 13, 14 e 15 | suspeição territorial, desproteção, cerco e versão oficial | Suspeição racializada e violência letal do Estado |

As condições de padrão distinguem núcleo e contexto por `isRequiredCondition`. Por exemplo, a privação alimentar é obrigatória no padrão de fome; a escola como proteção alimentar é contextual. Isso impede que uma pesquisa domiciliar sobre fome seja apresentada como prova de que uma criança específica frequenta a escola exclusivamente para comer.

## 7. Evidências e alcance

| Cadeia | Fonte principal | Afirmação sustentada | Limite registrado |
|---|---|---|---|
| Precariedade urbana | IBGE, Censo 2022 e definição de Favelas e Comunidades Urbanas | dados públicos e déficits de políticas/serviços coexistem | não responsabiliza o IBGE pela execução e não identifica o bairro ficcional |
| Reinserção | CNJ, pesquisa sobre trabalho de pessoas privadas de liberdade e egressas | estigma, oferta precária, acesso limitado e barreiras sociolaborais são reais | não fornece taxa nacional de recusa nem biografia do personagem |
| Socioeducação | Levantamento Nacional do SINASE 2024 | há lacunas de escolarização e profissionalização em contexto de privação juvenil | não equipara FEBEM e SINASE nem comprova abuso individual |
| Violência contra mulheres | FBSP/Datafolha, *Visível e Invisível* 2025 | a violência permanece disseminada apesar de visibilidade, leis e políticas | não classifica juridicamente a morte narrada nem demonstra atraso do IML |
| Fome infantil | IBGE, PNAD Contínua Segurança Alimentar 2024 | fome e privação grave atingem domicílios com crianças e adolescentes | não prova a cena da feira nem o motivo individual da frequência escolar |
| Morte jovem | Ipea/FBSP, Atlas da Violência 2025 | homicídios atingem jovens em grande escala e com desigualdade racial persistente | não demonstra varejo de drogas nem sensacionalismo midiático |
| Violência estatal | FBSP, Anuário Brasileiro de Segurança Pública 2025 | letalidade policial é recorrente, jovem e racialmente seletiva | não determina autoria, legalidade ou veracidade da versão final da ficção |
| Linchamento | artigo empírico de 2024 em *Dilemas* | punição coletiva extrajudicial ocorre em metrópoles brasileiras | não identifica um caso real como origem da passagem nem uma causa única |

## 8. Ausências intencionais

O padrão `padraoEconomiaIlicitaMidia` foi mantido porque é importante para a interpretação do recorte 10, mas não recebeu `EmpiricalCase` nem `CorrespondenceClaim` próprios. A evidência do Atlas da Violência sustenta a letalidade juvenil; ela não sustenta, sozinha, a hierarquia econômica do mercado de drogas, a classe social dos consumidores ou a exploração midiática da morte.

Do mesmo modo:

- a pesquisa sobre violência contra mulheres não foi usada como evidência de atraso do IML;
- a PNAD de segurança alimentar não foi usada como evidência de frequência escolar motivada exclusivamente por comida;
- o Anuário de Segurança Pública não foi usado para decidir quem matou o personagem;
- os dados do SINASE não foram usados para reconstituir a experiência biográfica narrada;
- as fontes do IBGE não foram usadas para afirmar que o instituto é executor de políticas urbanas.

Essas ausências são uma qualidade epistêmica do grafo: indicam onde nova pesquisa é necessária e evitam o preenchimento indevido de lacunas.

## 9. Hipóteses e pluralidade interpretativa

Duas `ExplanationHypothesis` foram registradas separadamente das afirmações descritivas:

- a fragmentação entre produção de informação, orçamento, competências federativas e execução territorial **pode** contribuir para a permanência de problemas já medidos;
- racismo estrutural, estigma territorial e antecedentes penais **podem** atuar conjuntamente na distribuição desigual de suspeição e força letal.

O grafo também contém duas `InterpretationChallenge`:

- uma impede que a crítica à distância entre estatística e política seja convertida em responsabilização do IBGE pela prestação direta de serviços;
- outra mantém aberta a disputa sobre a autoria da morte final, mesmo diante da sequência de cerco e da crítica à versão oficial.

## 10. Validação executada

Foram executadas as seguintes verificações:

1. análise sintática completa do Turtle com o parser N3: **válido**, 678 triplas;
2. verificação das cardinalidades SHACL aplicáveis a todas as instâncias:
   - `Selection.selectsFrom` ≥ 1;
   - `SituationPattern.hasCondition` ≥ 1;
   - `EvidenceItem.derivedFromSource` = 1;
   - `CorrespondenceClaim.assertsPattern` = 1;
   - `CorrespondenceClaim.assertsCase` = 1;
   - `EvidenceAssessment.assessesEvidence` ≥ 1;
   - `InterpretationRecord.hasPrimarySelection` = 1;
   - `InterpretationRecord.producedByAct` = 1;
   - `InterpretiveAct.hasParticipant` ≥ 1 e participante como IRI;
   - dependências de `CreativeAct` e `CreativeContribution`;
3. verificação de que todo `aro:textValue` é literal com etiqueta de idioma;
4. `git diff --check`, sem erros de espaços ou formatação.

Não há `DerivationClaim` nesta anotação, portanto as restrições SHACL específicas de âncoras de derivação não são acionadas.

## 11. Limites remanescentes e próximos passos de pesquisa

- Os intervalos de linhas dependem da estabilidade da transcrição pública adotada; uma transcrição autorizada e versionada permitiria coordenadas mais robustas.
- As fontes empíricas são principalmente nacionais ou multirregionais. Elas sustentam padrões, mas não descrevem especificamente M'Boi Mirim.
- O componente de economia ilícita e mídia ainda precisa de fontes próprias e metodologicamente compatíveis.
- A demora de remoção de corpos e o acesso territorial de serviços de emergência permanecem sem caso empírico específico nesta versão.
- A hipótese sobre fragmentação institucional precisaria de avaliação de políticas, orçamento e execução para passar de hipótese a afirmação causal sustentada.
- URLs institucionais devem ser verificadas periodicamente ou complementadas por identificadores persistentes e cópias arquivadas permitidas.

## 12. Resultado

A anotação passa a representar precisamente a tese pretendida: *Homem na Estrada* formula situações reconhecíveis da realidade social brasileira, e estudos, estatísticas e pesquisas externas sustentam a existência ou persistência desses padrões. A evidência não é vinculada ao ano da obra nem apresentada como identificação de personagens; seu alcance é explicitado em cada avaliação, preservando a diferença entre representação artística, mundo empírico, correspondência e hipótese causal.
