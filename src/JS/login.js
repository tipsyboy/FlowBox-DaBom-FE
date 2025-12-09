// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    initializePasswordToggle();
    initializeSocialLogin();
});

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.btn-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Real-time validation
    emailInput?.addEventListener('blur', validateEmail);
    passwordInput?.addEventListener('blur', validatePassword);

    // Clear errors on input
    emailInput?.addEventListener('input', clearEmailError);
    passwordInput?.addEventListener('input', clearPasswordError);
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.querySelector('.btn-login');

    // Validate inputs
    if (!validateEmail() || !validatePassword()) {
        return;
    }

    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';

    // Simulate login API call
    setTimeout(() => {
        // Reset button state
        loginBtn.classList.remove('loading');
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';

        // Check credentials (simulation)
        if (isValidCredentials(email, password)) {
            showSuccessMessage('로그인 성공!');

            // Save login state if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            // Store user session
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);

            // Redirect to main page after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    }, 2000);
}

function isValidCredentials(email, password) {
    // Simulation - in real app, this would be handled by backend
    const validUsers = [
        { email: 'test@dabom.com', password: 'password123!' },
        { email: 'user@example.com', password: 'mypassword1!' },
        { email: 'admin@dabom.com', password: 'admin123!' }
    ];

    return validUsers.some(user => 
        user.email === email && user.password === password
    );
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showFieldError(emailError, '이메일을 입력해주세요.');
        return false;
    }

    if (!emailRegex.test(email)) {
        showFieldError(emailError, '올바른 이메일 형식을 입력해주세요.');
        return false;
    }

    clearFieldError(emailError);
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const password = passwordInput.value;

    if (!password) {
        showFieldError(passwordError, '비밀번호를 입력해주세요.');
        return false;
    }

    if (password.length < 8) {
        showFieldError(passwordError, '비밀번호는 8자 이상이어야 합니다.');
        return false;
    }

    clearFieldError(passwordError);
    return true;
}

function clearEmailError() {
    const emailError = document.getElementById('emailError');
    clearFieldError(emailError);
}

function clearPasswordError() {
    const passwordError = document.getElementById('passwordError');
    clearFieldError(passwordError);
}

function showFieldError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    errorElement.parentElement.querySelector('input').style.borderColor = 'var(--primary-color)';
}

function clearFieldError(errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    errorElement.parentElement.querySelector('input').style.borderColor = 'var(--border-color)';
}

function initializePasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = toggleBtn.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
}

function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');

    socialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList[1].replace('-btn', '');
            handleSocialLogin(platform);
        });
    });
}

function handleSocialLogin(platform) {
    showLoadingMessage(`${platform.toUpperCase()}로 로그인 중...`);

    // Simulate social login process
    setTimeout(() => {
        // In real implementation, this would redirect to OAuth provider
        const platformNames = {
            'kakao': '카카오',
            'naver': '네이버',
            'google': '구글',
            'apple': 'Apple'
        };

        showSuccessMessage(`${platformNames[platform]} 로그인 성공!`);

        // Store social login info
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('loginMethod', platform);
        sessionStorage.setItem('userEmail', `user@${platform}.com`);

        // Redirect to main page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showLoadingMessage(message) {
    showNotification(message, 'info');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // Style the notification
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
        max-width: 300px;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Remove after delay
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
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'var(--secondary-color)';
        case 'error': return 'var(--primary-color)';
        case 'info': return '#3498db';
        default: return '#3498db';
    }
}

// Load remembered email on page load
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});

// Check if user is already logged in
window.addEventListener('load', function() {
    if (sessionStorage.getItem('userLoggedIn') === 'true') {
        showNotification('이미 로그인되어 있습니다. 메인 페이지로 이동합니다.', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});
