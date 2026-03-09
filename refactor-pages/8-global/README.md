# 8-global

`refactor-pages` 전체 샘플에서 반복되는 패턴을 추출한 공통 자산입니다.

## 구성
- `styles/index.css`: 프로젝트 전체 공통 CSS 진입점 (`src/assets/main/main.css` 역할)
- `styles/tokens.css`: 컬러/간격/폰트/반경 토큰
- `styles/reset.css`: 기본 리셋
- `styles/layout.css`: 레이아웃 유틸, 컨테이너, 그리드, 탑바
- `styles/components.css`: 버튼/카드/검색/사이드바/섹션헤더/비디오카드 등

- `components/ButtonBasic.vue`
- `components/Header.vue`
- `components/Footer.vue`
- `components/SearchBar.vue`
- `components/AuthButtons.vue`
- `components/SectionHeader.vue`
- `components/SidebarNav.vue`
- `components/VideoCard.vue`
- `components/index.js`

## 도입 순서 제안
1. `styles/index.css`를 프로젝트 공통 엔트리로 연결
2. 페이지별 CSS에서 색상/간격/버튼 정의를 토큰/공통 클래스로 치환
3. `ButtonBasic`, `Header`, `Footer`부터 공통 컴포넌트 전환
4. 이후 `SidebarNav`, `VideoCard`, `SectionHeader` 순으로 치환

## 목표
- 각 페이지 샘플의 스타일 불일치 최소화
- 공통 컴포넌트 단위의 Vue 리뉴얼 기반 마련
- `src/assets/main/main.css`의 차세대 베이스 역할 수행
