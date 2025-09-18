# Utils - HYolss Discord Bot

## 유틸리티 모듈

봇의 핵심 기능을 지원하는 유틸리티 함수들과 서비스 모듈들입니다.

## 파일 구조

### auto-updater.js
- **역할**: 자동 업데이트 시스템
- **기능**:
  - GitHub 레포지토리 버전 확인
  - 자동 업데이트 스케줄링
  - 강제 업데이트 실행
  - 업데이트 알림

### status-server.js
- **역할**: 봇 상태 모니터링 서버
- **기능**:
  - HTTP 상태 서버 운영
  - 봇 상태 API 엔드포인트 제공
  - 헬스체크 기능
  - 업타임 모니터링

## 자동 업데이트 시스템

### 주요 기능
```javascript
const { scheduleUpdateCheck } = require('./utils/auto-updater');

// 자동 업데이트 스케줄 설정
scheduleUpdateCheck();
```

### 업데이트 프로세스
1. **버전 확인**: GitHub API를 통한 최신 버전 체크
2. **비교**: 현재 버전과 최신 버전 비교
3. **다운로드**: 새 버전 다운로드
4. **재시작**: 봇 프로세스 재시작

### 환경 변수
```env
# GitHub PAT (Personal Access Token) 설정
GITHUB_TOKEN=your_github_pat_here

# 업데이트 알림 웹훅
ADMIN_WEBHOOK_URL=your_discord_webhook_url_here

# 개발자 ID 목록 (쉼표로 구분)
BOT_DEVELOPER_IDS=user_id_1,user_id_2
```

### 업데이트 명령어 연동
```javascript
// commands/default/update.js와 연동
const { checkForUpdates, forceUpdate } = require('../../utils/auto-updater');

// 수동 업데이트 확인
await checkForUpdates();

// 강제 업데이트 실행
await forceUpdate();
```

## 상태 서버 시스템

### 서버 시작
```javascript
const { startStatusServer, setBotClient } = require('./utils/status-server');

// 상태 서버 시작
startStatusServer();

// 봇 클라이언트 설정
setBotClient(client);
```

### API 엔드포인트
- **GET /status**: 봇 상태 정보
- **GET /health**: 헬스체크
- **GET /stats**: 봇 통계 정보

### 응답 예시
```json
{
  "status": "online",
  "uptime": 3600000,
  "guilds": 150,
  "users": 5000,
  "commands": 25,
  "memory": {
    "used": "50MB",
    "total": "100MB"
  }
}
```

## 업데이트 관련 작업 사항

### 현재 이슈
- [ ] **PAT 토큰 작업**: Private 레포 접근 문제
- [ ] **버전 비교 오류**: 강제 업데이트 시 동일 버전 인식 문제
- [x] **강제 업데이트 오류**: 해결 완료

### PAT 토큰 설정
```javascript
// GitHub API 인증
const headers = {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'HYolss-Bot'
};
```

### Private 레포 지원
- GitHub Personal Access Token 필요
- Repository 읽기 권한 설정
- API 요청 헤더에 인증 정보 포함

## 모니터링 기능

### 시스템 리소스 모니터링
```javascript
const os = require('os');

function getSystemStats() {
    return {
        memory: {
            used: process.memoryUsage().heapUsed,
            total: process.memoryUsage().heapTotal
        },
        cpu: os.loadavg(),
        uptime: process.uptime()
    };
}
```

### 봇 상태 체크
```javascript
function getBotStats(client) {
    return {
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        channels: client.channels.cache.size,
        commands: client.commands.size,
        ping: client.ws.ping
    };
}
```

## Express 서버 설정

### 기본 설정
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// CORS 설정 (필요시)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
```

### 포트 설정
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 상태 서버가 포트 ${PORT}에서 실행 중`);
});
```

## 개발 가이드

### 새 유틸리티 함수 추가
1. `/utils/` 폴더에 새 `.js` 파일 생성
2. 모듈 내보내기 형식 사용
3. 필요한 곳에서 require로 가져오기

### 에러 처리
```javascript
try {
    await updateFunction();
} catch (error) {
    console.error('업데이트 실패:', error);
    // 웹훅으로 관리자에게 알림
    await sendAdminNotification(`업데이트 실패: ${error.message}`);
}
```

### 로깅 시스템
- 업데이트 시도 기록
- 상태 서버 요청 로그
- 에러 발생 시 상세 정보 기록

## 성능 최적화
- 메모리 사용량 모니터링
- CPU 사용률 체크
- 네트워크 요청 최적화
- 캐싱 시스템 구현

## 보안 고려사항
- GitHub 토큰 보안 관리
- 상태 서버 접근 제한
- 업데이트 무결성 검증
- 민감 정보 로그 제외