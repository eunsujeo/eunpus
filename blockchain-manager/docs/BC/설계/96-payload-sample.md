---
title: 웹훅 payload 실물 샘플 (참고) — v2 알림 원문
status: Done
ref: 참고
---

실측에서 실제로 받은 Fireblocks 웹훅 v2 알림 원문이다. 필드 이름을 확정한 근거다.

- **입금 두 건** — [수신 PoC](97-webhook-poc-result.md). 같은 입금 tx 의 감지·확정이다.
- **배치 sweep 한 건** — [approve 배치 sweep PoC](95-approve-pull-poc-result.md). 한 거래 아래 `networkRecords` 가 어떻게 담기는지 보여준다.

## 감지 — `transaction.created`

```json
{
  "id": "434e8c65-9489-4621-830f-eebe03cb2b3d",
  "resourceId": "f3339e5d-428e-4add-8018-631b972f3195",
  "webhookId": "ac8bf7d0-1dff-499a-81f4-3a87719f3b3c",
  "workspaceId": "f0e016ae-d9cc-510d-b66d-0c30dd520503",
  "eventType": "transaction.created",
  "createdAt": 1785738506511,
  "data": {
    "id": "f3339e5d-428e-4add-8018-631b972f3195",
    "createdAt": 1785738506296,
    "lastUpdated": 1785738506359,
    "assetId": "KBKRW_ETH_TEST5_6KCC",
    "source": {
      "id": "4b5351f6-9dcc-4322-a2dc-3e1cec34e549",
      "type": "INTERNAL_WALLET",
      "name": "mob",
      "subType": "Internal"
    },
    "destination": {
      "id": "23",
      "type": "VAULT_ACCOUNT",
      "name": "MOB_TEST",
      "subType": ""
    },
    "amount": 100,
    "fee": 0.000113517074303855,
    "networkFee": 0.000113517074303855,
    "netAmount": 100,
    "sourceAddress": "0xC05A705eFE3f89b3a7a6Ceb6D79107529Ce20f7C",
    "destinationAddress": "0x628501678d302023ca4555B678581917dF8D7636",
    "destinationAddressDescription": "",
    "destinationTag": "",
    "status": "CONFIRMING",
    "txHash": "0x18a64b1576aed8df84db0d259bf771929f66ebfeb877194fd2a679688e864b1f",
    "subStatus": "PENDING_BLOCKCHAIN_CONFIRMATIONS",
    "signedBy": [],
    "createdBy": "",
    "rejectedBy": "",
    "amountUSD": null,
    "addressType": "",
    "note": "",
    "exchangeTxId": "",
    "requestedAmount": 100,
    "feeCurrency": "ETH_TEST5",
    "operation": "TRANSFER",
    "customerRefId": null,
    "numOfConfirmations": 1,
    "amountInfo": {
      "amount": "100",
      "requestedAmount": "100",
      "netAmount": "100"
    },
    "feeInfo": {
      "networkFee": "0.000113517074303855",
      "gasPrice": "2.5916548550000003"
    },
    "destinations": [],
    "externalTxId": null,
    "blockInfo": {
      "blockHeight": "11408638",
      "blockHash": "0x9e52eb16d9118038998640c36ec7e3096e2c74c487c533eabeddc9f0507d4dd5"
    },
    "signedMessages": [],
    "index": 0,
    "assetType": "ERC20",
    "blockchainIndex": "164",
    "blockchainInfo": {
      "evmTransferType": "TOKEN"
    }
  }
}
```

## 확정 — `transaction.status.updated`

같은 tx 라 나머지 필드는 위와 같고, **일곱 개만 다르다**:

| 필드 | 감지 | 확정 |
|---|---|---|
| `id` (알림 id) | `434e8c65-…` | `284fb70a-…` — 알림마다 새로 발급된다 |
| `eventType` | `transaction.created` | `transaction.status.updated` |
| `createdAt` (알림) | 1785738506511 | 1785738526897 — 약 20초 뒤 |
| `data.lastUpdated` | 1785738506359 | 1785738526715 |
| `data.status` | `CONFIRMING` | `COMPLETED` |
| `data.subStatus` | `PENDING_BLOCKCHAIN_CONFIRMATIONS` | `CONFIRMED` |
| `data.numOfConfirmations` | 1 | 3 |

`resourceId`·`data.id`·`txHash`·`blockInfo`·금액·주소는 두 알림에서 동일하다.

## 읽을 점 — 입금 알림

- 최상위 **`id` 가 알림 id** (인박스 `noti_id`), **`data.id` 가 벤더 tx id** (`vndr_tx_id`). 최상위 `resourceId` 는 `data.id` 와 같은 값이다.
- **`transaction.created` 가 이미 `CONFIRMING` + `txHash` + `blockInfo` 를 담고 온다** — 입금은 체인에 올라간 뒤부터 알림이 시작한다.
- 금액은 `amount`(숫자)와 `amountInfo.amount`(문자열)로 둘 다 온다 — **문자열 쪽을 쓴다**(정밀도).
- `source.type` 이 `INTERNAL_WALLET`, `destination.type` 이 `VAULT_ACCOUNT` — 방향 판단에 쓰는 값이다.
- `externalTxId` 는 입금이라 `null`, `operation` 은 `TRANSFER`, `assetType` 은 `ERC20`.

원본 파일은 fbhook 저장소 `docs/payload-samples/` 에도 같이 있다.

## 배치 sweep — `transaction.network_records.processing_completed`

[approve 배치 sweep PoC](95-approve-pull-poc-result.md)에서 받은 알림 원문이다. 고객 vault 두 곳의 잔액을
배치 컨트랙트가 한 거래로 옮겼고, 그 이동이 `networkRecords` 에 어떻게 담기는지를 보여준다.

거래 생성 37초 뒤에 도착했고 그때 `data.status` 는 아직 `CONFIRMING` 이었다 — 확정을 기다리지 않는다.

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

### 읽을 점 — 배치 알림

- **상위 거래에는 이동 정보가 없다** — `amount` 0 · `assetId` 는 가스 자산(`ETH_TEST5`) · `sourceAddress` 는 빈 문자열. 실제 토큰 이동은 `networkRecords` 를 펼쳐야 나온다.
- **레코드마다 우리 vault 는 한쪽에만 채워진다.** 같은 이동이 받는 vault 관점(`source` 가 `UNKNOWN/External`)과 보내는 vault 관점(`destination` 이 `ONE_TIME_ADDRESS`)으로 두 번 들어온다. 주소는 양쪽 다 옴니버스 주소로 정확히 찍힌다.
- **레코드에 `sourceAddress` 가 없다** — 상위 거래에만 있는 필드다. 레코드에는 `destinationAddress` 만 있다.
- **`netAmount` 는 문자열**이다(`"150"`). 금액은 이 값을 문자열로 읽는다.
- **`networkFee` 는 거래 전체 수수료가 레코드마다 복사돼 있다** — 레코드별로 더하면 안 된다.
- 토큰이 실제로 움직이지 않은 관계(호출 대상 sweeper·가스)는 `netAmount` 가 `"0"` 이다.
