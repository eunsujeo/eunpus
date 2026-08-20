"""Source triage helpers — slug normalization + domain/tier classification.

v3.2.2 정합: filename + size 만 사용. PDF body 미로드. Rule-based heuristic.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

NORMALIZED_PDF_RE = re.compile(r"^\d{4}-\d{2}-\d{2}__[a-z0-9.-]+__[a-z0-9-]+\.pdf$")

# 5 priority domain — keyword sets for filename triage
DOMAIN_KEYWORDS = {
    "workspace-management": [
        "workspace", "vault", "account-and-wallet", "account-structure", "freeze",
        "cold-wallet", "sandbox", "environment", "node-router",
    ],
    "identity-auth": [
        "api-user", "api-key", "csr", "console-user", "user-roles", "user-management",
        "sso", "2fa", "yubikey", "authentication", "authorization", "manage-your-2fa",
        "reset-your-password", "configure-sso",
    ],
    "governance": [
        "policy", "policies", "quorum", "approval-group", "admin-quorum", "tap",
        "dccp", "deposit-control", "approval", "transaction-authorization",
    ],
    "mobile-recovery": [
        "mobile-app", "mobile-device", "mobile-authentication", "device-migration",
        "passphrase", "backup", "recovery", "mpc-key-share", "mpc-cmp",
        "re-enroll", "key-share", "fireblocks-mobile",
    ],
    "security-access": [
        "security-checklist", "audit-log", "ip-addresses", "allowlist",
        "whitelist", "sgx", "nitro", "intel-sgx", "fspm", "support-verification",
        "phishing", "is-this-email", "freeze-workspace",
    ],
}

# TIER 3 product line keywords (out-of-scope: separate product, catalog-only)
# NOTE: `travel-rule` excluded — Stage 14 AML/Compliance cluster treats it as in-scope
# compliance spine (TIER 1 lightweight indexes). Compliance ≠ product line.
TIER3_KEYWORDS = [
    "off-exchange", "off-exchanges",
    "fiat", "alfred-pay",
    "gas-station", "gasless",
    "staking", "earn",
    "smart-transfer", "smart-contract", "deployed-contract", "contract-template",
    "tokenization", "embedded-wallet", "embedded-wallets",
    "nft", "ordinal",
    "web3", "evm-", "hardhat", "rpc",
    "exchange-account", "fiat-account",
    "node-router",
    "automation-rule", "automation-engine", "automation",
    "p2p-network", "provider-network",
    "rwa",
]

# Marketing/UI suffix patterns to strip from raw filenames
SUFFIX_PATTERNS = [
    r"\s*[–-]\s*Fireblocks\s*Help\s*Center",
    r"\s*[–-]\s*Fireblocks\s*Documentation",
    r"\s*[–-]\s*Fireblocks\s*Support",
    r"\.pdf$",
]


@dataclass
class TriageResult:
    original_filename: str
    proposed_slug: str  # e.g. "about-embedded-wallets"
    proposed_filename: str  # e.g. "2026-05-19__support-fireblocks-io__about-embedded-wallets.pdf"
    domain: str  # 5 priority domain name or "unknown"
    domain_keywords_matched: list[str]
    tier: str  # "1" / "2" / "3"
    tier3_keywords_matched: list[str]
    recommended_mode: str  # "mode_a" / "mode_b" / "mode_b_cluster" / "mode_c_candidate"
    rationale: str


def is_normalized(filename: str) -> bool:
    return bool(NORMALIZED_PDF_RE.match(filename))


def normalize_slug(filename: str) -> str:
    """Raw PDF filename → kebab-case slug."""
    base = filename
    for pat in SUFFIX_PATTERNS:
        base = re.sub(pat, "", base, flags=re.IGNORECASE)
    base = base.strip().lower()
    base = re.sub(r"[\s_]+", "-", base)
    base = re.sub(r"[^a-z0-9-]", "", base)
    base = re.sub(r"-+", "-", base).strip("-")
    return base


def classify_domain(slug: str) -> tuple[str, list[str]]:
    """Return (best_domain, matched_keywords). Scores by # keywords matched."""
    scores: dict[str, list[str]] = {}
    for domain, keywords in DOMAIN_KEYWORDS.items():
        matched = [k for k in keywords if k in slug]
        if matched:
            scores[domain] = matched
    if not scores:
        return ("unknown", [])
    best_domain = max(scores, key=lambda d: len(scores[d]))
    return (best_domain, scores[best_domain])


def matched_tier3_keywords(slug: str) -> list[str]:
    return [k for k in TIER3_KEYWORDS if k in slug]


def estimate_tier(slug: str, domain: str, t3_matches: list[str]) -> str:
    """TIER 판정 — TIER 3 priority (Stage 26 보강).

    Stage 25 의 TIER 1 review 가 발견한 7 mis-classification 사례 — domain
    keyword + 단일 TIER 3 keyword 시 product line 으로 demote 권장. 보수적으로:

      ANY TIER 3 keyword match → TIER 3 (domain 매칭 여부와 무관)

    이는 EVM DeFi / EVM asset / gasless relay / automation rule 같은
    "5 priority domain 과 product line 의 경계" 자료를 product line 쪽으로
    분류. 약간의 false-demote (e.g. 만약 governance 가 진짜 EVM 영역인 경우)
    가 발생할 수 있으나, entity-min discipline + selective promote 정책 상
    TIER 3 강등이 더 안전 (Mode A catalog-only 로 보존).
    """
    if t3_matches:
        return "3"
    if domain != "unknown":
        return "1"
    return "2"


def recommend_mode(tier: str, sibling_count: int) -> tuple[str, str]:
    """Return (mode, rationale_1_line). sibling_count = # other non-normalized PDFs with shared domain."""
    if tier == "3":
        return (
            "mode_a",
            "TIER 3 (out-of-scope product line) — rename + meta.yml only, no markdown",
        )
    if tier == "1":
        if sibling_count >= 4:
            return (
                "mode_b_cluster",
                f"TIER 1 + {sibling_count} sibling — cluster catalog 후보 (Stage 14/18/19 pattern)",
            )
        return (
            "mode_b",
            "TIER 1 single — lightweight index draft (TODO body fact 추측 금지)",
        )
    return (
        "mode_a",
        "TIER 2 placeholder — meta.yml only, markdown deferred until promote 결정",
    )


def triage_one(filename: str, host: str = "support-fireblocks-io",
               iso_date: str = "2026-05-19",
               sibling_count: int = 0) -> TriageResult:
    """Triage a single PDF filename. Pure function — no file I/O."""
    slug = normalize_slug(filename)
    domain, d_kws = classify_domain(slug)
    t3_kws = matched_tier3_keywords(slug)
    tier = estimate_tier(slug, domain, t3_kws)
    mode, rationale = recommend_mode(tier, sibling_count)
    proposed_filename = f"{iso_date}__{host}__{slug}.pdf"
    return TriageResult(
        original_filename=filename,
        proposed_slug=slug,
        proposed_filename=proposed_filename,
        domain=domain,
        domain_keywords_matched=d_kws,
        tier=tier,
        tier3_keywords_matched=t3_kws,
        recommended_mode=mode,
        rationale=rationale,
    )


def count_domain_siblings(results: list[TriageResult]) -> dict[str, int]:
    """For each result's domain, return count of other results in same domain."""
    by_domain: dict[str, int] = {}
    for r in results:
        if r.domain != "unknown":
            by_domain[r.domain] = by_domain.get(r.domain, 0) + 1
    return by_domain
