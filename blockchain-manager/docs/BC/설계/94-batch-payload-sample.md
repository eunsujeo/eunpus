---
title: 배치 sweep payload 실물 샘플 (참고) — network records 알림 원문
status: Done
ref: 참고
---

[approve 배치 sweep PoC](95-approve-pull-poc-result.md)에서 받은 알림 원문이다. 고객 vault 두 곳의 잔액을
배치 컨트랙트가 한 거래로 옮겼고, 그 이동이 `networkRecords` 에 어떻게 담기는지를 보여준다.

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
- **이동 내역이 확정보다 먼저 온다.** `network_records` 알림이 `CONFIRMING` 과 `COMPLETED` 사이에 오고, 확정 9초 전이었다.
- 한 배치 sweep 이 알림 8건을 만든다. 이동 건수를 늘렸을 때도 8건인지는 확인하지 않았다.

## network records 알림 원문

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

## 읽을 점

- **상위 거래에는 이동 정보가 없다** — `amount` 0 · `assetId` 는 가스 자산(`ETH_TEST5`) · `sourceAddress` 는 빈 문자열. 실제 토큰 이동은 `networkRecords` 를 펼쳐야 나온다.
- **레코드마다 우리 vault 는 한쪽에만 채워진다.** 같은 이동이 받는 vault 관점(`source` 가 `UNKNOWN/External`)과 보내는 vault 관점(`destination` 이 `ONE_TIME_ADDRESS`)으로 두 번 들어온다. 주소는 양쪽 다 옴니버스 주소로 정확히 찍힌다.
- **레코드에 `sourceAddress` 가 없다** — 상위 거래에만 있는 필드다. 레코드에는 `destinationAddress` 만 있다.
- **`netAmount` 는 문자열**이다(`"150"`). 금액은 이 값을 문자열로 읽는다.
- **`networkFee` 는 거래 전체 수수료가 레코드마다 복사돼 있다** — 레코드별로 더하면 안 된다.
- 토큰이 실제로 움직이지 않은 관계(호출 대상 sweeper·가스)는 `netAmount` 가 `"0"` 이다.
