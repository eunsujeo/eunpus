window.OPENAPI = {
  "openapi": "3.1.0",
  "info": {
    "title": "Blockchain Manager API",
    "version": "0.0.2",
    "description": "블록체인 매니저는 사내의 별도 서비스로, 온체인 거래(노드 연동)를 담당한다.\nDAW-CORE(Service·Admin)는 이 HTTP API 로 계정·주소·잔액·거래를 다루고,\n온체인 상태 변경은 메시지 큐 이벤트로 받는다.\n\n아래 규약은 **모든 엔드포인트에 공통** 적용된다.\n\n## 응답 형식\n\n성공·목록·에러 모두 같은 구조로 돌려준다. `meta.requestId` 로 요청을 추적한다.\n\n단일 리소스:\n\n```json\n{\n  \"data\": {\n    \"ref\": \"ACT-000123\",\n    \"accountId\": \"acct_01H8X\"\n  },\n  \"meta\": {\n    \"requestId\": \"3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f\"\n  }\n}\n```\n\n페이지네이션 목록:\n\n```json\n{\n  \"data\": [\n    { \"txId\": \"tx_9f2a\", \"status\": \"COMPLETED\", \"amount\": \"1.5\" }\n  ],\n  \"meta\": {\n    \"requestId\": \"3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f\"\n  },\n  \"pagination\": {\n    \"nextCursor\": \"eyJsYXN0IjoxNzUxMzM2MDAwMDAwfQ\",\n    \"hasMore\": true\n  }\n}\n```\n\n에러:\n\n```json\n{\n  \"error\": {\n    \"code\": \"ACCOUNT_NOT_FOUND\",\n    \"message\": \"account not found\"\n  },\n  \"meta\": {\n    \"requestId\": \"3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f\"\n  }\n}\n```\n\n## 데이터 포맷\n\n- **시각** — ISO 8601, UTC, 밀리초. 예: `2026-07-13T04:05:06.789Z`\n- **금액** — 문자열(decimal). 예: `\"1.5\"`. float 가 아니라 decimal 로 파싱한다.\n- **필드명** — camelCase (`externalTxId` · `numOfConfirmations`)\n- **요청 추적** — 모든 응답에 `meta.requestId`\n- **온체인 해시** — 전파 후 채워짐(그 전엔 null), `txHash`\n\n## 에러 코드\n\n판단은 `error.code` 로 한다.\n\n| 코드 | HTTP | 뜻 |\n|---|---|---|\n| `VALIDATION_FAILED` | 400 | 요청 형식·값이 규약에 안 맞음 |\n| `ACCOUNT_NOT_FOUND` | 404 | 계정 없음 (주소 미발급과 구분) |\n| `NOT_FOUND` | 404 | 그 밖의 리소스 없음 |\n| `CONFLICT` | 409 | 상태·멱등 충돌 (예: 이미 쓴 externalTxId) |\n| `RELAY_REJECTED` | 502 | 대납 relay 가 전송을 못 대거나 거절 |\n| `INTERNAL` | 500 | 서버 내부 오류 |\n\n`INTERNAL`(500) 은 모든 엔드포인트에서 날 수 있어, 오퍼레이션별 응답 표기에서는 생략한다.\n\n## 페이지네이션\n\n목록은 **커서 방식**이다. `limit`(기본 200, 최대 500)으로 크기를 정하고, 응답 `pagination.nextCursor` 를 다음 요청 `cursor` 로 넘겨 이어받는다. 지금 이어받을 페이지가 있는지는 `hasMore` 로 판단한다 — false 면 현재 시점 마지막 페이지다.\n\n`nextCursor` 는 **마지막 페이지에서도 항상 채워진다** — 이번 응답 마지막 항목의 다음 위치를 가리킨다. `order=asc` 조회에서는 이 커서를 보관했다가 나중에 같은 값으로 재요청하면 그 사이 새로 쌓인 내역만 이어받는다(증분 폴링). `order=desc`(기본, 최신순)는 커서가 과거 방향으로 진행하므로 페이지 순회용이다.\n\n`cursor`/`nextCursor` 는 **불투명 토큰**이라 파싱·구성 대상이 아니며, 받은 값을 그대로 전달한다(다음 위치·필터·정렬 방향이 토큰에 담겨 있다). 커서 요청에서는 첫 요청의 조회 조건이 토큰으로 이어지므로, 함께 보낸 다른 파라미터는 무시된다.\n\n## 멱등\n\n- **생성** — `createAccount` 는 `ref`, `createDepositAddress` 는 `(accountId, asset)` 로 멱등하다. 같은 값으로 재요청하면 매니저가 같은 결과를 돌려준다(DAW-CORE가 별도 멱등키를 넣지 않는다).\n- **출금 제출** — 본문 `externalTxId` 가 멱등 키다. 같은 키로 재제출해도 중복 전송되지 않는다.\n\n## 이벤트 (메시지 큐)\n\n온체인 상태 변경(입금 감지·출금 확정 등)은 이 HTTP API 가 아니라 **메시지 큐 이벤트**로 온다. DAW-CORE는 토픽별 컨슈머로 받는다.\n\n```seq\n체인 -> Fireblocks: 온체인 상태 변경\n매니저 -> Fireblocks: 폴링 조회\nFireblocks -> 매니저: 상태 응답\n매니저 -> 큐: publish (3 토픽)\n큐 -> DAW-CORE: consume\nDAW-CORE -> 원장: 반영 (멱등)\nDAW-CORE -> 큐: 오프셋 커밋\n```\n\n| 토픽 | 담는 이벤트 | 파티션 키 |\n|---|---|---|\n| `deposit-events` | 고객 입금 (`DEPOSIT` · `UNMAPPED`) | 고객 accountId |\n| `withdrawal-events` | 외부 출금 (`WITHDRAWAL`) | 출금 풀 vault 의 accountId |\n| `internal-events` | 내부 이체 (`INTERNAL`) | 출발 계정 accountId |\n\n`UNMAPPED`(귀속 불명)은 대응되는 고객 계정이 없어 이벤트의 `accountId` 가 null 일 수 있다.\n\n**ChainEvent** — 큐로 오는 이벤트 형태 (타입 [ChainEvent](#schema-ChainEvent)):\n\n```json\n{\n  \"type\": \"WITHDRAWAL\",\n  \"txId\": \"tx_9f2a\",\n  \"txHash\": \"0x4e1d...ab\",\n  \"externalTxId\": \"wd-260713-0042\",\n  \"accountId\": \"acct_pool_02\",\n  \"asset\": \"ETH_USDC\",\n  \"to\": \"0x9f...E2\",\n  \"status\": \"COMPLETED\",\n  \"numOfConfirmations\": 12,\n  \"subStatus\": \"CONFIRMED\",\n  \"networkStatus\": \"CONFIRMED\"\n}\n```\n\n- [`type`](#schema-EventType) — DEPOSIT · UNMAPPED · WITHDRAWAL · INTERNAL\n- [`status`](#schema-TxStatus) — 공통 상태 다섯 (아래 \"상태 (TxStatus) 기준\")\n- `txHash` — 전파 후 채워짐\n- `subStatus` — 벤더 상세 사유. 분기 필요한 최소 집합만 보고 나머지는 로깅한다\n- `networkStatus` — 체인 레이어 상태\n\n전달 보장:\n\n- **at-least-once** — 같은 이벤트가 드물게 두 번 올 수 있다. 이벤트 ID(`txId` 또는 `externalTxId`) 유일 기준으로 **상태 전이만 반영**한다.\n- **오프셋 커밋** — 원장 반영이 성공한 뒤에만.\n- **순서** — 같은 계정은 파티션 키가 보장.\n- **입금 시작 상태** — 입금은 `SUBMITTED` 없이 `CONFIRMING` 부터 온다 (`SUBMITTED` 는 우리가 제출하는 거래에서만 관찰).\n- `REJECTED`(일시적) ≠ `FAILED`(영구). 확정은 `numOfConfirmations` 를 체인별 임계와 직접 비교한다.\n\n## 상태 (TxStatus) 기준\n\n거래·이벤트의 `status` 는 이 다섯이 기준이다. 벤더 원어는 매니저가 이 다섯으로 번역하고, `subStatus`·`networkStatus` 는 분기 필요한 최소 집합만 본다.\n\n| 공통 상태 | 뜻 | 벤더(Fireblocks) 원어 | 대표 subStatus | networkStatus | DB `tx_stcd` |\n|---|---|---|---|---|---|\n| `SUBMITTED` | 제출됨 — 서명·전파 준비 중, 아직 체인 미등장 (출금만 관찰) | PENDING_SIGNATURE · QUEUED · BROADCASTING | — | 서명 단계엔 없음 → BROADCASTING | PENDING |\n| `CONFIRMING` | 전파 후 체인 등장, 컨펌 누적 중 (미확정) | CONFIRMING | PENDING_BLOCKCHAIN_CONFIRMATIONS | CONFIRMING | PENDING |\n| `COMPLETED` | 확정 — 확정 정책(DCCP) 임계 컨펌 도달 = finality | COMPLETED | CONFIRMED | CONFIRMED | CONFIRMED |\n| `REJECTED` | 거부·차단 — 정책·스크리닝에 막힘. 영구 실패가 아니라 사람 개입 여지 | REJECTED · BLOCKED | AUTO_FREEZE · FROZEN_MANUALLY · REJECTED_AML_SCREENING | 출금(전파 전 차단)은 없음 · 입금 동결은 CONFIRMED | — (미정) |\n| `FAILED` | 영구 실패 — 사유 동반 (수수료 부족·revert 등) | FAILED | DROPPED_BY_BLOCKCHAIN (reorg 증발) · 그 외 | FAILED (revert) · DROPPED (mempool 누락) | FAILED |\n\n판단은 다섯(`status`)으로 한다. `REJECTED`(일시적) ≠ `FAILED`(영구) 구분이 원장·화면 처리를 가른다.\n`DB tx_stcd` 는 DAW-CORE 상태 대응(제안)이다 — `REJECTED` 는 DB 에 짝이 없어 미정, `CHECKING`·`CANCELLED` 는 DB 고유 상태.\n"
  },
  "servers": [
    {
      "url": "https://{baseUrl}/blockchain/manage-api",
      "description": "매니저 API 베이스 URL",
      "variables": {
        "baseUrl": {
          "default": "api.example.com"
        }
      }
    }
  ],
  "tags": [
    {
      "name": "Accounts",
      "description": "계정과 입금 주소"
    },
    {
      "name": "Balances",
      "description": "잔액 조회"
    },
    {
      "name": "Transactions",
      "description": "수수료 견적·출금 제출·거래 조회"
    }
  ],
  "paths": {
    "/accounts": {
      "post": {
        "tags": [
          "Accounts"
        ],
        "summary": "계정 생성",
        "description": "`ref`(우리 참조 키)로 vault 를 만들고 `ref ↔ accountId` 매핑을 반환한다. `ref` 는 DB 계정 ID 를 쓴다 — 고객 `ACT-000123`, 운영(관리) `SYS-000001`.\n고객 계정뿐 아니라 운영(관리) 계정도 이 오퍼레이션으로 만든다 — 운영 계정은 역할별로 HOT_OPS(운영)·FEE_MGT(가스비)·RESERVE(준비금)이 있다.\n같은 `ref` 재요청은 같은 `accountId` 를 돌려준다 (매니저가 `ref` 로 멱등 보장).\n",
        "operationId": "createAccount",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateAccountRequest"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "생성됨(또는 멱등 재요청)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AccountResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/ValidationFailed"
          }
        }
      }
    },
    "/accounts/{accountId}/assets/{asset}/address": {
      "parameters": [
        {
          "$ref": "#/components/parameters/AccountId"
        },
        {
          "$ref": "#/components/parameters/Asset"
        }
      ],
      "post": {
        "tags": [
          "Accounts"
        ],
        "summary": "입금 주소 발급",
        "description": "자산 지갑을 활성화하고 입금 주소를 발급한다. EVM 은 자산당 주소 하나다.\n같은 (accountId, asset) 재요청은 같은 주소를 돌려준다 (매니저가 멱등 보장).\n",
        "operationId": "createDepositAddress",
        "responses": {
          "201": {
            "description": "발급됨(또는 멱등 재요청)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddressResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/ValidationFailed"
          },
          "404": {
            "$ref": "#/components/responses/AccountNotFound"
          }
        }
      },
      "get": {
        "tags": [
          "Accounts"
        ],
        "summary": "입금 주소 조회",
        "description": "발급된 입금 주소를 조회한다(벤더 왕복 없음).\n- 주소 있음 → `data` 에 주소\n- 계정은 있으나 주소 미발급 → `data: null` (주소를 만들지 않는다)\n- 계정 없음 → `404 ACCOUNT_NOT_FOUND`\n",
        "operationId": "depositAddressOf",
        "responses": {
          "200": {
            "description": "조회 결과(미발급 시 data=null)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddressNullableResponse"
                }
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/AccountNotFound"
          }
        }
      }
    },
    "/accounts/{accountId}/assets/{asset}/balance": {
      "parameters": [
        {
          "$ref": "#/components/parameters/AccountId"
        },
        {
          "$ref": "#/components/parameters/Asset"
        }
      ],
      "get": {
        "tags": [
          "Balances"
        ],
        "summary": "잔액 조회",
        "description": "vault 단위 잔액을 가용·대기·잠김으로 돌려준다.\n벤더가 보는 vault 잔액이라 대사(reconciliation) 재료다 — 고객별 귀속 잔액이 아니다. 고객별 잔액은 DAW-CORE 원장이 정본이다.\n",
        "operationId": "balanceOf",
        "responses": {
          "200": {
            "description": "잔액",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BalanceResponse"
                }
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/AccountNotFound"
          }
        }
      }
    },
    "/transactions": {
      "post": {
        "tags": [
          "Transactions"
        ],
        "summary": "출금 제출",
        "description": "출금(또는 내부 이체)을 제출한다. `externalTxId` 로 재제출 중복을 차단한다.\n응답은 벤더 tx id(`txId`)이며, 이후 상태 진행은 메시지 큐 이벤트로 따라간다(Events).\n",
        "operationId": "submitTransaction",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TransactionRequest"
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "접수됨(제출)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmitResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/ValidationFailed"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "502": {
            "$ref": "#/components/responses/RelayRejected"
          }
        }
      }
    },
    "/transactions/{txId}": {
      "get": {
        "tags": [
          "Transactions"
        ],
        "summary": "거래 단건 조회",
        "description": "벤더 tx id(`txId`)로 거래 1건을 조회한다. `txId` 는 출금 제출 응답이나 큐 이벤트에서 얻는다.",
        "operationId": "transactionOf",
        "parameters": [
          {
            "name": "txId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "벤더 tx id",
            "example": "tx_9f2a"
          }
        ],
        "responses": {
          "200": {
            "description": "거래",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TransferResponse"
                }
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          }
        }
      }
    },
    "/accounts/{accountId}/transactions": {
      "parameters": [
        {
          "$ref": "#/components/parameters/AccountId"
        }
      ],
      "get": {
        "tags": [
          "Transactions"
        ],
        "summary": "거래 목록 조회",
        "description": "거래 이력을 **거래 시각(createdAt) 기준**으로 조회한다 — 기본 최신순, `order=asc` 면 과거→최신. 기간(`after`/`before`)·상태로 좁히고 커서로 페이지네이션한다.\n`order=asc` + `before` 생략 조합이면 마지막 `nextCursor` 를 보관했다가 재요청해 새로 쌓인 내역만 이어받는 증분 폴링이 된다.\n상태 변경 실시간 감지는 이 목록이 아니라 이벤트 큐가 담당한다(매니저 내부의 lastUpdated 감지 폴링과 별개).\n",
        "operationId": "transactionsOf",
        "parameters": [
          {
            "name": "after",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "format": "date-time"
            },
            "description": "시작 시각 — 거래 시각(createdAt) 기준 (ISO 8601 UTC)",
            "example": "2026-07-01T00:00:00.000Z"
          },
          {
            "name": "before",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date-time"
            },
            "description": "종료 시각 — 거래 시각(createdAt) 기준 (ISO 8601 UTC). 생략하면 상한 없음 — 증분 폴링(`order=asc`) 조회는 생략한다.",
            "example": "2026-07-13T00:00:00.000Z"
          },
          {
            "name": "order",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            },
            "description": "정렬 방향 — 거래 시각(createdAt) 기준. 기본 desc(최신순). 마지막 커서를 보관해 새 내역을 이어받는 증분 폴링은 `asc` 조회에서만 성립한다.",
            "example": "desc"
          },
          {
            "name": "status",
            "in": "query",
            "required": false,
            "schema": {
              "$ref": "#/components/schemas/TxStatus"
            },
            "description": "상태 필터 (선택)",
            "example": "COMPLETED"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 500,
              "default": 200
            },
            "description": "페이지 크기 — 기본 200, 최대 500 (벤더 한도). 1 미만이거나 500 초과면 `400 VALIDATION_FAILED`.",
            "example": 200
          },
          {
            "name": "cursor",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            },
            "description": "다음 위치 커서 — 이전 응답의 `pagination.nextCursor` 를 그대로 넣는다. 불투명 토큰이라 직접 만들거나 해석하지 않는다. 첫 요청엔 생략. cursor 가 있으면 조회 조건은 토큰이 우선이라 함께 보낸 `after`/`before`·`status`·`order`·`limit` 는 무시된다.",
            "example": "eyJsYXN0IjoxNzUxMzM2MDAwMDAwfQ"
          }
        ],
        "responses": {
          "200": {
            "description": "거래 목록",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TransfersResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/ValidationFailed"
          },
          "404": {
            "$ref": "#/components/responses/AccountNotFound"
          }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "AccountId": {
        "name": "accountId",
        "in": "path",
        "required": true,
        "schema": {
          "type": "string"
        },
        "description": "매니저가 돌려준 vault 핸들 (DB ext_acnt_id = vaultAccountId)",
        "example": "acct_01H8X"
      },
      "Asset": {
        "name": "asset",
        "in": "path",
        "required": true,
        "schema": {
          "type": "string"
        },
        "description": "자산 식별 (체인 × 토큰)",
        "example": "ETH_USDC"
      }
    },
    "schemas": {
      "Meta": {
        "type": "object",
        "properties": {
          "requestId": {
            "type": "string",
            "description": "요청 추적 id (모든 응답에 포함)",
            "example": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
          }
        },
        "required": [
          "requestId"
        ]
      },
      "Pagination": {
        "type": "object",
        "properties": {
          "nextCursor": {
            "type": "string",
            "description": "다음 위치 커서 (불투명 토큰) — 다음 요청 `cursor` 로 그대로 전달. 마지막 페이지에서도 항상 채워지며, `order=asc` 조회면 보관해 뒀다가 이후 새로 쌓인 내역을 이어받는 시작점(증분 폴링)으로 쓴다.",
            "example": "eyJsYXN0IjoxNzUxMzM2MDAwMDAwfQ"
          },
          "hasMore": {
            "type": "boolean",
            "description": "지금 이어받을 다음 페이지가 있는지 — false 면 현재 시점 마지막 페이지",
            "example": true
          }
        },
        "required": [
          "nextCursor",
          "hasMore"
        ]
      },
      "ErrorBody": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "에러 코드 (API Conventions 표 참조)",
            "example": "ACCOUNT_NOT_FOUND"
          },
          "message": {
            "type": "string",
            "description": "사람이 읽는 설명 — 분기 판단은 `code` 로 한다",
            "example": "account not found"
          }
        },
        "required": [
          "code",
          "message"
        ]
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "error": {
            "$ref": "#/components/schemas/ErrorBody"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "error",
          "meta"
        ]
      },
      "Account": {
        "type": "object",
        "properties": {
          "ref": {
            "type": "string",
            "description": "우리 참조 키 (DB 계정 ID) — 고객 ACT-000123, 운영 SYS-000001 (역할 HOT_OPS·FEE_MGT·RESERVE)",
            "example": "ACT-000123"
          },
          "accountId": {
            "type": "string",
            "description": "매니저가 돌려주는 vault 핸들 (DB ext_acnt_id = vaultAccountId)",
            "example": "acct_01H8X"
          }
        },
        "required": [
          "ref",
          "accountId"
        ]
      },
      "Address": {
        "type": "object",
        "properties": {
          "address": {
            "type": "string",
            "description": "입금 주소",
            "example": "0xAb3...C9"
          },
          "memoTag": {
            "type": [
              "string",
              "null"
            ],
            "description": "EVM 은 null. Tag/Memo 체인만 사용.",
            "example": null
          }
        },
        "required": [
          "address"
        ]
      },
      "Balance": {
        "type": "object",
        "description": "금액은 문자열(decimal).",
        "properties": {
          "available": {
            "type": "string",
            "description": "가용",
            "example": "10.5"
          },
          "pending": {
            "type": "string",
            "description": "대기(확정 전)",
            "example": "1.0"
          },
          "locked": {
            "type": "string",
            "description": "잠김 — 나가는 중(전파 전) 출금 예약분 + AML 동결분",
            "example": "0"
          }
        },
        "required": [
          "available",
          "pending",
          "locked"
        ]
      },
      "Transfer": {
        "type": "object",
        "description": "거래 1건. 요청의 `from`/`to`(TransferPeer)는 여기선 확정된 온체인 주소 문자열로 나온다.",
        "properties": {
          "txId": {
            "type": "string",
            "description": "벤더 tx id"
          },
          "txHash": {
            "type": [
              "string",
              "null"
            ],
            "description": "온체인 거래해시 — 전파 후 채워짐"
          },
          "externalTxId": {
            "type": [
              "string",
              "null"
            ],
            "description": "우리 요청 키"
          },
          "asset": {
            "type": "string",
            "description": "자산 식별 (체인 × 토큰)"
          },
          "amount": {
            "type": "string",
            "description": "금액(문자열)"
          },
          "from": {
            "type": "string",
            "description": "발신 (확정 온체인 주소)"
          },
          "to": {
            "type": "string",
            "description": "목적지 (확정 온체인 주소)"
          },
          "status": {
            "$ref": "#/components/schemas/TxStatus"
          },
          "numOfConfirmations": {
            "type": "integer",
            "description": "누적 컨펌 수"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "거래 생성 시각 (목록 정렬·기간 필터 기준)"
          },
          "lastUpdated": {
            "type": "string",
            "format": "date-time",
            "description": "마지막 상태 변경 시각"
          }
        },
        "required": [
          "txId",
          "asset",
          "amount",
          "from",
          "to",
          "status",
          "numOfConfirmations",
          "createdAt",
          "lastUpdated"
        ],
        "example": {
          "txId": "tx_9f2a",
          "txHash": "0x4e1d...ab",
          "externalTxId": "wd-260713-0042",
          "asset": "ETH_USDC",
          "amount": "1.5",
          "from": "0xA1...C9",
          "to": "0x9f...E2",
          "status": "COMPLETED",
          "numOfConfirmations": 12,
          "createdAt": "2026-07-13T04:05:06.789Z",
          "lastUpdated": "2026-07-13T04:06:10.120Z"
        }
      },
      "ChainEvent": {
        "type": "object",
        "description": "큐로 오는 온체인 상태 변경 이벤트 (HTTP 응답이 아니라 메시지 큐로 전달).",
        "properties": {
          "type": {
            "$ref": "#/components/schemas/EventType"
          },
          "txId": {
            "type": "string",
            "description": "벤더 tx id"
          },
          "txHash": {
            "type": [
              "string",
              "null"
            ],
            "description": "온체인 거래해시 — 전파 후 채워짐"
          },
          "externalTxId": {
            "type": [
              "string",
              "null"
            ],
            "description": "우리 요청 키 (출금·내부이체)"
          },
          "accountId": {
            "type": [
              "string",
              "null"
            ],
            "description": "파티션 키 (vault 핸들). UNMAPPED 은 귀속 계정이 없어 null 일 수 있다"
          },
          "asset": {
            "type": "string",
            "description": "자산 식별 (체인 × 토큰)"
          },
          "to": {
            "type": "string",
            "description": "목적지 주소 — 입금 판별"
          },
          "status": {
            "$ref": "#/components/schemas/TxStatus"
          },
          "numOfConfirmations": {
            "type": "integer",
            "description": "누적 컨펌 수"
          },
          "subStatus": {
            "type": [
              "string",
              "null"
            ],
            "description": "벤더 상세 사유 — 분기 필요한 최소 집합만"
          },
          "networkStatus": {
            "type": [
              "string",
              "null"
            ],
            "description": "체인 레이어 상태"
          }
        },
        "required": [
          "type",
          "txId",
          "asset",
          "to",
          "status",
          "numOfConfirmations"
        ],
        "example": {
          "type": "WITHDRAWAL",
          "txId": "tx_9f2a",
          "txHash": "0x4e1d...ab",
          "externalTxId": "wd-260713-0042",
          "accountId": "acct_pool_02",
          "asset": "ETH_USDC",
          "to": "0x9f...E2",
          "status": "COMPLETED",
          "numOfConfirmations": 12,
          "subStatus": "CONFIRMED",
          "networkStatus": "CONFIRMED"
        }
      },
      "TxStatus": {
        "type": "string",
        "enum": [
          "SUBMITTED",
          "CONFIRMING",
          "COMPLETED",
          "REJECTED",
          "FAILED"
        ],
        "description": "공통 상태 다섯.",
        "x-enumDescriptions": {
          "SUBMITTED": "제출 — 체인 미등장",
          "CONFIRMING": "컨펌 누적 (미확정)",
          "COMPLETED": "확정",
          "REJECTED": "거부·차단 (일시적)",
          "FAILED": "영구 실패"
        }
      },
      "EventType": {
        "type": "string",
        "enum": [
          "DEPOSIT",
          "UNMAPPED",
          "WITHDRAWAL",
          "INTERNAL"
        ],
        "description": "이벤트 분류. 매니저가 발신자가 우리 vault 인지로 가른다.",
        "x-enumDescriptions": {
          "DEPOSIT": "고객 입금 (매핑된 주소로 수신)",
          "UNMAPPED": "귀속 불명 — 보류",
          "WITHDRAWAL": "외부 출금",
          "INTERNAL": "내부 이체 (sweep·정산 등)"
        }
      },
      "SubmitResult": {
        "type": "object",
        "properties": {
          "txId": {
            "type": "string",
            "description": "벤더 tx id",
            "example": "tx_9f2a"
          }
        },
        "required": [
          "txId"
        ]
      },
      "CreateAccountRequest": {
        "type": "object",
        "required": [
          "ref"
        ],
        "properties": {
          "ref": {
            "type": "string",
            "description": "우리 참조 키 (영구 유일) — DB 계정 ID. 고객 `ACT-000123`, 운영(관리) `SYS-000001` (역할 HOT_OPS·FEE_MGT·RESERVE).",
            "example": "ACT-000123"
          }
        }
      },
      "TransactionRequest": {
        "type": "object",
        "properties": {
          "externalTxId": {
            "type": "string",
            "description": "우리 요청 키 — 승인 완료된 출금 지시 1건과 1:1. 재제출 중복 차단·완료 대응",
            "example": "wd-260713-0042"
          },
          "from": {
            "allOf": [
              {
                "$ref": "#/components/schemas/TransferPeer"
              },
              {
                "properties": {
                  "type": {
                    "const": "ACCOUNT"
                  }
                }
              }
            ],
            "description": "보내는 쪽 — type=ACCOUNT 만 허용"
          },
          "to": {
            "allOf": [
              {
                "$ref": "#/components/schemas/TransferPeer"
              }
            ],
            "description": "목적지"
          },
          "asset": {
            "type": "string",
            "description": "자산 식별 (체인 × 토큰)",
            "example": "ETH_USDC"
          },
          "amount": {
            "type": "string",
            "description": "금액(문자열 · 부동소수 금지)",
            "example": "1.5"
          },
          "note": {
            "type": [
              "string",
              "null"
            ],
            "description": "벤더 거래 기록 메모"
          },
          "travelRule": {
            "description": "트래블룰 게이트가 만든 암호화 산출물 — 해외(Notabene) 출금만 싣고, 국내(VerifyVASP)·개인지갑은 null",
            "oneOf": [
              {
                "$ref": "#/components/schemas/TravelRule"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "externalTxId",
          "from",
          "to",
          "asset",
          "amount"
        ],
        "example": {
          "externalTxId": "wd-260713-0042",
          "from": {
            "type": "ACCOUNT",
            "accountId": "acct_pool_02"
          },
          "to": {
            "type": "ADDRESS",
            "address": "0x9f...E2"
          },
          "asset": "ETH_USDC",
          "amount": "1.5",
          "note": null,
          "travelRule": null
        }
      },
      "TransferPeer": {
        "type": "object",
        "description": "벤더 TransferPeerPath 대응. from·to 공통. type 에 따라 필요한 식별 필드가 정해진다.",
        "properties": {
          "type": {
            "$ref": "#/components/schemas/PeerType"
          },
          "address": {
            "type": [
              "string",
              "null"
            ],
            "description": "온체인 주소 (type=ADDRESS 일 때 필수)"
          },
          "accountId": {
            "type": [
              "string",
              "null"
            ],
            "description": "우리 계정 (type=ACCOUNT 일 때 필수)"
          },
          "walletId": {
            "type": [
              "string",
              "null"
            ],
            "description": "사전 등록 지갑 id (type=WHITELISTED 일 때 필수)"
          }
        },
        "required": [
          "type"
        ],
        "allOf": [
          {
            "if": {
              "properties": {
                "type": {
                  "const": "ADDRESS"
                }
              }
            },
            "then": {
              "required": [
                "address"
              ]
            }
          },
          {
            "if": {
              "properties": {
                "type": {
                  "const": "ACCOUNT"
                }
              }
            },
            "then": {
              "required": [
                "accountId"
              ]
            }
          },
          {
            "if": {
              "properties": {
                "type": {
                  "const": "WHITELISTED"
                }
              }
            },
            "then": {
              "required": [
                "walletId"
              ]
            }
          }
        ]
      },
      "PeerType": {
        "type": "string",
        "enum": [
          "ADDRESS",
          "ACCOUNT",
          "WHITELISTED"
        ],
        "x-enumDescriptions": {
          "ADDRESS": "온체인 주소 (외부 출금 → ONE_TIME_ADDRESS)",
          "ACCOUNT": "우리 계정 (내부 이동 → VAULT_ACCOUNT)",
          "WHITELISTED": "사전 등록 지갑 (→ EXTERNAL_WALLET)"
        }
      },
      "TravelRule": {
        "type": "object",
        "description": "트래블룰 게이트가 만든 **암호화 산출물**이다. 이 API(매니저)는 운반만 하고\n내용을 파싱하지 않으므로, 여기서는 내부 구조를 펼치지 않고 불투명한 객체로 둔다.\n\n- 실제 구조의 기준은 **IVMS101 표준 + 트래블룰 솔루션 스펙**(게이트 쪽 문서)이다.\n- 시나리오별로 실림 여부가 다르다 — 해외(Notabene)=메시지 있음, 국내(VerifyVASP)·개인지갑=없음(`null`).\n- 컴플라이언스가 내보내는 `travelRuleMessage`(암호화 문자열)를 DAW-CORE 가 이 필드로 실어 보낸다 — 정확한 형태는 구현 때 확정.\n",
        "additionalProperties": true
      },
      "AccountResponse": {
        "type": "object",
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Account"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "data",
          "meta"
        ]
      },
      "AddressResponse": {
        "type": "object",
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Address"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "data",
          "meta"
        ]
      },
      "AddressNullableResponse": {
        "type": "object",
        "properties": {
          "data": {
            "oneOf": [
              {
                "$ref": "#/components/schemas/Address"
              },
              {
                "type": "null"
              }
            ],
            "description": "미발급 시 null"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "data",
          "meta"
        ]
      },
      "BalanceResponse": {
        "type": "object",
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Balance"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "data",
          "meta"
        ]
      },
      "TransferResponse": {
        "type": "object",
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Transfer"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "data",
          "meta"
        ]
      },
      "TransfersResponse": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Transfer"
            }
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          },
          "pagination": {
            "$ref": "#/components/schemas/Pagination"
          }
        },
        "required": [
          "data",
          "meta",
          "pagination"
        ]
      },
      "SubmitResponse": {
        "type": "object",
        "properties": {
          "data": {
            "$ref": "#/components/schemas/SubmitResult"
          },
          "meta": {
            "$ref": "#/components/schemas/Meta"
          }
        },
        "required": [
          "data",
          "meta"
        ]
      }
    },
    "responses": {
      "ValidationFailed": {
        "description": "요청 검증 실패",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            },
            "example": {
              "error": {
                "code": "VALIDATION_FAILED",
                "message": "amount must be a decimal string"
              },
              "meta": {
                "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
              }
            }
          }
        }
      },
      "NotFound": {
        "description": "리소스 없음",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            },
            "example": {
              "error": {
                "code": "NOT_FOUND",
                "message": "transaction not found"
              },
              "meta": {
                "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
              }
            }
          }
        }
      },
      "AccountNotFound": {
        "description": "계정 없음",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            },
            "example": {
              "error": {
                "code": "ACCOUNT_NOT_FOUND",
                "message": "account not found"
              },
              "meta": {
                "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
              }
            }
          }
        }
      },
      "Conflict": {
        "description": "상태·멱등 충돌",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            },
            "example": {
              "error": {
                "code": "CONFLICT",
                "message": "externalTxId already used"
              },
              "meta": {
                "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
              }
            }
          }
        }
      },
      "RelayRejected": {
        "description": "relay 가 전송을 대지 못함·거절 (대납 구성)",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            },
            "example": {
              "error": {
                "code": "RELAY_REJECTED",
                "message": "relay refused to sponsor gas"
              },
              "meta": {
                "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
              }
            }
          }
        }
      }
    }
  }
};
