window.OPENAPI = {
  "openapi": "3.1.0",
  "info": {
    "title": "Compliance Service API",
    "version": "0.0.5",
    "x-curl": true,
    "description": "컴플라이언스 서비스는 규제 대응의 솔루션·벤더 연동을 전담하는 별도 서비스다.\nDAW-CORE는 이 HTTP API 로 출금 확인·입금 판별의 솔루션 조회를 요청하고,\n비동기 확인의 결과 도착은 메시지 큐 이벤트로 받는다.\n\n아래 규약은 **모든 엔드포인트에 공통** 적용되며, 블록체인 매니저 API 와 같은 형식을 쓴다.\n\n## 응답 형식\n\n성공·에러 모두 같은 구조로 돌려준다. `meta.requestId` 로 요청을 추적한다.\n\n단일 리소스:\n\n```json\n{\n  \"data\": {\n    \"checkId\": \"chk_01J9Z\",\n    \"verdict\": \"PENDING\"\n  },\n  \"meta\": {\n    \"requestId\": \"3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f\"\n  }\n}\n```\n\n에러:\n\n```json\n{\n  \"error\": {\n    \"code\": \"CHECK_NOT_FOUND\",\n    \"message\": \"withdrawal check not found\"\n  },\n  \"meta\": {\n    \"requestId\": \"3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f\"\n  }\n}\n```\n\n## 데이터 포맷\n\n- **시각** — ISO 8601, UTC, 밀리초. 예: `2026-07-14T04:05:06.789Z`\n- **금액** — 문자열(decimal). 예: `\"1.5\"`. float 가 아니라 decimal 로 파싱한다.\n- **필드명** — camelCase (`externalTxId` · `travelRuleMessage`)\n- **요청 추적** — 모든 응답에 `meta.requestId`\n- **솔루션 원어 비노출** — 응답은 공통 어휘(TrVerdict 등)만 싣는다. 벤더 응답 코드 등 솔루션 원어 근거는 서비스가 감사 기록으로 보존한다.\n- **curl 예시의 인증 헤더는 생략** — 서비스 간 인증 방식은 미확정(아래 미확정 절).\n\n## 에러 코드\n\n판단은 `error.code` 로 한다.\n\n| 코드 | HTTP | 뜻 |\n|---|---|---|\n| `VALIDATION_FAILED` | 400 | 요청 형식·값이 규약에 안 맞음 |\n| `CHECK_NOT_FOUND` | 404 | check 없음 |\n| `NOT_FOUND` | 404 | 그 밖의 리소스 없음 |\n| `CONFLICT` | 409 | 멱등 충돌 — 같은 `externalTxId` 로 다른 본문 재요청 |\n| `SYNC_IN_PROGRESS` | 409 | 목록 동기화가 이미 실행 중 |\n| `NETWORK_UNAVAILABLE` | 502 | 솔루션·벤더 장애 — 외부 이체는 fail-close 가 원칙 |\n| `INTERNAL` | 500 | 서버 내부 오류 |\n\n`INTERNAL`(500) 은 모든 엔드포인트에서 날 수 있어, 오퍼레이션별 응답 표기에서는 생략한다.\n\n## 멱등\n\n- **Create Withdrawal Check** — `externalTxId` 가 멱등 키다. 같은 키 재요청은 새 check 를 만들지 않고 기존 check 를 `200` 으로 돌려준다. 같은 키에 다른 본문이면 `CONFLICT`(409) — 서비스가 최초 요청의 본문 해시를 check 에 보관해 대조한다.\n- **제출 결과 보고** — 같은 `txHash` 재보고는 no-op 이다.\n- **Sync Solution VASPs** — 이미 실행 중이면 `SYNC_IN_PROGRESS`(409). 결과는 항상 최신 목록으로 수렴한다.\n- **Activate / Deactivate VASP** — 이미 그 상태면 그대로 `200`. Activate 에 이미 다른 `vaspId` 가 매핑돼 있으면 `CONFLICT`(409).\n\n## 이벤트 (메시지 큐)\n\n비동기 확인의 결과 도착(대상 아님·승인·거절·PENDING 만료)은 이 HTTP API 가 아니라 **메시지 큐 이벤트**로 온다.\n\n- **토픽**: `compliance` · 파티션 키 = `accountId` (기존 큐 규칙과 동일)\n- 모든 솔루션이 이 한 경로로 통일된다 — Create 는 항상 PENDING 접수, 최종 verdict 와 travelRuleMessage(값 또는 null)가 이 이벤트로 함께 온다. DAW-CORE는 Get 없이 이벤트만으로 제출한다(값 있으면 동봉). 이벤트를 놓쳐도 Get 이 복구하고, 그마저 놓쳐도 PENDING 만료 규칙이 흐름을 끝낸다.\n- **PENDING 만료의 주인은 이 서비스** — 솔루션별 시간 규칙([트래블룰 4장](../../트래블룰/설계/04-policy-and-timing.md))을 아는 쪽이 만료를 가려 `REJECTED` 로 발행한다.\n\n메시지 본문은 JSON 그대로다 — HTTP 응답의 `data`/`meta` 봉투를 쓰지 않는다. 필드 정의는 [SettledEvent](#schema-SettledEvent) 타입.\n\n```json\n{\n  \"type\": \"withdrawal-check.settled\",\n  \"checkId\": \"chk_01J9Z\",\n  \"externalTxId\": \"WD-000123\",\n  \"accountId\": \"acct_01H8X\",\n  \"verdict\": \"APPROVED\",\n  \"travelRuleMessage\": \"enc_9f3a...\",\n  \"settledAt\": \"2026-07-16T04:05:06.789Z\"\n}\n```\n",
    "x-appendix": "## 미확정\n\n- **원화 임계 판단의 위치** — 벤더 지원 여부 미확정([트래블룰 14장](../../트래블룰/설계/14-fireblocks-questions.md) 문의 1). 어느 쪽이든 이 API 표면(verdict)은 바뀌지 않는다.\n- **Evidence.kind 목록** — 솔루션별 증적 종류 확정 후 enum 으로 못 박는다.\n- **인증 방식** — 서비스 간 인증(DAW-CORE↔컴플라이언스·내부 API)은 인프라 결정과 함께 확정.\n- **사전 검증 기록 대조 규칙** — 키 조합(txHash 우선 · 주소·금액 일치 범위)은 구현 전 확정.\n- **Enclave 콜백 페이로드** — 수신 질문에 어떤 필드가 평문으로 오는지(실명 외 항목 포함 여부) — Enclave 설치 검증 때 확정.\n"
  },
  "servers": [
    {
      "url": "https://{baseUrl}/compliance/travel-rule",
      "description": "컴플라이언스 API 베이스 URL",
      "variables": {
        "baseUrl": {
          "default": "api.example.com"
        }
      }
    }
  ],
  "tags": [
    {
      "name": "VASPs (운영 · Admin)",
      "description": "VASP 정체·거래 허용은 DAW-CORE의 VASP 마스터(daw_vasp_m)에 있다 — 출금 화면의 거래소 목록도 DAW-CORE가 거기서 자체 제공한다. 컴플라이언스 운영 API 는 솔루션 목록 동기화와 VASP 온보딩(목록 조회 → 활성화/해제)을 맡고, 모두 Admin(코어) 백엔드가 호출한다. 컴플라이언스가 아는 VASP 는 각자 안정 id(cmplVaspId)를 갖고, 활성화 때 코어 vaspId 와 매핑된다(설계 2장)."
    },
    {
      "name": "Withdrawal Checks"
    },
    {
      "name": "Deposit Checks"
    },
    {
      "name": "인바운드 내부 API — DAW-CORE가 구현, 컴플라이언스가 호출",
      "x-section": true,
      "description": "상대 VASP 의 사전 검증 요청(수신 질문)에 답하기 위한 계약. 수신 기록의 보관·tx hash 갱신은 서비스 내부라 DAW-CORE API 가 없다. 응답 형식·에러 형식은 위 공통 규약과 동일하다."
    }
  ],
  "paths": {
    "/vasps/sync": {
      "post": {
        "tags": [
          "VASPs (운영 · Admin)"
        ],
        "summary": "Sync Solution VASPs",
        "operationId": "syncSolutionVasps",
        "description": "솔루션 VASP 목록 동기화를 즉시 실행한다 — 주기 배치와 같은 일을 지금 한다. 신규 항목엔 `cmplVaspId` 를 발급하고, 이미 있는 항목은 이름·트래블룰 요청을 보낼 수 있는지만 갱신하며 **매핑·활성화는 보존**한다(UPSERT). 목록에서 빠진 항목은 지우지 않고 \"트래블룰 요청을 보낼 수 없음\"으로 표시한다.\n이미 실행 중이면 `SYNC_IN_PROGRESS`(409).\n\n동기 실행이다 — 목록 규모가 커져 오래 걸리게 되면 접수(202)·결과 조회로 바꾼다(구현 때 확정).\n",
        "responses": {
          "200": {
            "description": "동기화 완료",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/components/schemas/SyncResult"
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
                "example": {
                  "data": {
                    "addedCount": 2,
                    "changedCount": 5,
                    "unreachableCount": 0,
                    "syncedAt": "2026-07-16T04:05:06.789Z"
                  },
                  "meta": {
                    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
                  }
                }
              }
            }
          },
          "409": {
            "description": "`SYNC_IN_PROGRESS` — 목록 동기화가 이미 실행 중"
          }
        }
      }
    },
    "/vasps": {
      "get": {
        "tags": [
          "VASPs (운영 · Admin)"
        ],
        "summary": "List VASPs",
        "operationId": "listVasps",
        "description": "Admin 이 온보딩 대상을 고르는 목록이다 — 컴플라이언스가 아는 VASP 를 `cmplVaspId` 와 함께 준다. 활성화 여부·매핑된 `vaspId` 도 실려, 이미 온보딩된 것과 아닌 것을 가른다. **호출 주체는 Admin 백엔드다.**\n",
        "parameters": [
          {
            "name": "query",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            },
            "description": "VASP 이름 부분 일치 (없으면 전체)",
            "example": "upbit"
          }
        ],
        "responses": {
          "200": {
            "description": "VASP 목록",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/VaspListItem"
                      }
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
                "example": {
                  "data": [
                    {
                      "cmplVaspId": "cvasp_01H9",
                      "name": "Upbit",
                      "solution": "VERIFYVASP",
                      "reachable": true,
                      "active": true,
                      "vaspId": "VASP-0001"
                    }
                  ],
                  "meta": {
                    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/vasps/{cmplVaspId}/activate": {
      "parameters": [
        {
          "$ref": "#/components/parameters/CmplVaspId"
        }
      ],
      "post": {
        "tags": [
          "VASPs (운영 · Admin)"
        ],
        "summary": "Activate VASP",
        "operationId": "activateVasp",
        "description": "코어가 만든 `vaspId` 를 이 VASP 항목에 **매핑하고 활성화**한다 — 이미 매핑돼 있으면 활성화만 한다. **호출 주체는 Admin(코어) 백엔드다** (Admin 이 목록에서 VASP 를 골라 활성화하면, 코어가 `vaspId` 를 만들어 이 API 를 부른다).\n",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "vaspId": {
                    "type": "string",
                    "description": "코어가 발급한 VASP id — 이 항목에 매핑한다. 이미 다른 값이 매핑돼 있으면 `CONFLICT`(409)"
                  }
                },
                "required": [
                  "vaspId"
                ]
              },
              "example": {
                "vaspId": "VASP-0001"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "매핑·활성화됨 (이미 그 상태여도 `200` — 멱등)"
          },
          "404": {
            "description": "`NOT_FOUND` — 없는 `cmplVaspId`"
          }
        }
      }
    },
    "/vasps/{cmplVaspId}/deactivate": {
      "parameters": [
        {
          "$ref": "#/components/parameters/CmplVaspId"
        }
      ],
      "post": {
        "tags": [
          "VASPs (운영 · Admin)"
        ],
        "summary": "Deactivate VASP",
        "operationId": "deactivateVasp",
        "description": "활성화를 끈다 — 매핑(`vaspId`)은 남긴다. 재활성화하면 그대로 돌아온다. 해제 후에는 그 VASP 로의 새 출금 확인이 열리지 않는다. **호출 주체는 Admin 백엔드다.**\n",
        "responses": {
          "200": {
            "description": "해제됨 (이미 해제 상태여도 `200` — 멱등)"
          },
          "404": {
            "description": "`NOT_FOUND` — 없는 `cmplVaspId`"
          }
        }
      }
    },
    "/withdrawal-checks": {
      "post": {
        "tags": [
          "Withdrawal Checks"
        ],
        "summary": "Create Withdrawal Check",
        "operationId": "createWithdrawalCheck",
        "description": "출금 한 건의 트래블룰 확인을 시작한다. **거래소 선택 출금 전용이다** — 개인지갑 출금은 등록 지갑 확인을 DAW-CORE가 자체 처리하므로 이 API 를 부르지 않는다. **항상 `PENDING`(접수)으로 답하고, 최종 verdict 는 `compliance` 큐 이벤트로 알린다** — 동기 솔루션(CODE·Notabene)도 \"즉시 완료되는 비동기\"로 접어(이벤트가 거의 즉시 도착) DAW-CORE가 한 경로만 타게 한다.\n수취 거래소는 `beneficiary.vaspId`(DAW-CORE VASP 마스터의 식별자)로 지목한다 — 컴플라이언스가 이 값으로 연결된 솔루션 항목을 찾아 라우팅한다.\n`externalTxId` 로 멱등 — 같은 키 재요청은 기존 check 를 돌려준다.\n트래블룰 요청을 보낼 수 있는 솔루션에 연결되지 않은 `vaspId` 가 오면 `VALIDATION_FAILED`(400) — 거래 허용·솔루션 연결은 출금 화면에 오르기 전에 서 있어야 하는 값이다.\n",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "externalTxId": {
                    "type": "string",
                    "description": "DAW-CORE의 출금 건 식별자 — 멱등 키. 블록체인 매니저 제출에 쓰는 키와 같은 것 — 한 출금을 양쪽에서 같은 키로 추적한다"
                  },
                  "accountId": {
                    "type": "string",
                    "description": "계정 ID — 결과 이벤트의 큐 파티션 키"
                  },
                  "asset": {
                    "type": "string",
                    "description": "자산 심볼"
                  },
                  "amount": {
                    "type": "string",
                    "description": "금액(문자열)"
                  },
                  "destinationAddress": {
                    "type": "string",
                    "description": "수취 주소"
                  },
                  "beneficiary": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Beneficiary"
                      }
                    ],
                    "description": "수취인 정보 — 트래블룰 대상 거래만. 판별 결과 필요한데 없으면 `VALIDATION_FAILED` 에 부족 필드를 담아 돌려준다"
                  }
                },
                "required": [
                  "externalTxId",
                  "accountId",
                  "asset",
                  "amount",
                  "destinationAddress"
                ]
              },
              "example": {
                "externalTxId": "WD-000123",
                "accountId": "acct_01H8X",
                "asset": "ETH",
                "amount": "1.5",
                "destinationAddress": "0x896B...0b9b",
                "beneficiary": {
                  "name": "Bruce Wayne",
                  "accountNumber": "0x896B...0b9b",
                  "vaspId": "VASP-0001"
                }
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "접수됨 · check 생성 (멱등 재요청이면 `200`)",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/components/schemas/WithdrawalCheck"
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
                "example": {
                  "data": {
                    "checkId": "chk_01J9Z",
                    "externalTxId": "WD-000123",
                    "accountId": "acct_01H8X",
                    "verdict": "PENDING",
                    "travelRuleMessage": null,
                    "evidence": null
                  },
                  "meta": {
                    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
                  }
                }
              }
            }
          },
          "409": {
            "description": "같은 `externalTxId` 에 다른 본문"
          }
        }
      }
    },
    "/withdrawal-checks/{checkId}": {
      "parameters": [
        {
          "$ref": "#/components/parameters/CheckId"
        }
      ],
      "get": {
        "tags": [
          "Withdrawal Checks"
        ],
        "summary": "Get Withdrawal Check",
        "operationId": "getWithdrawalCheck",
        "description": "이벤트 유실·재기동 **복구 전용** — 정상 흐름에서는 호출하지 않는다. settled 이벤트가 verdict·travelRuleMessage 를 다 실어 오므로 제출은 이벤트만으로 된다. 이벤트를 놓쳤거나 재기동으로 소비 상태가 불확실할 때 같은 내용을 다시 읽는다.\n",
        "responses": {
          "200": {
            "description": "check 상태",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/components/schemas/WithdrawalCheck"
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
                "example": {
                  "data": {
                    "checkId": "chk_01J9Z",
                    "externalTxId": "WD-000123",
                    "accountId": "acct_01H8X",
                    "verdict": "APPROVED",
                    "travelRuleMessage": null,
                    "evidence": {
                      "kind": "PRE_APPROVAL",
                      "ref": "uuid-...",
                      "settledAt": "2026-07-14T04:05:06.789Z"
                    }
                  },
                  "meta": {
                    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
                  }
                }
              }
            }
          },
          "404": {
            "description": "`CHECK_NOT_FOUND`"
          }
        }
      }
    },
    "/withdrawal-checks/{checkId}/report": {
      "parameters": [
        {
          "$ref": "#/components/parameters/CheckId"
        }
      ],
      "post": {
        "tags": [
          "Withdrawal Checks"
        ],
        "summary": "Report Withdrawal Result",
        "operationId": "reportWithdrawalResult",
        "description": "온체인 제출 후 tx hash 를 보고한다. 서비스는 이 해시를 솔루션에 알려 사전 검증과 실 거래를 잇는다 — 그럴 필요가 없는 솔루션이면 no-op 이고, DAW-CORE는 솔루션 구분 없이 항상 호출한다.\n실패는 재시도 대상일 뿐 출금 흐름을 막지 않는다.\n",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "txHash": {
                    "type": "string",
                    "description": "온체인 거래해시"
                  }
                },
                "required": [
                  "txHash"
                ]
              },
              "example": {
                "txHash": "0xabc..."
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "접수",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "object",
                      "properties": {
                        "checkId": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "checkId"
                      ]
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
                "example": {
                  "data": {
                    "checkId": "chk_01J9Z"
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
    },
    "/deposit-checks": {
      "post": {
        "tags": [
          "Deposit Checks"
        ],
        "summary": "Create Deposit Check",
        "operationId": "createDepositCheck",
        "description": "입금 한 건의 트래블룰 확인. 서비스가 **보관 중인 사전 검증 기록과 대조**하고, 대조가 안 되면 능동 조회(보고 미수신 건 — Check Transaction Status · 기록 자체가 없으면 — TXID 역추적)까지 안에서 처리해 결과만 돌려준다. 귀속 판단·가용 전이는 DAW-CORE 몫이다.\n",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "sourceAddress": {
                    "type": "string",
                    "description": "입금 source 주소"
                  },
                  "asset": {
                    "type": "string",
                    "description": "자산 심볼"
                  },
                  "amount": {
                    "type": "string",
                    "description": "금액(문자열)"
                  },
                  "txHash": {
                    "type": "string",
                    "description": "온체인 tx"
                  }
                },
                "required": [
                  "sourceAddress",
                  "asset",
                  "amount",
                  "txHash"
                ]
              },
              "example": {
                "sourceAddress": "0x1a2b...",
                "asset": "ETH",
                "amount": "1.5",
                "txHash": "0xdef..."
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "판별 결과",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/components/schemas/DepositCheckResult"
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
                "example": {
                  "data": {
                    "senderVerified": "VERIFIED",
                    "counterpartyName": "Upbit"
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
    },
    "/internal/compliance/address-attribution": {
      "post": {
        "tags": [
          "인바운드 내부 API — DAW-CORE가 구현, 컴플라이언스가 호출"
        ],
        "summary": "Verify Address Attribution",
        "operationId": "verifyAddressAttribution",
        "servers": [
          {
            "url": "https://{walletBaseUrl}",
            "variables": {
              "walletBaseUrl": {
                "default": "core.example.com"
              }
            }
          }
        ],
        "description": "\"이 주소가 너희 고객 아무개 소유인가\" — 주소↔계정은 DAW-CORE가 답하고, 실명 대조는 그 데이터를 가진 서비스에 이어 조회한 결과를 합쳐 돌려준다.\n\n**요구사항**\n\n- **확정 답만 준다** — 실명 데이터 서비스 장애 등으로 확인이 불가하면 `owned: false` 가 아니라 **에러(`INTERNAL` 등)로 응답**한다. `false` 는 상대에게 거절로 회신되는 확정 답이다.\n- **무저장** — `name` 은 대조에만 쓰고 저장·로그에 남기지 않는다 (PII).\n- **응답 시간** — 상대 VASP 의 동기 왕복이 이 응답을 기다린다. 제한 값은 미정([트래블룰 4장](../../트래블룰/설계/04-policy-and-timing.md) 국내 시간 규칙과 함께).\n- **대조 항목의 확장** — 이름 외 항목(생년월일 등)이 요구되는지는 Enclave 콜백 페이로드 확인 후 확정(아래 미확정).\n",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "address": {
                    "type": "string",
                    "description": "확인 대상 주소"
                  },
                  "asset": {
                    "type": "string",
                    "description": "자산 심볼 — 같은 주소 문자열이 여러 체인에 있을 수 있어 체인 특정에 쓴다"
                  },
                  "name": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "상대가 대조를 요청한 실명 (있으면)"
                  }
                },
                "required": [
                  "address",
                  "asset"
                ]
              },
              "example": {
                "address": "0x896B...0b9b",
                "asset": "ETH",
                "name": "Bruce Wayne"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "귀속·실명 대조 결과",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/components/schemas/AddressAttribution"
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
                "example": {
                  "data": {
                    "owned": true,
                    "accountId": "acct_01H8X",
                    "nameMatched": true
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
    }
  },
  "components": {
    "parameters": {
      "CmplVaspId": {
        "name": "cmplVaspId",
        "in": "path",
        "required": true,
        "schema": {
          "type": "string"
        },
        "description": "컴플라이언스 발급 안정 id",
        "example": "cvasp_01H9"
      },
      "CheckId": {
        "name": "checkId",
        "in": "path",
        "required": true,
        "schema": {
          "type": "string"
        },
        "description": "check 식별자",
        "example": "chk_01J9Z"
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
      "ErrorBody": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "에러 코드 (공통 규약 표 참조)",
            "example": "CHECK_NOT_FOUND"
          },
          "message": {
            "type": "string",
            "description": "사람이 읽는 설명 — 분기 판단은 `code` 로 한다",
            "example": "withdrawal check not found"
          }
        },
        "required": [
          "code",
          "message"
        ]
      },
      "TrVerdict": {
        "type": "string",
        "description": "verdict 의 값 — 솔루션 원어를 이 넷으로 번역한다 ([트래블룰 8장](../../트래블룰/설계/08-gate-port.md)).",
        "enum": [
          "NOT_REQUIRED",
          "APPROVED",
          "PENDING",
          "REJECTED"
        ],
        "x-enumDescriptions": {
          "NOT_REQUIRED": "트래블룰 대상 아님 — 한국 기준(원화 100만원) 미만이거나 솔루션이 수취를 개인지갑으로 판별",
          "APPROVED": "통과 — 정보 교환·검증이 승인됐다",
          "PENDING": "아직 결과가 없다 — 결과가 나면 큐 이벤트(`withdrawal-check.settled`)로 알린다",
          "REJECTED": "거절 — 상대 거절 또는 PENDING 만료"
        }
      },
      "Beneficiary": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "수취인 이름"
          },
          "accountNumber": {
            "type": "string",
            "description": "수취 계좌(주소)"
          },
          "vaspId": {
            "type": "string",
            "description": "수취 거래소 — DAW-CORE VASP 마스터(`daw_vasp_m`)의 식별자. 출금 화면의 거래소 목록에서 고른 값. 컴플라이언스가 이 값으로 솔루션 라우팅"
          }
        },
        "required": [
          "name",
          "accountNumber",
          "vaspId"
        ]
      },
      "WithdrawalCheck": {
        "type": "object",
        "properties": {
          "checkId": {
            "type": "string",
            "description": "check 식별자 — 서비스가 발급"
          },
          "externalTxId": {
            "type": "string",
            "description": "DAW-CORE의 출금 건 식별자 (멱등 키)"
          },
          "accountId": {
            "type": "string",
            "description": "계정 ID"
          },
          "verdict": {
            "allOf": [
              {
                "$ref": "#/components/schemas/TrVerdict"
              }
            ],
            "description": "현재 verdict"
          },
          "travelRuleMessage": {
            "type": [
              "string",
              "null"
            ],
            "description": "제출 시 실어 보내는 암호화 메시지 — Notabene 경로만 값, 없는 솔루션은 null. DAW-CORE는 내용을 해석하지 않고 블록체인 매니저 제출의 `travelRule` 로 그대로 전달한다"
          },
          "evidence": {
            "oneOf": [
              {
                "$ref": "#/components/schemas/Evidence"
              },
              {
                "type": "null"
              }
            ],
            "description": "통과 증적 — 결과가 나기 전이면 null"
          }
        },
        "required": [
          "checkId",
          "externalTxId",
          "accountId",
          "verdict"
        ]
      },
      "Evidence": {
        "type": "object",
        "properties": {
          "kind": {
            "type": "string",
            "description": "증적 종류 — 솔루션별 목록은 미확정(아래)"
          },
          "ref": {
            "type": "string",
            "description": "증적 참조 (예: 사전 승인 참조)"
          },
          "settledAt": {
            "type": "string",
            "format": "date-time",
            "description": "결과가 난 시각"
          }
        },
        "required": [
          "kind",
          "ref",
          "settledAt"
        ]
      },
      "DepositCheckResult": {
        "type": "object",
        "properties": {
          "senderVerified": {
            "allOf": [
              {
                "$ref": "#/components/schemas/SenderVerified"
              }
            ],
            "description": "송신측 검증 유무 능동 조회 결과"
          },
          "counterpartyName": {
            "type": [
              "string",
              "null"
            ],
            "description": "식별된 송신 VASP (있으면)"
          }
        },
        "required": [
          "senderVerified"
        ]
      },
      "SenderVerified": {
        "type": "string",
        "description": "송신측 검증 유무 능동 조회 결과.",
        "enum": [
          "VERIFIED",
          "NOT_FOUND",
          "UNAVAILABLE"
        ],
        "x-enumDescriptions": {
          "VERIFIED": "송신측이 사전 검증을 했음이 확인됨 — 사전 검증 기록 대조 또는 능동 조회",
          "NOT_FOUND": "송신측에 검증 기록 없음",
          "UNAVAILABLE": "확인 불가 — 대조 기록이 없고 TXID 역추적도 안 되는 솔루션"
        }
      },
      "VaspListItem": {
        "type": "object",
        "properties": {
          "cmplVaspId": {
            "type": "string",
            "description": "컴플라이언스 발급 안정 id — 활성화/해제에 그대로 넘긴다"
          },
          "name": {
            "type": "string",
            "description": "솔루션이 알려준 표시명"
          },
          "solution": {
            "type": "string",
            "description": "어느 솔루션의 항목인가 — `VERIFYVASP` · `CODE_INTEROP` · `NOTABENE`"
          },
          "reachable": {
            "type": "boolean",
            "description": "마지막 동기화 기준, 이 VASP 로 트래블룰 요청을 보낼 수 있는지"
          },
          "active": {
            "type": "boolean",
            "description": "활성화 여부"
          },
          "vaspId": {
            "type": [
              "string",
              "null"
            ],
            "description": "매핑된 코어 VASP id — null 이면 아직 온보딩 전"
          }
        },
        "required": [
          "cmplVaspId",
          "name",
          "solution",
          "reachable",
          "active"
        ]
      },
      "SyncResult": {
        "type": "object",
        "properties": {
          "addedCount": {
            "type": "integer",
            "description": "새로 들어와 `cmplVaspId` 를 발급한 VASP 수"
          },
          "changedCount": {
            "type": "integer",
            "description": "이름·트래블룰 요청 가능 여부가 갱신된 VASP 수"
          },
          "unreachableCount": {
            "type": "integer",
            "description": "목록에서 빠져 \"트래블룰 요청 보낼 수 없음\"으로 표시한 수 (매핑·활성화는 보존)"
          },
          "syncedAt": {
            "type": "string",
            "format": "date-time",
            "description": "동기화 완료 시각"
          }
        },
        "required": [
          "addedCount",
          "changedCount",
          "unreachableCount",
          "syncedAt"
        ]
      },
      "AddressAttribution": {
        "type": "object",
        "properties": {
          "owned": {
            "type": "boolean",
            "description": "우리 고객의 주소인가 — `false` 는 \"아니다\"라는 확정 답"
          },
          "accountId": {
            "type": [
              "string",
              "null"
            ],
            "description": "귀속 계정"
          },
          "nameMatched": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "실명 대조 결과 — `name` 이 안 왔으면 null"
          }
        },
        "required": [
          "owned"
        ]
      },
      "SettledEvent": {
        "type": "object",
        "description": "큐로 오는 비동기 확인 결과 이벤트 (`compliance` 토픽). settled = check 가 최종 결과(NOT_REQUIRED·APPROVED·REJECTED — PENDING 만료는 REJECTED)에 도달해 더는 바뀌지 않는다.\n본문 JSON 예시는 위 \"이벤트 (메시지 큐)\" 절에 있다 — HTTP 응답의 `data`/`meta` 봉투를 쓰지 않는다. 전달은 at-least-once 라 재전달될 수 있다 — settled 는 check 당 한 번이므로 **소비 쪽 중복 제거 키는 `checkId`** 다.\n",
        "properties": {
          "type": {
            "type": "string",
            "description": "`withdrawal-check.settled`"
          },
          "checkId": {
            "type": "string",
            "description": "check 식별자"
          },
          "externalTxId": {
            "type": "string",
            "description": "DAW-CORE의 출금 건 식별자"
          },
          "accountId": {
            "type": "string",
            "description": "파티션 키"
          },
          "verdict": {
            "allOf": [
              {
                "$ref": "#/components/schemas/TrVerdict"
              }
            ],
            "description": "`NOT_REQUIRED` · `APPROVED` · `REJECTED` (PENDING 만료는 `REJECTED`)"
          },
          "travelRuleMessage": {
            "type": [
              "string",
              "null"
            ],
            "description": "제출에 실어 보낼 암호화 메시지 — Notabene 경로만 값, 없는 솔루션은 null. DAW-CORE는 내용을 해석하지 않고 블록체인 매니저 제출의 `travelRule` 로 그대로 실어 보낸다. 이 값이 이벤트에 실려 오므로 제출에 Get 이 필요 없다"
          },
          "settledAt": {
            "type": "string",
            "format": "date-time",
            "description": "결과가 난 시각"
          }
        },
        "required": [
          "type",
          "checkId",
          "externalTxId",
          "accountId",
          "verdict",
          "settledAt"
        ]
      }
    }
  }
};
