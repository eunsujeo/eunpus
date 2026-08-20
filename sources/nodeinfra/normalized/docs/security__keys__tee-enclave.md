<!--
source_url: https://docs.nodeinfra.com/security/keys/tee-enclave
path: /security/keys/tee-enclave
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 서명 순간에만 키가 엔클레이브에 존재하고, 서명 직후 제로화됩니다.
-->

# Intel SGX 엔클레이브

Intel SGX(Software Guard Extensions)는 CPU 수준에서 격리된 실행 영역을 제공합니다.
노드월렛의 체인 서명 로직은 SGX 엔클레이브 안에서만 실행되며, 호스트 OS나 하이퍼바이저가 침해되어도 엔클레이브 메모리는 보호됩니다.
초기 프로비저닝 이후 마스터 키는 엔클레이브 내부에 MRENCLAVE 봉인(sealed blob) 형태로 상주합니다.
운영 중 서명에는 HSM 호출이 필요 없으므로, 프로비저닝이 끝난 뒤에는 HSM을 오프라인으로 두어도 서명 서비스는 정상 동작합니다.

## 서명 경로

## 엔클레이브 내부 흐름

엔클레이브는 서명 요청을 받으면 다음 순서로 동작합니다:

1. **요청 검증** — MRENCLAVE로 세션이 바인딩되어 있는지 확인
2. **마스터 키 언실** — 디스크의 `sealed_blob`을 `EGETKEY`로 언실하여 평문 마스터 키를 엔클레이브 메모리에 로드
3. **BIP-44 파생** — 요청된 지갑 경로(`m/44'/501'/account'/change/index`)로 서명 키 파생
4. **경로 검증** — 파생 경로가 허용된 범위 내인지 확인 (공격자가 임의 경로 서명을 요청하지 못하도록 차단)
5. **Ed25519 서명** — 트랜잭션에 서명
6. **즉시 제로화** — 마스터 키와 파생 키, 중간 값을 모두 엔클레이브 메모리에서 제거
7. **반환** — 서명값만 호스트로 반환

## DCAP 원격 증명

엔클레이브가 “진짜 노드월렛 엔클레이브”인지 검증하는 과정은 DCAP(Data Center Attestation Primitives)으로 수행됩니다.

검증되는 항목:

- **MRENCLAVE** — 엔클레이브 바이너리 해시
- **MRSIGNER** — 빌드 서명자 신원
- **ISVSVN** — 엔클레이브 버전
- **TCB 수준** — CPU 마이크로코드 최신성 (취약 CPU 차단)

## 호스트 침해 시나리오

공격자가 엔클레이브를 실행하는 호스트 OS를 완전히 장악한 경우에도:

- **메모리 추출 불가** — SGX EPC 메모리는 CPU 내부에서 암호화되어 RAM 덤프로 추출 불가
- **실드 블롭 재사용 불가** — `sealed_blob`은 MRENCLAVE에 봉인되어 있어 다른 이미지로 언실 불가 (EGETKEY가 거부)
- **재생 공격 불가** — 엔클레이브는 세션별 nonce를 발행하고, 요청에 포함된 nonce를 검증

## HSM의 역할 경계

| 시점 | HSM 필요 여부 | 용도 |
| --- | --- | --- |
| 초기 프로비저닝 | 필요 | 마스터 키 생성 + RSA-OAEP 래핑 후 엔클레이브로 전달 |
| 재프로비저닝 (엔클레이브 이미지 교체 등) | 필요 | 동일한 마스터 키를 새 엔클레이브 RSA 공개키로 다시 래핑 |
| 운영 중 서명 | 불필요 | 엔클레이브가 디스크의sealed_blob에서 언실하여 서명 |
