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
  - 단어 추가
  - 단어 삭제
  - 랜덤 추천

- [ ] `supabase-js`로 기능 전환  
  ```js
  // 삽입
  await supabase.from('menu_items').insert([{ name: '김치찌개', category: '한식' }]);

  // 랜덤 선택
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', '편의점');

  const random = data[Math.floor(Math.random() * data.length)];

  // 삭제
  await supabase.from('menu_items').delete().eq('id', 3);
  ```

- [ ] `pg` 관련 코드 및 라이브러리 제거

---

## 🧪 4. 테스트 및 디버깅

- [ ] 개발용 DB에 테스트 데이터 입력
- [ ] 명령어별 기능 확인
  - `/오늘의메뉴`
  - `/오늘의편의점`
  - `추가`
  - `삭제`

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
