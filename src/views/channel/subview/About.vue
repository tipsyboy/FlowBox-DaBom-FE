<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/channel/index.js'

const route = useRoute()
const channelInfo = reactive({
  name: '채널',
  content: '작성된 내용이 없습니다.',
  email: '',
  sns01: '',
  sns02: '',
  website: ''
})

onMounted(async () => {
  try {
    const channelName = route.params.channelName || ''
    const result = await api.getChannelInfoByChannelName(channelName)
    Object.assign(channelInfo, {
      name: result?.name || channelInfo.name,
      content: result?.content || channelInfo.content,
      email: result?.email || '',
      sns01: result?.sns01 || '',
      sns02: result?.sns02 || '',
      website: result?.website || ''
    })
  } catch (error) {
  }
})
</script>

<template>
  <section class="tab-header">
    <h2>정보</h2>
  </section>

  <section class="about-grid">
    <article class="about-card">
      <h3>{{ channelInfo.name }} 채널 소개</h3>
      <p>{{ channelInfo.content }}</p>
      <ul class="about-list">
        <li><span>이메일</span><strong>{{ channelInfo.email || '-' }}</strong></li>
        <li><span>웹사이트</span><strong>{{ channelInfo.website || '-' }}</strong></li>
        <li><span>SNS 1</span><strong>{{ channelInfo.sns01 || '-' }}</strong></li>
        <li><span>SNS 2</span><strong>{{ channelInfo.sns02 || '-' }}</strong></li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tab-header h2 {
  margin: 0;
  font-size: 30px;
}

.about-grid {
  display: grid;
  gap: 14px;
}

.about-card {
  background: #2a2a2a;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
}

.about-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
}

.about-card p {
  margin: 0 0 10px;
  color: #d5d5d5;
  line-height: 1.7;
}

.about-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.about-list li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #3f3f3f;
  padding-bottom: 8px;
}

.about-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.about-list span {
  color: var(--text-secondary);
  font-size: 14px;
}

.about-list strong {
  font-size: 14px;
}
</style>
