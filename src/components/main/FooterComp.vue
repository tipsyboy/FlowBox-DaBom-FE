<script setup></script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 브랜드 정보 섹션 -->
      <div class="footer-section">
        <h4>DaBom</h4>
        <p>함께하는 스트리밍 플랫폼</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
        </div>
      </div>

      <!-- 서비스 링크 섹션 -->
      <div class="footer-section">
        <h5>서비스</h5>
        <ul>
          <li><a href="#">홈</a></li>
          <li><a href="#">채널</a></li>
          <li><a href="#">Together 모드</a></li>
          <li><a href="#">라이브</a></li>
        </ul>
      </div>

      <!-- 지원 링크 섹션 -->
      <div class="footer-section">
        <h5>지원</h5>
        <ul>
          <li><a href="#">고객센터</a></li>
          <li><a href="#">신고</a></li>
          <li><a href="#">개인정보처리방침</a></li>
          <li><a href="#">이용약관</a></li>
        </ul>
      </div>

      <!-- 크리에이터 링크 섹션 -->
      <div class="footer-section">
        <h5>크리에이터</h5>
        <ul>
          <li><a href="#">채널 만들기</a></li>
          <li><a href="#">업로드 가이드</a></li>
          <li><a href="#">수익화</a></li>
          <li><a href="#">분석</a></li>
        </ul>
      </div>
    </div>

    <!-- 푸터 하단 저작권 -->
    <div class="footer-bottom">
      <p>&copy; 2025 DaBom. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 1rem 0 1rem;
  margin-top: 10rem;
}

.footer-container {
  max-height: 10rem;
  max-width: 250rem;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h4,
.footer-section h5 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.footer-section p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  width: 40px;
  height: 40px;
  background-color: var(--hover-color);
  color: var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: var(--transition);
}

.social-links a:hover {
  background-color: var(--primary-color);
  color: white;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.footer-section ul li a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 2rem;
  text-align: center;
  color: var(--text-secondary);
}
</style>
