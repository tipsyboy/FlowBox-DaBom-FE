<script setup>
import {reactive} from 'vue';
import api from "@/api/auth"
import SignupForm from '@/entity/auth/SignupForm';
import SignupFormErrors from '@/entity/auth/SignupFormErrors';
import {useRouter} from 'vue-router';
import Modal from '@/components/main/Modal.vue';


const router = useRouter()
const form = reactive({
  signupForm: new SignupForm(),
  signupFormErrors: new SignupFormErrors()
})

const state = reactive({
  showPassword: false,
  confirmPassword: false,
  passwordStrengthClass: '', // weak / medium / strong
  passwordStrengthLabel: '', // 약함 / 보통 / 강함
  signupSuccess: false,
  signupRedirectTimeoutId: null,
  duplicatedEmail: true,
  duplicatedChannelName:true
})

const checkEmail = reactive({
  email: ''
})

const checkChannelName = reactive({
  channelName: ''
})

const togglePassword = () => {
  state.showPassword = !state.showPassword;
}

const toggleConfirmPassword = () => {
  state.confirmPassword = !state.confirmPassword;
}

const checkEmailExists = async (email) => {
  if (email === '') {
    alert("이메일을 입력해주세요.");
    return
  }

  if (!validateEmail()) {
    form.signupForm.isEmailChecked = null;
    return
  }
  checkEmail.email = email
  const result = await api.checkEmailExists(checkEmail)
  console.log(result)
  form.signupForm.isEmailChecked = !result.data.isDuplicate
}

const checkChannelNameExists = async (channelName) => {
  if (channelName === '') {
    alert("채널명을 입력해주세요.");
    return
  }

  if (!validateChannelName()) {
    form.signupForm.isChannelChecked = null;
    return
  }
  checkChannelName.channelName = channelName
  const result = await api.checkChannelNameExists(checkChannelName)
  console.log(result)
  form.signupForm.isChannelChecked = !result.data.isDuplicate
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.signupForm.email || !emailRegex.test(form.signupForm.email)) {
    form.signupFormErrors.email = '올바른 이메일 형식을 입력해주세요.'
    return false
  }
  form.signupFormErrors.email = ''
  return true
}

const validateChannelName = () => {
  const channelNameRegex = /^[a-zA-Z0-9_]{3,20}$/
  if (!form.signupForm.channelName || !channelNameRegex.test(form.signupForm.channelName)) {
    form.signupFormErrors.channelName = '사용자명은 3-20자의 영문, 숫자, 언더스코어만 사용할 수 있습니다.'
    return false
  }
  form.signupFormErrors.channelName = ''
  return true
}

const validatePassword = () => {
  if (!form.signupForm.password || form.signupForm.password.length < 8) {
    form.signupFormErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    return false
  }
  return true
}

const validateConfirmPassword = () => {
  if (form.signupForm.password !== form.signupForm.password2) {
    form.signupFormErrors.password2 = '비밀번호가 일치하지 않습니다.'
    return false
  }
  return true
}

const validateSignupForm = () => {
  Object.keys(form.signupFormErrors).forEach(errorField => form.signupFormErrors[errorField] = '') // 에러 필드 초기화
  console.log(form.signupForm)
  const emailValid = validateEmail()
  const channelValid = validateChannelName()
  const passwordValid = validatePassword()
  const confirmPasswordValid = validateConfirmPassword()
  // null && true && true && ... = null (falsy)
  return emailValid && channelValid && passwordValid && confirmPasswordValid && form.signupForm.isEmailChecked && form.signupForm.isChannelChecked
}

const updatePasswordStrength = () => {
  let strength = 0;

  if (form.signupForm.password.length >= 8) strength++;
  if (/[a-z]/.test(form.signupForm.password)) strength++;
  if (/[A-Z]/.test(form.signupForm.password)) strength++;
  if (/[0-9]/.test(form.signupForm.password)) strength++;
  if (/[^a-zA-Z0-9]/.test(form.signupForm.password)) strength++;

  if (strength <= 2) {
    state.passwordStrengthClass = 'weak'
    state.passwordStrengthLabel = '약함';
  } else if (strength <= 3) {
    state.passwordStrengthClass = 'medium'
    state.passwordStrengthLabel = '보통';
  } else {
    state.passwordStrengthClass = 'strong'
    state.passwordStrengthLabel = '강함';
  }
}

const signupSuccessHandler = () => {
  state.signupSuccess = true
}
const handleModalConfirm = () => {
  state.signupSuccess = false;
  router.push({name: 'login'});
}

const signUp = async () => {
  if (validateSignupForm()) {
    const result = await api.signup(form.signupForm)
    console.log(result)
    signupSuccessHandler()
  }
}
</script>

<template>
  <Modal v-if="state.signupSuccess" title="회원가입 완료" message="성공적으로 회원가입이 완료되었습니다. 로그인 페이지로 이동합니다."
         @confirm="handleModalConfirm"/>
  <div class="singup-container">
    <div class="signup-form-wrapper">
      <div class="signup-header">
        <h1>회원가입 V8</h1>
        <p>DaBom 커뮤니티의 새로운 멤버가 되어보세요</p>
      </div>

      <!-- signup form -->
      <form action="#" class="signup-form" id="signupForm" @submit.prevent="onSubmit()">
        <div class="form-step active" id="step1">
          <div class="form-group">
            <label for="email">이메일 *</label>
            <div class="input-with-button">
              <input type="email" id="email" name="email" required v-model="form.signupForm.email"
                     placeholder="이메일을 입력하세요">
              <button type="button" class="btn-check" id="checkEmailBtn"
                      @click="checkEmailExists(form.signupForm.email)">중복확인
              </button>
            </div>
            <span v-if="form.signupForm.isEmailChecked !== null" :class="{
                            'success-message': form.signupForm.isEmailChecked,
                            'error-message': !form.signupForm.isEmailChecked
                        }">
                            {{ form.signupForm.emailCheckMessage() }}
                        </span>
            <span class="error-message" v-if="form.signupFormErrors.email">
                            {{ form.signupFormErrors.email }}
                        </span>
          </div>

          <div class="form-group">
            <label for="channelName">닉네임(채널명) *</label>
            <div class="input-with-button">
              <input type="text" id="channelName" name="channelName" required
                     v-model="form.signupForm.channelName" placeholder="사용자명을 입력하세요">
              <button type="button" class="btn-check" id="checkChannelNameBtn"
                      @click="checkChannelNameExists(form.signupForm.channelName)">중복확인
              </button>
            </div>
            <span v-if="form.signupForm.isChannelChecked !== null" :class="{
                            'success-message': form.signupForm.isChannelChecked,
                            'error-message': !form.signupForm.isChannelChecked
                        }">
                            {{ form.signupForm.channelCheckMessage() }}
                        </span>
            <span class="error-message" v-if="form.signupFormErrors.channelName">
                            {{ form.signupFormErrors.channelName }}
                        </span>
            <span class="help-text">영문, 숫자, 언더스코어만 사용 가능 (3-20자)</span>
          </div>

          <div class="form-group">
            <label for="password">비밀번호 *</label>
            <div class="password-input">
              <input :type="state.showPassword ? 'text' : 'password'" id="password" name="password"
                     required v-model="form.signupForm.password" @input="updatePasswordStrength()"
                     placeholder="비밀번호를 입력하세요">
              <button type="button" class="toggle-password" id="togglePassword" @click="togglePassword">
                <i :class="state.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="form.signupFormErrors.password">
                            {{ form.signupFormErrors.password }}
                        </span>
            <div class="password-strength" id="passwordStrength">
              <div class="strength-bar">
                <div class="strength-fill" :class="state.passwordStrengthClass"></div>
              </div>
              <span class="strength-text">비밀번호 강도: {{ state.passwordStrengthLabel }}</span>

            </div>
            <span class="help-text">영문 소문자, 특수문자 포함 8자 이상</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">비밀번호 확인 *</label>
            <div class="password-input">
              <input :type="state.confirmPassword ? 'text' : 'password'" id="confirmPassword"
                     name="confirmPassword" required v-model="form.signupForm.password2"
                     placeholder="비밀번호를 다시 입력하세요">
              <button type="button" class="toggle-password" id="toggleConfirmPassword"
                      @click="toggleConfirmPassword">
                <i :class="state.confirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="form.signupFormErrors.password2">
                            {{ form.signupFormErrors.password2 }}
                        </span>
          </div>

          <!-- 생년월일 -->
          <!-- <div class="form-group">
              <label for="birthDate">생년월일</label>
              <input type="date" id="birthDate" name="birthDate">
              <span class="error-message" id="birthDateError"></span>
          </div> -->

          <!-- 휴대폰 인증 -->
          <!-- <div class="form-group">
              <label for="phone">휴대폰 번호</label>
              <div class="input-with-button">
                  <input type="tel" id="phone" name="phone" placeholder="휴대폰 번호를 입력하세요">
                  <button type="button" class="btn-check" id="verifyPhoneBtn">인증</button>
              </div>
              <span class="error-message" id="phoneError"></span>
          </div>

          <div class="form-group" id="phoneVerificationGroup" style="display: none;">
              <label for="phoneVerification">인증번호</label>
              <div class="input-with-button">
                  <input type="text" id="phoneVerification" name="phoneVerification" placeholder="인증번호 6자리">
                  <button type="button" class="btn-check" id="confirmPhoneBtn">확인</button>
              </div>
              <span class="error-message" id="phoneVerificationError"></span>
              <span class="timer" id="verificationTimer">03:00</span>
          </div> -->

          <div class="form-navigation">
            <button type="submit" class="btn-signup" id="submitSignup" @click="signUp()">회원가입</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.logo-image {
  width: 6.123rem;
  height: 4.213rem;
  margin-top: 0.7rem;
}

/* ##### signup container ##### */
.signup-container {
  display: flex;
  min-height: 100vh;
}


/* ##### signup wrapper ##### */
.signup-form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: var(--background-color);
  padding: 0.7rem;
  /* border: 1px solid var(--border-color); */
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); */
  color: var(--text-primary);
}

/* ##### signusignup guide ##### */
.singup-header {
  display: flex;
  text-align: center;
  margin-bottom: 2rem;
}

.signup-header h1 {
  text-align: center;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.signup-header p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 20px;
}


/* ##### logo ##### */
/* .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
}

.logo-img {
    width: 80px;
    height: 80px;
    border-radius: 15px;
}

.logo-subtitle {
    color: var(--text-secondary);
    font-size: 0.875rem;
} */


/* ##### signup form ##### */
.signup-form {
  width: 100%;
  max-width: 650px;
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
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

.form-group input {
  width: 100%;
  padding: 1rem;
  background-color: var(--hover-color);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition);
  outline: none;
}

.form-group input:focus {
  border-color: var(--primary-color);
  background-color: var(--dark-bg);
}

.form-group input::placeholder {
  color: var(--text-secondary);
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.btn-check {
  padding: 1rem 1.5rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.btn-check:hover {
  background-color: #ff3838;
}

/* password */
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

.password-input {
  position: relative;
}

.toggle-password:hover {
  color: var(--text-primary);
  background-color: var(--border-color);
}

/* ##### password - 강도 ##### */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  width: 0%;
  transition: var(--transition);
  border-radius: 2px;
}

.strength-fill.weak {
  width: 33%;
  background-color: #e74c3c;
}

.strength-fill.medium {
  width: 66%;
  background-color: #f39c12;
}

.strength-fill.strong {
  width: 100%;
  background-color: var(--secondary-color);
}

.strength-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* ##### error and success messages ##### */
.error-message {
  color: var(--primary-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  /* opacity: 0; */
  transition: var(--transition);
}

.success-message {
  color: var(--success-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  opacity: 1;
  transition: var(--transition);
}

/* 
.success-message.show {
    opacity: 1;
} */


/* ##### signup guide ##### */
.help-text {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.btn-view-terms {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-view-terms:hover {
  background-color: var(--hover-color);
  color: var(--text-primary);
}

/* ##### button ##### */
.form-navigation {
  display: flex;
  /* align-items: flex-end; */
  /* justify-content: flex-end; */
  margin-top: 2rem;
}

.btn-signup {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, var(--secondary-color), #27ae60);
}

.btn-signup:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
  box-shadow: 0 8px 25px rgba(46, 213, 115, 0.4);
}
</style>