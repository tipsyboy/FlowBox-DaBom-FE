# refactor-proposal/component

Vue 3 `script setup`(Composition API) 기반 재사용 컴포넌트 모음입니다.

## 구성
- `components/`: 실제 재사용 컴포넌트
- `styles/design-tokens.css`: 공통 토큰
- `ComponentPage.vue`: 컴포넌트 조합 예시 페이지
- `index.js`: export 엔트리

## 빠른 사용 예시
```vue
<script setup>
import { AppHeader, BannerImage, VideoCard } from '@/refactor-proposal/component'
</script>
```

## 포함 컴포넌트
- `AppHeader`, `SearchBar`, `AuthButtons`
- `AppButton`
- `BannerImage`
- `SidebarItem`, `SidebarSection`
- `SectionHeader`
- `VideoCard`
- `PlaylistRow`
- `PostItem`
- `EmptyState`, `LoadingState`

