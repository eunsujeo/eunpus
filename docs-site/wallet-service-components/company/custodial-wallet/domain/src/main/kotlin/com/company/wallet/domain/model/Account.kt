package com.company.wallet.domain.model

/**
 * 우리 쪽 고객/계정 참조. custody 특화 식별자(vault id 등)는 어댑터 안에 캡슐화하고
 * 코어로 누출하지 않는다 (가이드 13.5).
 */
@JvmInline
value class AccountRef(val value: String)

/** custody 계정 (Fireblocks vault account 의 정규화 표현). */
data class Account(
    val id: String,
    val ref: AccountRef,
)
