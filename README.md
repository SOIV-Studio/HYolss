# HYolss (Discord BOT)

HYolss는 개인이 사용하기 위해 제작된 디스코드 봇입니다.

봇 추가는 상관없이 누구나 추가하여 사용은 가능합니다만, 봇이 불안정할 수 있으니 주의 바랍니다.

코딩을 해본적이 없는 사람이라 코드가 무척 지저분할 수 있으니 양해바랍니다.

[Discord Bot add link](https://discord.com/oauth2/authorize?client_id=888061096441819166)

기능 사용에 관해서는 전부 무료로 사용을 할 수 있도록 운영할 생각이지만, 일부 기능에 한에서 Premium 유료 요금제가 적용이 될 수 있읍니다.

- HYolss Discord Bot Info
    * Discord API : Discord.js
    * Languages : node.js(JavaScript)
    * locales : ko_KR
        - en-US, ja-JP 지원 예정
    * version : beta-3.2.0-dev
        - 정식 라이브 서비스 예정 날자 확정 불가능
    * Hosting Server : 서버 이전 및 호스팅 업체 탐색 중 / 홈서버 구축 생각 중
        - 24/7 운영 중 / 최소 과금 / 임시 구동 서버
        - 이전 서버 : AWS EC2 프리티어 (서울 리전)

## Community[커뮤니티]

[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/GvpmtExPrf) 

## announcements 📢

개인 봇이 아닌 정식 라이브 서비스를 위한 계획과 작업을 진행중입니다.

또한 각종 문서 및 가이드라인을 준비중이며 봇 개발에 참여방법 또는 다국어 변역 참여는 별도 공지가 있을 예정입니다.

준비중인 문서 및 가이드라인은 다음과 같습니다.
- 개발자 문서화 및 가이드라인
- 봇 사용자 도움말 문서화 및 가이드라인
- 커뮤니티 참여 관련
---
정식 라이브 서비스 및 원활한 서비스 제공 등을 위해 팀 모집을 준비 중에 있습니다.

여러 방면으로 팀을 모집을 할 필요성이 강하게 오게 되어 모집 준비 중에 있으니 관심이 있으신 분은 아레 문의처에 남겨주시면 답변을 드리겠습니다.
- E-mail : biz@soiv-studio.xyz

구인 분야는 다양하게 하게 될 계획이니 부디 팀 모집 공고가 올라오게 된다면 많은 지원을 부탁드리겠습니다.

- 요약
    1. 라이브 서비스 및 원활한 제공을 위해 팀 모집을 준비 중에 있습니다.
    2. 문의는 E-mail로 부탁드립니다.
    3. 팀 모집 만관부
    4. 신규(뉴비)도 상관없이 지원 가능

## Features[특징] 🎉

- 업데이트 / 자동 업데이트 기능
    * [system_update_and_auto_update_guide(KR)](dosc(notepad)\system_guide\system_update_and_auto_update_guide.md)

## Setup 🛠️

### Prerequisites[필수 조건] 📦

Make sure you have the following installed:

- npm (Node Package Manager)
- node.js Version : v22.14.0 or above
- Discord.js Version : v14.18.0 or above
- Database(DB) Version :
    * Supabase (PostgreSQL 기반)
    * MongoDB Atlas (NoSQL)

### Development Mode 🔧

1. .env에서 구동할 Dev 봇의 대한 토큰을 입력합니다:

    [.env.example #6~9](.env.example)
    ```bash
    # Development Bot Token
    DEV_DISCORD_TOKEN=your_dev_token_here
    DEV_DISCORD_CLIENT_ID=your_dev_client_id_here
    DEV_DISCORD_GUILD_ID=your_dev_guild_id_here
    ```

2. 구동전 .env에서 다음과 같이 'NODE_ENV' 설정을 합니다:

    [.env.example #11~12](.env.example)
    ```bash
    # Environment Flag (set to 'development' or 'production')
    NODE_ENV=development
    ```

3. 필요한 종속성을 설치합니다:

   ```bash
   npm install
   ```

4. 개발 모드에서 봇을 실행합니다:

   ```bash
   node index.js

   and

   NODE_ENV=development node index.js
   ```

---

### Production Mode 💥

1. .env에서 구동할 Dev 봇의 대한 토큰을 입력합니다:

    [.env.example #1~4](.env.example)
    ```bash
    # Main Bot Token (Production)
    DISCORD_TOKEN=your_main_token_here
    DISCORD_CLIENT_ID=your_main_client_id_here
    DISCORD_GUILD_ID=your_main_guild_id_here
    ```

2. 구동전 .env에서 다음과 같이이 'NODE_ENV' 설정을 합니다:

    [.env.example #11~12](.env.example)
    ```bash
    # Environment Flag (set to 'development' or 'production')
    NODE_ENV=Production
    ```

3. 필요한 종속성을 설치합니다:

   ```bash
   npm install
   ```

4. Production 모드에서 봇을 실행합니다:

   ```bash
   node index.js

   and

   NODE_ENV=Production node index.js
   ```

## Usage[사용법] ⚙️

## To-Do 📝

- DB : Supabase 기초 Resetup
    * API 자동 셋업
    * 셋팅이 되다 말아먹은 것들 재작업
    * 버그와 오류, 부족한 부분 작업하기
- auto-updater / updater
    * 조건부 수정
        - 버전이 똑같더라도 깃허브 해쉬가 동일하지 않으면 업데이트 실행
    * 깃허브 레포가 private의 조건에 대한 문제 작업
        - 깃허브 레포가 private으로 설정 되어 있더라도 업데이트를 실행 할 수 있도록 작업 필요
    * 버그와 오류 잡기
        ```bash
        [ERROR] Git pull 실패: Error: 명령 실행 실패: Command failed: git pull origin main
        fatal: not a git repository (or any of the parent directories): .git

        fatal: not a git repository (or any of the parent directories): .git

            at /app/auto-updater.js:171:24
            at ChildProcess.exithandler (node:child_process:421:5)
            at ChildProcess.emit (node:events:518:28)
            at maybeClose (node:internal/child_process:1101:16)
            at ChildProcess._handle.onexit (node:internal/child_process:304:5)
        [ERROR] 업데이트 프로세스 실패: Error: 명령 실행 실패: Command failed: git pull origin main
        fatal: not a git repository (or any of the parent directories): .git

        fatal: not a git repository (or any of the parent directories): .git

            at /app/auto-updater.js:171:24
            at ChildProcess.exithandler (node:child_process:421:5)
            at ChildProcess.emit (node:events:518:28)
            at maybeClose (node:internal/child_process:1101:16)
            at ChildProcess._handle.onexit (node:internal/child_process:304:5)
        ```
- commands\default\help.js 관련 작업 필요
    * 깃북에서도 작업중이지만 별도 간단한 설명을 해줄수 있는 명령어가 필요

- 작업에 관련하여 작성된 문서는 아레 2개입니다.
    * [dashboard-and-features](dosc(notepad)\dashboard-and-features.md)
    * [2025-2nd~4th-quarter-Features-update](dosc(notepad)\2025-2nd~4th-quarter-Features-update.md)

## Contributing[기어] 💖

각종 문서 및 가이드라인을 준비중이며 봇 개발에 참여방법 또는 다국어 변역 참여는 별도 공지가 있을 예정입니다.

준비중인 문서 및 가이드라인은 다음과 같습니다.
- 개발자 문서화 및 가이드라인
- 봇 사용자 도움말 문서화 및 가이드라인
- 커뮤니티 참여 관련

---

### FAQs ❓

**1. What operating system does HYolss support?**

> **Windows**, **Ubuntu**, **Linux (untested)**

---

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
(KR) 이 프로젝트 및 레포는 MIT 라이센스를 따라갑니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 확인 해주세요.

SOIV_Studio-Project_BOT-C_2020~2025

---

## 전체적인 참고 및 구조 환경 참고에 사용된 디스코드 봇 리스트

아레 봇 리스트는 이 봇을 제작할때 참고 및 시스템 확인을 위해 확인 했었던 디스코드 봇 리스트입니다.

아레 리스트 중 일부 봇은 오픈 소스 및 소스코드가 오픈 되어 있는 봇도 있음을 알림니다.

- Zira
- Sapphire
- MEE6
- Ticket Tool
- ModMail
- TempVoice
- InviteManagement
- Xenon
- MonitoRSS
- Streamcord
- 치직
- appeal.gg