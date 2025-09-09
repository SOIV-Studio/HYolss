# HYolss (Discord BOT)

HYolss는 개인이 사용하기 위해 제작된 디스코드 봇입니다.<br>
코딩을 해본적이 없는 사람이라 코드가 무척 지저분할 수 있으니 양해바랍니다.<br>
또한 기능 사용에 관해서는 전부 무료로 사용을 할 수 있도록 운영할 생각이지만, 일부 기능에 한에서 Premium 유료 요금제가 적용이 될 수 있읍니다.

봇 추가는 상관없이 누구나 추가하여 사용은 가능합니다만, 봇이 불안정할 수 있으니 주의 바랍니다.<br>
[Discord Bot add link](https://discord.com/oauth2/authorize?client_id=888061096441819166)

Lite 버전의 레포는 아레 링크에서 확인이 가능합니다!<br>
[ https://github.com/SOIV-Studio/HYolss-Lite ]

- HYolss Discord Bot Info
    * Discord API : Discord.js
    * Languages : node.js(JavaScript)
    * locales : ko_KR
        - en-US, ja-JP 지원 예정
    * AI locales : ko_KR, ja-JP, en-US
        - 3개 국어 기본 지원 예정
        - TTS X / Live 2D, 3D X
    * version : beta-3.2.0-dev
        - 정식 라이브 서비스 예정 날자 확정 불가능
    * Hosting Server : railway에서 운영 중
        - 24/7 운영 중 / 최소 과금
        - 이전 서버 : AWS EC2 프리티어 (서울 리전)
    * Lite Version
        - 24/7 운영 중단

## Community[커뮤니티]

<p align="center">
  <a href="https://discord.gg/tVnhbaB9yY"><img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://x.com/SOIV_Studio"><img src="https://img.shields.io/badge/X-%23000000.svg?style=for-the-badge&logo=X&logoColor=white" alt="X"></a>
  <a href="https://www.instagram.com/soiv_coms_official"><img src="https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white" alt="Instagram"></a>
  <a href="https://youtube.com/@SOIV_Studio_official"><img src="https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white" alt="YouTube"></a>
</p>

## announcements 📢

개인 봇이 아닌 정식 라이브 서비스를 위한 계획과 작업을 진행중입니다.<br>
또한 각종 문서 및 가이드라인을 준비중이며 봇 개발에 참여방법 또는 다국어 변역 참여는 별도 공지가 있을 예정입니다.

준비중인 문서 및 가이드라인은 다음과 같습니다.
- 개발자 문서화 및 가이드라인
- 봇 사용자 도움말 문서화 및 가이드라인
- 커뮤니티 참여 관련
---
정식 라이브 서비스 및 원활한 서비스 제공 등을 위해 팀 모집을 준비 중에 있습니다.<br>
여러 방면으로 팀을 모집을 할 필요성이 강하게 오게 되어 모집 준비 중에 있으니 관심이 있으신 분은 아레 문의처에 남겨주시면 답변을 드리겠습니다.<br>
E-mail : biz@soiv-studio.xyz

구인 분야는 다양하게 하게 될 계획이니 부디 팀 모집 공고가 올라오게 된다면 많은 지원을 부탁드리겠습니다.

[ 요약 ]
1. 라이브 서비스 및 원활한 제공을 위해 팀 모집을 준비 중에 있습니다.
2. 문의는 E-mail로 부탁드립니다.
3. 팀 모집 만관부
4. 신규(뉴비)도 상관없이 지원 가능

## Features[특징] 🎉

- 업데이트 / 자동 업데이트 기능
    * [system_update_and_auto_update_guide(KR)](dosc(notepad)\system_guide\system_update_and_auto_update_guide.md)
- 오늘의 시리즈!
    - 어떤 음식을 먹을지 안정했다면 '/오늘의메뉴'를 사용해보세요! 100개가 넘는 메뉴중에서 하나를 추천합니다.

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

- [ ] Dashboard, website UI/UX 작업
    - < 진행 상황 업데이트 (05. 24) >
        - 로그인, 서버 목록 및 백엔드 등 서버 대시보드 홈을 제외한 모든 작업이 완료되었습니다.<br>
        따라서 대시보드 홈 UI/UX에 대한 디자인 작업이 조금씩 늦어지고 있으나<br>
        일부 기능을 먼저 제작과 동시에 UI/UX 작업을 진행할 예정입니다.
        - 다만 작업이 전혀 되지 않는 목록도 존재합니다, 이에 따른 부분을 도와주시거나 작업을 해주실 분을 모집하고 있습니다.<br>
        먼저 오리지널 캐릭터 작업에 관한 것과 그 외 제가 하지 못하는 분야에 대해 작업자분들을 찾고 있으니 부디 가능하신 분께서는 위 공지에 작성된 이메일로 연락을 부탁드리겠습니다.
    - 작업은 한번식 하고는 있으나 UI/UX는 아무것도 모르는 상태라 진행 속도가 느림
    - 작업을 도와주거나 UI/UX에 대해 도움을 조금 주실수 있으시면 이메일로 연락 부탁드리겠습니다.
    - 작업 프로그램 : Figma
- [ ] DB : Supabase Resetup
    * 작업 완료후 Lite 버전에 수정 버전 적용
    * [supabase_refactor_todo](docs(notepad)\supabase_refactor_todo.md)
- [ ] auto-updater / updater
    * PAT(Personal Access Token) 작업
        - 깃허브 레포 상태(Public/Private)의 조건에 대한 문제 작업
        - 깃허브 레포가 private으로 설정 되어 있더라도 업데이트를 실행 할 수 있도록 작업 필요
    - [x] 강재 업데이트 오류
        - 버전 비교 및 강재 업데이트 실행 했는데 업데이트 시스템에서 버전 동일로 업데이트 중지 처리 되는 문제
- [x] 오늘의 시리즈 단어장(random-words-store) 부분
    * 기존 내부에 txt 파일에 저장된 내용을 불러오는 방식에서 DB에서 불러오는 방식으로 교채 하는 것도 생각중.
        - 사유: Lite 버전과 메인 버전의 음식 등록되는 단어 개수의 싱크를 맞추기 위해
        - 작업 확정 / txt 파일에서 supabase으로 이전 작업 준비중 / 기존 레포에서 적용 후 Lite에 적용 예정
- commands\default\help.js 관련 작업 필요
    * 깃북에서도 작업중이지만 별도 간단한 설명을 해줄수 있는 명령어가 필요

- 작업에 관련하여 작성된 문서는 아레 2개입니다.
    * [dashboard-and-features](dosc(notepad)\dashboard-and-features.md)
        - 기존 '2025-2nd~4th-quarter-Features-update'에 있던 모든 내용을 통합됨
    * [HYolss-original-setup](docs(notepad)\HYolss-original-setup.md)
        - HYolss Project 오리지널 문서 / 오리지널 캐릭터와 관련됨

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

This project is licensed under the GPL-3.0 license - see the [LICENSE](LICENSE) file for details.<br>
(KR) 이 프로젝트 및 레포는 GPL-3.0 라이센스를 따라갑니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 확인 해주세요.

SOIV Studio / Palette Square Studio (PS Studio)<br>
HYolss Project 2020~

---

## 전체적인 참고 및 구조 환경 참고에 사용된 디스코드 봇 리스트

아레 봇 리스트는 이 봇을 제작할때 참고 및 시스템 확인을 위해 확인 했었던 디스코드 봇 리스트입니다.<br>
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
