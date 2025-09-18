# HYolss Discord Bot - Claude Code Documentation

## 프로젝트 개요
HYolss는 Discord.js 기반의 한국어 디스코드 봇입니다.
- **프로젝트명**: HYolss (Discord BOT)
- **버전**: 3.4.0 (beta)
- **언어**: Node.js (JavaScript)
- **프레임워크**: Discord.js v14
- **라이센스**: GPL-3.0

## 기술 스택 & 버전

### 런타임 & 프레임워크
- **Node.js**: v22.14.0 이상
- **Discord.js**: v14.22.1
- **JavaScript**: ES6+

### 데이터베이스
- **Supabase**: PostgreSQL 기반 (v2.57.0)
- **MongoDB Atlas**: NoSQL (v6.19.0)

### 웹 서버
- **Express.js**: v4.21.2
- **HTTP 상태 서버**: 봇 모니터링용

### 주요 의존성
```json
{
  "@supabase/supabase-js": "^2.57.0",
  "discord.js": "^14.22.1",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "mongodb": "^6.19.0",
  "semver": "^7.7.1"
}
```

### 개발 환경 요구사항
- **Node.js**: v22.14.0 이상 필수
- **npm**: 최신 버전 권장
- **Discord Bot Token**: 개발/프로덕션 각각
- **Database Access**: Supabase & MongoDB Atlas

## 빠른 시작

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 개발 모드 실행
NODE_ENV=development node index.js

# 프로덕션 모드 실행
NODE_ENV=production node index.js
```

### 환경 변수 (.env)
- **DISCORD_TOKEN**: 메인 봇 토큰 (프로덕션)
- **DEV_DISCORD_TOKEN**: 개발 봇 토큰
- **SUPABASE_URL/KEY**: Supabase 데이터베이스 연결
- **MONGODB_URI**: MongoDB Atlas 연결
- **NODE_ENV**: 'development' 또는 'production'

## 프로젝트 구조

```
HYolss/
├── CLAUDE.md                    # 이 파일
├── index.js                     # 메인 엔트리 포인트
├── package.json                 # 프로젝트 설정
├── .env.example                 # 환경변수 예시
├── commands/                    # 명령어 모듈들
│   ├── CLAUDE.md               # 명령어 관련 문서
│   ├── default/                # 기본 명령어들
│   └── utility/                # 유틸리티 명령어들
├── database/                   # 데이터베이스 연결
│   ├── CLAUDE.md              # 데이터베이스 관련 문서
│   ├── sql-supabase.js        # Supabase 연결
│   └── nosql-mongodb.js       # MongoDB 연결
├── events/                     # Discord 이벤트 핸들러
│   ├── CLAUDE.md              # 이벤트 관련 문서
│   ├── ready.js               # 봇 준비 이벤트
│   ├── interactionCreate.js   # 상호작용 이벤트
│   └── ...
├── utils/                      # 유틸리티 함수들
│   ├── CLAUDE.md              # 유틸리티 관련 문서
│   ├── auto-updater.js        # 자동 업데이트
│   └── status-server.js       # 상태 서버
└── docs(notepad)/             # 프로젝트 문서들
```

## 주요 기능
- **오늘의 메뉴**: 랜덤 메뉴 추천 (/오늘의메뉴)
- **메뉴 관리**: 메뉴 추가/삭제 (/addmenu, /deletemenu)
- **랜덤 기능들**: 숫자, 팀 구성, 가챠 등
- **편의점 추천**: 오늘의 편의점 추천
- **자동 업데이트**: 깃허브 기반 자동 업데이트

## 데이터베이스
- **Supabase**: PostgreSQL 기반 메인 DB
- **MongoDB Atlas**: NoSQL 보조 DB
- 환경에 따른 자동 연결 테스트

## 개발 가이드라인

### 명령어 추가
1. `/commands/` 하위 적절한 폴더에 `.js` 파일 생성
2. Discord.js SlashCommandBuilder 사용
3. 데이터베이스 연결이 필요한 경우 `/database/` 모듈 사용

### 환경별 설정
- **개발**: `NODE_ENV=development` + DEV_* 환경변수 사용
- **프로덕션**: `NODE_ENV=production` + 메인 환경변수 사용

### 테스트
```bash
# 봇 실행 후 Discord에서 테스트
node index.js
```

## 배포 정보
- **호스팅**: Railway (24/7 운영)
- **이전 서버**: AWS EC2 프리티어
- **Lite 버전**: 별도 레포지토리 운영

## Claude 작업 참고사항

### 자주 사용하는 명령어
```bash
npm start                           # 봇 실행 (프로덕션)
NODE_ENV=development node index.js  # 개발 모드 실행
npm run maintenance                 # 점검 모드 (system-maintenance.js)
```

### 코드 수정 시 주의사항
- **한국어 기반**: 모든 명령어와 응답이 한국어
- **환경변수 의존**: .env 파일 필수 (토큰, DB 연결정보)
- **이중 DB 구조**: Supabase(메인) + MongoDB(보조)
- **권한 체크**: 개발자 전용 명령어는 BOT_DEVELOPER_IDS 확인

### 현재 작업 중인 이슈
- **help.js**: 간단한 도움말 시스템 필요
- **auto-updater.js**: GitHub PAT 토큰 Private 레포 이슈
- **버전 비교**: 강제 업데이트 시 동일 버전 인식 문제

### 핵심 파일 역할
- **system-maintenance.js**: 점검 모드 전용 봇
- **nixpacks.toml**: Railway 배포 설정 (Node.js 22)
- **legacy code/**: 참조용 이전 버전 코드
- **.env.example**: 환경변수 템플릿

## 문제 해결
- 데이터베이스 연결 오류: 환경변수 확인
- 명령어 등록 안됨: Discord API 권한 확인
- 자동 업데이트 실패: GitHub PAT 토큰 확인

## 커뮤니티
- Discord: https://discord.gg/tVnhbaB9yY
- GitHub: https://github.com/SOIV-Studio/HYolss
- Email: biz@soiv-studio.xyz

---
*각 폴더별 세부 사항은 해당 폴더의 CLAUDE.md 파일을 참조하세요.*