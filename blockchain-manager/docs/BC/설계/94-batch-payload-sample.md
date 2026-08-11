---
title: 배치 sweep payload 실물 샘플 (참고) — network records 알림 원문
status: Done
ref: 참고
---

고객 vault 두 곳의 잔액을 배치 컨트랙트가 한 거래로 옮긴 건이다. 제출·이동 내역·확정 세 시점의 알림 원문을 담는다.

## 알림 순서 — 배치 거래 한 건에 8건

| 시각 | 이벤트 | status | 그 단계에서 하는 일 |
|---|---|---|---|
| 08:42:39 | `transaction.created` | `SUBMITTED` | 제출 접수. outgoing 거래의 첫 단계 |
| 08:42:40 | `transaction.status.updated` | `PENDING_ENRICHMENT` | 콘솔 표시는 Pending Security Screening — dApp Protection 검사. **여기서 걸려도 거래가 실패하지는 않는다** |
| 08:42:41 | `transaction.status.updated` | `QUEUED` | 서명자에게 보내기 전 대기 |
| 08:42:43 | `transaction.status.updated` | `PENDING_SIGNATURE` | 지정 서명자의 서명 대기. **2시간 넘으면 실패** |
| 08:42:45 | `transaction.status.updated` | `BROADCASTING` | 체인으로 송신 중 |
| 08:42:45 | `transaction.status.updated` | `CONFIRMING` | 컨펌 대기 (`PENDING_BLOCKCHAIN_CONFIRMATIONS`) |
| 08:43:16 | **`transaction.network_records.processing_completed`** | `CONFIRMING` | 이동 내역 확정 — 아직 컨펌 대기 중이다 |
| 08:43:25 | `transaction.status.updated` | `COMPLETED` | 확정 (`CONFIRMED`) |

단계 정의는 벤더 문서 [Primary transaction statuses](https://support.fireblocks.io/hc/en-us/articles/4407808817042) 기준이다. 전체 17개 중 이번 거래가 지난 것은 위 일곱 개다 — AML 스크리닝(`PENDING_AML_SCREENING`)과 승인 대기(`PENDING_AUTHORIZATION`)는 지나지 않았다.

- **우리가 낸 거래는 `created` 가 `SUBMITTED` 로 시작한다.** 입금 알림은 `created` 가 이미 `CONFIRMING`+`txHash` 를 담고 오는데([입금 샘플](96-payload-sample.md)), 제출한 거래는 벤더 내부 단계까지 전부 알림으로 온다 — 여기서는 6초 안에 다섯 단계.
- 한 배치 sweep 이 알림 8건을 만든다. 이동 건수를 늘렸을 때도 8건인지는 확인하지 않았다.

## 제출 — `transaction.created`

```json
{
    "id": "c92c16be-9652-433d-aeeb-c7d6a86af5c9",
    "data": {
        "id": "d98a64ba-3d6f-407a-96e8-e1746fc087a8",
        "fee": -1,
        "note": "approve-pull \ubc30\uce58 \uc2e4\uce21 \u2014 batchSweep 2 leg",
        "amount": 0,
        "source": {
            "id": "84",
            "name": "approve-pull-operator",
            "type": "VAULT_ACCOUNT",
            "subType": ""
        },
        "status": "SUBMITTED",
        "txHash": "",
        "assetId": "ETH_TEST5",
        "feeInfo": {},
        "signedBy": [],
        "amountUSD": null,
        "blockInfo": {},
        "createdAt": 1786351358653,
        "createdBy": "a040583c-465a-453f-8b02-bef2f3e97c48",
        "netAmount": 0,
        "operation": "CONTRACT_CALL",
        "subStatus": "",
        "amountInfo": {
            "amount": "0",
            "netAmount": "0",
            "requestedAmount": "0"
        },
        "networkFee": -1,
        "rejectedBy": "",
        "addressType": "",
        "destination": {
            "id": null,
            "name": "N/A",
            "type": "ONE_TIME_ADDRESS",
            "subType": ""
        },
        "feeCurrency": "ETH_TEST5",
        "lastUpdated": 1786351358653,
        "exchangeTxId": "",
        "externalTxId": "approve-pull-batchsweep-1",
        "sourceAddress": "",
        "destinationTag": "",
        "extraParameters": {
            "contractCallData": "0xd128dea1000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000429cdea1dc75bbda4e006675abe5f773e299dddb000000000000000000000000b6df2ad4d9fb89529874636276af2e367cf091d2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000ad78ebc5ac620000000000000000000000000000000000000000000000000000821ab0d4414980000"
        },
        "requestedAmount": 0,
        "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9",
        "destinationAddressDescription": ""
    },
    "createdAt": 1786351358809,
    "eventType": "transaction.created",
    "webhookId": "ac8bf7d0-1dff-499a-81f4-3a87719f3b3c",
    "resourceId": "d98a64ba-3d6f-407a-96e8-e1746fc087a8",
    "workspaceId": "f0e016ae-d9cc-510d-b66d-0c30dd520503"
}
```

체인에 올라가기 전이라 `txHash` 는 빈 문자열, `blockInfo`·`feeInfo` 는 빈 객체, `subStatus` 도 빈 문자열이다.

우리가 보낸 **`extraParameters.contractCallData` 가 그대로 실려 온다.** 어떤 주소에서 얼마씩 옮기라고 요청했는지가 이 값 안에 있어서 제출 시점 기록으로 쓸 수 있다.

## 이동 내역 — `transaction.network_records.processing_completed`

```json
{
  "id": "92487a53-de7d-4f68-be7c-f784c19c7b77",
  "data": {
    "id": "d98a64ba-3d6f-407a-96e8-e1746fc087a8",
    "fee": 0.000165085504896902,
    "note": "approve-pull 배치 실측 — batchSweep 2 leg",
    "nonce": "0",
    "amount": 0,
    "source": {
      "id": "84",
      "name": "approve-pull-operator",
      "type": "VAULT_ACCOUNT",
      "subType": ""
    },
    "status": "CONFIRMING",
    "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
    "assetId": "ETH_TEST5",
    "feeInfo": {
      "feeUSD": "0.3180895944144699703273265445886",
      "gasPrice": "1.9997517340000002",
      "networkFee": "0.000165085504896902"
    },
    "signedBy": [
      "a040583c-465a-453f-8b02-bef2f3e97c48"
    ],
    "amountUSD": 0,
    "assetType": "BASE_ASSET",
    "blockInfo": {
      "blockHash": "0x7f37231a8115054446eb94ba741821c95df5a0b36a6afc6c8952209fbc871e9e",
      "blockHeight": "11458115"
    },
    "createdAt": 1786351358653,
    "createdBy": "a040583c-465a-453f-8b02-bef2f3e97c48",
    "netAmount": 0,
    "operation": "CONTRACT_CALL",
    "subStatus": "PENDING_BLOCKCHAIN_CONFIRMATIONS",
    "amountInfo": {
      "amount": "0",
      "amountUSD": "0.00",
      "netAmount": "0",
      "requestedAmount": "0"
    },
    "networkFee": 0.000165085504896902,
    "rejectedBy": "",
    "addressType": "",
    "destination": {
      "id": null,
      "name": "N/A",
      "type": "ONE_TIME_ADDRESS",
      "subType": ""
    },
    "feeCurrency": "ETH_TEST5",
    "lastUpdated": 1786351364569,
    "exchangeTxId": "",
    "externalTxId": "approve-pull-batchsweep-1",
    "sourceAddress": "",
    "destinationTag": "",
    "networkRecords": [
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "",
          "name": "External",
          "type": "UNKNOWN",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "KBKRW_ETH_TEST5_6KCC",
        "amountUSD": null,
        "isDropped": false,
        "netAmount": "150",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": "12",
          "name": "kb-test-stablecoin-issuer",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "destinationAddress": "0x496E49e0d3F30336079FF0B921F98D77eb00055D"
      },
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "83",
          "name": "approve-pull-owner2",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "KBKRW_ETH_TEST5_6KCC",
        "amountUSD": null,
        "isDropped": false,
        "netAmount": "150",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": null,
          "name": "N/A",
          "type": "ONE_TIME_ADDRESS",
          "subType": ""
        },
        "destinationAddress": "0x496E49e0d3F30336079FF0B921F98D77eb00055D"
      },
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "83",
          "name": "approve-pull-owner2",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "KBKRW_ETH_TEST5_6KCC",
        "amountUSD": null,
        "isDropped": false,
        "netAmount": "0",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": null,
          "name": "N/A",
          "type": "ONE_TIME_ADDRESS",
          "subType": ""
        },
        "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9"
      },
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "",
          "name": "External",
          "type": "UNKNOWN",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "KBKRW_ETH_TEST5_6KCC",
        "amountUSD": null,
        "isDropped": false,
        "netAmount": "200",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": "12",
          "name": "kb-test-stablecoin-issuer",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "destinationAddress": "0x496E49e0d3F30336079FF0B921F98D77eb00055D"
      },
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "82",
          "name": "approve-pull-owner",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "KBKRW_ETH_TEST5_6KCC",
        "amountUSD": null,
        "isDropped": false,
        "netAmount": "200",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": null,
          "name": "N/A",
          "type": "ONE_TIME_ADDRESS",
          "subType": ""
        },
        "destinationAddress": "0x496E49e0d3F30336079FF0B921F98D77eb00055D"
      },
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "82",
          "name": "approve-pull-owner",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "KBKRW_ETH_TEST5_6KCC",
        "amountUSD": null,
        "isDropped": false,
        "netAmount": "0",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": null,
          "name": "N/A",
          "type": "ONE_TIME_ADDRESS",
          "subType": ""
        },
        "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9"
      },
      {
        "type": "CONTRACT_CALL",
        "source": {
          "id": "84",
          "name": "approve-pull-operator",
          "type": "VAULT_ACCOUNT",
          "subType": ""
        },
        "txHash": "0xbcc3e8160d06de3c673e0cb2d828304ba003ac44d7b187a8f6fcc5be8ae46201",
        "assetId": "ETH_TEST5",
        "amountUSD": "0",
        "isDropped": false,
        "netAmount": "0.000000000000000000",
        "networkFee": "0.000165085504896902",
        "destination": {
          "id": null,
          "name": "N/A",
          "type": "ONE_TIME_ADDRESS",
          "subType": ""
        },
        "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9"
      }
    ],
    "signedMessages": [],
    "extraParameters": {
      "contractCallData": "0xd128dea1000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000429cdea1dc75bbda4e006675abe5f773e299dddb000000000000000000000000b6df2ad4d9fb89529874636276af2e367cf091d2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000ad78ebc5ac620000000000000000000000000000000000000000000000000000821ab0d4414980000"
    },
    "requestedAmount": 0,
    "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9",
    "numOfConfirmations": 0,
    "destinationAddressDescription": ""
  },
  "createdAt": 1786351395388,
  "eventType": "transaction.network_records.processing_completed",
  "webhookId": "ac8bf7d0-1dff-499a-81f4-3a87719f3b3c",
  "resourceId": "d98a64ba-3d6f-407a-96e8-e1746fc087a8",
  "workspaceId": "f0e016ae-d9cc-510d-b66d-0c30dd520503"
}
```

## 확정 — `transaction.status.updated`

같은 거래라 위 이동 내역 알림과 나머지는 같고, **네 개만 다르다**:

| 필드 | 이동 내역 알림 | 확정 알림 |
|---|---|---|
| `data.status` | `CONFIRMING` | `COMPLETED` |
| `data.subStatus` | `PENDING_BLOCKCHAIN_CONFIRMATIONS` | `CONFIRMED` |
| `data.numOfConfirmations` | 0 | 3 |
| `data.lastUpdated` | 1786351364569 | 1786351404749 |

`networkRecords` 7개는 두 알림에 **똑같이** 들어 있다. 확정 알림에서 새로 붙는 이동 정보는 없다.

## 부분 실패한 배치 — `transaction.network_records.processing_completed`

vault 82(승인 잔여 100)에 200 을, vault 83(잔여 150)에 100 을 요청한 배치다. 82 의 이동만 실패했다.
레코드는 **4개**이고 **실패한 vault 82 는 어느 레코드에도 없다.**

```json
{
    "id": "0e9584b7-e50a-444a-8987-d6e41b2acc0c",
    "data": {
        "id": "647c2c5b-b2a0-49b3-8b46-d2300c34c8bb",
        "fee": 0.000152011774567585,
        "note": "approve-pull \ubd80\ubd84 \uc2e4\ud328 \uc7ac\ud604 \u2014 \ud55c \uac74\uc740 \uc2b9\uc778 \uc794\uc5ec \ucd08\uacfc",
        "nonce": "1",
        "amount": 0,
        "source": {
            "id": "84",
            "name": "approve-pull-operator",
            "type": "VAULT_ACCOUNT",
            "subType": ""
        },
        "status": "CONFIRMING",
        "txHash": "0xd1c257ebb16b65887a1371e633966249ac8c6987a451316efce39f468f94f3b4",
        "assetId": "ETH_TEST5",
        "feeInfo": {
            "feeUSD": "0.2844507992583298765401704667545",
            "gasPrice": "1.9997602389999998",
            "networkFee": "0.000152011774567585"
        },
        "signedBy": [
            "a040583c-465a-453f-8b02-bef2f3e97c48"
        ],
        "amountUSD": 0,
        "assetType": "BASE_ASSET",
        "blockInfo": {
            "blockHash": "0x34337febfef57fc7a4a4863fe9b916052a87bd05abf56b01f84f50e1550f6c54",
            "blockHeight": "11462654"
        },
        "createdAt": 1786407516290,
        "createdBy": "a040583c-465a-453f-8b02-bef2f3e97c48",
        "netAmount": 0,
        "operation": "CONTRACT_CALL",
        "subStatus": "PENDING_BLOCKCHAIN_CONFIRMATIONS",
        "amountInfo": {
            "amount": "0",
            "amountUSD": "0.00",
            "netAmount": "0",
            "requestedAmount": "0"
        },
        "networkFee": 0.000152011774567585,
        "rejectedBy": "",
        "addressType": "",
        "destination": {
            "id": null,
            "name": "N/A",
            "type": "ONE_TIME_ADDRESS",
            "subType": ""
        },
        "feeCurrency": "ETH_TEST5",
        "lastUpdated": 1786407520886,
        "exchangeTxId": "",
        "externalTxId": "approve-pull-partial-fail-1",
        "sourceAddress": "",
        "destinationTag": "",
        "networkRecords": [
            {
                "type": "CONTRACT_CALL",
                "source": {
                    "id": "",
                    "name": "External",
                    "type": "UNKNOWN",
                    "subType": ""
                },
                "txHash": "0xd1c257ebb16b65887a1371e633966249ac8c6987a451316efce39f468f94f3b4",
                "assetId": "KBKRW_ETH_TEST5_6KCC",
                "amountUSD": null,
                "isDropped": false,
                "netAmount": "100",
                "networkFee": "0.000152011774567585",
                "destination": {
                    "id": "12",
                    "name": "kb-test-stablecoin-issuer",
                    "type": "VAULT_ACCOUNT",
                    "subType": ""
                },
                "destinationAddress": "0x496E49e0d3F30336079FF0B921F98D77eb00055D"
            },
            {
                "type": "CONTRACT_CALL",
                "source": {
                    "id": "83",
                    "name": "approve-pull-owner2",
                    "type": "VAULT_ACCOUNT",
                    "subType": ""
                },
                "txHash": "0xd1c257ebb16b65887a1371e633966249ac8c6987a451316efce39f468f94f3b4",
                "assetId": "KBKRW_ETH_TEST5_6KCC",
                "amountUSD": null,
                "isDropped": false,
                "netAmount": "100",
                "networkFee": "0.000152011774567585",
                "destination": {
                    "id": null,
                    "name": "N/A",
                    "type": "ONE_TIME_ADDRESS",
                    "subType": ""
                },
                "destinationAddress": "0x496E49e0d3F30336079FF0B921F98D77eb00055D"
            },
            {
                "type": "CONTRACT_CALL",
                "source": {
                    "id": "83",
                    "name": "approve-pull-owner2",
                    "type": "VAULT_ACCOUNT",
                    "subType": ""
                },
                "txHash": "0xd1c257ebb16b65887a1371e633966249ac8c6987a451316efce39f468f94f3b4",
                "assetId": "KBKRW_ETH_TEST5_6KCC",
                "amountUSD": null,
                "isDropped": false,
                "netAmount": "0",
                "networkFee": "0.000152011774567585",
                "destination": {
                    "id": null,
                    "name": "N/A",
                    "type": "ONE_TIME_ADDRESS",
                    "subType": ""
                },
                "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9"
            },
            {
                "type": "CONTRACT_CALL",
                "source": {
                    "id": "84",
                    "name": "approve-pull-operator",
                    "type": "VAULT_ACCOUNT",
                    "subType": ""
                },
                "txHash": "0xd1c257ebb16b65887a1371e633966249ac8c6987a451316efce39f468f94f3b4",
                "assetId": "ETH_TEST5",
                "amountUSD": "0",
                "isDropped": false,
                "netAmount": "0.000000000000000000",
                "networkFee": "0.000152011774567585",
                "destination": {
                    "id": null,
                    "name": "N/A",
                    "type": "ONE_TIME_ADDRESS",
                    "subType": ""
                },
                "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9"
            }
        ],
        "signedMessages": [],
        "extraParameters": {
            "contractCallData": "0xd128dea1000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000429cdea1dc75bbda4e006675abe5f773e299dddb000000000000000000000000b6df2ad4d9fb89529874636276af2e367cf091d2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000056bc75e2d63100000"
        },
        "requestedAmount": 0,
        "destinationAddress": "0xF95AFc896461a3eb7426714267eC6abb1cd6A1c9",
        "numOfConfirmations": 0,
        "destinationAddressDescription": ""
    },
    "createdAt": 1786407553926,
    "eventType": "transaction.network_records.processing_completed",
    "webhookId": "ac8bf7d0-1dff-499a-81f4-3a87719f3b3c",
    "resourceId": "647c2c5b-b2a0-49b3-8b46-d2300c34c8bb",
    "workspaceId": "f0e016ae-d9cc-510d-b66d-0c30dd520503"
}
```

같은 거래의 온체인 이벤트에는 실패가 남는다.

```
SweepLeg  from=0x429cdea1…(vault 82)  요청=200  성공=False
SweepLeg  from=0xb6df2ad4…(vault 83)  요청=100  성공=True
SweepDone 이동=2  성공=1
```

## 파싱할 때 걸리는 값

- **`netAmount` 는 문자열**이다(`"150"`). 금액은 이 값을 문자열로 읽는다.
- **`networkFee` 는 거래 전체 수수료가 레코드마다 복사돼 있다** — 레코드별로 더하면 수수료가 레코드 수만큼 부풀려진다.
- **레코드에는 `sourceAddress` 가 없다** — 상위 거래에만 있는 필드고, 레코드에는 `destinationAddress` 만 있다.
- 제출 시점의 `fee`·`networkFee` 는 `-1` 이다. 0 이 아니라 미정 표시다.

레코드를 어떻게 읽어 이동 건수와 원천 vault 를 복원하는지는 [PoC 결과보고](95-approve-pull-poc-result.md)에 있다.
