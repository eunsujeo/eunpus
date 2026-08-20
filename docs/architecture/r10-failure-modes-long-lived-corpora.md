# R10 — Failure Modes of Long-lived Architecture Corpora

> Generalized — institutional WaaS architecture corpus, failure-mode catalog at the corpus level.
> All generalized reasoning is ★ Hypothesis.
> No "corpus is safe" claim. No "discipline guarantees survival" claim. No closure-by-completeness.

---

## 0. Why a failure-mode catalog at the corpus level

C4 catalogs **architectural anti-patterns** within documents (what custody architectures should not do).
R10 catalogs **corpus-level failure modes** (how the corpus itself, as an institution, fails).

These are different concerns. A corpus may have flawless architectural content and still die — from stewardship vacuum, ontology collapse, vendor recapture, silent rewrite, mission drift, or any of a dozen other corpus-operational failures.

R10 exists because:

- Other R-series docs specify **disciplines**. R10 specifies **what happens when disciplines lapse**.
- Multi-decade corpora have **observable failure patterns** in the historical record of long-lived knowledge systems.
- New stewards entering the corpus benefit from reading **what to watch for**, not just **what to do**.
- Failure modes are the **strongest motivation** for R1-R9. Without R10, the disciplines look like overhead.

---

## 1. Core thesis

> Long-lived corpora fail in named, predictable ways.
> The disciplines (R1-R9) are not aesthetic preferences — they are responses to specific historical failure patterns.
> A corpus that cannot describe how it might fail is a corpus that has stopped guarding against failure.

---

## 2. ≠ propositions

- Active ≠ healthy
- Large ≠ comprehensive
- Recent ≠ maintained
- Cited ≠ used
- Used ≠ understood
- Surviving ≠ surviving with integrity
- Complete ≠ done
- Coherent ≠ honest
- Authoritative ≠ correct
- Old corpus ≠ wise corpus

---

## 3. The 12 corpus-level failure modes

★ Hypothesis — minimum viable catalog:

| # | Failure mode | Signal | Cause | Primary R-discipline |
|---|--------------|--------|-------|----------------------|
| FM1 | **Ontology collapse** | Terms drift; readers no longer agree on meaning | R4 lapse | R4 |
| FM2 | **Contradiction accumulation** | Open T3 count grows; resolution capacity exceeded | R3 + R5 lapse | R3 |
| FM3 | **Stewardship vacuum** | No active stewards; review cycles missed | R5 lapse | R5 |
| FM4 | **Mission drift** | Architecture corpus → marketing / vendor / advocacy doc | R0 + R5 lapse | R0 |
| FM5 | **Embedding-only retrieval** | Reranking + citation discipline abandoned for similarity | R1 lapse | R1 |
| FM6 | **AI override** | Humans defer to AI; AI becomes de facto authority | R8 + R9 lapse | R8/R9 |
| FM7 | **Silent rewrite** | Docs edited in place; worldview history erased | R7 lapse | R7 |
| FM8 | **Frontier capture** | Speculative content promoted to canonical without R5 review | R5 + E4 lapse | R5 |
| FM9 | **Vendor recapture** | Reasoning collapses to a single vendor's framing | R0 invariant 10 lapse | R0 |
| FM10 | **Closure-by-claim** | Corpus declared "complete" → stops evolving | R0 invariant 9 lapse | R0 |
| FM11 | **Hype injection** | Industry buzzwords adopted as canonical without scrutiny | R4 + E4 lapse | R4 |
| FM12 | **Reader-as-customer drift** | Reader feedback treated as user research, not governance signal | R8 lapse | R8 |

Each failure mode has: **signal** (how it's detected), **cause** (why it happens), **mitigation** (what stops it), **link to R-discipline** (which discipline is the primary defense).

---

## 4. FM1 — Ontology collapse

**Signal:** Increasing T4 contradictions (R3). Readers report term confusion. Cluster-local senses leak into cross-cluster usage. Layer-1 terms (Vault, Wallet, Ledger) used in incompatible senses across recent docs.

**Cause:** R4 discipline lapsed. New docs added without sense qualification. Industry / vendor terminology silently adopted. Steward rotation lost ontology context.

**Mitigation:**
- Annual ontology audit (R4 §7).
- T4 contradiction monitoring (R3).
- Reader-feedback triage routes term-confusion reports to R4 steward (R8 §11).
- Conservative refactor policy (R4 §9) enforced.
- Sense qualifier requirement (R4 §4) reinforced in new-doc review (R5 C5).

**Recovery:** If ontology has already collapsed in a region of the corpus, recovery requires a **multi-cycle ontology rebuild** — explicit sense-mapping audit, term disambiguation, supersession of ambiguous docs, R7 snapshots throughout. Not a quick fix.

★ Hypothesis: ontology collapse is **the most insidious** failure mode because it propagates slowly and is invisible until the corpus is unreadable to fresh readers.

---

## 5. FM2 — Contradiction accumulation

**Signal:** Open T3 / T5 contradictions in registry grow without resolution. Review cycles do not address them. Synthesis (R2) surfaces them but no path forward exists.

**Cause:** R3 detection works but R5 resolution capacity exceeded. Or T3 resolutions blocked by reviewer disagreement. Or T3 contradictions are surfacing because the corpus has grown into genuinely contested architectural territory.

**Mitigation:**
- Periodic registry review (R3 §11).
- Allocate stewardship time for contradiction resolution per cycle.
- Recognize that some T3 contradictions are **healthy permanent state** — not all need resolution.
- C6 (open questions) entries created for T3 contradictions to make their open status reader-visible.

**Recovery:** If accumulation has produced reader confusion, prioritize **surfacing** (R2 §13) over **resolving**. A corpus with 100 explicitly-surfaced T3 contradictions is more honest than a corpus with 100 silently-resolved ones.

★ Hypothesis: T3 accumulation is sometimes a **success signal** — the corpus has grown into territory where genuine disagreement is the institutional position.

---

## 6. FM3 — Stewardship vacuum

**Signal:** Review cycles missed. Audit trails (R5) thin or absent. No declared stewards for clusters. Reader reports unanswered. Charter changes proposed without review.

**Cause:** Stewardship rotation broken. Institution funding for corpus stewardship reduced. Original stewards departed without handoff. R5 governance treated as overhead rather than load-bearing.

**Mitigation:**
- Mandatory steward handoff documents (R5 §11).
- Multi-person stewardship (no single-owner roles for any cluster).
- Periodic stewardship status review at charter level.
- External sponsorship if institutional sponsor withdraws (forking allowance, R5 §12).

**Recovery:** Stewardship vacuum is **the most dangerous** failure mode because it disables all other defenses. Recovery requires either:
- New steward council assumes responsibility (with multi-cycle re-affirmation review), or
- Corpus is **explicitly placed in archival state** (R7-style preservation; no further evolution; clearly marked).

A corpus in stewardship vacuum that pretends to be active is the worst configuration — readers trust it as if maintained, but it is not.

---

## 7. FM4 — Mission drift

**Signal:** New docs increasingly advocate for specific vendors / products / methodologies. Recommendation framing replaces invariant reasoning. Decision-support content dominates over architectural content. Audience tone shifts from operator/auditor to executive/buyer.

**Cause:** Stewardship captured by an institution with marketing incentives. Cluster lead has vendor relationship. Decision-support questions (which naturally lean toward recommendations) accumulate without compensating architectural content.

**Mitigation:**
- Charter (R0) explicitly names corpus mission as architectural reasoning, not advocacy.
- Reviewer conflict-of-interest declarations (R8 §15).
- C-series invariant audit detects vendor framing leaks.
- C4 anti-pattern catalog includes "advocacy without architectural justification."
- Reader-feedback triage routes "this reads like marketing" reports.

**Recovery:** Mission drift requires **charter re-anchoring** (R5 C8). Affected docs must be reviewed for vendor framing and revised (with R7 snapshot of pre-revision state). Stewards with conflicts of interest rotated.

★ Hypothesis: mission drift is the **most institutionally consequential** failure mode. A corpus that has drifted into advocacy has lost the property that made it useful — vendor-neutral architectural reasoning.

---

## 8. FM5 — Embedding-only retrieval

**Signal:** Reranking pipeline simplified to top-k similarity. Citation discipline lapses. Reader-facing outputs lose ★ markers. Cluster collapse in retrieval becomes common.

**Cause:** Implementation team optimizes for speed / cost / engineering simplicity. Reranking deemed "overhead." Citation deemed "noise."

**Mitigation:**
- R1 disciplines enforced in implementation review (R5).
- Periodic benchmark of reranking value vs raw similarity.
- Sample-audit of citation density.
- Reader-facing audit: can readers trace assertions to documents?

**Recovery:** Re-establish R1 disciplines. May require **partial corpus re-derivation** if retrieval has been embedding-only for an extended period (readers will have been relying on undisciplined retrieval).

---

## 9. FM6 — AI override

**Signal:** AI assistance produces answers that humans cite as authoritative. Boundary signals (R8 §7) ignored. Escalation rate drops to near-zero. AI configuration changes without governance review. Stewards treat AI outputs as research, not drafts.

**Cause:** AI fluency creates trust faster than R9 disciplines can train skepticism. Reviewers fatigued by escalation volume; thresholds raised. AI persistence across stewardship transitions; incoming stewards inherit AI-shaped institutional memory.

**Mitigation:**
- R8 §13 — annual boundary review.
- R9 §7 — failure-to-escalate audit.
- R9 §13 — AI versioning as governance event.
- Stewardship handoff includes AI-assistance context (R8 §14).
- Periodic calibration tests for AI outputs (R9 §14).

**Recovery:** AI override is recoverable if detected early. Late-stage AI override (multi-year) may require **AI quarantine** — pause AI assistance, audit prior outputs, re-establish discipline. Painful but necessary.

★ Hypothesis: this failure mode is **highly novel** — most historical knowledge systems did not face AI authority drift. The discipline is unproven; vigilance is the only defense.

---

## 10. FM7 — Silent rewrite

**Signal:** R7 snapshots missing or sparse. Readers report content "changed without notice." Diffs between snapshots unavailable. Old citations point to current-state content rather than historical state.

**Cause:** Edit-in-place workflow. Steward "tidies" old docs. Format migrations rewrite content. AI assistance edits without snapshot trigger (R9 violation).

**Mitigation:**
- R7 §13 — silent rewrite is explicitly a top failure mode.
- Edit workflow requires snapshot trigger before publication (R5 + R7).
- AI assistance forbidden from edit-in-place (R9 §3).
- Periodic snapshot integrity exercise (R7 §12).
- Reader-feedback triage routes "this changed" reports (R8 §11).

**Recovery:** Silent rewrite is **partially irreversible** — once worldview history is lost, it cannot be reconstructed. Recovery limits future damage but cannot restore past states. This is why R7 prevention discipline is **categorical**.

---

## 11. FM8 — Frontier capture

**Signal:** Frontier-cluster (D27-D32) content promoted to canonical-status without E4 5-stage institutionalization review. Speculative claims cited as established. Hypothesis markers stripped during canonicalization.

**Cause:** Industry hype around frontier topics (CBDC, AI governance, intent-based settlement, post-quantum). Stewards under pressure to "cover" topics. E4 cooling-off bypassed.

**Mitigation:**
- E4 5-stage institutionalization ladder enforced for any frontier→canonical migration.
- R5 C5 review for new docs requires E4 stage justification.
- Hypothesis marker preservation enforced (R9 §3).
- Reader-feedback triage routes "this seems speculative" reports.

**Recovery:** Affected docs reviewed for frontier vs canonical positioning. May require **partial supersession** — redeclare content as frontier with appropriate ★ markers; create R7 snapshot of canonical-status period as historical worldview.

---

## 12. FM9 — Vendor recapture

**Signal:** Vendor-specific terminology appears as default in new docs. Vendor capabilities cited as architectural primitives. Vendor whitepapers referenced as authoritative. Reader-facing outputs use vendor-specific framing.

**Cause:** Multiple paths — vendor employee becomes steward; vendor sponsors documentation effort; vendor terminology dominates training data of AI assistants and leaks into outputs; sole-vendor field experience shapes mental model.

**Mitigation:**
- R0 invariant 10 explicitly forbids vendor recapture.
- R4 ontology audit catches vendor-specific term adoption.
- C4 anti-pattern catalog includes "vendor capability cited as architectural primitive."
- R8 reviewer conflict-of-interest declarations.
- AI assistance constrained against vendor framing (R9 §17).

**Recovery:** Affected docs reviewed; vendor framing replaced with generic architectural language; vendor-specific examples preserved as **illustrative** rather than **canonical**; R7 snapshot of pre-recovery state.

★ Hypothesis: vendor recapture is **the founding failure mode** that motivated the corpus's transition from Fireblocks deepening (Stage 1-31) to generalized reasoning (Stage 32+). Defending against recapture is **structural**, not incidental.

---

## 13. FM10 — Closure-by-claim

**Signal:** Steward / sponsor / public communication declares corpus "complete." Review cadence reduces. New-doc proposals discouraged. Reader feedback treated as "post-completion polish." Charter changes blocked as "unnecessary."

**Cause:** Sponsor / executive pressure for "finished" deliverable. Stewards exhausted; tempting to declare victory. Branding / marketing framing the corpus as a finished product.

**Mitigation:**
- R0 invariant 9 explicitly forbids closure-by-claim.
- E5 (corpus longevity / knowledge survivability) names this failure mode.
- Reader-facing communication frames corpus as **publication state, not completion state** (R0 §11).
- Periodic governance review explicitly asks: "have we said this is done?"

**Recovery:** Restate corpus state honestly. Resume cycle discipline. Address any review backlog. Publish a corrective communication if external claim of completeness was made.

---

## 14. FM11 — Hype injection

**Signal:** New industry buzzwords appear in corpus before E4 institutionalization. Terms used without R4 sense definition. Concepts adopted without contradiction-resolution against existing corpus content. Decay class assignments lag the actual volatility of hyped content.

**Cause:** Steward under pressure to appear current. AI assistance proposes hyped content with high apparent confidence (training data bias toward recent industry literature). C5 new-doc review under-applies E4 discipline.

**Mitigation:**
- E4 institutionalization ladder enforced.
- R4 ontology requires sense definition before term adoption.
- R6 decay class assignment requires conservative default (Class C or D for new content).
- R9 constrains AI proposals on hyped content.

**Recovery:** Affected content reviewed; terms marked as ★ Hypothesis; decay class lowered to D or E; supersession plan documented; R7 snapshot.

---

## 15. FM12 — Reader-as-customer drift

**Signal:** Reader feedback treated as user-research signal — "users want X, let's add it." Reader satisfaction prioritized over institutional discipline. Cooling-off periods abbreviated to "respond to user demand."

**Cause:** Corpus framed as product; readers framed as customers; review cadence framed as release cadence. Confusion of institutional knowledge (reader is a participant in shared understanding) with consumer product (reader is a customer to be satisfied).

**Mitigation:**
- R8 §11 — reader-feedback triage is a **governance signal**, not a product input.
- R5 cycle discipline maintained; no fast-tracking for "user demand."
- C5 audience reading paths frame reader as participant, not consumer.
- Reader-facing communication frames the corpus as architectural reasoning, not service delivery.

**Recovery:** Re-anchor framing in charter (R0). Re-establish cooling-off discipline. Audit recent changes for fast-track exceptions; consider rollback for those that violated cooling-off.

---

## 16. Compound failure modes

Failure modes do not occur in isolation. Common compounds:

- **FM3 + FM6** — Stewardship vacuum + AI override. The most dangerous compound. Without stewards, AI fills the institutional voice. Recovery requires stewardship rebuild before AI containment.
- **FM4 + FM9** — Mission drift + vendor recapture. Vendor advocacy and mission drift reinforce each other.
- **FM7 + FM1** — Silent rewrite + ontology collapse. Silent rewrites enable ontology drift to occur unnoticed.
- **FM8 + FM11** — Frontier capture + hype injection. Hyped frontier content gets promoted to canonical.
- **FM10 + FM3** — Closure-by-claim + stewardship vacuum. Declaring completeness becomes justification for ending stewardship.

★ Hypothesis: stewards should track **compound risk** explicitly, not just per-failure risk. A corpus exhibiting two reinforcing failure modes degrades faster than the sum of single-mode degradations would predict.

---

## 17. Failure-mode signals to monitor

★ Hypothesis — combined dashboard:

| Failure mode | Primary signal | Secondary signal |
|--------------|----------------|------------------|
| FM1 Ontology collapse | T4 count growth | Reader term-confusion reports |
| FM2 Contradiction accumulation | Open T3 count growth | Resolution capacity utilization |
| FM3 Stewardship vacuum | Review cycle adherence | Reader-report response SLA |
| FM4 Mission drift | New-doc framing audit | Conflict-of-interest declarations |
| FM5 Embedding-only retrieval | Citation density | Reranking value benchmark |
| FM6 AI override | Escalation rate | AI-configuration governance audit |
| FM7 Silent rewrite | Snapshot integrity | Reader "this changed" reports |
| FM8 Frontier capture | Hypothesis marker preservation | E4 stage compliance |
| FM9 Vendor recapture | Vendor-term ratio in new content | Reviewer COI declarations |
| FM10 Closure-by-claim | External communication audit | New-doc proposal rate |
| FM11 Hype injection | New-term decay class distribution | E4 stage compliance |
| FM12 Reader-as-customer drift | Cooling-off exception rate | Framing audit |

These are **lagging indicators** at best. Failure modes are easier to **prevent** than to **detect**. R1-R9 are the prevention disciplines; this dashboard is the safety net.

---

## 18. The "honest failure" stance

★ Hypothesis: stewards should adopt a posture of **honest failure** — periodically asking, in writing:

> "If this corpus dies in 10 years, what is the most likely failure mode?"

The answer changes over time. Tracking the answer over time reveals stewardship's understanding of where the corpus is actually exposed.

A stewardship that **always answers the same way** is either unusually stable or in denial. A stewardship that **never answers** is in failure mode FM3 or FM10.

---

## 19. Closing invariant

> Every long-lived corpus dies eventually.
> Some die from external causes — institutional collapse, regulatory dissolution, technology obsolescence.
> Most die from internal causes — the failure modes catalogued here.
> The discipline is not to prevent death; the discipline is to make death **visible, slow, and recoverable**.

★ Hypothesis: this corpus will face at least 4-6 of these failure modes over a 30-year horizon. The R-series cannot prevent that. What the R-series can do is:

- Make each failure **visible** to stewards before it becomes irreversible.
- Make each failure **slow** enough to be addressed within a review cycle.
- Make each failure **recoverable** through documented disciplines.

That is the most honest claim R10 can make. The corpus is mortal; the discipline is its protection against an undignified death.
