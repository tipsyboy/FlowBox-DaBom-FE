
# 리뉴얼 체크리스트
## 1) 인증/계정
- [x] `/login` (`src/views/auth/Login.vue`) 리뉴얼
- [x] `/signup` (`src/views/auth/Signup.vue`) 리뉴얼
- 인증 로그인: `http://localhost:5174/refactor-pages/1-auth/login-sample.html`
- 인증 회원가입: `http://localhost:5174/refactor-pages/1-auth/signup-sample.html`

## 2) 메인 탐색/시청
- [x] `/` (`src/views/MainView.vue`) 리뉴얼
- [x] `/video-player/:id` (`src/views/Video_Player.vue`) 리뉴얼
- 메인: `http://localhost:5174/refactor-pages/2-main-explore/main-page-sample.html`
- 비디오 플레이어: `http://localhost:5174/refactor-pages/2-main-explore/video-player-sample.html`

## 3) 채널 방문/커뮤니티
- [x] 채널 메인(동영상 탭) 샘플 페이지 생성  
  `refactor-pages/3-channel-visit-community/channel-main-sample.html`
- [x] 채널 재생목록 탭 샘플 페이지 생성  
  `refactor-pages/3-channel-visit-community/channel-playlists-sample.html`
- [x] 채널 커뮤니티 탭 샘플 페이지 생성  
  `refactor-pages/3-channel-visit-community/channel-community-sample.html`
- [x] 채널 정보 탭 샘플 페이지 생성  
  `refactor-pages/3-channel-visit-community/channel-about-sample.html`
- [x] 커뮤니티 게시글 상세(`/post/:id`) 샘플 페이지 생성  
  `refactor-pages/3-channel-visit-community/channel-post-sample.html`
- [ ] 위 샘플 기준으로 실제 라우트 매핑표 작성  
  (`/channel/:channelName/*` ↔ `src/views/channel/*`)
- 채널 메인: `http://localhost:5174/refactor-pages/3-channel-visit-community/channel-main-sample.html`
- 채널 재생목록: `http://localhost:5174/refactor-pages/3-channel-visit-community/channel-playlists-sample.html`
- 채널 커뮤니티: `http://localhost:5174/refactor-pages/3-channel-visit-community/channel-community-sample.html`
- 채널 게시글 상세: `http://localhost:5174/refactor-pages/3-channel-visit-community/channel-post-sample.html`
- 채널 정보: `http://localhost:5174/refactor-pages/3-channel-visit-community/channel-about-sample.html`

## 4) 채널 운영(크리에이터/관리자)
- [x] 채널 운영 메인 샘플 페이지 생성  
  `refactor-pages/4-channel-studio/mychannel.html`
- [x] 동영상 관리/업로드 상세 샘플 페이지 분리 생성  
  `refactor-pages/4-channel-studio/video-management-sample.html`
- [x] 커뮤니티 관리 상세 샘플 페이지 분리 생성  
  `refactor-pages/4-channel-studio/community-management-sample.html`
- [x] 채널 정보 수정 상세 샘플 페이지 분리 생성  
  `refactor-pages/4-channel-studio/channel-info-edit-sample.html`
- [ ] 위 샘플 기준으로 실제 라우트/컴포넌트 매핑표 작성  
  (`/mychannel/*` ↔ `src/views/channel/*`, `src/components/channel/*`)
- 채널 운영 대시보드: `http://localhost:5174/refactor-pages/4-channel-studio/mychannel.html`
- 동영상 관리: `http://localhost:5174/refactor-pages/4-channel-studio/video-management-sample.html`
- 커뮤니티 관리: `http://localhost:5174/refactor-pages/4-channel-studio/community-management-sample.html`
- 채널 정보 수정: `http://localhost:5174/refactor-pages/4-channel-studio/channel-info-edit-sample.html`

## 5) 투게더(동시 시청)
- [x] 투게더 메인 샘플 페이지 생성
  `refactor-pages/5-together/together-main-sample.html`
- [x] 투게더 검색 샘플 페이지 생성
  `refactor-pages/5-together/together-search-sample.html`
- [x] 투게더 방(`/together/:id`) 샘플 페이지 생성  
  `refactor-pages/5-together/together-room-sample.html`
- [x] 메인 페이지에 검색 결과 통합(기존 검색 분리 이슈 해소)
  `refactor-pages/5-together/together-main-sample.html`
- [ ] 위 샘플 기준으로 실제 라우트/컴포넌트 매핑표 작성  
  (`/together*` ↔ `src/views/together/*`, `src/views/TogetherRoom.vue`)
- 투게더 메인: `http://localhost:5174/refactor-pages/5-together/together-main-sample.html`
- 투게더 검색(참고): `http://localhost:5174/refactor-pages/5-together/together-search-sample.html`
- 투게더 방: `http://localhost:5174/refactor-pages/5-together/together-room-sample.html`

## 6) 메시지/DM
- [x] 메시지 메인(대화 목록 + 대화창) 샘플 페이지 생성  
  `refactor-pages/6-message/message-sample.html`
- [x] 채팅방 상세 상태(빈 상태/대화중) 샘플 페이지 생성
  `refactor-pages/6-message/message-room-sample.html`
- [x] 메시지 말풍선 크기 축소 조정
  `refactor-pages/6-message/message-sample.css`
- [ ] 위 샘플 기준으로 실제 라우트/컴포넌트 매핑표 작성
  (`/message` ↔ `src/views/MessageContainer.vue`)
- 메시지 메인: `http://localhost:5174/refactor-pages/6-message/message-sample.html`
- 메시지 빈방: `http://localhost:5174/refactor-pages/6-message/message-room-sample.html`

## 7) 개인 플레이리스트
- [x] 내 플레이리스트 목록 샘플 페이지 생성  
  `refactor-pages/7-playlist/my-playlists-sample.html`
- [x] 플레이리스트 상세 샘플 페이지 생성  
  `refactor-pages/7-playlist/playlist-detail-sample.html`
- [x] `열기` 버튼 스타일/클릭 영역 보정
  `refactor-pages/7-playlist/playlist-sample.css`
- [ ] 위 샘플 기준으로 실제 라우트/컴포넌트 매핑표 작성  
  (`/my-playlists`, `/playlist/:id` ↔ `src/views/playlist/*`)
- 내 플레이리스트: `http://localhost:5174/refactor-pages/7-playlist/my-playlists-sample.html`
- 플레이리스트 상세: `http://localhost:5174/refactor-pages/7-playlist/playlist-detail-sample.html`

## 8) 공통 부분
### 공통 CSS
- [ ] 공통 토큰(색상/간격/타이포/라운드/그림자) 단일 파일 정의
- [ ] `src/assets/main/main.css`와 `src/CSS/main.css` 통합
- [ ] 페이지별 CSS에서 공통 유틸/레이아웃 클래스 정리
- [ ] 반응형 브레이크포인트 기준 통일

### 공통 컴포넌트
- [ ] Header / SearchBar / AuthButtons 공통화
- [ ] Sidebar / SidebarSection / SidebarItem 공통화
- [ ] SectionHeader 공통화
- [ ] Button(Primary/Ghost/Danger) 공통화
- [ ] VideoCard 공통화
- [ ] EmptyState / LoadingState 공통화
- [ ] Modal(Confirm/Form) 공통화

## 9) vue3로 전환하기

