# 대시보드 및 기능 구현 계획

## 1. 웹사이트 구조

### 메인 사이트 구조
- `website.com/` (메인)
- `website.com/portfolio` (작업물)
- `website.com/commission` (커미션)
- `website.com/service/agreement` (이용약관) terms-of-service
- `website.com/service/privacy` (개인정보처리방침) privacy-policy

### 대시보드 구조
- `dashboard.website.com` (봇 대시보드)
  * 디스코드 OAuth2 로그인 사용
  * 봇 관련 기능 전용 대시보드

### 로그인 시스템
1. 메인 사이트
   - SNS 로그인 (구글 등) 지원
   - 일반 회원가입
   - 관리자 전용 로그인 별도 구현(기본 로그인 시스템에 관리자 계정 등록으로도 갠찬을 듯)

2. 대시보드
   - 디스코드 로그인 전용
   - 관리자는 메인 사이트 크레덴셜로도 접근 가능

### 장단점
- 장점:
  * 각 서비스에 최적화된 인증 방식 사용
  * 서비스별 독립적인 리소스 관리
  * 트래픽 분산 효과
- 단점:
  * 추가 SSL 인증서 필요
  * 서브도메인 DNS 설정 필요
  * 서버 비용 증가 가능성

## 2. 봇 기능 구현

### 서버 입장 시스템
1. 초대자 기반 메시지
```javascript
// DB 구조
{
    inviter_id: String,    // 초대한 유저 ID
    guild_id: String,      // 서버 ID
    invite_date: Date,     // 초대 날짜
    invite_count: Number   // 초대 횟수
}
```

2. 서버 기록 기반 메시지
```javascript
// DB 구조
{
    guild_id: String,          // 서버 ID
    first_join_date: Date,     // 최초 입장 날짜
    last_leave_date: Date,     // 마지막 퇴장 날짜
    join_count: Number,        // 총 입장 횟수
    current_status: Boolean    // 현재 입장 상태
}
```

3. 위의 2가지를 확인하여 하나의 메시지로 전송
메지시 내용은 추후 작성 필요

### 서버 설정 복원 시스템
```javascript
// 서버 설정 DB 구조
{
    guild_id: String,
    settings: {
        command_channels: [채널ID들],
        notification_settings: {
            twitch: { enabled: Boolean, channel_id: String },
            youtube: { enabled: Boolean, channel_id: String }
        },
        auto_roles: [역할ID들],
        welcome_message: {
            enabled: Boolean,
            channel_id: String,
            message: String
        },
        custom_prefix: String,
        permissions: {
            admin_roles: [역할ID들],
            mod_roles: [역할ID들]
        }
    },
    version: Number,
    last_updated: Date
}
```

## 3. 구현 예정 기능

### 대시보드 기능
- 봇 상태 모니터링
- 서버별 설정 관리
- 명령어 사용 통계
- 알림 설정 관리
- 사용자 권한 관리
- 구독 시스템(유료/결제 시스템 구현 필요)

### 봇 기능
- AI 채팅 시스템 (LLM/GPT)
- 스트리밍 플랫폼 알림
  * Twitch
  * CHZZK
  * YouTube
  * SOOP
- SNS 알림
  * Twitter(X)
  * Instagram
  * Bluesky
  * 그외 여러 SNS
- 서버 관리 기능
  * 자동 역할 부여 (???? 이건 어디서 읽어온거니?)
  * 환영 메시지 설정
  * 명령어 권한 관리
  * AutoMod/서버 활동 규정을 적용하여 자동 제재 기능
  * 서버내에서 유저 활동 로그 기능(추가 확인및 기획 필요)
  * 서버 입장 캡차인증(뷰봇, 광고계정 걸러내기용)

## 4. 필요한 패키지

### 웹사이트
- express 또는 next.js (웹 프레임워크)
- ejs 또는 react (프론트엔드)
- passport (인증)
- express-session (세션 관리)
- mongoose 또는 sqlite3 (데이터베이스)

### 봇 대시보드
- discord.js (디스코드 API)
- passport-discord (디스코드 OAuth2)
- express-session
- 데이터베이스 패키지

## 5. 호스팅 고려사항

### 서버 요구사항
- Node.js 실행 환경
- 24/7 안정적 가동
- SSL 인증서
- 최소 1GB RAM (권장 2GB 이상)
- 데이터베이스 지원

### 추천 호스팅 서비스
- AWS
- Google Cloud
- DigitalOcean
- Heroku
- Vercel (프론트엔드)
- MongoDB Atlas (데이터베이스)

### 필수 설정
- 환경 변수 관리
- 도메인 및 DNS 설정
- 백업 시스템
- 모니터링 도구

## 6. 개발 및 배포 프로세스

### Git 브랜치 전략
```
main (또는 master) ← 메인 버전
   ↑
development ← 개발 버전
   ↑
feature/* ← 새로운 기능 개발
```

### 환경 설정 분리
```
config/
  ├── config.main.json    # 메인 서버 설정
  ├── config.dev.json     # 개발 서버 설정
  └── config.local.json   # 로컬 테스트 설정
```

### 배포 구조
1. 코드 관리 (GitHub/GitLab)
```
Repository
├── main 브랜치 → 실제 서비스
└── development 브랜치 → 개발/테스트
```

2. 웹사이트 배포 (Cloudflare)
- 메인 사이트: `website.com`
  * main 브랜치에서 자동 배포
  * 프로덕션 환경 설정 사용
- 개발 버전: `dev.website.com`
  * development 브랜치에서 자동 배포
  * 개발 환경 설정 사용

3. 디스코드 봇 배포
- 메인 봇:
  * 호스팅 업체에서 24/7 구동
  * main 브랜치 기반 배포
  * 실제 서비스용 토큰 사용
- 개발용 봇:
  * 별도 호스팅 또는 로컬 실행
  * development 브랜치 기반
  * 테스트용 토큰 사용

## 7. 테스트 환경 구성

### 로컬 테스트 환경
```
개발 PC ─→ 로컬 봇 ─→ 테스트 서버
      └─→ 로컬 웹사이트
```

### 호스팅 테스트 환경
```
호스팅 서버 ─→ 개발용 봇 ─→ 테스트 서버
          └─→ dev.website.com
```

## 8. 추가 고려사항

### UI/UX 개발 프로세스
1. 디자인 준비
   - UI 디자인 파일 작성
   - 필요한 이미지 에셋 준비
   - 컴포넌트 구조 설계

2. 구현 단계
   - 컴포넌트별 개발
   - 반응형 디자인 적용
   - 접근성 고려

3. 테스트
   - 크로스 브라우저 테스트
   - 모바일 환경 테스트
   - 사용성 테스트

### 보안 고려사항
- HTTPS 필수 적용
- API 엔드포인트 보안
- 토큰 관리
- 권한 관리
- DDoS 방어 (Cloudflare 활용)

### 성능 최적화
- 이미지 최적화
- 캐싱 전략
- CDN 활용
- 데이터베이스 인덱싱
- 로드 밸런싱 고려

### 모니터링 및 로깅
- 서버 상태 모니터링
- 에러 로깅
- 사용자 행동 분석
- 성능 메트릭 수집

### 백업 전략
- 데이터베이스 정기 백업
- 설정 파일 백업
- 복구 절차 문서화

### 확장성 고려
- 마이크로서비스 아키텍처 고려
- 컨테이너화 가능성
- 서버리스 구조 검토

### 약관 및 정책에 관련된 내용 작성 필요
- 서비스 약관 : terms-of-service
- 개인정보 보호정책 : privacy-policy