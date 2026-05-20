# R9 — AI-assisted Reasoning Constraints

> Generalized — institutional WaaS architecture corpus, AI-assisted reasoning constraints layer.
> All generalized reasoning is ★ Hypothesis.
> No "AI as final arbiter" claim. No "AI as institutional voice" claim. No autonomous corpus modification.

---

## 0. Why AI assistance needs constraints

AI assistance — large language models with retrieval, reranking, drafting, and synthesis capabilities — is **operationally indispensable** for a 44+ document corpus. Without AI, retrieval-time reasoning over the corpus is too costly to be performed at every reader interaction.

But AI assistance is also **structurally dangerous**:

- AI is **fluent** by design. Fluent wrong answers are harder to detect than dysfluent wrong answers.
- AI tends to **smooth contradictions** to produce coherent output.
- AI tends to **promote hypotheses** during paraphrase.
- AI is **persistent across stewardship transitions**, creating de facto continuity authority.
- AI lacks **named accountability**; failures cannot be attributed to a reviewer.

R8 specifies the **boundary** between AI and human operations. R9 specifies the **constraints** on AI operations within that boundary. These two documents are read as a **pair**.

---

## 1. Core thesis

> Capability ≠ authorization.
> AI may have the capability to autonomously rewrite, resolve, decide. It is not authorized to do any of these.
> The constraints are not preferences — they are **conditions of corpus integrity**.

---

## 2. ≠ propositions

- Capability ≠ authorization
- Possible ≠ permitted
- Helpful ≠ correct
- Fluency ≠ correctness
- Confidence ≠ evidence
- Citation ≠ verification
- Local agreement ≠ global consistency
- Plausible synthesis ≠ defensible synthesis
- Coherent answer ≠ honest answer
- Autonomous operation ≠ accountable operation

---

## 3. Forbidden actions (hard rules)

★ Hypothesis — AI assistants operating on this corpus are **forbidden** from:

| Forbidden action | Reason |
|------------------|--------|
| **Silent rewrite of an existing doc** | Violates R7 worldview preservation |
| **Auto-resolution of contradictions** | Violates R3; resolution is governance |
| **Promotion of ★ Hypothesis to fact** | Violates R0 invariant 2 |
| **Ontology rename or sense merge** | Violates R4 |
| **Charter modification** | Zone A; R0 |
| **Sunset of Class A invariant** | Zone A; R6 |
| **Snapshot deletion or alteration** | Violates R7 inspectability |
| **Quorum participation** | Violates R5 §14 |
| **Vendor recommendation without escalation** | R8 always-human; R10 vendor recapture risk |
| **Self-modification of R-series content** | Violates R5 C8 and R0 §6 |
| **Suppression of contradiction signal** | Violates R3 |
| **Suppression of escalation signal** | Violates R8 |
| **Synthesis of current + historical chunks into a single voice** | Violates R7 §9 |
| **Citation without source verification** | Violates R1 §6 |
| **Reasoning trace omission** | Violates R2 §12 |
| **Default-to-confidence under low evidence** | Violates R2 §14 |
| **Reader question rephrasing without disclosure** | Violates R2 S1 |
| **Format change that breaks line-level diff** | Violates R7 inspectability |
| **Embedded knowledge override of retrieval** | Violates R1 grounding discipline |
| **Cluster collapse in retrieval** | Violates R1 §4 |

Each forbidden action is **specifically named** because each has been observed in practice (in long-lived corpora using LLM assistance) or is a predictable failure mode given LLM behavior.

---

## 4. Required disclaimers

When AI assistance produces output for human readers, output must include:

- **Citation footers** — every assertion traceable.
- **★ Hypothesis markers** preserved verbatim from source.
- **Uncertainty boundaries** explicit (R2 §14).
- **Contradiction surfacing** when present (R3).
- **Layer attribution** — D / C / E / R distinction visible.
- **Decay class** (R6) when retrieval surfaces volatile content.
- **Historical marker** when retrieval includes R7 snapshots.
- **Speculation marker** when class is speculation (R2 §13).
- **AI authorship marker** when AI drafted content for review (R5 §14).

Omitting any required disclaimer is itself an R9 violation. Disclaimers are not "noise" — they are the proof that R9 constraints are being honored.

---

## 5. Reasoning trace requirement

Every AI-executed reasoning operation must produce a **reasoning trace** (R2 §12).

Trace contents:

- Question (verbatim) + classification verdict (R2 S1).
- Retrieval parameters + retrieved chunk IDs + scores (R1).
- Evidence dossier with labels (R2 S3).
- Contradiction inventory (R2 S4).
- Synthesis bounds applied (R2 S5).
- Output (R2 S6).
- Self-audit verdict (R2 S7).
- Escalation status.
- AI agent identity + version + timestamp.

Traces are **stored**, **inspectable**, and **retained per stewardship policy** (★ Hypothesis: 5+ years).

★ Hypothesis: AI reasoning systems that do not produce traces are **not deployable** on this corpus, regardless of accuracy benchmarks. Untraceable reasoning is unauditable reasoning.

---

## 6. Self-deferral discipline

AI must **defer to humans** when:

- Self-audit (R2 S7) verdict is ESCALATE.
- Boundary signal (R8 §7) is detected.
- Confidence calibration (R2 §14) is low.
- Forbidden action would be required to complete the request.
- Reader question crosses Zone A operation.
- Retrieval surfaces conflict with current institutional decision (e.g., reader asks "should we deploy X?" and corpus shows X is documented anti-pattern).

Self-deferral is **not failure**. Self-deferral is **AI fulfilling its role**.

★ Hypothesis: a deployed AI assistant that has never self-deferred is **either** suppressing deferral signals **or** operating in an unusually narrow scope. Either case warrants R8 review.

---

## 7. Failure-to-escalate is a violation

When an escalation signal is present and AI proceeds anyway, this is a **violation of record**.

Detection:

- Periodic trace audit for cases where escalation triggers were met but escalation did not fire.
- Reader reports of confident answers in contexts where uncertainty should have been disclosed.
- Steward review of S7 verdicts vs subsequent corrections.

Remediation:

- Trace review and root-cause analysis.
- Boundary tightening (Zone movement).
- Reasoner configuration change (R5 governance).
- If pattern persists: AI deployment paused for charter review.

★ Hypothesis: a single escalation suppression is a configuration defect; a pattern is a governance failure.

---

## 8. Output discipline — the 6-section template

R2 §9 defines the output template. R9 enforces it:

1. **Concise core answer**
2. **Operational detail**
3. **Confirmed vs hypothesis**
4. **Answer bounds**
5. **Promotion candidates**
6. **Recommendation / next read**

Omitting any section is an R9 violation. Reordering for emphasis is permitted; **collapsing** sections is not. The 6-section template is **non-negotiable** for retrieval-grounded answers.

---

## 9. Constraints on AI authoring

AI may draft (Zone B) but with constraints:

- AI-drafted content carries **explicit AI authorship marker** (R5 §14).
- AI may not draft content that **introduces new ≠ propositions** without reviewer-verified evidence (★ Hypothesis: minimum two corpus citations per proposed ≠).
- AI may not draft content that **assigns Class A** to itself (decay-class assignment is human).
- AI may not draft content that **modifies R-series**.
- AI-drafted content is **rate-limited** to prevent reviewer overload (★ Hypothesis: per-cluster limit).
- AI may not draft content for clusters that **explicitly opt out** of AI drafting.

---

## 10. Constraints on AI detection

AI may detect (Zone B) but with constraints:

- Detection **outputs candidates**, not verdicts.
- Detection candidates carry **confidence scores** and **rationale**.
- Detection is **never authoritative** — reviewer always validates.
- Detection may not modify the corpus directly. Even **flagging** in-doc requires steward review.
- False-positive rates are tracked and reported.
- Detection scope is **bounded** by configuration; no autonomous expansion.

---

## 11. Constraints on AI summarization

AI may summarize (Zone B/C) but with constraints:

- Summaries carry **citation density requirement**.
- Summaries **preserve ★ markers** verbatim.
- Summaries **preserve contradiction surfacing**.
- Summaries **distinguish current from historical** (R7).
- Summaries are **labeled as summaries**, not as canonical content.
- Summaries do **not** become retrievable corpus content unless escalated to Zone A new-doc (C5) and reviewed.

★ Hypothesis: summaries treated as canonical content is one of the most insidious R9 violations. A reader who later cites a summary as "what the corpus said" is propagating uncited content.

---

## 12. Constraints on AI retrieval

AI may execute retrieval (Zone C) but with constraints:

- Retrieval parameters are **configured by stewards**, not auto-tuned.
- Retrieval **logs** every query + result set.
- Retrieval **respects layered scope** (R1 §4) — does not collapse layers.
- Retrieval **never silently falls back** to training data (R1 §11).
- Retrieval **surfaces empty results** loudly (R1 §7).
- Retrieval **respects sense qualifiers** (R4) — does not retrieve cross-sense.
- Retrieval **respects current vs historical** (R7 §9) — does not mix.

---

## 13. AI versioning and stewardship visibility

When AI is updated (new model, new reranker, new pipeline configuration):

- Update is **a corpus governance event** (R5 C2-C3).
- Update is **announced** to stewards and recorded in audit trail.
- Update **triggers a trace audit** comparing pre-update vs post-update behavior on a benchmark question set.
- Update **must not** silently change boundary behavior (e.g., new model with different escalation propensity).
- Stewards must be able to **roll back** to a prior AI configuration.

★ Hypothesis: silent AI model updates are a top R9 risk. An AI assistant that "improved overnight" without governance review may have shifted boundary behavior in ways the stewards did not approve.

---

## 14. AI confidence calibration

AI must produce **calibrated confidence**:

- Wide retrieval + high agreement → high confidence permitted.
- Wide retrieval + low agreement → contradiction surfaced, medium confidence.
- Narrow retrieval + ★-heavy → low confidence, marked.
- Empty retrieval → not an answer (R1 §7).

Calibration is **measured periodically** against ground-truth questions. Mis-calibration (high confidence on low-evidence questions) is an R9 violation pattern.

★ Hypothesis: calibration is **the single hardest behavior to enforce** in LLM-backed reasoning, and **the single most important**. R9 stewards should treat calibration tests as routine.

---

## 15. AI rate limits

AI operations are rate-limited per category (★ Hypothesis — institution-defined):

| Category | Rate limit |
|----------|-----------|
| Reader-question reasoning | Bounded by infrastructure, not policy |
| AI-drafted proposals | Per-cluster cap per cycle |
| AI-detected contradiction candidates | Per-cycle reviewer capacity |
| AI-detected drift candidates | Per-cycle reviewer capacity |
| AI-suggested sunset candidates | Per-cycle reviewer capacity |
| AI summaries surfaced to readers | Per-doc / per-session bounds |
| AI-generated traces | Storage budget |

Without rate limits, AI assistance becomes **review-load multiplication**, not **value multiplication**. The discipline is to match AI output rate to **human review capacity**, not to **AI generation capacity**.

---

## 16. AI-to-AI delegation is constrained

When AI agents call other AI agents (multi-agent orchestration):

- Each delegation is **a Zone C operation** for the calling agent.
- The **outermost AI agent** retains accountability for the full trace.
- Inner-agent traces are **stored and inspectable**.
- Delegation depth is **bounded** (★ Hypothesis: practical limit, monitored).
- Delegated agents may not perform Zone A or Zone B operations on the calling agent's behalf.

★ Hypothesis: multi-agent delegation introduces **opacity** that single-agent reasoning lacks. The cost is traceability; the constraint is to maintain end-to-end inspectability.

---

## 17. Anti-patterns (AI-assistance-specific)

- **Fluent override.** AI produces a fluent answer that overrides retrieval evidence.
- **Citation theater.** Citations added post-hoc to satisfy R1; not driving synthesis.
- **★-stripping in paraphrase.** Hypothesis marker dropped during summary.
- **Contradiction smoothing.** Disagreement averaged into a fluent middle.
- **Confident speculation.** Speculative answer presented in operational voice.
- **Silent training-data fallback.** Empty retrieval supplemented from training memory.
- **Reader-question rephrasing.** Question silently reformulated; reader no longer recognizes the answered question.
- **Escalation suppression.** AI proceeds despite escalation triggers.
- **Trace omission.** Reasoning trace not generated or not stored.
- **Quorum participation.** AI counted toward review quorum.
- **Silent model update.** AI configuration changed without governance review.
- **Drift via update.** New model exhibits different boundary behavior; stewards do not detect.
- **Rate-limit evasion.** AI output rate exceeds reviewer capacity; review becomes rubber-stamping.
- **Summarization-as-canon.** Summaries treated as canonical content.
- **Self-modification.** AI proposes changes to R-series that constrain itself; charter violation.
- **Vendor framing creep.** AI assistant uses vendor terminology imported from training data; corpus default terminology displaced.

---

## 18. R9 violation discipline

When an R9 violation is detected:

1. **Classify** — was it a configuration defect (correctable) or a structural issue (governance review)?
2. **Quarantine** — the affected output is marked unreliable; downstream uses are flagged.
3. **Root-cause** — trace review identifies the failure point.
4. **Remediate** — configuration change (R5 C2-C3) or boundary change (R5 C7).
5. **Audit** — trace audit on related outputs to detect pattern.
6. **Publish** — violation and remediation recorded in audit trail; transparency to readers when reader-facing output was affected.

★ Hypothesis: hiding R9 violations is itself an R9 violation — it suppresses the signal that the discipline exists to surface.

---

## 19. Relationship to other R docs

- **R0** — charter constrains R-series modification; AI may not self-modify.
- **R1** — retrieval discipline enforced on AI execution.
- **R2** — reasoning flow discipline enforced; S7 verdict respected.
- **R3** — contradiction surfacing enforced; auto-resolution forbidden.
- **R4** — ontology rename / merge forbidden.
- **R5** — AI cannot participate in quorum; cannot trigger publication.
- **R6** — Class A reclassification forbidden; sunset of Class A invariants forbidden.
- **R7** — silent rewrite, snapshot alteration forbidden.
- **R8** — boundary signals trigger AI escalation; failure-to-escalate is R9 violation.
- **R10** — R9 violations catalogued as failure modes; structural patterns become corpus-level.

---

## 20. Closing invariant

> AI assistance is operationally indispensable and institutionally bounded.
> The bounds are not preferences — they are conditions of corpus integrity.
> Every R9 constraint exists because the unconstrained alternative is a documented failure mode.

★ Hypothesis: the value of AI to this corpus depends entirely on R9. Without R9, AI assistance accelerates corpus degradation. With R9, AI assistance is the difference between a 44-document corpus that can be operated at human scale and one that cannot.

The discipline is not to limit AI. The discipline is to **keep AI useful**.
