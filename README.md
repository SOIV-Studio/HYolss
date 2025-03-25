SOIV_Studio-Project_BOT-C_2020~2025
# Discord_BOT_HYolss
HYolss는 개인이 사용하기 위해 제작된 디스코드 봇입니다.

제작하게 된 이유는 사용하는 봇의 기능들을 한 봇에서 구동해서 사용 해보고 싶다라는 생각에서 시작된 프로젝트겸 개인 예산을 사용하여 취미적으로 제작하는 디스코드 봇임을 밝힘니다.
- 참고 및 사용된 디스코드 봇은 다음과 같습니다.
    * Zira
    * Sapphire
    * MEE6
    * Ticket Tool
    * ModMail
    * TempVoice
    * InviteManagement
    * Xenon
    * MonitoRSS
    * Streamcord
    * 치직
    * appeal.gg

기능 사용에 관해서는 전부 무료로 사용을 할 수 있도록 운영할 생각이지만, 일부 기능에 한에서 Premium 유료 요금제가 적용이 될 수 있읍니다.

코딩을 해본적이 없는 사람이라 코드가 무척 지저분할 수 있으니 양해바랍니다.

# 커뮤니티
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/GvpmtExPrf) 

## 안내 사향
HYolss는 기존 개인이 사용하기 위해 제작한 디스코드 봇입니다.

봇 추가는 상관없이 누구나 추가하여 사용은 가능합니다만, 봇이 불안정할 수 있으니 주의 바랍니다.

[Discord Bot add link](https://discord.com/oauth2/authorize?client_id=888061096441819166)

[HYolss Dashboard Web_Front-end](https://github.com/SOIV-Studio/HYolss-Dashboard-Web_Front-end) / 
[HYolss Dashboard Web_Back-end](https://github.com/SOIV-Studio/HYolss-Dashboard-Web_Back-end)

[SOIV Studio_main website(Private)](https://github.com/SOIV-Studio/main-website_Front-end)
- - -
개인 봇이 아닌 정식 라이브 서비스를 위한 계획과 작업을 진행중입니다.

또한 각종 문서 및 가이드라인을 준비중이며 봇 개발에 참여방법 또는 다국어 변역 참여는 별도 공지가 있을 예정입니다.

준비중인 문서 및 가이드라인은 다음과 같습니다.
- 개발자 문서화 및 가이드라인
- 봇 사용자 도움말 문서화 및 가이드라인
- 커뮤니티 참여 관련
- - -
정식 라이브 서비스 및 원활한 서비스 제공 등을 위해 팀 모집을 준비 중에 있습니다.

여러 방면으로 팀을 모집을 할 필요성이 강하게 오게 되어 모집 준비 중에 있으니 관심이 있으신 분은 아레 문의처에 남겨주시면 답변을 드리겠습니다.
- E-mail : biz@soiv-studio.xyz

구인 분야는 다양하게 하게 될 계획이니 부디 팀 모집 공고가 올라오게 된다면 많은 지원을 부탁드리겠습니다.

- 요약
    1. 라이브 서비스 및 원활한 제공을 위해 팀 모집을 준비 중에 있습니다.
    2. 문의는 E-mail로 부탁드립니다.
    3. 팀 모집 만관부
    4. 신규(뉴비)도 상관없이 지원 가능
- - -
- 사용된 버전 정보
    * node.js Version : v22.14.0
    * Discord.js Version : v14.18.0
    * Database(DB) Version : PostgreSQL 17.4
- HYolss Discord Bot Info
    * Discord API : Discord.js
    * Languages : node.js(JavaScript)
    * locales : ko_KR
        - en-US, ja-JP 지원 예정
    * version : beta-3.0.0-dev
        - 정식 라이브 서비스 예정 날자 확정 불가능
    * Hosting Server : AWS EC2 (서울 리전)
        - 24/7 운영 중 / 임시 구동 서버

# 봇 주요 작동 방식
- Embed
- Message Component
- 슬래시 명령어 [ / ]
- 접두사 명령어 [ ! or = ] (일부 기능에서만 사용)

## 봇 온라인 명령어
* 기본 모드 : node index.js
* 점검 모드 : node system-maintenance.js