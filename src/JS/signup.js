// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSignupForm();
    initializePasswordToggle();
    initializeValidation();
    initializeTermsModal();
});

let currentStep = 1;
const totalSteps = 3;

function initializeSignupForm() {
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const submitButton = document.getElementById('submitSignup');

    nextButtons.forEach(btn => {
        btn.addEventListener('click', nextStep);
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });

    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function showStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');

    // Show new step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');

    // Update step indicators
    updateStepIndicators();
}

function updateStepIndicators() {
    const indicators = document.querySelectorAll('.step');
    indicators.forEach((indicator, index) => {
        const stepNumber = index + 1;
        indicator.classList.remove('active', 'completed');

        if (stepNumber < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNumber === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

function validateStep1() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('emailError', '올바른 이메일을 입력해주세요.');
        isValid = false;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username || !usernameRegex.test(username)) {
        showFieldError('usernameError', '사용자명은 3-20자의 영문, 숫자, 언더스코어만 사용할 수 있습니다.');
        isValid = false;
    }

    // Password validation
    if (!password || password.length < 8) {
        showFieldError('passwordError', '비밀번호는 8자 이상이어야 합니다.');
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        showFieldError('confirmPasswordError', '비밀번호가 일치하지 않습니다.');
        isValid = false;
    }

    return isValid;
}

function validateStep2() {
    const fullName = document.getElementById('fullName').value;

    if (!fullName) {
        showFieldError('fullNameError', '이름을 입력해주세요.');
        return false;
    }

    return true;
}

function validateStep3() {
    const termsRequired = document.getElementById('termsRequired').checked;
    const privacyRequired = document.getElementById('privacyRequired').checked;
    const ageConfirm = document.getElementById('ageConfirm').checked;

    if (!termsRequired || !privacyRequired || !ageConfirm) {
        showNotification('필수 약관에 동의해주세요.', 'error');
        return false;
    }

    return true;
}

function showFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function initializeValidation() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    let strength = 0;
    let strengthClass = '';
    let strengthLabel = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
        strengthClass = 'weak';
        strengthLabel = '약함';
    } else if (strength <= 3) {
        strengthClass = 'medium';
        strengthLabel = '보통';
    } else {
        strengthClass = 'strong';
        strengthLabel = '강함';
    }

    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthText.textContent = `비밀번호 강도: ${strengthLabel}`;
}

function initializeTermsModal() {
    const modal = document.getElementById('termsModal');
    const closeBtn = document.getElementById('closeModal');
    const viewTermsBtns = document.querySelectorAll('.btn-view-terms');

    viewTermsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const termsType = this.dataset.terms;
            showTermsModal(termsType);
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    modal.querySelector('.modal-overlay').addEventListener('click', function() {
        modal.classList.remove('show');
    });
}

function showTermsModal(termsType) {
    const modal = document.getElementById('termsModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');

    const termsContent = {
        service: {
            title: '서비스 이용약관',
            content: 'DaBom 서비스 이용약관 내용...'
        },
        privacy: {
            title: '개인정보 처리방침',
            content: 'DaBom 개인정보 처리방침 내용...'
        },
        marketing: {
            title: '마케팅 정보 수신 동의',
            content: 'DaBom 마케팅 정보 수신 동의 내용...'
        }
    };

    title.textContent = termsContent[termsType].title;
    content.textContent = termsContent[termsType].content;
    modal.classList.add('show');
}

function handleSubmit(e) {
    e.preventDefault();

    if (validateStep3()) {
        const submitBtn = document.getElementById('submitSignup');
        submitBtn.classList.add('loading');

        // Simulate signup process
        setTimeout(() => {
            showNotification('회원가입이 완료되었습니다!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 3000);
    }
}

function showNotification(message, type) {
    // Same notification function as in login.js
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'var(--secondary-color)';
        case 'error': return 'var(--primary-color)';
        default: return '#3498db';
    }
}
