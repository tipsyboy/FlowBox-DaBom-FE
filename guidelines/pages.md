# 서비스 페이지 목록

기준은 `src/router/*.js` 라우팅 등록입니다.

## 1) 인증/계정

`/login` (`login`)은 `src/views/auth/Login.vue`를 사용하며, 일반 로그인 및 소셜 로그인 진입 페이지입니다.

`/signup` (`signup`)은 `src/views/auth/Signup.vue`를 사용하며, 이메일/채널명 중복확인을 포함한 회원가입 페이지입니다.

## 2) 메인 탐색/시청

`/` (`main`)은 `src/views/MainView.vue`를 사용하며, 메인 홈에서 인기영상/검색결과와 사이드바를 보여줍니다.

`/video-player/:id` (`videoPlayer`)는 `src/views/Video_Player.vue`를 사용하며, 동영상 재생/설명/댓글을 보여주는 상세 시청 페이지입니다.

## 3) 채널 방문/커뮤니티

`/channel/:channelName` (`channel`)은 `src/views/channel/ChannelMainView.vue`를 사용하며, 채널 하위 탭을 감싸는 부모 레이아웃 페이지입니다.

`/channel/:channelName/videos` (`videos`)는 `src/views/channel/subview/video/Video_Fix.vue`를 사용하며, 특정 채널의 동영상 목록 탭입니다.

`/channel/:channelName/playlists` (`playlists`)는 `src/views/channel/subview/ChannelPlaylists.vue`를 사용하며, 특정 채널의 플레이리스트 목록 탭입니다.

`/channel/:channelName/community` (`community`)는 `src/views/channel/subview/Community.vue`를 사용하며, 특정 채널의 커뮤니티 게시글 목록 탭입니다.

`/channel/:channelName/about` (`about`)은 `src/views/channel/subview/About.vue`를 사용하며, 특정 채널의 소개/정보 탭입니다.

`/post/:id` (`post`)는 `src/components/channel/community/ChannelPost.vue`를 사용하며, 커뮤니티 게시글 상세 페이지입니다.

## 4) 채널 운영(크리에이터/관리자)

`/mychannel` (`mychannel`)은 `src/views/channel/MychannelMainView.vue`를 사용하며, 내 채널 관리(동영상/플레이리스트/커뮤니티/정보수정) 페이지입니다.

## 5) 투게더(동시 시청)

`/together` (`together`, 기본은 `togetherMain`)는 `src/views/together/TogetherView.vue` + `src/views/together/subview/TogetherMainView.vue`를 사용하며, 투게더 메인/목록 페이지입니다.

`/together/search` (`togetherSearch`)는 `src/views/together/subview/TogetherSearchView.vue`를 사용하며, 투게더 검색 결과 페이지입니다.

`/together/:id` (`togetherRoom`)는 `src/views/TogetherRoom.vue`를 사용하며, 투게더 방 입장 후 동시시청/채팅 페이지입니다.

## 6) 메시지/DM

`/message` (`message`)는 `src/views/MessageContainer.vue`를 사용하며, DM 채팅 목록/채팅창 페이지입니다.

## 7) 개인 플레이리스트

`/my-playlists` (`my-playlists`)는 `src/views/playlist/MyPlaylistsView.vue`를 사용하며, 내 플레이리스트 목록 페이지입니다.

`/playlist/:id` (`playlist-detail`)는 `src/views/playlist/PlaylistDetailView.vue`를 사용하며, 플레이리스트 상세 및 포함 영상 페이지입니다.

## 참고(테스트/비서비스성)

`/tttttt`는 `src/components/sidebar/SidebarContainer.vue`를 연결한 테스트성 라우트로 보이며, 실제 내비게이션/기능 흐름에서 사용 흔적이 없습니다.

## 참고(현재 라우팅 미사용 파일)

`src/router/togetherRoom.js`는 내용이 없습니다.

`src/views/channel/subview/playlist/Playlist.vue`는 라우터에서 참조하지 않습니다.

`src/HTML/*`, `src/JS/*`는 현재 Vue 라우팅 기반 서비스 페이지로 사용되지 않습니다.

---
