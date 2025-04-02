## 자동 업데이트 기능
HYolss 봇은 GitHub 저장소의 최신 버전을 자동으로 확인하고 업데이트하는 기능을 제공합니다.

### 주요 기능
* 6시간마다 GitHub 저장소에서 최신 버전 확인
* 새 버전이 있을 경우 자동으로 업데이트 진행
* 업데이트 중에는 점검 모드로 전환되어 사용자에게 알림
* 업데이트 완료 후 자동으로 봇 재시작
* 관리 서버에 업데이트 로그 전송

### 관리자 명령어
* `/update` - 수동으로 업데이트 확인 및 실행 (개발자 전용)
* `/update force:true` - 버전이 같더라도 강제로 업데이트 실행 (개발자 전용)
* 접두사 명령어: `!update` 또는 `=update` (개발자 전용)

### 설정 방법
1. `.env` 파일에 `ADMIN_WEBHOOK_URL` 설정 (Discord 웹훅 URL)
2. `.env` 파일에 `BOT_DEVELOPER_IDS` 설정 (봇 개발자의 Discord 사용자 ID, 쉼표로 구분)
3. 프로덕션 환경에서 자동으로 활성화됨 (`NODE_ENV=production`)

### 보안
* 업데이트 명령어는 서버 관리자 권한을 가진 사용자 중에서도 봇 개발자로 등록된 사용자만 실행할 수 있습니다.
* 봇 개발자는 `.env` 파일의 `BOT_DEVELOPER_IDS`에 Discord 사용자 ID를 등록해야 합니다.
* 점검 모드 : node system-maintenance.js