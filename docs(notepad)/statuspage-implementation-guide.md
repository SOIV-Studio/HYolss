# StatusPage 구현 가이드

## 개요
이 문서는 무료로 서비스 상태 페이지를 구축하는 방법을 설명합니다. GitHub 기반의 Upptime을 활용하여 여러 서비스(웹사이트, 디스코드 봇, API 등)의 상태를 모니터링하고 표시하는 페이지를 구현합니다.

## 구현 방법

### 1. 기본 설정
1. GitHub에서 [Upptime 템플릿](https://github.com/upptime/upptime)을 포크합니다.
2. 저장소 이름은 `status` 또는 원하는 이름으로 설정합니다.

### 2. 설정 파일 구성
`.upptimerc.yml` 파일을 수정하여 모니터링할 서비스와 기본 설정을 합니다:

```yaml
owner: 당신의유저이름  # GitHub 사용자명
repo: status  # 저장소 이름

# 모니터링할 서비스 목록
sites:
  - name: 웹사이트
    url: https://your-website.com
    icon: https://your-website.com/favicon.ico  # 아이콘 URL (선택사항)
    maxResponseTime: 5000  # 응답 시간 제한 (ms)
  
  - name: 디스코드 봇 (GCP)
    url: https://your-bot-domain.com/health
    method: GET  # 요청 방식
    expectedStatusCodes:
      - 200
      - 201  # 정상으로 간주할 상태 코드
  
  - name: API 서비스 (AWS)
    url: https://api.your-service.com/health
    check: "JSON.status === 'ok'"  # JSON 응답 검증
  
  - name: 데이터베이스 서비스
    url: https://db-status.your-service.com
    assignees:  # 담당자 지정 (문제 발생 시 알림)
      - your-github-username

# 상태 웹사이트 설정
status-website:
  cname: status.soiv-studio.xyz  # 사용자 지정 도메인
  baseUrl: /  # 기본 경로
  logoUrl: https://yourwebsite.com/logo.png
  name: 서비스 상태
  introTitle: "서비스 실시간 상태"
  introMessage: 모든 서비스의 현재 상태와 과거 장애 이력을 확인하세요
  theme: dark  # light 또는 dark
  navbar:
    - title: 상태
      href: /
    - title: 이슈
      href: /history
    - title: GitHub
      href: https://github.com/$OWNER/$REPO

# 알림 설정
notifications:
  - type: discord
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
  - type: email
    recipients:
      - your-email@example.com
```

### 3. 다국어 지원 설정
다국어 지원을 원하는 경우 `.upptimerc.yml`에 다음을 추가합니다:

```yaml
i18n:
  languageSelector: true
  activeLanguage: ko
  
  # 한국어
  ko:
    activeIncidents: 진행 중인 문제
    allSystemsOperational: 모든 시스템 정상 작동 중
    incidentReport: "문제 보고 #$NUMBER"
    incidentTitle: "문제 세부 정보 #$NUMBER"
    incidentDetails: 문제 세부 정보
    incidentFixed: 해결됨
    incidentOngoing: 진행 중
    liveStatus: 실시간 상태
    overallUptime: "전체 가동률: $UPTIME"
    pastIncidents: 지난 문제들
    pastIncidentsResolved: "$RESOLVED 해결됨, $TOTAL 총 문제"
    responseTime: 응답 시간
    up: 정상
    down: 중단
    degraded: 성능 저하
    ms: ms
    loading: 로딩 중
    navHistory: 히스토리
    navStatus: 상태
    navGitHub: GitHub
    footer: 이 페이지는 [Upptime](https://upptime.js.org)으로 운영됩니다
  
  # 일본어
  ja:
    activeIncidents: 現在の障害
    allSystemsOperational: すべてのシステムが正常に動作しています
    incidentReport: "インシデント #$NUMBER レポート"
    incidentTitle: "インシデント #$NUMBER 詳細"
    incidentDetails: インシデント詳細
    incidentFixed: 解決済み
    incidentOngoing: 進行中
    liveStatus: ライブステータス
    overallUptime: "全体の稼働率: $UPTIME"
    pastIncidents: 過去のインシデント
    pastIncidentsResolved: "$RESOLVEDが解決、合計$TOTAL"
    responseTime: 応答時間
    up: 正常
    down: 停止
    degraded: 性能低下
    ms: ミリ秒
    loading: 読み込み中
    navHistory: 履歴
    navStatus: ステータス
    navGitHub: GitHub
    footer: このページは[Upptime](https://upptime.js.org)によって運営されています
```

### 4. 디스코드 봇 상태 엔드포인트 구현
디스코드 봇에 상태 확인용 엔드포인트를 추가합니다:

```javascript
// discord-bot-status.js - 봇 코드에 추가
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 기본 상태 엔드포인트
app.get('/health', (req, res) => {
  try {
    // 봇 상태 확인 로직
    const isOnline = true; // 실제 연결 상태 확인으로 대체
    
    const status = {
      status: isOnline ? 'ok' : 'error',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      discord: {
        connected: isOnline,
        ping: 40, // 실제 핑 측정으로 대체
        guilds: 100 // 실제 서버 수로 대체
      }
    };
    
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`상태 서버가 포트 ${PORT}에서 실행 중입니다`);
});
```

### 5. 커스텀 디자인 (선택 사항)
기본 디자인을 커스터마이징하려면 다음과 같이 설정합니다:

1. `.github/workflows/update-template.yml` 파일 생성:

```yaml
name: Update Template

on:
  workflow_dispatch:
  schedule:
    - cron: "0 0 * * 1"  # 매주 월요일 실행

jobs:
  release:
    name: Update Template
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.3
        with:
          ref: ${{ github.head_ref }}
          token: ${{ secrets.GH_PAT }}
      
      - name: Update template
        uses: upptime/uptime-monitor@master
        with:
          command: "update-template"
        env:
          GH_PAT: ${{ secrets.GH_PAT }}
      
      - name: Add custom styles
        run: |
          echo '/* 커스텀 CSS */' > assets/custom.css
          echo 'body { font-family: "맑은 고딕", "Malgun Gothic", sans-serif; }' >> assets/custom.css
          echo '.navbar { background-color: #1e3a8a !important; }' >> assets/custom.css
          echo '.incident-card { border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }' >> assets/custom.css
      
      - name: Commit new data
        uses: upptime/uptime-monitor@master
        with:
          command: "commit"
        env:
          GH_PAT: ${{ secrets.GH_PAT }}
          COMMIT_MSG: "상태 페이지 템플릿 업데이트 및 커스텀 스타일 추가"
```

### 6. 도메인 연결 설정
Cloudflare에서 커스텀 도메인 연결:

1. Cloudflare 대시보드 > DNS 설정에서 레코드 추가:
   - 유형: `CNAME`
   - 이름: `status` (status.soiv-studio.xyz로 접속하기 위함)
   - 대상: `[your-github-username].github.io`
   - 프록시 상태: 프록시됨 (주황색 구름)
   - TTL: Auto

2. GitHub 저장소 > Settings > Pages에서:
   - Custom domain에 `status.soiv-studio.xyz` 입력
   - "Enforce HTTPS" 체크

### 7. 보안 설정
GitHub 저장소의 Settings > Secrets and variables > Actions에서 필요한 비밀 값 설정:

1. `GH_PAT`: GitHub Personal Access Token
   - GitHub > Settings > Developer settings > Personal access tokens에서 생성
   - 필요 권한: repo, workflow

2. `DISCORD_WEBHOOK`: 디스코드 알림용 웹훅 URL
   - 디스코드 서버 > 채널 설정 > 연동 > 웹후크 > 새 웹후크

## 유지 관리 팁

1. **모니터링 주기 조정**:  
   `.github/workflows/uptime.yml` 파일의 cron 설정 수정:
   ```yaml
   on:
     schedule:
       - cron: "*/5 * * * *"  # 5분마다 확인 (기본값)
       # - cron: "*/3 * * * *"  # 3분마다 확인 (더 자주)
   ```

2. **상태 배지 활용**:  
   다른 웹사이트에 상태 배지 추가:
   ```html
   <img src="https://raw.githubusercontent.com/username/status/master/api/website/status.svg" alt="웹사이트 상태">
   ```

3. **문제 발생 시 대응**:
   - GitHub Issues에 자동으로 생성된 이슈 확인 및 처리
   - 문제 해결 후 이슈 닫기 (자동으로 해결 시간 기록)

4. **알림 관리**:
   - 알림 빈도를 조정하려면 `.upptimerc.yml`의 notifications 섹션 수정
   - 너무 많은 알림을 방지하기 위한 설정 추가 가능:
     ```yaml
     notifications:
       - type: discord
         webhook: ${{ secrets.DISCORD_WEBHOOK }}
         notifyWhenStatusChanges: true
         notifyWhenFixed: true
     ```

## 참고 링크
- [Upptime 공식 문서](https://upptime.js.org/docs)
- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [Cloudflare DNS 설정 가이드](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
