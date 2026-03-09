# Vue3 이식 가이드 (src 적용)

이 문서는 `refactor-pages` 산출물을 실제 `src`로 이식하는 실행 절차입니다.
기준 자산은 `refactor-pages/8-global` 입니다.

## 0. 원칙
- 한 번에 전부 교체하지 말고, **페이지 단위 점진 이관**으로 진행
- 기존 동작 유지가 우선 (UI 개선보다 회귀 방지 우선)
- 공통 CSS/컴포넌트 먼저 고정 후 페이지 이관

## 1. 사전 준비
- 브랜치 분리
  - `feat/renewal-global-base`
  - 이후 페이지별 브랜치 (`feat/renewal-main`, `feat/renewal-channel-visit` ...)
- 기준 문서
  - `guidelines/renewal.md`
  - `refactor-pages/8-global/README.md`

## 2. 공통 CSS 이식 (main.css 역할)
### 2-1. 파일 복사
- `refactor-pages/8-global/styles/*`를 `src/assets/global/`로 복사
  - `tokens.css`
  - `reset.css`
  - `layout.css`
  - `components.css`
  - `index.css`

### 2-2. 앱 엔트리에 연결
- `src/main.js` 또는 기존 전역 CSS 엔트리에서 `src/assets/global/index.css` import

### 2-3. 기존 공통 CSS와 충돌 정리
- 대상:
  - `src/assets/main/main.css`
  - `src/css/main.css`
- 전략:
  1. 토큰 변수 중복 제거
  2. 동일 역할 클래스(`topbar`, `card`, `btn*`)를 `g-*` 네임스페이스 우선으로 교체
  3. 페이지별 스타일에서 공통 속성 제거

## 3. 공통 컴포넌트 이식
### 3-1. 파일 복사
- `refactor-pages/8-global/components/*`를 `src/components/global/`로 복사

### 3-2. Export 정리
- `src/components/global/index.js` 생성/정리
- 포함:
  - `ButtonBasic`
  - `Header`
  - `Footer`
  - `SearchBar`
  - `AuthButtons`
  - `SectionHeader`
  - `SidebarNav`
  - `VideoCard`

### 3-3. 적용 우선순위
1. `Header`, `Footer`, `ButtonBasic`
2. `SearchBar`, `AuthButtons`, `SectionHeader`
3. `SidebarNav`, `VideoCard`

## 4. 페이지 이관 순서 (권장)
아래 순서대로 진행하면 충돌이 적음.

1. 인증
- `/login` → `src/views/auth/Login.vue`
- `/signup` → `src/views/auth/Signup.vue`

2. 메인 탐색/시청
- `/` → `src/views/MainView.vue`
- `/video-player/:id` → `src/views/Video_Player.vue`

3. 채널 방문/커뮤니티
- `/channel/:channelName/*`
- `/post/:id`

4. 채널 운영
- `/mychannel` + 하위 관리 화면

5. Together
- `/together`
- `/together/search`
- `/together/:id`

6. 메시지
- `/message`

7. 플레이리스트
- `/my-playlists`
- `/playlist/:id`

## 5. 페이지별 작업 템플릿
각 페이지 이관 시 아래 순서 고정.

1. 샘플 HTML을 Vue 템플릿으로 옮김
2. 인라인 이벤트/스크립트를 `<script setup>`으로 변환
3. 공통 컴포넌트로 치환
- 버튼 → `ButtonBasic`
- 상단 → `Header`
- 섹션 헤더 → `SectionHeader`
- 카드 리스트 → `VideoCard`
4. 페이지 전용 CSS만 남김 (공통 속성 삭제)
5. 기존 API/스토어 연결
6. 회귀 확인

## 6. 라우트 매핑 규칙
- 샘플 파일명과 실제 라우트 1:1 표를 항상 유지
- 파일명 예시:
  - `*-sample.html` ↔ `src/views/**.vue`

권장: `guidelines/renewal.md`에 완료 시점마다 매핑 갱신

## 7. 검증 체크리스트
페이지 이관마다 아래 체크 필수.

- [ ] 라우트 진입/이탈 정상
- [ ] 콘솔 에러 없음
- [ ] 모바일(<=760px) 깨짐 없음
- [ ] 버튼/링크 동작 정상
- [ ] 기존 API 호출/스토어 상태 정상
- [ ] 기존 기능 회귀 없음

## 8. 커밋 규칙 (권장)
- `feat(global): add shared css layer and global components`
- `feat(auth): migrate login/signup to global components`
- `feat(main): migrate main explore + video player`
- `feat(channel): migrate channel visit/community pages`

## 9. 초기 적용 예시 (import)
```js
import '@/assets/global/index.css';
import { Header, Footer, ButtonBasic } from '@/components/global';
```

---

실행 시작점 제안:
1. `global` 레이어 먼저 PR
2. 인증 페이지 2개 이관
3. 메인/비디오 플레이어 이관
