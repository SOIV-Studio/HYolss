# 📌 Supabase 통합 및 기존 코드 리팩토링 To-Do 리스트

## 🔧 1. `supabase-js` 환경 구축

- [ ] `supabase-js` 라이브러리 설치
  ```bash
  npm install @supabase/supabase-js
  ```

- [ ] `.env` 파일에 Supabase URL과 익명 키 저장
  ```env
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key
  ```

- [ ] Supabase 클라이언트 초기화
  ```js
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  export default supabase;
  ```

---

## 🔒 2. RLS 설정 및 권한 정책 구성

- [ ] Supabase 콘솔에서 RLS 활성화
- [ ] 정책 생성: 봇 사용자에게 접근 권한 부여
  ```sql
  CREATE POLICY "Allow bot access"
  ON menu_items
  FOR ALL
  USING (auth.role() = 'bot')
  WITH CHECK (auth.role() = 'bot');
  ```

- [ ] service_role key 또는 봇 전용 사용자 등록
- [ ] `.env`에 `SUPABASE_SERVICE_KEY` 저장 (서버 전용)

---

## 🧹 3. 기존 `pg` 코드 전면 리팩토링

- [ ] `pg`를 통해 수행 중인 기능 목록 정리
  - 메뉴 추가 [addmenu.js](commands\utility\addmenu.js)
  - 메뉴 삭제
  - today 시리즈 [오늘의메뉴](commands\utility\todaymenu.js) / [오늘의편의점](commands\utility\todayconvenience.js)

- [ ] `supabase-js`로 기능 전환
  - random-words-store를 하나의 테이블로 작업
  - events\guildCreate.js, events\guildDelete.js 리팩토링

- [ ] `pg` 관련 코드 및 라이브러리 제거

---

## 🧪 4. 테스트 및 디버깅

- [ ] 개발용 DB에 테스트 데이터 입력
  - 기존 random-words-store에 저장된 텍스트 데이터 DB로 데이터 이전
- [ ] 명령어별 기능 확인
  - `/오늘의메뉴`
  - `/오늘의편의점`
  - `/메뉴추가`
  - `/메뉴삭제`

- [ ] 권한, 정책, 오류 로그 확인

---

## 🚀 5. 최종 배포 정리

- [ ] `.env` 정리 (필요한 키만 유지)
- [ ] `pg` 라이브러리 제거
- [ ] `README.md` 또는 문서에 연결 방식 및 역할 정리
- [ ] Supabase 정책 및 테이블 백업

---

## 📁 보너스: 추후 확장 고려

- [ ] 대시보드에 메뉴 리스트 표시 연동
- [ ] 관리자용 웹 CRUD 기능 설계
- [ ] 카테고리별 필터 및 관리 UI 구상