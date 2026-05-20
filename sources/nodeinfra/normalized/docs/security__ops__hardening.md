<!--
source_url: https://docs.nodeinfra.com/security/ops/hardening
path: /security/ops/hardening
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: RHEL · EnterpriseDB · 네트워크 3계층에 금융권 기준 하드닝을 적용합니다.
-->

# 시스템 하드닝

노드월렛 운영 환경은 Red Hat Enterprise Linux(RHEL)와 EnterpriseDB(EDB Advanced Server)를 기반으로 배포됩니다.
금융권 표준 리눅스 하드닝 · DB 감사 · 네트워크 격리를 조합하여 공격면을 최소화하고, 은행 IT 인증 체계(전자금융감독규정 · 보안기능확인서 · KCMVP)의 통제 요구사항을 충족합니다.

## OS 계층 (RHEL)

- **SELinux enforcing** — targeted 정책 기준 강제 접근 제어 (MAC)
- **auditd** — 커널 수준 감사 로그 (execve · open · 네트워크 · 권한 변경 이벤트)
- **fapolicyd** — 화이트리스트 기반 실행 제어. 승인된 바이너리·스크립트만 실행 가능
- **USBGuard** — 운영 서버에서 USB 저장장치 자동 차단
- **FIPS mode** — `fips-mode-setup --enable`로 시스템 전역 FIPS 140-3 암호 정책 적용
- **crypto-policies** — `DEFAULT:FIPS` 또는 `FUTURE` 정책으로 취약 알고리즘 차단
- **pam_faillock** — 로그인 실패 시 계정 락아웃
- **sudo + RBAC** — 운영자별 최소 권한 원칙

### 컴플라이언스 스캔

- **OpenSCAP + SCAP Security Guide** — DISA STIG · CIS RHEL Benchmark · PCI-DSS 프로파일로 정기 자동 스캔
- **Red Hat Insights** — 취약점 · 컴플라이언스 편차 · 미적용 패치 중앙 집계
- **AIDE** — 파일 무결성 기준선 관리, 변경 감지

## 서비스 실행 계층

각 노드월렛 서비스는 전용 시스템 계정으로 격리 실행되며, systemd 유닛 단위로 다음 하드닝이 기본 적용됩니다:

- **Non-root 실행** — 서비스별 독립 UID/GID, 로그인 셸 없음
- **NoNewPrivileges=yes** — 자식 프로세스의 권한 상승 차단 (setuid 무효화)
- **ProtectSystem=strict / ProtectHome=yes** — 쓰기 가능 경로 최소화
- **PrivateTmp=yes · PrivateDevices=yes** — /tmp · /dev 격리
- **CapabilityBoundingSet** — 불필요한 Linux capability 전부 드롭 (네트워크 서비스도 `CAP_NET_BIND_SERVICE`만 보존)
- **RestrictAddressFamilies** — 허용된 소켓 패밀리만 사용 (AF_INET · AF_INET6 · AF_UNIX)
- **SystemCallFilter** — seccomp 프로파일로 허용 시스템 콜 제한

## 데이터베이스 계층 (EnterpriseDB)

원장 · 감사 로그 · 정책 · 키 메타데이터는 모두 **EDB Advanced Server**에 저장되며, 금융권 표준 DB 보안 통제가 적용됩니다:

- **TDE (Transparent Data Encryption)** — AES-256 기반 저장 데이터 암호화
- **pgaudit / EDB Audit** — DDL · DML · 로그인 · 권한 변경 이벤트 영구 기록 → [감사 로그](/security/ops/audit-logs)
- **Row-level Security (RLS)** — 행 단위 접근 제어로 고객사 · 파티션별 데이터 격리
- **FIPS 모드** — DB 내부 암호 연산도 FIPS 검증 알고리즘만 사용
- **LDAP / Kerberos 인증** — 금융사 IAM과 통합, DB 사용자 중앙 관리
- **최소 권한 접속 계정** — 서비스별 전용 DB 롤, `CREATE`/`DROP` 권한 박탈
- **네트워크 격리** — DB 서버는 내부 DB 구역에만 배치, 응용 서버에서만 접근 허용

## 네트워크 계층

- **mTLS** — 내부 서비스 간 양방향 인증서 인증 → [신뢰 경계](/security/architecture/trust-boundaries)
- **firewalld / nftables zone** — 구역(DMZ · Core · DB)별 허용 포트 명시 → [망분리](/security/architecture/network-segregation)
- **인그레스 제한** — 외부 트래픽은 DMZ Coordinator :8084에만 도달
- **이그레스 제한** — 내부망에서 외부 인터넷 직접 통신 차단, Chain Relay 경유만 허용

RHEL 버전 · EnterpriseDB 에디션 · DISA STIG 프로파일 · 하드닝 자동화 파이프라인(Ansible · Satellite)은 고객사의 인증 요구사항과 기존 IT 표준에 맞춰 설계됩니다. 도입 시 노드인프라 팀과 협의하세요.
