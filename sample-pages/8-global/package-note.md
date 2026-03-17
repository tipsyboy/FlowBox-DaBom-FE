# Import Example

```js
// component register example
import { ButtonBasic, Header, Footer, SidebarNav, SectionHeader, VideoCard } from '@/refactor-pages/8-global/components';
import '@/refactor-pages/8-global/styles/index.css';
```

```vue
<template>
  <Header @search="onSearch" />
  <SectionHeader title="동영상 관리">
    <template #actions>
      <ButtonBasic variant="primary">동영상 업로드</ButtonBasic>
    </template>
  </SectionHeader>
  <Footer />
</template>
```
