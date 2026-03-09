<script setup>
import {reactive, ref} from 'vue';
import LoginForm from '@/entity/auth/LoginForm.js';
import Modal from '@/components/main/Modal.vue'
import ButtonBasic from '@/components/global/ButtonBasic.vue';
import api from '@/api/auth/index.js'
import useMemberStore from '@/stores/useMemberStore.js';

const memberStore = useMemberStore();
const form = reactive({
  loginForm: new LoginForm()
})
const showErrorModal = ref(false)
const errorMessage = ref('')
const errorTitle = 'Together 생성 에러'
const socialLogin = reactive({
  "google": "/oauth2/authorization/google",
  "kakao": "/oauth2/authorization/kakao",
  "naver": "/oauth2/authorization/naver"
})

const closeErrorModal = () => {
  showErrorModal.value = false
}

const state = reactive({
  showPassword: false
})

const togglePassword = () => {
  state.showPassword = !state.showPassword;
}

const login = async () => {
  const data = await api.login(form.loginForm)
  const channelName = data.data;
  if (data.code !== 200) {
    showErrorModal.value = true;
    errorMessage.value = "로그인을 다시 시도해주세요."
    return;
  }
  memberStore.setWithEncrypt(channelName)
  window.location.href = '/'
}

const showSocialLoginPopup = (url) => {
  const popupHeight = 500;
  const popupWidth = 500;
  const left = (window.screen.width - popupWidth) / 2;
  const top = (window.screen.height - popupHeight) / 2;

  const popupOptions = `height=${popupHeight},width=${popupWidth},left=${left},top=${top},scrollbars=yes,resizable=yes`;

  openPopup(popupOptions, url);
};

const openPopup = async (options, url) => {
  const popup = window.open(url, "_blank", options);
  window.addEventListener("message", async (event) => {
    if (event.data === 'true') {
      let res = await api.getCurrentMemberInfo();
      window.location.href = '/';
      return memberStore.setWithEncrypt(res.data.name)
    }
    popup.close();
    showErrorModal.value = true;
    errorMessage.value = "소셜 로그인을 다시 시도해주세요."
  })
};
</script>

<template>
  <div class="auth-page">
    <main class="auth-main">
      <div class="login-form-wrapper">
        <div class="login-header">
          <img src="@/assets/images/dabom2.png" alt="DaBom" class="auth-logo" />
          <h1>로그인</h1>
          <p>DaBom 계정으로 로그인하여 서비스를 이용하세요.</p>
        </div>
        <div class="login-form-container g-card">
          <form class="login-form" id="loginForm" @submit.prevent="login()">
            <div class="form-group">
              <label for="email">이메일</label>
              <input class="g-input" type="email" id="email" name="email" required placeholder="이메일을 입력하세요"
                     v-model="form.loginForm.email">
            </div>

            <div class="form-group">
              <label for="password">비밀번호</label>
              <div class="password-input">
                <input class="g-input" :type="state.showPassword ? 'text' : 'password'" id="password" name="password"
                       v-model="form.loginForm.password" required placeholder="비밀번호를 입력하세요">
                <button type="button" class="toggle-password" id="togglePassword" @click="togglePassword">
                  <i :class="state.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" id="rememberMe">
                <span class="checkmark"></span>
                로그인 상태 유지
              </label>
              <a href="#" class="forgot-link">비밀번호를 잊으셨나요?</a>
            </div>

            <ButtonBasic type="submit" variant="primary" size="lg" class="btn-login">
              <i class="fas fa-sign-in-alt"></i>
              로그인
            </ButtonBasic>
          </form>

          <div class="divider">
            <span>또는</span>
          </div>

          <div class="social-login-container">
            <button class="social-icon-btn kakao" title="kakao" @click="showSocialLoginPopup(socialLogin.kakao)">
              <i class="fas fa-comment"></i>
            </button>
            <button class="social-icon-btn naver" title="naver" @click="showSocialLoginPopup(socialLogin.naver)">
              <span>N</span>
            </button>
            <button class="social-icon-btn google" title="google" @click="showSocialLoginPopup(socialLogin.google)">
              <i class="fab fa-google"></i>
            </button>
          </div>

          <div class="signup-link">
            <p>계정이 없으신가요?
              <RouterLink :to="{ name: 'signup' }">회원가입</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
  <Modal v-if="showErrorModal" @confirm="closeErrorModal" :title="errorTitle" :message="errorMessage"/>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #1f1f1f;
}

.auth-main {
  min-height: calc(100vh - 78px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
}

.login-form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 560px;
  color: var(--text-primary);
}

.login-header {
  text-align: center;
  margin-bottom: 1.25rem;
}

.auth-logo {
  width: 72px;
  margin-bottom: 10px;
}

.login-header h1 {
  margin: 0;
  font-size: 30px;
}

.login-header p {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.login-form-container {
  width: 100%;
  padding: 2.5rem;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.25);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.login-form-container .g-input {
  padding: 0.9rem 0.95rem;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: var(--transition);
}

.toggle-password:hover {
  color: var(--text-primary);
  background-color: var(--border-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.remember-me input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background-color: var(--hover-color);
  border: 2px solid var(--border-color);
  border-radius: 4px;
  margin-right: 0.5rem;
  position: relative;
  transition: var(--transition);

  display: flex;
  /* 정렬 위해 추가 */
  align-items: center;
  /* 세로 정렬 */
  justify-content: center;
  /* 가로 정렬 */
}

.remember-me input:checked + .checkmark {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.remember-me input:checked + .checkmark::after {
  content: '';
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  display: block;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
  transition: var(--transition);
}

.forgot-link:hover {
  color: #ff3838;
}

.btn-login {
  width: 100%;
  min-height: 48px;
  font-size: 1.02rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--border-color);
}

.divider span {
  background-color: var(--card-bg);
  color: var(--text-secondary);
  padding: 0 1rem;
  font-size: 0.875rem;
}

/* ##### social login icons ##### */
.social-login-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.social-icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background-color: #2a2a2a;
  color: white;
}

.social-icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

/* 플랫폼별 색상 */
.social-icon-btn.kakao {
  background-color: #FEE500;
  color: #000;
}

.social-icon-btn.naver {
  background-color: #03C75A;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.social-icon-btn.google {
  background-color: white;
  color: #4285F4;
  border: 1px solid #ddd;
}

.social-icon-btn.apple {
  background-color: #000;
  color: white;
}


.signup-link {
  text-align: center;
  margin-top: 0.35rem;
  padding-top: 1.5rem;
}

.signup-link p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.signup-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.signup-link a:hover {
  color: #ff3838;
}

@media (max-width: 768px) {
  .auth-main {
    padding: 18px 14px 28px;
  }

  .login-form-container {
    padding: 1.6rem 1.2rem;
  }
}

@media (max-width: 480px) {
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .social-login-container {
    gap: 1rem;
  }
}
</style>
