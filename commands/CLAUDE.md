# Commands - HYolss Discord Bot

## 명령어 구조

### 디렉토리 구조
```
commands/
├── default/           # 기본 시스템 명령어
├── utility/          # 유틸리티 명령어
├── games-and-fun/    # 게임 및 재미 기능 (비어있음)
├── games-utility/    # 게임 유틸리티 (비어있음)
└── management/       # 관리 명령어 (비어있음)
```

## 기본 명령어 (default/)

### dashboard.js
- **명령어**: `/dashboard`
- **기능**: 서버 대시보드 접속 링크 제공
- **용도**: 웹 대시보드 연결

### help.js
- **명령어**: `/help`
- **기능**: 봇 사용법 및 명령어 도움말
- **상태**: 작업 필요 (간단한 설명 명령어 필요)

### info.js
- **명령어**: `/info`
- **기능**: 봇 정보 및 버전 표시
- **포함 정보**: 버전, 서버 수, 업타임 등

### ping.js
- **명령어**: `/ping`
- **기능**: 봇 응답 시간 측정
- **용도**: 봇 상태 확인

### support.js
- **명령어**: `/support`
- **기능**: 지원 및 문의 정보 제공
- **포함**: Discord 서버, 이메일 연락처

### update.js
- **명령어**: `/update`
- **기능**: 봇 업데이트 실행
- **권한**: 개발자 전용
- **기능**: 강제 업데이트, 버전 확인

## 유틸리티 명령어 (utility/)

### 메뉴 관련
- **addmenu.js**: `/addmenu` - 메뉴 추가 (총 메뉴 개수 표시)
- **deletemenu.js**: `/deletemenu` - 메뉴 삭제 (총 메뉴 개수 표시)
- **todaymenu.js**: `/오늘의메뉴` - 랜덤 메뉴 추천 (100개+ 메뉴)

### 랜덤 기능
- **random_Number.js**: `/랜덤숫자` - 숫자 범위 내 랜덤 선택
- **random_Team.js**: `/랜덤팀` - 팀 구성 랜덤 생성
- **random_gacha.js**: `/랜덤가챠` - 가챠 시스템

### 기타
- **todayconvenience.js**: `/오늘의편의점` - 편의점 추천

## 명령어 개발 가이드

### 새 명령어 추가 절차
1. 적절한 카테고리 폴더 선택
2. `.js` 파일 생성
3. Discord.js SlashCommandBuilder 구조 사용
4. 데이터베이스 연결 필요시 `/database/` 모듈 import

### 명령어 파일 구조
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('명령어이름')
        .setDescription('명령어 설명'),
    async execute(interaction) {
        // 명령어 로직
    },
};
```

### 데이터베이스 사용
```javascript
// Supabase 사용
const { supabase } = require('../database/sql-supabase');

// MongoDB 사용
const { getDb } = require('../database/nosql-mongodb');
```

## 메뉴 시스템 작업 계획
- [ ] txt 파일에서 DB로 이전 (Supabase)
- [ ] Lite 버전과 메인 버전 동기화
- [ ] 메뉴 관리 시스템 개선

## 주의사항
- 모든 명령어는 한국어 지원
- 다국어 지원 예정 (en-US, ja-JP)
- 개발자 전용 명령어는 권한 체크 필요
- 데이터베이스 의존 명령어는 연결 상태 확인

## 테스트 방법
1. 봇 실행: `node index.js`
2. Discord 서버에서 슬래시 명령어 테스트
3. 에러 로그 확인: 콘솔 출력 모니터링