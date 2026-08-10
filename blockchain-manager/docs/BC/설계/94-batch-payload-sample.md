---
title: 배치 sweep payload 실물 샘플 (참고) — network records 알림 원문
status: Done
ref: 참고
---

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

## 읽을 점

- **상위 거래에는 이동 정보가 없다** — `amount` 0 · `assetId` 는 가스 자산(`ETH_TEST5`) · `sourceAddress` 는 빈 문자열. 실제 토큰 이동은 `networkRecords` 를 펼쳐야 나온다.
- **레코드마다 우리 vault 는 한쪽에만 채워진다.** 같은 이동이 받는 vault 관점(`source` 가 `UNKNOWN/External`)과 보내는 vault 관점(`destination` 이 `ONE_TIME_ADDRESS`)으로 두 번 들어온다. 주소는 양쪽 다 옴니버스 주소로 정확히 찍힌다.
- **레코드에 `sourceAddress` 가 없다** — 상위 거래에만 있는 필드다. 레코드에는 `destinationAddress` 만 있다.
- **`netAmount` 는 문자열**이다(`"150"`). 금액은 이 값을 문자열로 읽는다.
- **`networkFee` 는 거래 전체 수수료가 레코드마다 복사돼 있다** — 레코드별로 더하면 안 된다.
- 토큰이 실제로 움직이지 않은 관계(호출 대상 sweeper·가스)는 `netAmount` 가 `"0"` 이다.
