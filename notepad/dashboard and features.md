# 대시보드 및 기능 구현 계획

## 0. 버전관리 및 작성에 관련하여

- 아레 계획은 추후 적용하게 될 4.0.0과 5.0.0 버전의 계획 및 준비 작업입니다.
- 4.0.0은 봇에게 대시보드를 적용하기 전의 버전
- 5.0.0은 봇에게 대시보드를 적용한 후의 버전
- 모든 버전이 적용되고 안정화 페치 및 그외 기타 업데이트에 관한 버전은 5.5.0 ~ 6.0.0 버전으로 적용한다.

- 대시보드 버전 관리는 별도로 진행한다.
  * 기본 1.0.0 부터 시작하여 Front-end, Back-end의 개별레포와 버전을 개별로 관리한다.
  * [HYolss Dashboard Web_Front-end :: Github](https://github.com/SOIV/HYolss-Dashboard-Web_Front-end)
  * [HYolss Dashboard Web_Back-end :: Github](https://github.com/SOIV/HYolss-Dashboard-Web_Back-end)
- 메인 웹사이트는 별도의 레포로 관리하여 버전 관리를 한다.
  * 메인 웹사이트 또한 1.0.0 부터 시작하며 Front-end, Back-end를 모노레포로 관리한다.
  * 모노레포 메인 관리는 Front-end 레포에서 사용되며 Back-end 레포는 추후 서비스 중 분리 작업이 필요할때 사용될 예정
  * [SOIV-Studio_website_Front-end(Private) :: Github](https://github.com/SOIV/SOIV-Studio_website_Front-end)
  * [SOIV-Studio_website_Back-end(Private) :: Github](https://github.com/SOIV/SOIV-Studio_website_Back-end)

- 모든 웹사이트와 봇과의 연동은 API를 통하여 통신한다.
- statuspage를 제작하여 `status.website.com`으로 표기한다.
  * 메인 웹사이트, 대시보드, 디스코드 봇 등 SOIV Studio와 연관된 모든 서비스 상태를 여기서 확인 가능하도록 한다.
  * 자체 제작 페이지가 될 가능성도 있음 / 기본 statuspage으로만은 추가 관리 및 확인이 가능한 대시보드가 필요하기 때문

## 1. 웹사이트 구조

- 도메인 : [호스팅케이알(hosting.kr)](https://www.hosting.kr/)
- DNS, DDoS, Workers 및 Pages, CDN : [클라우드플레어(cloudflare)](https://www.cloudflare.com/)
- 서버 : [AWS](https://aws.amazon.com/)
- 이메일
  * 메인 : biz@soiv-studio.xyz
    - 기본 모든 메일을 받는 메일 주소 / 문의, 광고, ETC
  * 서브 : help@soiv-studio.xyz
    - 웹페이지 또는 기타 서비스에서 별도로 도움이 필요할때 사용되거나 메인 메일이 작동 불능일때 사용하는 메일일
  * 자동메일 : noreply@soiv-studio.xyz
    - 인증코드, 회원가입, 회원탈퇴 등등

### 메인 사이트 구조
- `soiv-studio.xyz/` (메인)
- `soiv-studio.xyz/portfolio` (작업물)
- `soiv-studio.xyz/commission` (커미션)
- `soiv-studio.xyz/(discordbotname)-bot` (디스코드 봇 메인 페이지)

- `soiv-studio.xyz/account/dashboard` (웹사이트 대시보드)
- `soiv-studio.xyz/account` (웹사이트 어카운트 페이지)

- `soiv-studio.xyz/service/agreement` (이용약관) terms-of-service
- `soiv-studio.xyz/service/privacy` (개인정보처리방침) privacy-policy

- `status.soiv-studio.xyz` (statuspage)
  * `status.soiv-studio.xyz/dashboard` (statuspage Dashboard)
- `urlshort.soiv-studio.xyz` (urlshort/링크단축)
  * `urlshort.soiv-studio.xyz/dashboard` (urlshort Dashboard)
  * `urlshort.soiv-studio.xyz/movement/**` (urlshort 링크)

### 대시보드 구조
- `dashboard.soiv-studio.xyz` (봇 대시보드)
    * 디스코드 OAuth2 로그인 사용
    * 봇 관련 기능 전용 대시보드
    * SOIV_Studio-Project_BOT 에서 제작된 모든 디스코드 봇을 관리가 가능한 대시보드
- `dashboard.soiv-studio.xyz/serverid/home` (home)
- `dashboard.soiv-studio.xyz/serverid/**` (기능)
  * `dashboard.website.com/serverid/general-settings`
  * `dashboard.website.com/serverid/commands`
  * `dashboard.website.com/serverid/auto-moderation`
  * `dashboard.website.com/serverid/moderation`
  * `dashboard.website.com/serverid/social-notifications`
  * `dashboard.website.com/serverid/join-roles`
  * `dashboard.website.com/serverid/reaction-roles`
  * `dashboard.website.com/serverid/welcome-messages`
  * `dashboard.website.com/serverid/role-connections`
  * `dashboard.website.com/serverid/logging`
  * `dashboard.website.com/serverid/utility`
  * `dashboard.website.com/serverid/Music`
  * `dashboard.website.com/serverid/translate`
- `dashboard.soiv-studio.xyz/serverid/Premium/buy` (Premium - buy)
  * `dashboard.soiv-studio.xyz/serverid/Premium/settings` (Premium - settings)
- `dashboard.soiv-studio.xyz/serverid/new` (실험실/얼리 엑세스)
- `dashboard.soiv-studio.xyz/serverid/developer` (개발자 대시보드)
  * `dashboard.soiv-studio.xyz/developer`

### 로그인 시스템
1. 메인 사이트
    - SNS 로그인 (구글 등) 지원
    - 일반 회원가입 
        * (수집 및 등록 정보 : *이메일, *닉네임, 생년월일 / *처리는 필수 작성)
    - 관리자 전용 로그인 별도 구현(기본 로그인 시스템에 관리자 계정 등록으로도 갠찬을 듯)

2. 대시보드
    - 디스코드 로그인 전용
    - 관리자는 메인 사이트 크레덴셜로도 접근 가능

### 장단점
- 장점:
    * 각 서비스에 최적화된 인증 방식 사용
    * 서비스별 독립적인 리소스 관리
    * 트래픽 분산 효과
- 단점:
    * 추가 SSL 인증서 필요
    * 서브도메인 DNS 설정 필요
    * 서버 비용 증가 가능성

## 2. 봇 기능 구현

- 봇 캐릭터 작업 필요(별계의 작업/AI chat 작업 전에 작업 필요)
  * 신규 오리지널 캐릭터 및 설정 작업 필요, 캐릭터에 맞는 이름 적용
  * 작업이 필요한 일러스트 또는 디자인
    - 오리지널 캐릭터 설정표
      * 시즌별 의상, 기본 의상(기본, 사복, 교복, 수영복, 체육복, 잠옷, 운동복)
      * 여러 머리 스타일
    - 로고 디자인
      * 시즌별 로고
    - 프로필 일러스트
      * 시즌별 프로필, 이벤트 배너
    - 배너 일러스트 & 디자인
      * 시즌별 배너, 이벤트 배너
    - Emojis(이모지, 이모티콘) [갯수는 상황에 따라/최대 2000개 등록 가능/PNG, GIF]
      * 기본 Emojis
      * 이벤트 Emojis
  * 선택적 작업이 필요한 부분
    - 오리지널 Live2D (컨텐츠용)
    - 오리지널 3D (컨텐츠용)
    - 4컷 만화
    - 공식 일러스트
  * 봇 활동에 따른 SNS관련
    - YouTube 채널
    - Instagram
    - X(Twitter)
  * 개발자 관련 SNS, 플렛폼
    - YouTube
    - CHZZK
    - Instagram
    - X(Twitter)
- 시스템 작동 여부
  * 다음과 같은 상태에서는 작동이 중지 됩니다.
    - 점검 상태에 진입했을 경우 (서버, 봇 업데이트, 재부팅 등)
    - API 또는 서버에서 부하가 높아 서버가 정상적으로 작동하기 힘든 경우
    - 봇이 비상모드로 강재 중지 되었을 경우(강재 중지 되었을 경우 개발자 호출 필요)
  * 다음과 같은 상태에서는 일부 기능만 작동이 중지 됩니다.
    - 무점검 상태에 진입했을 경우 (서버를 중지하거나 일부 서버만 작동을 중지 한 경우)
    - 핫픽스를 위해 API 또는 일부 서버만 재부팅을 할 경우
    - 일부 기능중 실행도중 시스템 충돌 또는 자체 복구가 실행 불가하는 상태에 빠젔을 경우
- 동시 작업 및 필요한 기능
  * [대시보드] : 대시보드가 필요한 기능
  * [AI] : AI 시스템이 필요한 기능
  * [API] : API가 필요한 기능
  * [DB] : DB가 필요한 기능
  * [slash-command] : 슬레시 명령어(/)로 사용이 가능한 명령어
  * [Prefix] : 접두사로 사용이 가능한 명령어
  * [Embed] : 메시지 전송을 Embed 방식으로 전송하는 기능
  * [Message-Components] : 버튼 및 여러 방식을 사용하는 기능
  * [Emoji-Resource] : 이모지, 스티커를 사용하는 기능
  * [AUTO-System] : 자동으로 작동하는 시스템, 사용자가 명령어로 작동하는 방식이 아닌 기능

### 2-0-1. default command
- 정보(info)
  * 봇 정보를 보여줍니다.
  * 포함될 내용
    - 버전
      * 봇 버전
      * node.js 버전
      * Discord.js 버전
    - Developer
    - Uptime
    - Discord 관련 정보
      * 서버 수
      * 핑
- 지원(Support)
  * 지원서버의 초대 링크를 보여줍니다.
- 대시보드(dashboard)
  * 봇을 쉽게 조작또는 설정 할 수 있는 웹사이트를 안내합니다.
- 도움말(help)
  * 조작하기 힘든 명령어나 일부 설명이 필요한 명령어들을 알려줍니다.
- 핑(ping)
  * 서버와의 핑 테스트를 보여줍니다.

### 2-0-2. MAIN AI 시스템 (default AI system)
- default AI API : Google Gemini, OpenAI ChatGPT
- AI chat을 제외한 기본 시스템에서 작동하는 AI 기반 시스템입니다.
- 일반 AI 시스템과 AI chat의 작동 여부는 별개의 시스템으로 분리되어 운영됩니다.
  * 다만 AI chat에서 유저와 대화하다가 유저가 요청으로 설정을 요청하는 대화가 오갈 경우 설정을 도와주는 식의 방식으로 도음을 줌니다.
  * AI chat에서 기본적으로 작동은 Ask 상태로 작동되며 기존에 개발자가 조건을 걸어둔 내용에서 모든 내용을 충족하면 code 모드 즉 디버그 상태로 변경되었다는 알림과 요청 사항에 대한 내용이 전부 완료 되면 Ask 모드로 전환됩니다.
    - Ask -> (내부)요청사항 확인 -> (내부)디버그 조건 확인 -> (내부/code/디버그)조건이 부합시 알림과 요청사항 실행 -> (code/디버그)요청사항 실행 완료 -> Ask
- 주 AI 사용처는 다음과 같습니다.
  * 서버 관리 시스템 (AutoMod 등)
  * 서버 입장 및 서버 복원 시스템 (2-1, 2-5)
  * 사용자 상태 메시지 (기본값, AI LLM에서 호출되는 봇의 감정 상태 등)
  * 그외 AI 시스템이 필요한 기능들 (꼭 필요하다라는 값이 정해 젔을 경우에만 AI 적용)

### 2-1. 서버 입장 시스템 [메시지 조건 2개를 제외한 작업 완료]
[API] [DB] [Embed] [Message-Components] [AUTO-System]
1. 초대자 기반 메시지
    ```javascript
    // DB 구조
    {
        inviter_id: String,    // 초대한 유저 ID
        guild_id: String,      // 서버 ID
        invite_date: Date,     // 초대 날짜
        invite_count: Number   // 초대 횟수
    }
    ```

2. 서버 기록 기반 메시지
    ```javascript
    // DB 구조
    {
        guild_id: String,          // 서버 ID
        first_join_date: Date,     // 최초 입장 날짜
        last_leave_date: Date,     // 마지막 퇴장 날짜
        join_count: Number,        // 총 입장 횟수
        current_status: Boolean    // 현재 입장 상태
    }
    ```

3. 위의 2가지를 확인하여 하나의 메시지로 전송
    - 초대자 기반, 서버 입장 기록 기반으로 서버 입장시 메시지를 전송
    - 모든 내용은 Embed, Message Component 방식을 사용

4. 메시지 전송 조건 및 메시지 내용
    - 신규 유저, 신규 서버 / 두가지가 전부 신규일 경우 봇 입장 메시지
        ```
        # HYolss가 유저들에게 인사합니다! (인사 임티)

        저를 대리고 와주신 유저님! 처음 뵙겠습니다!
        나는 하나의 작은 별과 꿈을 가지고 나아가는 동행자 HYolss 이라고해!
        이 서버에 대려와준 (닉네임)님, 대리고 와줘서 고마워!

        일단 내가 작동하는 방식에 대해 짧개 알려줄깨!
        기본은 슬레시(/)를 사용하고 다른 방식으로는
        접두사 방식인 ! or = 으로 호출 및 명령어, 기능 사용이 가능하고
        명령어를 사용하면 버튼과 메뉴 선택이라는 기능을 주로 작동되니 이점 알아줘!

        명령어를 사용하는데 모르는 점이 있어?
        '/help'를 사용하여 각각의 명령어에 대한 설명과 사용법을 확인해 볼 수 있어!

        여기는 처음 왔는데 어떤 서버일까? 궁굼하다! 알려줄 동행자는 없나?

        [TIP] 기초 작업 시작 명령어인 '/setup'를 사용하여 서버에서 봇을 사용하기 위한 작업을 간편하게 진행을 할 수 있습니다!

        [!] 운영중인 HYolss은 테스트 버전 및 경험을 위해 제작 및 활동중인 봇이므로 봇이 종료되거나 버그 및 오류가 발생 할 수 있습니다.
        ```
    - 기존 유저, 기존(중복) 서버 / 두가지가 전부 신규가 아닐 경우 봇 입장 메시지
        ```
        # HYolss가 유저에게 인사합니다! (인사 임티)

        저를 대리고 와주신 유저님! 다시 뵙겠습니다!
        나는 하나의 작은 별과 꿈을 가지고 나아가는 동행자 HYolss 이라고해!
        이 서버에 대려와준 (닉네임)님, 대리고 와줘서 고마워!

        날 대리고온 동행자 (닉네임)님! 그리고 날 알고 있는 동행자가 보이네!
        그렇다면! 나에 대해 잘 알고 있는 동행자가 있으니 설명을 생략할깨!

        물론! 명령어를 사용하는데 모르는 점이 있어?
        '/help'를 사용하여 각각의 명령어에 대한 설명과 사용법을 확인해 볼 수 있어!

        글고보니 어라 여기는 와본적이 있는 것 같아!
        이 서버의 데이터가 복구 가능해! 동행자님 복구 시스템을 시작할까!?

        [TIP] 기초 작업 시작 명령어인 '/setup'를 사용하여 서버에서 봇을 사용하기 위한 작업을 간편하게 진행을 할 수 있습니다!

        [!] 운영중인 HYolss은 테스트 버전 및 경험을 위해 제작 및 활동중인 봇이므로 봇이 종료되거나 버그 및 오류가 발생 할 수 있습니다.
        ```
    - 신규 유저, 기존(중복) 서버 / 처음 보는 유저, 중복되는 서버인 경우 봇 입장 메시지
        ```
        # HYolss가 유저들에게 인사합니다! (인사 임티)

        저를 대리고 와주신 유저님! 처음 뵙겠습니다!
        나는 하나의 작은 별과 꿈을 가지고 나아가는 동행자 HYolss 이라고해!
        이 서버에 대려와준 (닉네임)님, 대리고 와줘서 고마워!

        일단 내가 작동하는 방식에 대해 짧개 알려줄깨!
        기본은 슬레시(/)를 사용하고 다른 방식으로는
        접두사 방식인 ! or = 으로 호출 및 명령어, 기능 사용이 가능하고
        명령어를 사용하면 버튼과 메뉴 선택이라는 기능을 주로 작동되니 이점 알아줘!

        명령어를 사용하는데 모르는 점이 있어?
        '/help'를 사용하여 각각의 명령어에 대한 설명과 사용법을 확인해 볼 수 있어!

        어라 지금 보니 여기는 와본적이 있는 것 같아! 근대 날 초대 해준 동행자는 처음 보는데?...
        누가 날 여기에 초대 해준적이 있는 것 같은데 알수가 없어!
        하지만 이 서버의 데이터가 복구 가능해! 동행자님 복구 시스템을 시작할까!?

        [TIP] 기초 작업 시작 명령어인 '/setup'를 사용하여 서버에서 봇을 사용하기 위한 작업을 간편하게 진행을 할 수 있습니다!

        [!] 운영중인 HYolss은 테스트 버전 및 경험을 위해 제작 및 활동중인 봇이므로 봇이 종료되거나 버그 및 오류가 발생 할 수 있습니다.
        ```
    - 기존 유저, 신규 서버 / 기존 유저, 신규 서버일 경우 봇 입장 메시지
        ```
        # HYolss가 유저들에게 인사합니다! (인사 임티)

        저를 대리고 와주신 유저님! 다시 뵙겠습니다!
        나는 하나의 작은 별과 꿈을 가지고 나아가는 동행자 HYolss 이라고해!
        이 서버에 대려와준 (닉네임)님, 대리고 와줘서 고마워!

        날 대리고온 동행자 (닉네임)님! 그리고 날 알고 있는 동행자가 보이네!
        그렇다면! 나에 대해 잘 알고 있는 동행자가 있으니 설명을 생략할깨!

        명령어를 사용하는데 모르는 점이 있어?
        '/help'를 사용하여 각각의 명령어에 대한 설명과 사용법을 확인해 볼 수 있어!

        여기는 처음 왔는데 어떤 서버일까? 궁굼하다! 알려줄 동행자는 없나?

        [TIP] 기초 작업 시작 명령어인 '/setup'를 사용하여 서버에서 봇을 사용하기 위한 작업을 간편하게 진행을 할 수 있습니다!

        [!] 운영중인 HYolss은 테스트 버전 및 경험을 위해 제작 및 활동중인 봇이므로 봇이 종료되거나 버그 및 오류가 발생 할 수 있습니다.
        ```
    - 그외 특정 기반 메시지(확정되지 않은 조건)

### 2-2. 플렛폼 알림 시스템(Social Notifications)
[대시보드] [API] [DB] [slash-command] [Embed]
- 스트리밍 플랫폼 알림 (플렛폼 우선순번)
  * YouTube : 공식 API 지원
  * Vimeo : 유튜브랑 똑같이 가능
  * Twitch : 공식 API 지원
  * CHZZK : API 제작 또는 라이브러리 제작 필요
  * SOOP : API 존제 여부 확인 필요 / 없으면 제작 필요
  * TikTok : 가능은 하는데 좀 힘듬
  * KICK : 안됨 (API 존제 여부가 확인 불가능)
  * Facebook Live : 안됨 (API 지원 X)
  * Instagram Live : 당연히 안됨 (API 지원 X)
  * 그외 여러 플랫폼
- SNS 알림 (마지막 과제)
  * X(Twitter) : API 유료
  * Instagram : 지원 종료(API에서 계시글 전송 불가)
  * Bluesky : 복잡함
  * Threads : API에서 계시글 전송 불가
  * Facebook : API에서 계시글 전송 불가
  * NAVER Cafe : 크롤링으로 제목에 링크로 알림 가능
  * Tumblr : 공식 API 지원
  * Mastodon : 공식 API 지원
  * Reddit : 공식 API 지원
  * RSS Feeds : 이건 그냥 만들면 됨
  * Podcast : 이건 머지; 그냥 안만들레요
  * 그외 여러 SNS
- 작업 및 표시 방식
    - 모든 표시방식은 Embed, Message Component 방식을 사용
    - 메시지 Embed 내용 설정은 기본값을 만들어두고 추후 대시보드에서 수정을 할 수 있도록 적용

### 2-3. 서버 관리 기능
[대시보드] [AI] [DB] [slash-command] [Prefix] [Embed] [Message-Components] [Emoji-Resource]
- 자동 역할 부여
- 환영 메시지 설정
- 명령어 권한 관리
- AutoMod/서버 활동 규정을 적용하여 자동 제재 기능 (경고 및 제재 시스템)
  * 항소 및 일부 기능 참고 : appeal.gg
- Logging : 서버내에서 유저 활동 로그 기능(추가 확인및 기획 필요/뽑을 수 있는 모든 로그는 띄울수 있도록)
- 서버 입장 캡차인증(뷰봇, 광고계정 걸러내기용)
- 일부 기능은 Zira, Sapphire, MEE6를 참고하여 추가 기능 제작 및 구현
- 관리자 문의 시스템
  * 서버내에 있는 관리진에게 문의를 남길 수 있는 시스템
  * 대표적인 봇 : Ticket Tool, ModMail

### 2-4. 유틸리티
[대시보드] [API] [DB] [slash-command] [Prefix] [Embed] [Message-Components] [Emoji-Resource]
- 오늘의 시리즈(이미 제작됨/한국어 전용)
  * 메뉴 추가(개발자 전용)
    - [개발자 전용 명령어] 새로운 메뉴를 추가합니다.
  * 오늘의 메뉴
    - 오늘의 메뉴를 추천해줍니다.
  * 오늘의 편의점
    - 오늘의 편의점 메뉴를 추천해줍니다.
- 추첨/투표 시스템
  * 여러 방식의 추첨 기능
  * 디스코드 기본 투표 시스템 / 다른 방식의 투표 기능
  * /반응 추첨 영상업로드날짜: 2025-02-28 20:37:00 채널: #🎉ㆍ이벤트 메시지: 1344996894727733288 반응: ✅ 인원: 1
    - 반응 집계가 되어 있지 않을 경우
    ```
    반응을 추가한 사람들의 데이터가 집계되어 있지 않습니다. '/반응 집계' 명령어를 먼저 사용해주세요.
    ```

    - 반응 집계가 완료된 경우 (예시 1명 추첨)
    ```
    ✅ 반응을 추가한 1명의 사람들을 집계된 데이터에서 추첨하였습니다.

    [추첨 방식]
    1. 이벤트 참여자마다 100개의 추첨 공을 넣습니다.
    2. 이벤트 영상 업로드 날짜 이전부터 참여 중이던 사람들은 추첨 공을 1개 더 넣습니다.

    [추첨 데이터]
    - 추첨 대상 인원: 3298명
    - 가중치 적용 인원: 2664명
    - 추첨 공 개수: 332464개 (가중치 대상은 추첨 공 1개 추가)
    - 계산식: (3298 X 100) + 2664 = 332464

    1. @** - 서버 가입일: *달 전

    당첨을 축하드립니다.
    ```
  * /반응 집계
  ```embed
  {
    "embeds": [
      {
        "title": "메시지에 반응한 사람 목록 집계",
        "description": "디스코드 서버에서 메시지에 응답한 사람들의 목록을 가져와 데이터베이스에 등록 완료했습니다.",
        "color": 5172003,
        "fields": [
          {
            "id": 831227294,
            "name": "반응만 남기고 서버를 퇴장한 사람(제외 처리)",
            "value": "282명",
            "inline": false
          },
          {
            "id": 144354947,
            "name": "최종적으로 집계된 모든 사람",
            "value": "12835명"
          },
          {
            "id": 746830571,
            "name": "마지막 상태 업데이트",
            "value": "5일 전"
          }
        ]
      }
    ]
  }
  ```
  ```
  메시지에 반응한 사람 목록 집계
  디스코드 서버에서 메시지에 응답한 사람들의 목록을 가져와 데이터베이스에 등록 완료했습니다.
  반응만 남기고 서버를 퇴장한 사람(제외 처리)
  282명
  최종적으로 집계된 모든 사람
  12835명
  마지막 상태 업데이트
  5일 전
  ```
- 양식 시스템 (대시보드 제작 및 기존 작업 초기화 완료)
  * 관리자가 양식을 만들어서 유저가 그 양식을 작성하여 채팅채널에 전송이 가능한 시스템
  * Message-Components -> Text Inputs 기능을 사용
  * 기본 양식 불러오기는 slash-command으로 사전에 제작된 명령어에서 양식을 선택하여 불러오기
  * 개발자가 사전에 예시로 제작된 양식을 볼 수 있도록 대시보드에서 불투명도 80% 정도의 표시로 볼 수 있도록 작업
- 채널 시스템
  * 통화방 생성기 / 예시는 TempVoice를 참고
- 멤버 카운트 시스템
  * 역할 또는 유저와 봇 갯수에 따라 카운드를 표시하는 시스템
  * 유저와 봇 카운트를 별도로 표시 할 수 있도록 작업 필수
- 채팅 청소 [청소, prune] (확정 안됨 / 아마 제작 안할듯)
  사용시 뜨는 문구
  ```Embed
  00개의 메세지(들)을/를 삭제하고 있어요... 잠시 기다려주세요.
  ```
  삭제 완료시
  ```Embed
  완료! 아래에 결과를 표시할게요.
  
  정리결과
  모든 메시지를 삭제했어요
  ```숫자```
  오래된 메시지들을 삭제했어요
  ```숫자```
  유저에 의해 메시지가 삭제되었어요
  ```
  kileu#0001 : 숫자
  ```
  자동 삭제 기능이 작동되었어요. 10초후 메시지를 삭제할꺼에요. 'c'를 눌러 취소할 수 있어요
  ```
- Emote 시스템 (확정 안됨)
  * BTTV, 7TV와 같은 이모티콘(이모지)를 사용 하거나 서버내에 등록을 할 수 있도록 제작

### 2-5. 서버 설정 복원 시스템
[대시보드] [DB] [AUTO-System]
- 서버 설정 복원 시스템은 Xenon 참고
```javascript
// 서버 설정 DB 구조
{
    guild_id: String,
    settings: {
        command_channels: [채널ID들],
        notification_settings: {
            twitch: { enabled: Boolean, channel_id: String },
            youtube: { enabled: Boolean, channel_id: String }
        },
        auto_roles: [역할ID들],
        welcome_message: {
            enabled: Boolean,
            channel_id: String,
            message: String
        },
        custom_prefix: String,
        permissions: {
            admin_roles: [역할ID들],
            mod_roles: [역할ID들]
        }
    },
    version: Number,
    last_updated: Date,
    settings_history: [{
        version: Number,
        changed_at: Date,
        changed_by: String, // 변경한 관리자/봇 ID
        changes: {
            field: String, // 변경된 필드
            old_value: any, // 이전 값
            new_value: any  // 새로운 값
        }
    }],
    backup: {
        enabled: Boolean,
        interval: String, // 백업 주기
        last_backup: Date,
        storage_limit: Number // 보관할 최대 백업 수
    }
}
```

### 2-6. 커스텀 명령어 시스템
[대시보드] [DB] [slash-command] [Prefix] [Embed] [Message-Components] [Emoji-Resource]
- 대시보드 작업과 동시에 작업 예정 [커스텀 명령어 작성을 명령어로는 복잡 해질 경우가 있음]
- 간편모드로 MEE6, Sapphire와 같은 커스텀 명령어 제작 방식
- node.js, CSS으로 직접 명령어 코딩을 하여 작동하는 방식 (고급 사용자용)

### 2-7. 음악 시스템
[대시보드] [API] [slash-command] [Prefix] [Embed] [Message-Components] [Emoji-Resource]
- 지원 플렛폼
  * YouTube(YouTube/YouTube Music) : 공식 API 지원
  * Spotify : API 지원은 하나 최근 정책 변경으로 불가능 가능성 있음
  * SoundCloud : 공식 API 지원
  * 그외 플렛폼은 지원 예정 없음 (유튜브만 있어도 왠만한거는 다 틀수 있지 않음?)
- 시스템 제작 여부는 확정되지 않았습니다.
- 별계의 봇으로 운영 될 가능성도 있음 / 실험실을 통하여 테스트 가능성 있음
- 시스템 방식
  * 기본 사운드 시스템은 마이크를 통한 사운드 송출
  * MV 또는 영상을 볼 수 있도록 화면 송출 시스템
  * 활동기능을 활용한 음악 재생
    - 예쁘지만 심플한 재생 UI
    - 오른쪽에 재생 상태 UI (재생목록은 펼첬다가 접었다가 가능)
    - 왠쪽에 검색 UI
    - MV 버튼을 통해 영상 시청 가능

### 2-8. 변역 시스템(Translate)
[API] [slash-command] [Embed] [Message-Components]
- 지원하는 변역 시스템
  * 채팅
  * 통화방
  * 알림 시스템 내용
    - 일부 시스템에서만 지원합니다.
- 지원 하는 API
  * 구글 변역기 API
    - 메인으로 작동동
  * 네이버 파파고 API(미확정)
    - 사용 가능할 경우 유저가 설정을 변경하여 사용 가능

### 2-9. 게임관련 시스템
[API] [slash-command] [Embed] [Message-Components]
- 게임 전적 검색 시스템
  * OP.gg, TRN을 통하여 전적 검색 기능 (TRN API 확인 완료, op.gg API 확인 불가능, 라이엇 API 확인 완료)
  * 게임 종류는 해당 전적 시스템에서 지원하는 게임 종류 수만큼
- 게임 내전/대회 시스템
  * 게임 사설 방을 체크하여 운영하는 시스템
  * 사용자지정게임 플레이를 할 수 있는 게임을 전부 지원 예정
  * 상황에 따라 제작 여부 확정 안됨

### 2-10. AI 채팅 시스템 (LLM/GPT)
[대시보드] [API] [AI] [DB] [Emoji-Resource]
- 모든 기능 작업 완료 후 마지막으로 작업 예정
- API 사용 또는 자체 LLM 사용 계획 필요
- 단일 AI 채팅 시스템이 아닌 AI버튜버인 뉴로사마(Neurosama)와 같이 성격이 부여된 AI 채팅 시스템
- TTS, Live2D를 디스코드 내에 적용할 예정은 1도 없음
  * 하게 되면 너무 많은 작업이 요구됨
  * 물론 딥 러닝을 통한 게임 플레이는 X / 채팅으로 놀고 간단한 게임하고 하는건 가능할지도?
- 모델 선택 및 학습
    * 기본 모델 선택 (GPT-3.5/4, LLaMA, Claude, LLM 등)
    * Fine-tuning 데이터셋 구축
        - 캐릭터 성격에 맞는 대화 데이터 수집
        - 롤플레잉 시나리오 작성
        - 멀티턴 대화 컨텍스트 구성
        - 금지어, 대화 필터 구성 및 작성
    * 모델 학습 및 평가
        - 하이퍼파라미터 최적화
        - 성능 메트릭 정의
        - A/B 테스트 계획
- 컨텍스트 관리 시스템
    * 대화 기록 저장 및 관리
    * 컨텍스트 윈도우 최적화
    * 메모리 관리 전략
    * 세션 관리 정책
- 토큰 사용량 관리
    * 사용량 모니터링 시스템
    * 사용자별 할당량 설정
    * 비용 최적화 전략
    * 캐시 시스템 구현
- 안전성 및 필터링
    * 콘텐츠 필터링 시스템
    * 악의적 입력 방지
    * 응답 검증 로직
    * 긴급 중단 시스템
- 성능 최적화
    * 응답 시간 최적화
    * 배치 처리 구현
    * 로드 밸런싱 전략
    * 분산 처리 시스템
- 통합 AI 시스템
    * 채팅 외 기능 AI 통합
        - 명령어 의도 파악
        - 자연어 명령 처리
        - 컨텍스트 기반 추천
    * 멀티모달 지원
        - 이미지 인식/생성
        - 음성 인식/합성
        - 감정 분석

## 3. 웹사이트 및 대시보드 기능 구현

### 대시보드 기능
- 봇 상태 모니터링([statuspage](https://www.atlassian.com/ko/software/statuspage))
- 서버별 설정 관리
- 명령어 사용 통계
- 알림 설정 관리
- 사용자 권한 관리
- [ Premium ]구독 시스템(유료/결제 시스템 구현 필요 / 월, 년, 평생 결제 시스템)
- 밝은, 다크, 기기 테마 모드 (계정 저장/기기 저장?)
- 사이트 언어 (한국어, 영어, 일본어(?))
- random-words-store 폴더내에 있는 단어 목록 확인 페이지

### UI/UX 개발 프로세스
1. 디자인 준비
  - UI 디자인 파일 작성
  - 필요한 이미지 에셋 준비
  - 컴포넌트 구조 설계
  - Figma UI/UX
    * PC, Mobile 전용 UI/UX
    * PC 버전의 UI/UX를 우선

2. 구현 단계
  - 컴포넌트별 개발
  - 반응형 디자인 적용
  - 접근성 고려

3. 테스트
  - 자동화된 테스트
    * 단위 테스트 (Jest/Mocha)
    * 통합 테스트 (SuperTest)
    * E2E 테스트 (Cypress/Playwright)
  - 크로스 브라우저 테스트
    * 주요 브라우저 호환성 검증
    * 반응형 디자인 테스트
  - 모바일 환경 테스트
    * 다양한 디바이스 해상도 테스트
    * 터치 인터랙션 테스트
  - 사용성 테스트
    * 사용자 시나리오 기반 테스트
    * A/B 테스트
  - 성능 테스트
    * 부하 테스트 (k6/Artillery)
    * 스트레스 테스트
    * 메모리 누수 테스트
  - 보안 테스트
    * 취약점 스캔
    * 침투 테스트
  - 장애 복구 테스트
    * 장애 주입 테스트
    * 백업/복구 프로세스 검증

4. 국제화(i18n)
  - 다국어 지원
    * 커뮤니티 기반 번역 시스템
      - Crowdin/Transifex/Lokalise 등의 플랫폼 활용
      - 커뮤니티 번역가 보상 시스템
      - 번역 품질 검수 프로세스
      - 번역 진행률 대시보드
      - 개발자에서 정식 지원하는 언어는 기본 3개
        * default locales : en-US, ja-JP, ko-KR
        * default locales를 제외한 모든 언어는 정식 지원하는 언어가 아님
    * 번역 관리 시스템 구축
      - 번역 키 체계 설계
      - 누락된 번역 자동 감지
        * 변역 되지 않은 부분은 영어로 표시
        * 한국어는 default 언어이기에 제외
      - 번역 버전 관리
      - 번역 메모리(TM) 구축
    * 동적 언어 전환
      - 실시간 언어 변경
        * 언어 표시는 사용자가 지정하여 변경 가능
      - 언어별 폰트 최적화
        * IBM Plex Sans 사용 (en-US, ja-JP, ko-KR 지원)
      - RTL 지원 (아랍어 등)
    * 번역 워크플로우
      - 신규 텍스트 자동 추출
      - 번역가 할당 시스템
      - 리뷰어 검수 프로세스
      - 배포 자동화
        * 배포 확정시 대시보드에는 자동 업데이트 적용, 봇에는 점검시에 자동 업데이트 적용
  - 지역화
    * 타임존 처리
    * 날짜/시간 포맷 (ISO 639-1 Code)
    * 통화 표시 (달러(USD), 엔화(JPY), 원화(WON))
  - 문화적 고려사항
    * 아이콘/이미지 현지화
    * 색상 스키마 조정
    * 텍스트 방향 지원

## 4. 봇, 웹사이트 및 대시보드 기능 [ 동시 작업 ]

### 개발자 전용 시스템
- 공지 시스템
  * 개발자가 전송하는 공지 시스템 / 서버점검, 업데이트, 일반 공지 등등
- 모듈
  * 기능을 on/off를 봇에서 할 수 있는 기능
  * /load, /reload, /unload

### 실험실 시스템
- 기능 추가를 위해 일부 기간동안 피드백 및 개선을 위한 실험실 기능
- 실험실은 시작한 날을 기준으로 약 1~3달 동안 테스트와 사용을 할 수 있음
- 관리자가 직접 대시보드에서 실험실 목록에서 끄고 키고가 가능
- 의견 및 피드백은 SOIV Studio Support 디스코드 채널 또는 대시보드에서 작성 후 제출

### Premium [ 유료 서비스 ]
- Premium에 관하여
  * Premium은 제한되어 있는 기능들을 원활하게 사용과 잠겨있는 기능들을 사용하기 위해 존제하는 유료 서비스입니다.
  * 결제 방식은 매월, 매년, 평생을 전부 지원하며 일부 기능은 평생 결제를 지원하지 않습니다.
  * 플레티넘 1개 결제시 최대 서버 2~3개의 서버에서 사용이 가능하며 서버 선택은 니트로 부스터처럼 선택 및 변경이 가능합니다.
    - 서버 변경은 매달 각 1회가 최대입니다. / 디스코드 니트로 부스터와 같은 방식
  * Premium 결제 등급은 다음과 같이 선택하여 사용이 가능합니다.
    - default Premium
      * 가장 기본적인 봇 이름과 프로필 이미지 변경, 제한되지 않은 기능 사용이 들어있는 페키지 입니다.
      * 기본 바탕이 되는 페키지입니다, 매월, 매년, 평생 결제를 전부 지원합니다.
    - default Premium (AI+)
      * default Premium에서 제한되지 않은 AI 시스템이 포함된 페키지입니다.
      * AI system으로 인해 추가금이 발생할 수 있습니다.
      * 상황에 따라 평생 결제가 지원되지 않을 수 있습니다.
    - Premium (AI+)
      * 봇 이름과 프로필 이미지 변경, 제한되지 않은 AI 시스템만 포함된 페키지입니다.
      * AI system으로 인해 추가금이 발생할 수 있습니다.
      * 상황에 따라 평생 결제가 지원되지 않을 수 있습니다.
    - Premium Custom for AI+
      * default Premium (AI+) 및 Custom branded bots가 포함된 페키지입니다.
      * 이 페키지는 평생 결제가 불가능합니다.
- 결제 시스템은 토스페이먼츠를 사용
  * 국내 결제, 해외 결제 전부 토스페이먼츠를 사용
    - 상황에 따라 일부 다른 결제 방식도 사용될 예정
  * 해외 결제는 토스페이먼츠를 사용하되 페이팔 연동하여 사용 가능
  * [토스페이먼츠(Tosspayments)](https://developers.tosspayments.com/)
- Premium 기본 포함된 내용
  * 봇 이름 변경
  * 봇 프로필 이미지 변경
  * 제한되지 않은 기능 사용
    - 커스텀 명령어
    - 채널 시스템
    - 양식 시스템
    - 추첨/투표 시스템
    - Social Notifications
    - Music
    - Translate
    - 게임 내전/대회
  * 제한되지 않은 AI system
    - default AI system
    - AI chat system
- Premium 선텍적 내용
  * Custom branded bots (추가금 발생/별도 결제 가능)

## 5. 추가 고려사항

### 보안 고려사항
- HTTPS 필수 적용
- API 엔드포인트 보안
  * Rate Limiting 정책 구현 (IP 기반, 유저 기반)
  * API 키 관리 및 만료 정책
  * 요청 검증 미들웨어 구현
- 토큰 관리
  * OAuth2 토큰 암호화 저장
  * 토큰 자동 갱신 시스템
  * 세션 관리 및 만료 정책
- 권한 관리
  * RBAC(Role-Based Access Control) 구현
  * 권한 상속 시스템
  * 권한 감사 로그
- DDoS 방어 (Cloudflare 활용)
- 데이터 암호화
  * 중요 데이터 AES-256 암호화
  * 키 순환 정책
  * 암호화 키 관리 시스템

### 성능 최적화
- 이미지 최적화
- 캐싱 전략
- CDN 활용
- 데이터베이스 인덱싱
- 로드 밸런싱 고려

### 모니터링 및 로깅
- 서버 상태 모니터링
  * 시스템 메트릭 (CPU, 메모리, 디스크)
  * 네트워크 트래픽 모니터링
  * 서비스 가용성 체크
  * 알림 임계값 설정 및 알림 구성
- 에러 로깅 및 추적
  * 구조화된 로그 포맷 (JSON)
  * 로그 레벨 관리
  * 로그 보관 기간 정책
  * 에러 스택 트레이스 수집
- 사용자 행동 분석
  * 명령어 사용 패턴
  * 기능별 사용량 통계
  * 사용자 세션 분석
  * 실시간 사용자 모니터링
- 성능 메트릭 수집
  * API 응답 시간 측정
  * 데이터베이스 쿼리 성능
  * 캐시 히트율
  * 리소스 사용량 추이
- 모니터링 도구 통합
  * Prometheus/Grafana 대시보드
  * ELK 스택 구성
  * APM 도구 연동
  * 알림 통합 (Slack/Discord)

### 백업 전략
- 데이터베이스 정기 백업
- 설정 파일 백업
- 복구 절차 문서화

### 확장성 고려
- 마이크로서비스 아키텍처 고려
  * 서비스간 통신: gRPC/RabbitMQ 사용
  * 서비스 디스커버리: Consul/etcd 활용
  * API Gateway: Kong/Traefik 구현
  * 서비스 메시: Istio 검토
- 컨테이너화 가능성
  * Docker 컨테이너화
  * Kubernetes 오케스트레이션
  * CI/CD 파이프라인 구성 (Jenkins/GitLab CI)
  * 컨테이너 모니터링 (Prometheus/Grafana)
- 서버리스 구조 검토
  * AWS Lambda/Azure Functions 활용
  * 이벤트 기반 아키텍처 구현
  * 서버리스 데이터베이스 연동
  * 비용 최적화 전략
- 봇 활동량에 따른 서버 샤드 작업화 및 샤드 그룹화(클러스터)
  * Redis Pub/Sub 기반 샤드간 통신
  * 자동 샤드 스케일링 시스템
  * 샤드 상태 모니터링
  * 샤드간 데이터 동기화 전략
- Custom branded bots에 대한 별도 서버 준비 작업 및 대응
  * 전용 인프라 구성
  * 리소스 격리
  * 커스텀 도메인 지원
  * 전용 모니터링 시스템

## 5. 문서 작업 및 커뮤니티

### 약관 및 정책
- 안전한 운영 및 필요한 약관 및 정책에 대한 내용 작성 필수 (언어에 따른 한국어, 영어 작성 필요)
- 서비스 약관 : terms-of-service
- 개인정보 보호정책 : privacy-policy
- 철회권 : Right of withdrawal
- 법적 고지 : Legal Notice
- Licenses : 제작하는데 포함된 라이브러리

### 개발자 문서화 및 가이드라인
- API 문서화
  * OpenAPI/Swagger 스펙 작성
  * API 엔드포인트 상세 설명
  * 요청/응답 예제 제공
  * API 버전 관리 정책
  * 에러 코드 및 처리 방안
- 개발자 가이드라인
  * 코드 스타일 가이드
  * Git 커밋 메시지 규칙
  * 코드 리뷰 프로세스
  * 브랜치 관리 전략
  * 릴리즈 프로세스
- 기술 문서
  * 아키텍처 설계 문서
  * 데이터베이스 스키마 문서
  * 배포 프로세스 가이드
  * 트러블슈팅 가이드
  * 성능 최적화 가이드
- 커뮤니티 기여 가이드라인
  * 이슈 리포팅 템플릿
  * PR 제출 가이드
  * 행동 강령 (Code of Conduct)
  * 라이선스 정책
  * 기여자 크레딧 정책

### 커뮤니티 참여 및 보상 시스템
- 번역 기여 시스템
  * 기여도 포인트 제도
    - 번역 수량 기반 포인트
    - 번역 품질 기반 보너스
    - 리뷰 참여 보상
    - 포인트 등급 시스템
  * 기여자 혜택
    - 특별 역할 부여
    - 프리미엄 기능 이용권
    - 커스텀 프로필 배지
    - 공식 크레딧 등재
  * 번역 품질 관리
    - 피어 리뷰 시스템
    - 전문 검수자 지정
    - 오류 신고 보상
    - 품질 지표 관리
  * 커뮤니티 활성화
    - 번역 순위표
    - 월간 우수 기여자 선정
    - 번역 이벤트 및 챌린지
    - 커뮤니티 피드백 반영
- 개발 기여 시스템
  * 코드 기여 보상
    - 버그 수정 포인트
    - 기능 개발 보상
    - 코드 리뷰 참여 보상
    - 문서화 기여 보상
  * 개발자 혜택
    - 개발자 배지
    - API 사용량 증가
    - 개발자 전용 채널 접근
    - 기술 멘토링 기회
  * 프로젝트 참여 기회
    - 핵심 개발팀 합류 기회
    - 프로젝트 리더 역할
    - 기술 세미나 발표 기회
    - 오픈소스 프로젝트 주도

### 디스코드 Support 서버 및 커뮤니티 서버 관련
- 기존에 조용하게 준비중이였던 Kileu NETWORK의 커뮤니티 및 기획안의 작업 관련 계획 세부화(?)
- SOIV Studio Support에서 봇에 대한 문제 및 QnA, 봇 공식 커뮤니티 서버 운영
- 그외 관련된 기획안 및 준비 단계의 작업들을 계획 세부화 또는 철회 작업

## 6. 필요한 패키지

### 웹사이트
- next.js (웹 프레임워크)
- ejs 또는 react (프론트엔드)
- passport (인증)
- express-session (세션 관리)
- mongoose 또는 sqlite3 (데이터베이스)

### 봇 대시보드
- next.js (웹 프레임워크)
- ejs 또는 react (프론트엔드)
- discord.js (디스코드 API)
- passport-discord (디스코드 OAuth2)
- express-session (세션 관리)
- 데이터베이스 패키지

## 7. 호스팅 고려사항

### 서버 요구사항
- Node.js 실행 환경
- 24/7 안정적 가동
- SSL 인증서
- 최소 1GB RAM (권장 2GB 이상)
- 데이터베이스 지원

### 추천 호스팅 서비스
- AWS (메인 호스팅)
- Google Cloud
- DigitalOcean
- Heroku
- Vercel (프론트엔드)
- MongoDB Atlas (데이터베이스)
- PostgreSQL 17.4 (데이터베이스)

### 필수 설정
- 환경 변수 관리
- 도메인 및 DNS 설정
- 백업 시스템
- 모니터링 도구

## 8. 개발 및 배포 프로세스

### Git 브랜치 전략

```
main (또는 master) ← 메인 버전
   ↑
development ← 개발 버전
   ↑
feature/* ← 새로운 기능 개발
```

#### 브랜치 설명
1. main (또는 master)
   - 실제 서비스에 배포되는 안정적인 버전
   - 철저한 테스트와 코드 리뷰를 거친 코드만 병합
   - 직접적인 커밋은 금지, development 브랜치를 통해서만 업데이트

2. development
   - 개발 중인 코드가 모이는 브랜치
   - 새로운 기능 개발이 완료되면 여기에 병합
   - 충분한 테스트 후 main 브랜치로 병합

3. feature/*
   - 새로운 기능 개발을 위한 브랜치
   - development 브랜치에서 분기
   - 기능 개발 완료 후 development로 병합
   - 브랜치명 예시: feature/login, feature/dashboard

#### 작업 프로세스
1. 기능 개발 시작
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/새기능
   ```

2. 기능 개발 완료 후
   ```bash
   git add .
   git commit -m "feat: 새로운 기능 추가"
   git push origin feature/새기능
   ```

3. development 브랜치로 병합
   ```bash
   git checkout development
   git merge feature/새기능
   git push origin development
   ```

4. main 브랜치로 배포
   ```bash
   git checkout main
   git merge development
   git push origin main
   ```

### 환경 설정 분리
```
config/
  ├── config.main.json    # 메인 서버 설정
  ├── config.dev.json     # 개발 서버 설정
  └── config.local.json   # 로컬 테스트 설정
```

### 배포 구조
1. 코드 관리 (GitHub/GitLab)
```
Repository
├── main 브랜치 → 실제 서비스
└── development 브랜치 → 개발/테스트
```

2. 웹사이트 배포 (Cloudflare)
- 메인 사이트: `website.com`
  * main 브랜치에서 자동 배포
  * 프로덕션 환경 설정 사용
- 개발 버전: `dev.website.com`
  * development 브랜치에서 자동 배포
  * 개발 환경 설정 사용

3. 디스코드 봇 배포
- 메인 봇:
  * 호스팅 업체에서 24/7 구동
  * main 브랜치 기반 배포
  * 실제 서비스용 토큰 사용
- 개발용 봇:
  * 별도 호스팅 또는 로컬 실행
  * development 브랜치 기반
  * 테스트용 토큰 사용

## 9. 테스트 환경 구성

### 로컬 테스트 환경
```
개발 PC ─→ 로컬 봇 ─→ 테스트 서버
      └─→ 로컬 웹사이트
```

### 호스팅 테스트 환경
```
호스팅 서버 ─→ 개발용 봇 ─→ 테스트 서버
          └─→ dev.website.com
```