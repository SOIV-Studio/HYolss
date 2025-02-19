# 토큰 관리 및 환경 변수 설정 가이드

## 1. 깃 저장소 공개 시 고려사항

### 민감한 정보 관리
- 디스코드 봇 토큰
- API 키
- 클라이언트 ID
- 서버 ID
등의 민감한 정보는 절대 공개 저장소에 노출되면 안됩니다.

### 환경 변수 관리 방식
1. 기존 방식 (config.json 사용)
```json
{
    "token": "your_token_here",
    "clientId": "your_client_id",
    "guildId": "your_guild_id"
}
```
- 문제점: 깃 저장소 공개 시 토큰이 노출될 위험

2. 개선된 방식 (.env 파일 사용)
```env
# Main Bot Token (Production)
DISCORD_TOKEN=your_main_token_here
DISCORD_CLIENT_ID=your_main_client_id
DISCORD_GUILD_ID=your_main_guild_id

# Development Bot Token
DEV_DISCORD_TOKEN=your_dev_token_here
DEV_DISCORD_CLIENT_ID=your_dev_client_id
DEV_DISCORD_GUILD_ID=your_dev_guild_id

# Environment Flag
NODE_ENV=production
```

## 2. 환경 변수 설정 방법

### 필요한 패키지
```bash
npm install dotenv
```

### 파일 구조
- `.env`: 실제 토큰들이 저장된 파일 (깃에서 제외)
- `.env.example`: 환경 변수 템플릿 (깃에 포함)
- `config.json`: 빈 값으로 유지 (레거시 지원)

### 코드 수정
1. index.js
```javascript
require('dotenv').config();
// 환경 변수에 따라 토큰 선택
const token = process.env.NODE_ENV === 'development' 
    ? process.env.DEV_DISCORD_TOKEN 
    : process.env.DISCORD_TOKEN;
```

2. deploy-commands.js
```javascript
require('dotenv').config();
// 환경 변수에 따라 토큰과 clientId 선택
const token = process.env.NODE_ENV === 'development' 
    ? process.env.DEV_DISCORD_TOKEN 
    : process.env.DISCORD_TOKEN;

const clientId = process.env.NODE_ENV === 'development'
    ? process.env.DEV_DISCORD_CLIENT_ID
    : process.env.DISCORD_CLIENT_ID;
```

## 3. 실행 방법

### 개발 환경
```bash
NODE_ENV=development node index.js
NODE_ENV=development node deploy-commands.js
```

### 프로덕션 환경
```bash
NODE_ENV=production node index.js
NODE_ENV=production node deploy-commands.js
```

## 4. 호스팅 서비스에서의 환경 변수 설정

### AWS 환경 변수 설정
1. Elastic Beanstalk 사용 시:
- AWS 콘솔 → Elastic Beanstalk
- 애플리케이션 선택
- Configuration → Software
- Environment properties에서 설정

2. EC2 사용 시:
- AWS Systems Manager → Parameter Store
- SecureString 타입으로 저장

### Google Cloud 환경 변수 설정
1. Cloud Run 사용 시:
- Cloud Console → Cloud Run
- 서비스 선택 → Variables & Secrets
- 환경 변수 추가

2. Compute Engine 사용 시:
- VM 인스턴스 설정
- Custom metadata에서 환경 변수 추가

## 5. 보안 관련 팁

### .gitignore 설정
```
node_modules
.env
```

### 환경 변수 템플릿 제공
- .env.example 파일을 통해 필요한 환경 변수 안내
- 실제 값은 포함하지 않음

### 토큰 관리
- 정기적인 토큰 갱신 권장
- 개발용과 프로덕션용 토큰 분리
- 토큰 노출 시 즉시 재발급

### 배포 시 주의사항
- 배포 전 환경 변수 설정 확인
- 테스트 환경과 프로덕션 환경의 토큰 분리
- 접근 권한 관리