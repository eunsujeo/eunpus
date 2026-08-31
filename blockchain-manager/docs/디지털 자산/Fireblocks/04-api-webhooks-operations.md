---
title: Fireblocks — API·Webhooks v2
status: Done
date: 2026-08-19
view: grid
group: 플랫폼 기능
---

# API와 이벤트 처리

Fireblocks API 호출의 성공, webhook 수신과 체인 확정은 서로 다른 신호다.

## API 인증

API user는 API key와 RSA private key로 요청 JWT를 만든다. 이 private key는 자산 transaction에 참여하는 MPC share가 아니다.

## Webhooks v2 수신

[Fireblocks 마이그레이션 안내](https://developers.fireblocks.com/reference/webhook-v2-migration-guide)는 Webhooks v1의 지원 종료일을 2026년 6월 15일로 안내했다. v2는 전달 관측성과 재전송 기능을 제공한다.

[공식 webhook 검증 문서](https://developers.fireblocks.com/reference/validating-webhooks)는 `Fireblocks-Webhook-Signature`의 Detached JWS와 JWKS `kid` 기반 key lookup을 설명한다.

Webhook 검증에는 원문 body와 `Fireblocks-Webhook-Signature`의 Detached JWS, JWKS의 `kid`가 사용된다.

## Workspace freeze

Workspace freeze는 outgoing 활동을 제한하지만 incoming transfer는 계속 발생할 수 있다.
