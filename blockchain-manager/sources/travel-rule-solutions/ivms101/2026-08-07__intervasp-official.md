# InterVASP IVMS101 공식 원문 확인 기록

- 공식 사이트: https://www.intervasp.org/
- 공식 표준 PDF: https://cdn.prod.website-files.com/648841abc97f28489cc3f2ce/6656e9c60c3029989dcd7431_IVMS101.2023%20interVASP%20data%20model%20standard.pdf
- 확인일: 2026-08-07
- 현재 배포본: IVMS 101.2023
- 사이트에 표시된 업데이트일: 2024-06-04
- PDF 표지 제목: IVMS101.2023 interVASP data model standard Issue 1 FINAL
- PDF 페이지 수: 57
- PDF SHA-256: 64bb38bdfaf65c46b80bc214f59444b11229cc8d1f7124d74059a02d6cfa5de2

## 출처 역할

이 자료를 IVMS101 필드명, 다중성, 데이터 타입, 제약 조건의 1차 출처로 사용한다. VerifyVASP 문서는 IVMS101을 해당 제품 API에 적용한 구현 가이드로 구분한다.

## 확인한 원문 구간

| PDF 구간 | 확인 내용 |
|---|---|
| §5.2.1~§5.2.13 | Person부터 IntermediaryVASP까지 전체 컴포넌트·필드·다중성·데이터타입 |
| §5.3 | Text 길이·정규식, 이름·주소·국가 식별 코드, Number, 음역 코드, payload 버전 코드 |
| §6 | Originator, Beneficiary, OriginatingVASP, BeneficiaryVASP, TransferPath, PayloadMetadata 엔티티 |
| §7 | 문자 체계와 음역 처리 |
| §8 | 개인·법인 business example |

## 정본 내부에서 확인된 불일치

- Address 구조표는 `townName [1..1]`, 개별 필드 설명은 `townName [0..1]`로 기재한다.
- Address 구조표는 `postcode`, 개별 필드 제목은 `postCode`로 기재한다.
- NaturalPersonNameID 구조와 필드 설명은 `naturalPersonNameIdentifierType`, business example은 `nameIdentifierType`을 사용한다.
- PayloadVersionCode 목록은 `101.2023`, business example은 `IVMS101.2023`을 사용한다.

공식 수정본 또는 공식 기계 판독 스키마가 확인되기 전까지 위 차이를 임의로 정규화하지 않는다.

## 보존 상태

이 파일은 공식 페이지와 PDF를 확인한 메타데이터 기록이다. 공식 PDF 바이너리 자체는 이 저장소에 보존하지 않았다. 따라서 PDF 원문 확인은 위 공식 URL과 SHA-256으로 수행한다.
