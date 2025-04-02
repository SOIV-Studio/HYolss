# 데이터베이스 설정 가이드

## Supabase 설정

1. [Supabase](https://supabase.com/)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트가 생성되면 프로젝트 URL과 API 키를 확인합니다.
   - 프로젝트 설정 > API > URL
   - 프로젝트 설정 > API > anon/public 키
   - 프로젝트 설정 > API > service_role 키 (마이그레이션용)
3. SQL 에디터에서 다음 테이블을 생성합니다:
   ```sql
   -- 서버 입장 기록을 저장하는 테이블
   CREATE TABLE IF NOT EXISTS bot_server_history (
     id SERIAL PRIMARY KEY,
     guild_id VARCHAR(20) NOT NULL,
     first_join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     last_leave_date TIMESTAMP WITH TIME ZONE NULL,
     join_count INTEGER DEFAULT 1,
     current_status BOOLEAN DEFAULT TRUE,
     UNIQUE(guild_id)
   );

   -- 초대자 정보를 저장하는 테이블
   CREATE TABLE IF NOT EXISTS bot_inviter_tracking (
     id SERIAL PRIMARY KEY,
     inviter_id VARCHAR(20) NOT NULL,
     guild_id VARCHAR(20) NOT NULL,
     invite_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(inviter_id, guild_id)
   );

   -- 유저 정보를 저장하는 테이블
   CREATE TABLE IF NOT EXISTS user_profiles (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(20) NOT NULL,
     username VARCHAR(100),
     email VARCHAR(255),
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(user_id)
   );

   -- 서버별 봇 설정을 저장하는 테이블
   CREATE TABLE IF NOT EXISTS bot_server_settings (
     id SERIAL PRIMARY KEY,
     guild_id VARCHAR(20) NOT NULL,
     prefix VARCHAR(10) DEFAULT '!',
     language VARCHAR(10) DEFAULT 'ko-KR',
     enabled_features JSONB DEFAULT '{"welcome": true, "logging": true, "automod": false}',
     custom_settings JSONB,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(guild_id)
   );
   ```
4. .env 파일에 Supabase 연결 정보를 추가합니다:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your_supabase_api_key
   SUPABASE_SECRET=your_supabase_service_role_key
   ```

## MongoDB Atlas 설정

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에 가입하고 새 클러스터를 생성합니다.
2. 클러스터가 생성되면 "Connect" 버튼을 클릭하고 연결 방법을 선택합니다.
3. 데이터베이스 사용자를 생성하고 IP 액세스 목록에 필요한 IP를 추가합니다.
4. 연결 문자열을 복사합니다.
5. .env 파일에 MongoDB 연결 정보를 추가합니다:
   ```
   MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/
   MONGODB_DB_NAME=hyolss_bot
   ```

## 데이터 마이그레이션

기존 PostgreSQL 데이터를 Supabase로 마이그레이션하려면 다음 명령어를 실행합니다:

```bash
node database/migrate_to_supabase.js
```

MongoDB Atlas 초기 설정을 위해 다음 명령어를 실행합니다:

```bash
node database-nosql/setup_mongodb.js
```

## 봇 실행

모든 설정이 완료되면 다음 명령어로 봇을 실행합니다:

```bash
node index.js
```

# 데이터베이스 구조

## Supabase (관계형 데이터)

- **bot_server_history**: 봇이 서버에 입장/퇴장한 기록
- **bot_inviter_tracking**: 봇을 초대한 사용자 정보
- **user_profiles**: 유저 정보 (SSO 로그인, 계정 설정)
- **bot_server_settings**: 서버별 봇 설정 (Prefix, 활성화 기능 등)

## MongoDB Atlas (비관계형 데이터)

- **command_logs**: 명령어 사용 기록
- **error_logs**: 오류 로그
- **notifications**: 디스코드 알림 시스템 (게시글 알림, 스트리밍 알림 등)