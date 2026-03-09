<script setup>
const overview = [
  { label: '이번 주 업로드', value: '3개' },
  { label: '이번 주 커뮤니티 글', value: '5개' },
  { label: '신규 구독자', value: '+842' },
  { label: '총 조회수(7일)', value: '128,109' }
]

const quickLinks = [
  {
    title: '동영상 관리',
    desc: '업로드, 공개 상태, 메타정보를 관리합니다.',
    to: { name: 'studioVideos' }
  },
  {
    title: '커뮤니티 관리',
    desc: '게시글 작성/수정/삭제와 정렬을 관리합니다.',
    to: { name: 'studioCommunity' }
  },
  {
    title: '채널 정보 수정',
    desc: '채널 소개, 프로필, 배너 이미지를 변경합니다.',
    to: { name: 'studioInfo' }
  }
]
</script>

<template>
  <div class="studio-grid">
    <section class="studio-card">
      <h2>통합 대시보드</h2>
      <p class="subtext">운영 현황을 확인하고, 각 관리 페이지로 이동하세요.</p>
      <div class="metric-grid">
        <article v-for="item in overview" :key="item.label" class="metric-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
    </section>

    <section class="studio-card">
      <h2>빠른 이동</h2>
      <div class="quick-grid">
        <RouterLink v-for="item in quickLinks" :key="item.title" :to="item.to" class="quick-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.studio-grid {
  display: grid;
  gap: 14px;
}

.studio-card {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: #191b1f;
  padding: 18px;
}

.studio-card h2 {
  margin: 0;
  font-size: 24px;
}

.subtext {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.metric-grid {
  margin-top: 14px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-item {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #15171a;
  padding: 10px 12px;
  display: grid;
  gap: 4px;
}

.metric-item span {
  color: var(--text-secondary);
  font-size: 12px;
}

.metric-item strong {
  font-size: 17px;
}

.quick-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.quick-card {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #15171a;
  text-decoration: none;
  color: var(--text-primary);
  padding: 12px;
}

.quick-card h3 {
  margin: 0;
  font-size: 16px;
}

.quick-card p {
  margin: 7px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 1020px) {
  .metric-grid,
  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .metric-grid,
  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
