# 사용자 ID 시스템 설계 문서

## 1. 개요

본 문서는 사용자 식별 시스템의 계층화된 ID 구조에 대한 설계 방안을 정리합니다. 이 설계는 시스템 안정성, 보안, 사용자 경험을 모두 고려하여 세 가지 레벨의 식별자를 사용합니다.

## 2. ID 계층 구조

사용자 식별을 위해 다음 세 가지 계층의 ID를 사용합니다:

### 2.1 내부 ID (시스템 참조용)
- **형식**: UUID 또는 ULID
- **길이**: UUID의 경우 36자, ULID의 경우 26자
- **용도**: 데이터베이스 키, 내부 시스템 참조
- **특성**: 사용자에게 노출되지 않음, 변경 불가

### 2.2 공개 핸들 (사용자 상호작용용)
- **형식**: `@username` 형식
- **길이**: 일반적으로 3-15자
- **용도**: 사용자 멘션, 프로필 URL, 사용자 검색
- **특성**: 사용자가 변경 가능, 시스템 내 고유함 보장

### 2.3 사용자 ID 코드 (고정 공개 식별자)
- **형식**: 20자 영숫자 조합
- **예시**: `a7x9f2r59d3kl5t7p4q8`
- **용도**: 핸들 변경 후 사용자 확인, API 참조, 계정 복구
- **특성**: 생성 시 고정, 변경 불가

## 3. 설계 근거

### 3.1 내부 ID 선택 (UUID vs ULID)

**UUID 선택 시 장점**:
- 표준화된 형식으로 대부분의 개발 환경에서 지원
- 완전한 무작위성으로 정보 유출 없음
- 기존 시스템과의 호환성 우수

**ULID 선택 시 장점**:
- 시간 순서로 정렬 가능
- UUID보다 짧은 형식(26자)
- 데이터베이스 인덱싱에 더 효율적
- 시간 정보 포함으로 가입 시점 추적 가능

**권장**: 시간 기반 정렬이 중요하다면 ULID, 그렇지 않다면 UUID v4

### 3.2 공개 핸들 형식

- 사용자가 선택 가능한 고유 식별자
- `@` 접두사를 통한 멘션 기능 지원
- 소셜 미디어 플랫폼에서 일반적으로 사용되는 친숙한 형식
- 마케팅, 브랜딩, 네트워킹 용도로 활용 가능

### 3.3 사용자 ID 코드 설계

- 충분한 무작위성을 가진 영숫자 조합
- 혼동되기 쉬운 문자(0/O, 1/l, I) 제외 권장
- 시각적 가독성을 위해 표시 시 구분자 사용 가능 (예: `a7x9-f2r5-9d3k-l5t7`)
- 대소문자 구분 없이 처리

## 4. 구현 고려사항

### 4.1 내부 ID 구현
- 데이터베이스 기본 키(Primary Key)로 사용
- 모든 내부 참조 및 관계에 이 ID 사용
- 로그 및 감사 추적에 활용

### 4.2 공개 핸들 구현
- 사용자 등록 시 유일성 검증
- 금지어 필터링 적용
- 핸들 변경 시 이전 핸들 일정 기간 예약 (사칭 방지)
- 대소문자 구분 없이 저장 및 검색 (표시는 사용자 선택 유지)

### 4.3 사용자 ID 코드 구현
- 사용자 생성 시 자동 생성되며 변경 불가
- 충돌 가능성을 최소화하기 위한 충분한 엔트로피 확보
- 사용자 프로필이나 설정 페이지에서 확인 가능하게 표시
- API 통합 시 공식 식별자로 사용

### 4.4 보안 고려사항
- 내부 ID는 외부에 노출되지 않도록 API 설계
- 사용자 ID 코드는 민감한 개인정보와 연결되지 않도록 설계
- 핸들 변경 시 적절한 인증 절차 적용
- ID 열거 공격 방지를 위한 적절한 제한 구현

## 5. 사용 시나리오

### 5.1 사용자 등록
1. 사용자가 회원가입 시 핸들(@username) 선택
2. 시스템이 내부적으로 UUID/ULID 생성
3. 시스템이 자동으로 사용자 ID 코드 생성
4. 세 가지 ID를 데이터베이스에 저장

### 5.2 사용자 핸들 변경
1. 사용자가 설정에서 새 핸들 요청
2. 시스템이 새 핸들의 유일성 검증
3. 핸들 변경 후에도 내부 ID와 사용자 ID 코드는 유지
4. 이전 핸들은 일정 기간 예약 처리

### 5.3 사용자 식별 및 인증
1. 일반 사용: 공개 핸들로 사용자 표시 및 상호작용
2. API 통합: 사용자 ID 코드로 안정적인 참조
3. 내부 처리: 내부 ID로 데이터베이스 쿼리 및 처리

## 6. 결론

이 세 계층 ID 구조는 시스템 안정성, 사용자 경험, 보안을 균형 있게 충족시킵니다. 내부 ID는 시스템 무결성을, 공개 핸들은 사용자 친화적 경험을, 사용자 ID 코드는 변경 불가능한 공개 식별자로서의 역할을 담당합니다. 이러한 구조는 소셜 미디어, 협업 도구, 게임 플랫폼 등 다양한 사용자 중심 서비스에 적합합니다.
