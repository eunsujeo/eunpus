---
title: 벤더 자산 매핑 — 우리 자산을 벤더 assetId 로 잇기
status: To Do
---

우리 (네트워크, 토큰)이 Fireblocks 에서 무엇으로 불리는지만 담는 표와, 그 표를 채우는 절차를 정한다.
어떤 자산을 지원할지는 여기서 정하지 않는다 — 그건 상품 결정이다.

## 매니저가 갖는 것과 갖지 않는 것

우리 계약은 자산을 **네트워크 + 토큰** 두 값으로 다룬다([흐름](02-bcm-flow.md)). 벤더는 `USDC_POLYGON` · `BASECHAIN_ETH` 처럼 **자체 체계의 assetId 하나**로 다루고, 그 체계는 우리가 정할 수 없다. 둘을 잇는 표가 필요하다.

| | 어디 소관인가 |
|---|---|
| **이 자산이 벤더에서 무엇인가** (`vndr_ast_id`) | **매니저** — 오히려 다른 데 두면 안 된다. 벤더 식별자를 다른 시스템이 알기 시작하면 "호출 쪽은 벤더를 모른다"는 전제가 무너진다 |
| 어떤 자산을 지원하는가 | 상품 결정 — 매니저가 정할 위치가 아니다 |
| 소수 자릿수 · 컨트랙트 주소 | 자산 자체의 속성 — 매니저는 금액을 문자열 decimal 로 넘기고 base unit 환산을 하지 않아 쓸 일이 없다 |

그래서 이 표는 **매핑만** 담는다. 이름을 "자산 마스터"로 부르지 않는 이유도 같다 — 자산의 정의를 우리가 갖는 것처럼 읽히면 곤란하다.

**벤더 카탈로그를 따라 동기화하지 않는다.** 벤더가 지원하는 자산은 수천 개지만 우리가 쓰는 것은 몇 개뿐이다. 지원하기로 한 자산만 등록하고, 늘어나면 그때 한 줄 더한다.

**범위 (시작 시점)** — 스테이블코인만, 네트워크는 `ETHEREUM` · `BASE` 둘. 벤더에는 스테이블코인이라는 분류가 없어(자산 분류는 NATIVE · FT · FIAT · NFT · SFT · VIRTUAL) 어차피 우리가 고르는 결정이다.

## bcm_vndr_ast_m — 벤더 자산 매핑

```sql
CREATE TABLE bcm_vndr_ast_m (
  ntwk_cd       VARCHAR(20)  NOT NULL,   -- 네트워크 코드 (우리 값)
  tkn_smbl      VARCHAR(16)  NOT NULL,   -- 토큰 심볼 (우리 값)
  vndr_ast_id   VARCHAR(64)  NOT NULL,   -- 벤더 assetId — 벤더 호출에만 쓴다
  vndr_blkc_id  VARCHAR(64)  NOT NULL,   -- 벤더 blockchainId — 등록 때 확보하고 대조에 쓴다
  reg_dttm      VARCHAR(16)  NOT NULL,
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL,
  PRIMARY KEY (ntwk_cd, tkn_smbl),
  UNIQUE (vndr_ast_id)
);
```

| 제약 | 무엇을 막나 |
|---|---|
| `PRIMARY KEY (ntwk_cd, tkn_smbl)` | 같은 자산이 두 줄로 갈라지는 것 |
| **`UNIQUE (vndr_ast_id)`** | **엉뚱한 체인에 주소를 발급하는 사고.** "BASE 의 USDC" 를 등록하며 이더리움 USDC 의 id 를 넣으면 여기서 걸린다 — 한 벤더 자산은 한 (네트워크, 토큰)에만 대응한다 |
| `vndr_ast_id` 는 **set-once** | 이미 주소가 발급된 뒤 이 값을 바꾸면 기존 주소와 새 주소가 서로 다른 체인이 된다. 수정 오퍼레이션을 두지 않는 이유다 |
| **한 `ntwk_cd` 는 한 `vndr_blkc_id`** | 같은 네트워크의 행들이 서로 다른 벤더 체인을 가리키는 것. 첫 줄만 제대로 고르면 그 뒤로는 등록 때 기계가 막는다 (DB 제약이 아니라 등록 검증) |

행 하나가 곧 "이 자산은 벤더로 보낼 수 있다"는 뜻이다. 별도의 사용 여부 플래그는 두지 않는다 — 상품에서 자산을 내리는 것은 호출 쪽이 요청을 보내지 않는 것으로 끝나고, 장애 때 급히 막는 것은 성격이 달라 아래 "뒤로 미룬 것"에서 따로 다룬다.

## 변환은 벤더 경계에서 한 번

우리 어휘는 끝까지 (네트워크, 토큰)으로 가고, **벤더를 부르는 지점에서만** assetId 로 바꾼다. DB·이벤트·API 어디에도 벤더 assetId 가 새어 들어가지 않는다.

호출 지점은 넷 — 주소 발급 · 잔액 조회 · 출금 제출 · sweep.

매핑에 없으면 **`ASSET_NOT_SUPPORTED`** 로 거절한다. 요청 형식 오류(`VALIDATION_FAILED`)와 구분해야 호출 쪽이 "우리가 잘못 보냈다"와 "아직 지원 안 한다"를 가릴 수 있다. 여러 네트워크 발급에서는 이것이 네트워크별 실패로 떨어져 나머지 네트워크는 정상 발급된다.

캐시는 두지 않는다 — 몇 줄짜리 표에 PK 조회 한 번이라 비용이 없고, 캐시를 두면 값이 바뀌었을 때 무효화 문제가 새로 생긴다.

## 등록 — 값을 어디서 얻고 어떻게 거르나

등록은 어쩌다 한 번이지만 여기서 틀리면 자금이 엉뚱한 체인으로 간다. 그래서 **운영자가 값을 적지 않고 고르게** 만든다 — 벤더가 준 목록에서 고른 값이 그대로 넘어오면 옮겨 적는 구간이 없어져 오타 자체가 안 생긴다. 그 뒤에 관문 셋으로 다시 거른다.

```mermaid
sequenceDiagram
    autonumber
    participant ADM as Admin 백엔드<br/>운영자 조작
    box rgb(220,252,231) 블록체인 매니저
    participant API as Admin API
    participant MDB as 매니저 DB<br/>bcm_vndr_ast_m
    end
    participant FB as Fireblocks

    Note over ADM,FB: 고르기 — 운영자는 값을 적지 않는다
    ADM->>API: GET /admin/vendor-blockchains
    API->>FB: GET /v1/blockchains
    FB-->>API: 네트워크 목록
    API-->>ADM: 목록 — 운영자가 Base 선택 · blockchainId 확보
    ADM->>API: GET /admin/vendor-assets — blockchainId · symbol
    API->>FB: GET /v1/assets — 그 네트워크로 필터
    FB-->>API: 자산 후보
    API-->>ADM: 후보 — 운영자가 선택 · assetId 확보

    Note over ADM,FB: 등록 — 고른 값을 우리 (network, token) 에 붙인다
    ADM->>API: POST 매핑 등록<br/>network · token · vendorAssetId · vendorBlockchainId · 직원번호 · 부점코드
    API->>MDB: (network, token) 조회 · 같은 network 의 vndr_blkc_id 조회
    alt 이미 등록됨 또는 그 network 가 다른 벤더 체인을 쓰고 있음
        MDB-->>API: 기존 행
        API-->>ADM: 409 CONFLICT
    else 통과
        API->>FB: GET /v1/assets/{vendorAssetId} — 최종 확인
        alt 없거나 blockchainId 가 요청과 불일치
            FB-->>API: 404 또는 다른 blockchainId
            API-->>ADM: 400 VALIDATION_FAILED
        else 확인됨
            FB-->>API: blockchainId · displaySymbol
            API->>MDB: INSERT — 감사 4컬럼 = 실제 직원·부점
            alt vndr_ast_id UNIQUE 위반
                MDB-->>API: 제약 위반
                API-->>ADM: 409 CONFLICT — 이 벤더 자산은<br/>다른 (network, token) 이 이미 쓰고 있다
            else 저장 성공
                MDB-->>API: 등록 완료
                API-->>ADM: 201 — network · token · vendorAssetId
            end
        end
    end
```

색: **초록 상자 = 매니저 안쪽**. 되돌아오는 점선이 실패 응답이다.

**앞의 네 왕복이 값의 출처다.** 운영자가 벤더 콘솔에서 문자열을 눈으로 찾아 복사해 오는 구간을 없애는 것이 목적이고, 이 과정에서 **벤더 `blockchainId` 도 함께 확보**된다. 조회 오퍼레이션 둘은 벤더 조회를 대신해 줄 뿐인 읽기 전용이라 위험이 없다.

**관문 셋이 각각 다른 실수를 잡는다.**

- **중복·네트워크 불일치 차단 (⑩)** — 이미 등록된 (network, token) 은 덮어쓰지 않는다. 여기에 더해 **같은 network 의 기존 행과 `vndr_blkc_id` 가 다르면 거절**한다 — `BASE` 의 첫 매핑이 어떤 벤더 체인을 가리켰다면 이후 `BASE` 매핑은 같은 체인이어야 한다.
- **벤더 최종 확인 (⑫)** — API 는 조회 화면 없이도 직접 호출될 수 있으므로, 넘어온 assetId 가 실재하는지와 **응답의 `blockchainId` 가 요청과 같은지**를 다시 본다.
- **UNIQUE 위반 차단 (⑰)** — 벤더에 존재하는 id 라도 다른 자산의 것일 수 있다. 그 id 를 이미 쓰는 행이 있으면 DB 가 막는다.

첫 줄만 사람이 제대로 고르면 그 네트워크의 나머지는 기계가 막는다. 네트워크당 첫 등록이 유일하게 사람의 판단에 기대는 지점이다.

## Admin API — 같은 서비스의 `/admin/*` (2026-08-06 확정)

매핑을 읽는 코드와 같은 서비스에 두고 경로를 `/admin/*` 로 나눈다. 표가 매니저 DB 에 있으므로 별도 서비스로 빼면 DB 를 둘이 나눠 쓰게 되거나 결국 매니저를 다시 호출해야 한다.

| 오퍼레이션 | 하는 일 |
|---|---|
| `GET /admin/vendor-blockchains` | 벤더가 지원하는 네트워크 목록 — 등록 전 고르기용 (읽기 전용 프록시) |
| `GET /admin/vendor-assets` | 그 네트워크의 자산 후보 — `blockchainId` · `symbol` 로 거른다 (읽기 전용 프록시) |
| `GET /admin/asset-mappings` | 등록된 매핑 목록 — 운영 확인용 |
| `POST /admin/asset-mappings` | 등록 — `network` · `token` · `vendorAssetId` · `vendorBlockchainId` |
| `DELETE /admin/asset-mappings/{network}/{token}` | 잘못 등록한 것 되돌리기 — **그 (네트워크, 토큰)으로 발급된 주소가 하나도 없을 때만** 허용, 있으면 409 |

수정 오퍼레이션은 두지 않는다. `vndr_ast_id` 가 set-once 이므로 고치는 유일한 경로는 "지우고 다시 넣기"이고, 주소가 이미 발급됐다면 그것도 막힌다 — 그 상황은 매핑 수정이 아니라 사고 처리다.

**감사 흔적** — 자동 처리 행은 시스템 센티넬(`SYSTEM`/`9999`)을 쓰지만 **Admin 수동 개입은 실제 직원번호·부점코드**를 남긴다는 규약([DB 명명 규약](03-bcm-db.md))을 그대로 따른다. 그래서 이 API 는 요청에 직원번호·부점코드를 받아 감사 4컬럼에 쓴다.

**경로를 나눈 것은 경계가 아니다** — 매니저 API 는 인증 없이 내부망을 신뢰하는 구성이라, `/admin/*` 로 이름만 갈라 두면 같은 망의 누구나 매핑을 등록할 수 있다. **이 경로의 호출 주체를 Admin 백엔드로 한정하는 망 수준 제한이 함께 필요하다.** 그 방식(방화벽 규칙·별도 리스너 등)은 배포 환경에서 정한다.

## 뒤로 미룬 것 — 네트워크 장애 대응

체인 장애 때 출금 제출을 네트워크 단위로 멈추는 스위치가 필요하다. 다만 이 표에 담을 것은 아니라고 판단해 **뒤로 미룬다.** 미루면서 정리해 둔 것:

- **단위가 다르다** — 장애는 네트워크 단위로 오는데 매핑은 (네트워크, 토큰) 단위다. 자산마다 내리면 하나 빠뜨렸을 때 그 자산만 새어 나간다.
- **저절로 막히는 장애와 아닌 장애가 갈린다** — 벤더가 죽으면 호출이 실패하니 스위치가 필요 없다. 문제는 **벤더는 멀쩡한데 체인이 지연되는 경우**로, 호출은 성공하고 tx 만 쌓인다. 스위치가 필요한 건 이쪽이다.
- **오퍼레이션마다 대응이 다르다** — 입금 감지는 **절대 막지 않는다**(돈은 계속 들어오고 못 잡는 것이 사고다). 출금 제출은 막아야 하고(stuck tx 가 쌓인다), sweep 은 미루면 되고, 주소 발급·잔액 조회는 굳이 막을 이유가 없다.
- **주된 통제는 호출 쪽이다** — 이상적으로는 접수 자체를 막아 고객에게 바로 안내되게 한다. 매니저 스위치는 그게 안 됐을 때의 최후 차단이다.
- **차단은 수동, 감지는 자동** — 자동 차단은 오탐 때 멀쩡한 출금을 멈춘다. 신호는 이미 있다 — 막힘 점검이 "확정 지연이 체인별 임계 초과"를 경보한다([흐름](02-bcm-flow.md)).
- **이미 나간 건은 스위치와 무관하다** — 진행 중 tx 는 막힘 점검·boost·경보가 맡고, 스위치는 신규 제출만 막는다.

## 아직 못 정한 것

- **네트워크 코드 값** — 우리가 정한 이름(`ETHEREUM`·`BASE`)을 쓸지 벤더 `blockchainId` 를 그대로 쓸지. 벤더 blockchainId 를 컬럼으로 따로 들고 대조하므로 **어느 쪽을 골라도 검증은 성립한다** — 읽기 편한 우리 이름을 쓰는 쪽이 무난하다.
- **실제 assetId 값** — 스펙에는 스키마만 있고 값은 없다. 워크스페이스에서 한 번 조회하거나 담당자에게 확인해야 한다.

## 참고 — 벤더 조회 API

| 엔드포인트 | 쓰임 |
|---|---|
| `GET /v1/assets` | 자산 조회. `blockchainId` · `assetClass` · `symbol` 로 거를 수 있다. 응답에 `id` · `legacyId` · `blockchainId` · `decimals` · `assetClass` |
| `GET /v1/assets/{id}` | 단건 — 등록 시 실재 확인에 쓴다 |
| `GET /v1/blockchains` | 벤더가 지원하는 네트워크 전체. 응답에 `id` · `legacyId` · `displayName` · `nativeAssetId` · `onchain{protocol · chainId · test · signingAlgo}` |
| `GET /v1/supported_assets` | 구 버전 자산 목록 — `id` · `name` · `type` · `contractAddress` · `nativeAsset` · `decimals` |
