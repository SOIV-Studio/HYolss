# Database - HYolss Discord Bot

## 데이터베이스 구성

### 이중 데이터베이스 시스템
HYolss는 두 개의 데이터베이스를 동시에 사용합니다:
- **Supabase (PostgreSQL)**: 메인 관계형 데이터베이스
- **MongoDB Atlas**: NoSQL 보조 데이터베이스

## 파일 구조

### sql-supabase.js
- **역할**: Supabase PostgreSQL 연결 관리
- **기능**:
  - 연결 테스트 (`testConnection`)
  - Supabase 클라이언트 인스턴스 제공
  - 환경변수 기반 설정

### nosql-mongodb.js
- **역할**: MongoDB Atlas 연결 관리
- **기능**:
  - 연결 테스트 (`testConnection`)
  - MongoDB 연결 관리 (`connect`)
  - 데이터베이스 인스턴스 제공 (`getDb`)

## 환경 변수 설정

### Supabase 설정
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_api_key_here
SUPABASE_SECRET=your_supabase_service_role_key_here
```

### MongoDB 설정
```env
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB_NAME=your_database_name_here
```

## 사용 방법

### Supabase 사용
```javascript
const { supabase, testConnection } = require('./database/sql-supabase');

// 연결 테스트
await testConnection();

// 데이터 조회
const { data, error } = await supabase
    .from('table_name')
    .select('*');
```

### MongoDB 사용
```javascript
const { getDb, testConnection, connect } = require('./database/nosql-mongodb');

// 연결 및 테스트
await connect();
await testConnection();

// 데이터베이스 사용
const db = getDb();
const collection = db.collection('collection_name');
const result = await collection.find({}).toArray();
```

## 데이터베이스 연결 초기화

### index.js에서 연결 테스트
```javascript
// 시작 시 두 데이터베이스 모두 연결 테스트
const { testConnection: testSupabaseConnection } = require('./database/sql-supabase');
const { testConnection: testMongoConnection, connect: connectMongo } = require('./database/nosql-mongodb');

// MongoDB 연결
await connectMongo();

// 연결 테스트
await testSupabaseConnection();
await testMongoConnection();
```

## 데이터 구조 및 용도

### Supabase (PostgreSQL)
- **메뉴 데이터**: 오늘의메뉴 기능용 메뉴 목록
- **서버 설정**: 길드별 설정값 저장
- **사용자 데이터**: 사용자 관련 정보

### MongoDB (NoSQL)
- **로그 데이터**: 명령어 사용 로그
- **임시 데이터**: 세션 기반 임시 저장
- **캐시 데이터**: 자주 사용되는 데이터 캐싱

## 마이그레이션 계획

### 현재 작업 중
- [ ] **메뉴 시스템 DB 이전**: txt 파일 → Supabase
- [ ] **Supabase 재설정**: 기존 설정 재구성
- [ ] **Lite 버전 동기화**: 메인 버전과 데이터 동기화

### 마이그레이션 우선순위
1. 메뉴 데이터 Supabase 이전
2. 기존 txt 파일 시스템 제거
3. Lite 버전 업데이트 적용

## 에러 처리

### 연결 실패 시
```javascript
try {
    await testConnection();
    console.log('✅ 데이터베이스 연결 성공');
} catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    // 적절한 에러 처리
}
```

### 쿼리 실패 시
- Supabase: `error` 객체 확인
- MongoDB: try-catch 블록 사용

## 성능 최적화

### 연결 풀링
- MongoDB: 자동 연결 풀 관리
- Supabase: 내장 연결 풀 사용

### 쿼리 최적화
- 인덱스 활용
- 필요한 필드만 선택
- 페이지네이션 구현

## 보안 고려사항
- 환경변수를 통한 민감 정보 관리
- 서비스 역할 키 제한적 사용
- 쿼리 인젝션 방지 (Supabase RLS, MongoDB 스키마 검증)

## 개발 팁
- 로컬 개발 시 별도 DB 인스턴스 사용 권장
- 프로덕션 데이터 백업 정기 실행
- 연결 상태 모니터링 구현