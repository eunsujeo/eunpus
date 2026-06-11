package com.company.wallet.backend.gateway

import com.company.wallet.backend.directory.AccountDirectory
import com.company.wallet.backend.directory.AccountNotFoundException
import com.company.wallet.domain.error.DuplicateRequestException
import com.company.wallet.domain.error.UnsupportedForChainException
import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.CancelCapability
import com.company.wallet.domain.port.DepositAddressIssuanceCapability
import com.company.wallet.domain.port.TransactionPort
import com.company.wallet.shared.idempotency.FailureKind
import com.company.wallet.shared.idempotency.IdempotencyRecord
import com.company.wallet.shared.idempotency.IdempotencyStore
import org.springframework.stereotype.Service

/**
 * API 게이트웨이 — 모든 외부 요청의 단일 입구 (가이드 6).
 *
 * 하는 일은 셋뿐이다: ① 인증 ② 멱등 키 확인(같은 요청이 두 번 실행되지 않게) ③ 포트로 라우팅.
 * 비즈니스 판단(승인·한도·수수료 정책)은 하지 않는다 — 그건 비즈니스 레이어 몫이고,
 * 게이트웨이는 벤더·체인과 무관한 지갑 서비스 백엔드 층이다 (가이드 6.2).
 *
 * 생성자 주입은 포트 타입만 받는다 — 어떤 custody 어댑터(Fireblocks/자체/NodeWallet)가 꽂히는지
 * 게이트웨이는 모른다 (가이드 13 · 17.3).
 */
@Service
class WalletGatewayService(
    private val accounts: AccountPort,
    private val transactions: TransactionPort,
    private val idempotency: IdempotencyStore,
    private val directory: AccountDirectory,
) {
    /**
     * 계정(vault) 생성 — 되돌릴 수 없는 쓰기이므로 멱등 wrap (가이드 6.1).
     * 발급 결과는 [AccountDirectory] 에 저장한다 — 벤더 교체 후에도 남는 우리 데이터 (가이드 9.3).
     */
    suspend fun createAccount(
        credentials: String?,
        idempotencyKey: String?,
        ref: AccountRef,
    ): Account {
        authenticate(credentials)
        return withIdempotency(idempotencyKey ?: "create-account:${ref.value}") {
            accounts.createAccount(ref).also { directory.save(it) }
        }
    }

    /**
     * 수신 주소 확보(조회) — 포트의 addressOf 는 멱등 조회지만, 처음 확보한 주소를 디렉터리에
     * 기록하고 watch-list 등록(가이드 9.4)과 한 흐름으로 묶기 위해 멱등 wrap 을 유지한다 (가이드 9.3).
     */
    suspend fun addressOf(
        credentials: String?,
        idempotencyKey: String?,
        accountId: String,
        asset: Asset,
    ): Address {
        authenticate(credentials)
        val account = resolveAccount(accountId)
        return withIdempotency(
            idempotencyKey ?: "address-of:${account.id}:${asset.chainId.value}:${asset.symbol}",
        ) {
            accounts.addressOf(account, asset).also { directory.saveAddress(account, it) }
        }
    }

    /**
     * 추가 입금 주소 "발급" — capability (가이드 13.3 · 9.3). 어댑터가
     * [DepositAddressIssuanceCapability] 를 구현하지 않으면(Canton·NodeWallet) 명시적 거절로 끝낸다.
     */
    suspend fun issueDepositAddress(
        credentials: String?,
        idempotencyKey: String?,
        accountId: String,
        asset: Asset,
    ): Address {
        authenticate(credentials)
        val account = resolveAccount(accountId)
        val issuer =
            accounts as? DepositAddressIssuanceCapability
                ?: throw UnsupportedForChainException("issueDepositAddress", asset.chainId)
        return withIdempotency(
            idempotencyKey ?: "issue-address:${account.id}:${asset.chainId.value}:${asset.symbol}",
        ) {
            issuer.issueDepositAddress(account, asset).also { directory.saveAddress(account, it) }
        }
    }

    /** 잔액 조회 — 읽기 전용이라 멱등 wrap 이 필요 없다. available/pending/locked 구분 (가이드 13.3). */
    suspend fun getBalance(
        credentials: String?,
        accountId: String,
        asset: Asset,
    ): Balance {
        authenticate(credentials)
        return accounts.getBalance(resolveAccount(accountId), asset)
    }

    /**
     * 계정 해석 — 디렉터리 단독 조회. 없으면 404 성격의 [AccountNotFoundException] 으로 끝낸다 —
     * 벤더에 다시 묻지 않는다 (가이드 9.3).
     */
    private suspend fun resolveAccount(accountId: String): Account =
        directory.findById(accountId) ?: throw AccountNotFoundException(accountId)

    /**
     * 트랜잭션 제출 — 가장 되돌릴 수 없는 쓰기. 멱등 키는 여기서 끝나지 않고
     * 어댑터의 dedup 키(Fireblocks `externalTxId` 등)까지 따라간다 (가이드 6.3).
     */
    suspend fun submitTransaction(
        credentials: String?,
        request: TransactionRequest,
    ): TxRef {
        authenticate(credentials)
        return withIdempotency(request.idempotencyKey) {
            transactions.submitTransaction(request)
        }
    }

    /** 트랜잭션 상태 조회 — 읽기 전용. */
    suspend fun getStatus(
        credentials: String?,
        txRef: TxRef,
    ): TxStatus {
        authenticate(credentials)
        return transactions.getStatus(txRef)
    }

    /**
     * 대기·막힌 트랜잭션 중단 — 역시 쓰기이므로 멱등 wrap.
     * cancel 은 capability 다 (가이드 13.3) — 어댑터가 [CancelCapability] 를 구현하지 않으면
     * (예: 취소를 보장 못 하는 체인) 명시적 거절로 끝낸다.
     */
    suspend fun cancel(
        credentials: String?,
        idempotencyKey: String?,
        txRef: TxRef,
    ): TxRef {
        authenticate(credentials)
        val cancellable =
            transactions as? CancelCapability
                ?: throw UnsupportedForChainException("cancel", txRef.chainId)
        return withIdempotency(idempotencyKey ?: "cancel:${txRef.chainId.value}:${txRef.value}") {
            cancellable.cancel(txRef)
        }
    }

    /**
     * ① 인증 — 누구의 요청인지 확인 (가이드 6.2).
     *
     * 외부 IdP/API key 검증은 인프라 경계라 스켈레톤에서는 통과시킨다.
     * TODO: API key·JWT 검증 연동 (실패 시 거절).
     */
    @Suppress("UNUSED_PARAMETER")
    private fun authenticate(credentials: String?) {
        // 스켈레톤 — 인증 스텁. 운영 전 반드시 구현.
    }

    /**
     * ② 멱등 wrap — 같은 키의 요청을 정확히 한 번으로 모은다 (가이드 6.3).
     *
     * - 이미 완료 → 저장된 결과 그대로 반환 (포트를 다시 호출하지 않는다)
     * - 진행 중(동시 중복) → [DuplicateRequestException] (그 사이 완료됐으면 그 결과로 합류)
     * - 실패 기록 → [FailureKind.RETRYABLE] 만 재실행 허용, [FailureKind.PERMANENT] 는 차단
     */
    private suspend fun <T : Any> withIdempotency(
        key: String,
        block: suspend () -> T,
    ): T {
        replayIfFinished<T>(idempotency.get(key))?.let { return it }
        try {
            idempotency.markInFlight(key)
        } catch (e: DuplicateRequestException) {
            // 경합에서 진 쪽 — 그 사이 완료됐으면 저장된 결과로 합류, 아니면 중복 거절
            return replayIfFinished(idempotency.get(key)) ?: throw e
        }
        return try {
            block().also { idempotency.recordSuccess(key, it) }
        } catch (e: Exception) {
            idempotency.recordFailure(key, classify(e), e.message ?: e.javaClass.simpleName)
            throw e
        }
    }

    /** 완료된 기록이면 결과 재생, 확정 실패면 차단, 그 외(null·진행 중)면 null. */
    @Suppress("UNCHECKED_CAST")
    private fun <T : Any> replayIfFinished(record: IdempotencyRecord?): T? =
        when (record) {
            is IdempotencyRecord.Succeeded -> record.result as T
            is IdempotencyRecord.Failed ->
                if (record.kind == FailureKind.PERMANENT) {
                    error("이미 확정 실패한 요청의 재실행 차단: ${record.reason}")
                } else {
                    null // 일시 오류 — 정당한 재시도 허용
                }
            else -> null
        }

    /** 실패 분류 — 검증·미지원은 확정 실패, 나머지는 일시 오류로 본다 (가이드 6.4). */
    private fun classify(e: Exception): FailureKind =
        when (e) {
            is IllegalArgumentException, is UnsupportedOperationException -> FailureKind.PERMANENT
            else -> FailureKind.RETRYABLE
        }
}
