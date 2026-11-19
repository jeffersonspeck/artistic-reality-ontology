[← Back to README](../../README.md) · [Português](../pt-BR/guia-de-anotacao.md) · [Annotator manual](annotator-manual.md)

# Annotation guide

This guide explains **how to create annotations** in the [annotator](https://jeffersonspeck.github.io/artistic-reality-ontology/annotator/): what each kind of node represents, what it needs in order to exist, and in which order to create nodes to record a reading, a pattern, a real case or a derivation. The [annotator manual](annotator-manual.md) covers the rest of the tool (installation, navigation, validation, files).

## 1. The main rule

The annotator only lets you create what the ontology allows:

- **Children and parents come from the structure.** From a node, only the relations its type accepts (domains and ranges of the properties) and the classes that may fill each one are offered.
- **What is required comes along.** Some classes do not exist on their own: a selection needs an expression, an expression needs an artwork, an interpretation record needs a selection and an act. These minimum links (minimum cardinality of the SHACL constraints) are asked for **when the node is created**, and the node is only created once they are filled.
- **Creation is validated.** After creating, the new nodes go through the same rules as **Analysis → Validate**. If the ontology rejects something, nothing is kept and the reason is shown in the footer.

## 2. The "Create node" window

Open the window in any of these ways:

- the **Create node…** button at the top of the *Create* panel;
- the **Children** and **Parents** buttons in a node's inspector;
- right-click a node → **Add child…** or **Add parent…**;
- a class chip in the *Create* panel (the window opens with that class already chosen).

The window has two columns.

**1. What to create** (left)
- With a starting node, two tabs: **Children** (this → relation → new) and **Parents** (new → relation → this). Each relation is shown with what it means and the classes that fill it. A relation that already has the maximum number of values is greyed out.
- Without a starting node, every class that can be created, grouped by module, with a filter.
- *What cannot be created here* explains the exceptions: abstract classes (choose a subclass), vocabulary concepts and agents (chosen in the fields).

**2. Fill in** (right)
- **Class card:** module, OntoUML nature, definition and the link that will be created.
- **Text:** title, description or content of the node, in the chosen language. Other languages are added later in the inspector.
- **Required for it to exist:** one box per requirement of the ontology, with its cardinality (exactly 1, at least 1) and what the relation means. Each box can be filled by:
  - an **existing** compatible node;
  - a **new node**, which shows its own requirements right below (a new interpretive act, for example, asks for its participant);
  - a **vocabulary concept** (derivation type, dimension, operation, role), from a list with definitions;
  - an **agent** (person or collective), existing or new, with a name and, if there is one, the IRI that identifies it.
  The box is red while something is missing and green when complete. When the link to the starting node already meets a requirement (creating an expression from an artwork meets "expression realizes artwork"), it is shown as filled.
- **Optional now:** data of the class itself, such as dates (year, year-month or date), the outcome of an assessment, whether a condition is required.
- **Can be linked later:** the other relations the class accepts, to complete in the inspector.

The footer says what is still missing. **Create** is enabled only when everything required is filled.

## 3. Recipes

The recipes follow the order in which the requirements chain. At each step, the window asks for what is in brackets.

### 3.1 An artwork and the passage you will interpret

1. **Artwork** (`Artwork`), without a link: just the title.
2. From the artwork, **Children** → *expression* (`Expression`): the recording, the lyric text, the translation. The link to the artwork meets the requirement.
3. If the edition matters (album, book edition), from the expression, **Children** → *manifestation* (`Manifestation`).
4. From the expression, **Parents** → *selection* (`Selection`): the passage analysed. In the inspector, add `hasSelector` to locate it (lines `line=27,30`, time `t=12,16` or a literal quote).

### 3.2 A reading of the passage

1. **Interpretation record** (`InterpretationRecord`), from the selection (**Parents**) or without a link. The window asks for:
   - the primary selection (`hasPrimarySelection`);
   - the act that produced the reading (`producedByAct`). A new act asks who took part (`hasParticipant`): you, as a person, with your ORCID if you wish.
2. From the record, **Children** → *situation description* (or *intentional state description*, for fear, desire, belief): what the passage represents, in your words.
3. Optional: a *justification* (`hasJustification`) and sources (`citesSource`) to ground the reading.

### 3.3 From the passage to the real world

1. From the situation description, **Children** → *situation pattern* (`generalizesAs`). The pattern asks for at least one *condition* (`hasCondition`); create it right there.
2. **Reference source** (`ReferenceSource`), without a link: the report, article or dataset. Add the link in *Links*.
3. **Evidence item** (`EvidenceItem`): asks for the source (`derivedFromSource`).
4. **Empirical case** (`EmpiricalCase`): the real case. Then, in the inspector, link it to the empirical situation or event (`caseAboutSituation`, `caseAboutEvent`) and to the source (`citesSource`).
5. **Correspondence claim** (`CorrespondenceClaim`): asks for the pattern (`assertsPattern`) and the case (`assertsCase`). Word the claim at the level of the pattern, not of the work: the same pattern may appear in several works.
6. **Evidence assessment** (`EvidenceAssessment`): asks for the claim assessed (`assessesClaim`) and the evidence (`assessesEvidence`). Under *Optional now*, choose the outcome (supports, partially supports, challenges, inconclusive, irrelevant) and write what the evidence supports and what it does not.

### 3.4 A derivation between works (cover, sample, adaptation, parody)

1. Have both artistic entities: artwork, expression, manifestation or selection on each side.
2. **Derivation claim** (`DerivationClaim`). The window asks for:
   - the source (`hasSourceAnchor`) and the derived entity (`hasDerivedAnchor`), different from each other;
   - the derivation type (`hasDerivationType`), chosen from the vocabulary with definitions.
3. Optional: a *transformation aspect* (`hasTransformation`), which asks for a dimension and an operation (for example, recorded sound, recontextualized); the regime (`hasRegime`); the creative act (`derivationRealizedBy`); justification and sources.

### 3.5 Who created it

1. **Creative act** (`CreativeAct`): asks for what it produced (`producesCreation`): an artwork, expression or manifestation, never a selection. Under *Optional now*, the date.
2. From the act, **Children** → *creative contribution*: asks for the agent (`contributionBy`), the role (`contributionRole`: author, composer, performer…) and the entity contributed to (`contributionTo`).

### 3.6 Disagreement and review

- **Challenge** (`Challenge`): asks for the claim challenged (`challenges`); it may target any claim, another challenge included.
- **Criteria assessment** (`CriteriaAssessment`): asks for the claim assessed and at least one *criterion* (epistemic, about grounding; or value, about merit).

## 4. What each class requires

The table comes from the SHACL constraints of ARO 1.0.0 (`validation/aro-shapes.ttl`) and the catalog (`model/conceptual-model.json`). "Required for it to exist" is what the window asks for before creating; the rest can be added later.

| Class | What it is | Required for it to exist | Optional data |
|---|---|---|---|
| **artwork** (`Artwork`) | Identifiable artistic creation, considered independently of any particular version or copy (the LRM work level). | nothing else | — |
| **expression** (`Expression`) | Specific realization of an artwork with its own content: a performance or recording, a translation, an arrangement, a text version, a film cut (the LRM expression level). | `realizesArtwork` → artwork (1) | — |
| **manifestation** (`Manifestation`) | Publication or carrier that embodies one or more expressions: an album edition, a book edition, a broadcast, a digital release (the LRM manifestation level). Optional: record it when the edition matters, e.g. to locate a page or a track. | `embodiesExpression` → expression (1+) | — |
| **selection** (`Selection`) | Addressable portion of an expression (lines, a time span, an image region), located by selectors; not a physical component. | `selectsFrom` → expression (1) | `selectorExpression` |
| **analysis unit** (`AnalysisUnit`) | Intentional grouping of selections for analytical purposes. | nothing else | — |
| **justification** (`Justification`) | Recorded argument connecting premises to a claim: why an interpretation, derivation, correspondence or hypothesis is asserted. | nothing else | — |
| **challenge** (`Challenge`) | Claim that criticizes another claim or offers an alternative to it; being a claim itself, it can be justified, assessed and challenged in turn. | `challenges` → claim (1) | — |
| **criteria assessment** (`CriteriaAssessment`) | Assessment of a claim against explicit epistemic or value criteria (plausibility, coherence, fidelity...). | `assessesClaim` → claim (1+)<br>`usesCriterion` → assessment criterion (1+) | `assessmentOutcome` |
| **assessment criterion** (`AssessmentCriterion`) | Explicit rule an assessment applies to judge a claim; epistemic criteria judge whether the claim is well grounded, value criteria judge its worth. | nothing else | — |
| **epistemic criterion** (`EpistemicCriterion`) | Criterion about knowledge: whether a claim is supported, coherent, plausible or well documented (textual evidence, source reliability, coherence with the work). | nothing else | — |
| **value criterion** (`ValueCriterion`) | Criterion about worth: whether a claim or reading is relevant, fair, original or ethically adequate, independently of being true. | nothing else | — |
| **interpretation record** (`InterpretationRecord`) | Persistent authored record of an interpretation of a selection. | `hasPrimarySelection` → selection (1)<br>`producedByAct` → interpretive act (1) | — |
| **interpretive act** (`InterpretiveAct`) | Temporal intentional activity yielding interpretation records. | `hasParticipant` → analyst (1+) | `endDate`, `startDate` |
| **depicted element** (`DepictedElement`) | Information-level representation of a referent in an artwork. | nothing else | — |
| **depicted agent** (`DepictedAgent`) | Depicted element referring to an agent or character. | nothing else | — |
| **situation description** (`SituationDescription`) | Recorded description of a represented situation. | nothing else | — |
| **intentional state description** (`IntentionalStateDescription`) | Situation description attributing desire, belief or intention to a depicted agent. | nothing else | — |
| **situation pattern** (`SituationPattern`) | Reusable informational specification of situation conditions. | `hasCondition` → pattern condition (1+) | — |
| **pattern condition** (`PatternCondition`) | Individuated mandatory or optional condition within a pattern. | nothing else | `isRequiredCondition` |
| **evidence assessment** (`EvidenceAssessment`) | Assessment of whether evidence items support, challenge or are irrelevant to a claim. | `assessesClaim` → claim (1+)<br>`assessesEvidence` → evidence item (1+) | `assessmentOutcome` |
| **empirical case** (`EmpiricalCase`) | Documented dossier about one real-world situation or occurrence. | nothing else | — |
| **empirical claim** (`EmpiricalClaim`) | Recorded testable claim about the empirical world. | nothing else | — |
| **reference source** (`ReferenceSource`) | Citable external resource: news, study, report, legal document, testimony, dataset, etc. | nothing else | `sourceURL` |
| **evidence item** (`EvidenceItem`) | Extracted contextual assertion or observation from a reference source. | `derivedFromSource` → reference source (1) | — |
| **correspondence claim** (`CorrespondenceClaim`) | Contestable assertion of similarity, instantiation or explanatory relevance between pattern and empirical case. | `assertsCase` → empirical case (1)<br>`assertsPattern` → situation pattern (1) | — |
| **explanation hypothesis** (`ExplanationHypothesis`) | Proposed mechanism or factors explaining a represented or observed phenomenon. | nothing else | — |
| **empirical situation** (`EmpiricalSituation`) | Configuration of entities and conditions in the real world. | nothing else | `endDate`, `startDate` |
| **empirical event** (`EmpiricalEvent`) | Real-world temporally bounded occurrence. | nothing else | `endDate`, `startDate` |
| **derivation claim** (`DerivationClaim`) | Contestable assertion, made by an agent, that one artistic entity (artwork, expression, manifestation or selection) derives from another in specified ways. The derived entity is represented as a creation in its own right; legality and originality are outside the scope of the ontology. | `hasDerivationType` → derivation type (1+)<br>`hasDerivedAnchor` → artistic entity (1)<br>`hasSourceAnchor` → artistic entity (1) | `derivationExtent` |
| **transformation aspect** (`TransformationAspect`) | Recorded statement of what happened to one artistic dimension in a derivation (retained, modified, added, removed or recontextualized). | `hasDimension` → artistic dimension (1)<br>`hasOperation` → transformation operation (1) | — |
| **creative act** (`CreativeAct`) | Intentional temporal activity that brings an artistic entity (artwork, expression or manifestation) into existence, including derivative ones. | `producesCreation` → artistic entity (1+) | `endDate`, `startDate` |
| **creative contribution** (`CreativeContribution`) | Participation of one creative agent in one creative act under one or more roles. | `contributionBy` → creative agent (1)<br>`contributionRole` → creative role (1+)<br>`contributionTo` → artistic entity (1+) | — |

---

[← Back to README](../../README.md) · [Português](../pt-BR/guia-de-anotacao.md)
