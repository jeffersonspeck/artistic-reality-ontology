# Relatório da anotação *Homem na Estrada — realidade social sustentada por evidências*

> Anotação na estrutura da **ARO 1.0.0** (claims, nível superior UFO, níveis IFLA LRM, validação OntoUML). Voltar para o [LEIA-ME](../../LEIA-ME.md).

## 1. Entrega e procedência

A anotação está em [`examples/aro_homem_na_estrada_realidade_social.ttl`](../../examples/aro_homem_na_estrada_realidade_social.ttl). Ela foi feita primeiro na versão 0.2 e depois refeita na estrutura da 0.3. A versão refeita substitui as anotações de *Homem na Estrada* que tinham ficado no modelo 0.2 e foram removidas do repositório: `aro_homem_na_estrada_refeita.ttl`, a cópia dela e `example_homem_na_estrada_revisado.ttl`. Delas foi aproveitada a derivação do sample de *Ela Partiu* (Tim Maia), agora no padrão 0.3. O estudo de caso do projeto continua em [`examples/case-studies.ttl`](../../examples/case-studies.ttl) e [`examples/example_homem_na_estrada.ttl`](../../examples/example_homem_na_estrada.ttl).

A anotação é autossuficiente. Ela contém a obra e seus níveis (expressões e manifestações), a criação e a derivação, os recortes, as interpretações, as situações representadas, os padrões e suas condições, os casos empíricos, as fontes, as evidências, as afirmações, as correspondências, as avaliações e as hipóteses. Ela usa um namespace próprio (`https://example.org/aro-homem-na-estrada-realidade/`), para não se misturar com o estudo de caso.

Nenhum verso da letra é reproduzido. Os recortes guardam apenas coordenadas de linha (RFC 5147) e uma descrição temática.

## 2. Correção conceitual principal

O problema da anotação de partida estava na formulação da camada empírica. Muitas `EmpiricalClaim` só repetiam o conteúdo estatístico de uma fonte (por exemplo, "o IBGE contou X"). As avaliações, por sua vez, se concentravam em dizer que o dado atual não comprovava o episódio ficcional nem o período da música.

Nesta anotação, a unidade avaliada é o **padrão social representado**. A pergunta deixou de ser "esta estatística comprova o que aconteceu com o personagem?" e passou a ser "a fonte sustenta que este tipo de situação existe ou persiste no mundo social?".

Assim:

- a data da obra e a data da fonte continuam registradas, mas a distância no tempo não invalida uma alegação de recorrência ou persistência;
- nenhuma fonte é tratada como documento do personagem, do bairro ou do episódio ficcional;
- uma estatística não é usada para inferir detalhes que ela não mediu;
- cada avaliação declara o resultado (`assessmentOutcome`) e diz separadamente o que a evidência apoia e o que não apoia;
- componentes sem sustentação direta não recebem correspondências artificiais.

## 3. O que mudou na passagem para a ARO 0.3

| Aspecto | Antes (0.2, migrado) | Agora (0.3) |
|---|---|---|
| Agentes | só `schema:Person` / `schema:MusicGroup` | também `aro:Person` / `aro:Collective` (padrão de papéis OntoUML, ADR-029); Mano Brown com nome civil (Pedro Paulo Soares Pereira) e nome artístico |
| Níveis da obra | `Artwork` → duas `Expression`, sem manifestação | `Artwork` → `Expression` (gravação de 1993; texto da letra) → `Manifestation` (álbum *Raio X do Brasil*; transcrição pública do Cifra Club) (IFLA LRM, ADR-028) |
| Recortes | `selectsFrom` uma "transcrição" tratada como expressão; seletor em nó anônimo | `selectsFrom` a letra (expressão) e `locatedInManifestation` a transcrição em que valem os números de linha; seletor nomeado (`oa:FragmentSelector`) |
| Autoria dos registros | `prov:wasAttributedTo` nas avaliações; contestações sem autor | `producedByAct` em todo registro analítico, por dois atos interpretativos com participante e data (ADR-033) |
| Datas | `dcterms:created` no ato | `startDate`/`endDate` nos atos criativo e interpretativos e nas situações empíricas (ADR-030) |
| Avaliações | resultado só no texto ("APOIA FORTEMENTE…") | `assessmentOutcome` (`supports`, `partiallySupports`, `inconclusive`) e texto com o alcance |
| Fontes de casos e afirmações | `citesSource` e `prov:wasDerivedFrom` duplicados; afirmações empíricas sem fonte | só `citesSource` (relação única de citação da 0.3), também nas afirmações empíricas |
| Hipóteses | sem autor e sem avaliação | com autor e avaliadas como **inconclusivas** pelas evidências disponíveis (respondem à CQ-12) |
| Revisão crítica | duas contestações | contestações com autor, uma com justificativa e a outra com fonte; avaliação por critérios (`CriteriaAssessment` com um `EpistemicCriterion` e um `ValueCriterion`) da interpretação do recorte 15 |
| Elementos representados | ausentes | `DepictedAgent` (protagonista, polícia) e `DepictedElement` (FEBEM, IBGE, IML, Estrada do M'Boi Mirim) |
| Estado intencional | descrição comum | o recorte 13 (desconfiança e medo da polícia) é uma `IntentionalStateDescription` |
| Derivação | *Ela Partiu* em outro arquivo, no estilo 0.2 | `DerivationClaim` (Sampling) com aspecto de transformação (som gravado, recontextualizado), justificativa, fonte e autoria |

## 4. Exemplo central: IBGE, favelas e políticas públicas

O padrão `padraoPrecariedadeConhecida` é **"Precariedade urbana conhecida por dados públicos, mas não superada por políticas e serviços"**.

A cadeia representa duas observações que se completam:

1. o Censo produz dados detalhados sobre população, água, esgotamento e outras condições em favelas e comunidades urbanas;
2. o próprio IBGE caracteriza esses territórios como expressão da incompletude ou precariedade das políticas governamentais, da infraestrutura, dos serviços, dos equipamentos e da proteção ambiental.

A `EmpiricalClaim` não acusa o IBGE de negligência e não atribui ao instituto a execução de saneamento, habitação ou assistência. Ela afirma algo mais preciso e verificável: **a produção de dados torna a precariedade visível, mas medir não equivale a implementar ou completar políticas públicas, e os déficits persistem nos territórios medidos**.

A avaliação registra `supports` para essa coexistência e rejeita três extrapolações: responsabilizar o IBGE pela execução dos serviços, identificar a comunidade ficcional e tratar todas as favelas como iguais. A contestação `contestacaoIBGE` reforça esse limite na própria interpretação do recorte 4.

## 5. Arquitetura e dependências usadas

| Camada | Dependência representada |
|---|---|
| Obra | `Artwork` ← `realizesArtwork` ← `Expression` → `hasManifestation` → `Manifestation` |
| Criação | `CreativeAct` (1993) → `producesCreation` obra, gravação e letra; `CreativeContribution` (relator) liga `Person`/`Collective`, papel e entidade artística |
| Derivação | `DerivationClaim` → âncora de origem (*Ela Partiu*) e âncora derivada (gravação de 1993), tipo `Sampling`, `TransformationAspect`, `derivationRealizedBy` o ato criativo |
| Recorte | `Selection` → `selectsFrom` a letra; `locatedInManifestation` a transcrição |
| Interpretação | `InterpretationRecord` → exatamente um `Selection` e um `InterpretiveAct`; `hasJustification` |
| Situação representada | `InterpretationRecord` → `SituationDescription` (ou `IntentionalStateDescription`) → `DepictedElement` |
| Generalização | `SituationDescription` → `SituationPattern` → pelo menos uma `PatternCondition` |
| Caso empírico | `EmpiricalCase` → `EmpiricalSituation` (datada quando a fonte delimita o período) e `ReferenceSource` |
| Evidência | `EvidenceItem` → exatamente uma `ReferenceSource` |
| Correspondência | `CorrespondenceClaim` → exatamente um `SituationPattern` e um `EmpiricalCase` |
| Avaliação | `EvidenceAssessment` → um ou mais `EvidenceItem`, `assessesClaim` a afirmação empírica e a correspondência, `assessmentOutcome` |
| Hipótese | `ExplanationHypothesis` → `SituationPattern`, separada da descrição e da correspondência, com avaliação própria |

A cadeia empírica adotada nos oito casos é:

`ReferenceSource → EvidenceItem → EmpiricalClaim / EmpiricalCase → CorrespondenceClaim → EvidenceAssessment`

## 6. Inventário do grafo

| Classe ARO | Instâncias |
|---|---:|
| `Artwork` | 2 (*Homem na Estrada*, *Ela Partiu*) |
| `Expression` | 2 |
| `Manifestation` | 2 |
| `CreativeAct` | 1 |
| `CreativeContribution` | 2 |
| `Person` / `Collective` | 2 / 1 |
| `DerivationClaim` | 1 |
| `TransformationAspect` | 1 |
| `AnalysisUnit` | 1 |
| `Selection` | 15 |
| `InterpretiveAct` | 2 |
| `InterpretationRecord` | 15 |
| `Justification` | 17 |
| `Challenge` | 2 |
| `CriteriaAssessment` | 1 |
| `EpistemicCriterion` / `ValueCriterion` | 1 / 1 |
| `DepictedAgent` / `DepictedElement` | 2 / 4 |
| `SituationDescription` (incl. 1 `IntentionalStateDescription`) | 15 |
| `SituationPattern` | 9 |
| `PatternCondition` | 18 |
| `ReferenceSource` | 10 |
| `EvidenceItem` | 9 |
| `EmpiricalSituation` | 8 |
| `EmpiricalCase` | 8 |
| `EmpiricalClaim` | 8 |
| `CorrespondenceClaim` | 8 |
| `EvidenceAssessment` | 10 (8 `supports`, 2 `inconclusive`) |
| `ExplanationHypothesis` | 2 |

O arquivo contém 865 triplas RDF.

## 7. Recortes e padrões

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

As condições de padrão separam núcleo e contexto por `isRequiredCondition`. Por exemplo, a privação alimentar é obrigatória no padrão de fome, e a escola como proteção alimentar é contextual. Isso impede que uma pesquisa domiciliar sobre fome seja apresentada como prova de que uma criança específica vai à escola só para comer.

## 8. Evidências e alcance

| Cadeia | Fonte principal | Afirmação sustentada | Limite registrado |
|---|---|---|---|
| Precariedade urbana | IBGE, Censo 2022 e definição de Favelas e Comunidades Urbanas | dados públicos e déficits de políticas e serviços coexistem | não responsabiliza o IBGE pela execução e não identifica o bairro ficcional |
| Reinserção | CNJ, pesquisa sobre trabalho de pessoas privadas de liberdade e egressas | estigma, oferta precária, acesso limitado e barreiras sociolaborais são reais | não fornece taxa nacional de recusa nem biografia do personagem |
| Socioeducação | Levantamento Nacional do SINASE 2024 | há lacunas de escolarização e profissionalização em contexto de privação juvenil | não equipara FEBEM e SINASE nem comprova abuso individual |
| Violência contra mulheres | FBSP/Datafolha, *Visível e Invisível* 2025 | a violência permanece disseminada apesar de visibilidade, leis e políticas | não classifica juridicamente a morte narrada nem demonstra atraso do IML |
| Fome infantil | IBGE, PNAD Contínua Segurança Alimentar 2024 | fome e privação grave atingem domicílios com crianças e adolescentes | não prova a cena da feira nem o motivo individual da frequência escolar |
| Morte jovem | Ipea/FBSP, Atlas da Violência 2025 | homicídios atingem jovens em grande escala e com desigualdade racial persistente | não demonstra varejo de drogas nem sensacionalismo midiático |
| Violência estatal | FBSP, Anuário Brasileiro de Segurança Pública 2025 | a letalidade policial é recorrente, jovem e racialmente seletiva | não determina autoria, legalidade ou veracidade da versão final da ficção |
| Linchamento | artigo empírico de 2024 em *Dilemas* | a punição coletiva extrajudicial ocorre em metrópoles brasileiras | não identifica um caso real como origem da passagem nem uma causa única |

As situações empíricas são datadas pelo período que a fonte observa (2022, 2023, 2024, 2011–2020). As situações de reinserção e de violência contra mulheres ficaram sem data, porque as fontes não delimitam o período com clareza.

## 9. Ausências intencionais

O padrão `padraoEconomiaIlicitaMidia` foi mantido porque é importante para a interpretação do recorte 10, mas não recebeu `EmpiricalCase` nem `CorrespondenceClaim` próprios. A evidência do Atlas da Violência sustenta a letalidade juvenil. Ela não sustenta, sozinha, a hierarquia econômica do mercado de drogas, a classe social dos consumidores ou a exploração da morte pela mídia.

Do mesmo modo:

- a pesquisa sobre violência contra mulheres não foi usada como evidência de atraso do IML;
- a PNAD de segurança alimentar não foi usada como evidência de frequência escolar motivada só pela comida;
- o Anuário de Segurança Pública não foi usado para decidir quem matou o personagem;
- os dados do SINASE não foram usados para reconstituir a experiência biográfica narrada;
- as fontes do IBGE não foram usadas para afirmar que o instituto executa políticas urbanas;
- a derivação de *Ela Partiu* não registra data nem autoria da canção de origem, que não foram verificadas; por isso a CQ-21 não responde sobre ela.

Essas ausências são uma qualidade epistêmica do grafo: mostram onde falta pesquisa e evitam preencher lacunas sem base.

## 10. Hipóteses e pluralidade interpretativa

Duas `ExplanationHypothesis` foram registradas separadamente das afirmações descritivas, e cada uma tem uma avaliação `inconclusive`:

- a fragmentação entre produção de informação, orçamento, competências federativas e execução territorial **pode** contribuir para a permanência de problemas já medidos. As fontes do IBGE diagnosticam a insuficiência de políticas, mas não avaliam orçamento nem execução;
- racismo estrutural, estigma territorial e antecedentes penais **podem** atuar juntos na distribuição desigual de suspeição e força letal. O Anuário e o Atlas mostram quem são as vítimas (uma correlação), não por quê.

O grafo também contém duas `Challenge` e uma `CriteriaAssessment`:

- uma contestação impede que a crítica à distância entre estatística e política vire responsabilização do IBGE pela prestação direta de serviços;
- outra mantém aberta a disputa sobre a autoria da morte final, com a justificativa de que a letra deixa os autores implícitos;
- a avaliação por critérios dá `partiallySupports` à interpretação do recorte 15: ela é socialmente relevante (critério de valor) e apoiada pela sequência narrativa (critério epistêmico), mas a versão oficial não é excluída.

## 11. Validação executada

1. `python scripts/validate.py examples/aro_homem_na_estrada_realidade_social.ttl --lang pt-BR`: **conforme** aos shapes SHACL da ARO 1.0.0 (865 triplas);
2. consistência OWL 2 RL (`owlrl`) da anotação com a ontologia: sem erros (a verificação faz parte de `tests/test_project.py`);
3. `python scripts/migrate.py --check`: nenhuma migração pendente;
4. consultas (`scripts/query.py --lang pt-BR`): CQ-19 sem claims sem fundamento (0 linhas); CQ-12 lista as duas hipóteses com evidência inconclusiva; CQ-13 e CQ-15 respondem sobre o sample de *Ela Partiu*; CQ-20 mostra obra → expressões → manifestações; RQ-01 e RQ-03 ligam os recortes aos casos reais e às avaliações;
5. `python tests/test_project.py`: **PASS**.

## 12. Limites remanescentes e próximos passos de pesquisa

- Os intervalos de linhas dependem da estabilidade da transcrição pública adotada. Uma transcrição autorizada e versionada permitiria coordenadas mais robustas.
- As fontes empíricas são principalmente nacionais ou multirregionais. Elas sustentam padrões, mas não descrevem especificamente o M'Boi Mirim.
- O componente de economia ilícita e mídia ainda precisa de fontes próprias e metodologicamente compatíveis.
- A demora na remoção de corpos e o acesso de serviços de emergência ao território continuam sem caso empírico específico.
- A hipótese sobre fragmentação institucional precisaria de avaliação de políticas, orçamento e execução para passar de hipótese a afirmação causal sustentada.
- A derivação de *Ela Partiu* pode ganhar a gravação de origem (como `Expression`), seu ato criativo datado e a autoria, depois de verificados.
- A anotação está só em português. As consultas funcionam assim, mas uma versão em inglês facilitaria a comparação com o estudo de caso.
- URLs institucionais devem ser verificadas periodicamente ou complementadas por identificadores persistentes e cópias arquivadas permitidas.

## 13. Resultado

A anotação representa a tese pretendida na estrutura da ARO 1.0.0: *Homem na Estrada* formula situações reconhecíveis da realidade social brasileira, e estudos, estatísticas e pesquisas externas sustentam a existência ou a persistência desses padrões. Cada registro tem autor e data, cada avaliação tem resultado explícito e alcance declarado, e nenhuma afirmação fica sem fundamento. A evidência não fica presa ao ano da obra nem é apresentada como identificação de personagens. Assim se preserva a diferença entre representação artística, mundo empírico, correspondência e hipótese causal.

> Voltar para o [LEIA-ME](../../LEIA-ME.md).
