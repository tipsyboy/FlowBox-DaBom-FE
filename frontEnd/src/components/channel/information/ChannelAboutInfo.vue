<script>
import api from '@/api/channel'

export default {
  data() {
    return {
      channelInfo: {
        id: "",
        name: '크리에이티브 채널',
        content: '작성된 내용이 없습니다.',
        image: '',
        email: 'creative@dabom.com',
        sns01: '',
        sns02: '',
        website: 'null'
      }
    }
  },
  async mounted() {
    try {
      const channelName = this.$route.params.channelName || ''
      const result = await api.getChannelInfoByChannelName(channelName)
      // 서버 데이터로 업데이트 (기본값이 있으면 유지)
      this.channelInfo.id = result.id || this.channelInfo.id
      this.channelInfo.name = result.name || this.channelInfo.name
      this.channelInfo.content = result.content || this.channelInfo.content
      this.channelInfo.email = result.email || this.channelInfo.email
      this.channelInfo.image = result.image || this.channelInfo.image
      this.channelInfo.sns01 = result.sns01 || this.channelInfo.sns01
      this.channelInfo.sns02 = result.sns02 || this.channelInfo.sns02
      this.channelInfo.website = result.website || this.channelInfo.website
    } catch (error) {
      console.error('채널 정보 불러오기 실패:', error)
      // 에러 시 기본값 유지
    }
  }
}
</script>

<template>
  <div class="about-section">
    <!-- 채널 이름 동적 표시 -->
    <h3>{{ channelInfo.name }} 의 채널</h3>
    
    <!-- 채널 설명 동적 표시 -->
    <p>{{ channelInfo.content }}</p>

    <h4>주요 콘텐츠</h4>
    <ul>
      <li>작성된 내용이 없습니다</li>
    </ul>

    <h3>연락처</h3>
    <div class="contact-info">
      <!-- 이메일 동적 표시 -->
      <p v-if="channelInfo.email">
        <i class="fas fa-envelope"></i> {{ channelInfo.email }}
      </p>
      
      <!-- 웹사이트 (있는 경우에만 표시) -->
      <p v-if="channelInfo.website">
        <i class="fas fa-globe"></i> {{ channelInfo.website }}
      </p>
      
      <!-- 소셜 링크 (데이터가 있는 경우에만 표시) -->
      <div class="social-links" v-if="channelInfo.sns01 || channelInfo.sns02">
        <a v-if="channelInfo.sns01" :href="channelInfo.sns01" target="_blank">
          <i class="fab fa-twitter" v-if="channelInfo.sns01.includes('twitter')"></i>
          <i class="fab fa-instagram" v-else-if="channelInfo.sns01.includes('instagram')"></i>
          <i class="fab fa-youtube" v-else-if="channelInfo.sns01.includes('youtube')"></i>
          <i class="fas fa-link" v-else></i>
        </a>
        <a v-if="channelInfo.sns02" :href="channelInfo.sns02" target="_blank">
          <i class="fab fa-twitter" v-if="channelInfo.sns02.includes('twitter')"></i>
          <i class="fab fa-instagram" v-else-if="channelInfo.sns02.includes('instagram')"></i>
          <i class="fab fa-youtube" v-else-if="channelInfo.sns02.includes('youtube')"></i>
          <i class="fas fa-link" v-else></i>
        </a>
      </div>
      
      <!-- 기본 소셜 링크 (서버 데이터가 없는 경우) -->
      <div class="social-links" v-else>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>
  
 
</template>

<style scoped>
.stat-div {
  margin-left: 3%;
  margin-right: 3%;
  padding: 2rem;
  color: #e5eaee;
}

.about-section {
  margin-top: 5%;
  background: #2e2e2e;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  color: #e5eaee;
}

.about-section h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fa5500;
  margin-bottom: 1rem;
}

.about-section h4 {
  color: #fa5500;
  font-size: 1.1rem;
  margin: 1.2rem 0 0.4rem 0;
  font-weight: 600;
}

.about-section p {
  font-size: 1.03rem;
  line-height: 1.6;
  color: #e5eaee;
  margin-bottom: 1.1rem;
}

.about-section ul {
  padding-left: 1.2rem;
  margin-bottom: 1.5rem;
}

.about-section li {
  margin-bottom: 0.4rem;
  color: #fff9f3;
  line-height: 1.7;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.3rem;
}

.contact-info i {
  color: #fa5500;
  font-size: 1.1rem;
  width: 22px;
}

.social-links {
  margin-top: 0.8rem;
}

.social-links a {
  margin-right: 1rem;
  color: #fa5500;
  font-size: 1.4rem;
  transition: color 0.2s;
  text-decoration: none;
}

.social-links a:hover {
  color: #ff9740;
}

@media (max-width: 600px) {
  .about-section { 
    padding: 1rem; 
    font-size: 0.97rem; 
  }
}
</style>