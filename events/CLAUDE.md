# Events - HYolss Discord Bot

## Discord 이벤트 핸들러

HYolss 봇의 모든 Discord 이벤트 처리를 담당하는 모듈들입니다.

## 파일 구조

### ready.js
- **이벤트**: `ready`
- **역할**: 봇 시작 시 초기화 작업
- **기능**:
  - 봇 로그인 완료 메시지
  - 활동 상태 설정
  - 명령어 등록 완료 확인
  - 서버 수 및 상태 정보 출력

### interactionCreate.js
- **이벤트**: `interactionCreate`
- **역할**: 슬래시 명령어 상호작용 처리
- **기능**:
  - 슬래시 명령어 실행
  - 에러 처리 및 로깅
  - 권한 검사
  - 명령어 사용 통계

### messageCreate.js
- **이벤트**: `messageCreate`
- **역할**: 일반 메시지 처리
- **기능**:
  - 텍스트 기반 명령어 (레거시)
  - 메시지 필터링
  - 자동 응답 시스템

### guildCreate.js
- **이벤트**: `guildCreate`
- **역할**: 새 서버 참가 시 처리
- **기능**:
  - 새 서버 환영 메시지
  - 기본 설정 초기화
  - 서버 정보 로깅
  - 데이터베이스 서버 데이터 생성

### guildDelete.js
- **이벤트**: `guildDelete`
- **역할**: 서버 퇴장 시 처리
- **기능**:
  - 서버 퇴장 로깅
  - 관련 데이터 정리 (선택적)
  - 통계 업데이트

## 이벤트 등록 시스템

### index.js에서 자동 로드
```javascript
// 이벤트 파일들을 자동으로 로드하고 등록
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
```

## 이벤트 파일 구조

### 기본 템플릿
```javascript
module.exports = {
    name: 'eventName',           // Discord 이벤트 이름
    once: false,                 // 한 번만 실행할지 여부
    execute(arg1, arg2, ...) {   // 이벤트 핸들러 함수
        // 이벤트 처리 로직
    },
};
```

### ready 이벤트 예시
```javascript
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} 봇이 준비되었습니다!`);
        console.log(`📊 ${client.guilds.cache.size}개 서버에서 활동 중`);

        // 활동 상태 설정
        client.user.setActivity('서비스 중', { type: 'PLAYING' });
    },
};
```

## 에러 처리

### 이벤트 에러 핸들링
```javascript
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // 상호작용 처리 로직
            await interaction.reply('처리 완료!');
        } catch (error) {
            console.error('상호작용 처리 중 오류:', error);

            if (!interaction.replied) {
                await interaction.reply({
                    content: '명령어 처리 중 오류가 발생했습니다.',
                    ephemeral: true
                });
            }
        }
    },
};
```

## 주요 기능별 상세

### 명령어 처리 (interactionCreate)
```javascript
const command = interaction.client.commands.get(interaction.commandName);

if (!command) {
    console.error(`${interaction.commandName} 명령어를 찾을 수 없습니다.`);
    return;
}

try {
    await command.execute(interaction);
} catch (error) {
    console.error('명령어 실행 중 오류:', error);
    // 에러 응답 처리
}
```

### 서버 관리 (guildCreate/guildDelete)
```javascript
// 새 서버 참가 시
module.exports = {
    name: 'guildCreate',
    execute(guild) {
        console.log(`✅ 새 서버 참가: ${guild.name} (${guild.id})`);

        // 데이터베이스에 서버 정보 저장
        // 기본 설정 초기화
        // 관리자에게 알림
    },
};
```

## 개발 가이드

### 새 이벤트 추가
1. `/events/` 폴더에 새 `.js` 파일 생성
2. 적절한 이벤트 이름과 핸들러 구현
3. 봇 재시작 시 자동으로 등록됨

### 이벤트 테스트
1. 개발 환경에서 봇 실행
2. Discord에서 해당 이벤트 트리거
3. 콘솔 로그 확인

### 성능 고려사항
- 무거운 작업은 비동기 처리
- 데이터베이스 쿼리 최적화
- 에러 로깅 시스템 구축

## 모니터링 및 로깅
- 각 이벤트별 실행 횟수 기록
- 에러 발생 시 상세 로그
- 서버 상태 변화 추적
- 사용량 통계 수집