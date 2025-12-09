// Vue 호환 비디오 플레이어 스크립트
let currentRating = 0;
let isTogetherModeActive = false;

// Vue 인스턴스가 마운트된 후 초기화
function initializeVideoPlayerForVue() {
    // Vue의 $nextTick과 유사한 기능을 위해 지연 실행
    setTimeout(() => {
        initializeVideoPlayer();
        initializeStarRating();
        initializeTogetherMode();
        initializeComments();
        initializeMobileMenu();
        initializeSearch();
        initializeAdditionalFeatures();
    }, 100);
}

// Video Player Functions
function initializeVideoPlayer() {
    const video = document.getElementById('mainVideoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');

    if (video && playPauseBtn) {
        // 기존 이벤트 리스너 제거 (중복 방지)
        const newPlayPauseBtn = playPauseBtn.cloneNode(true);
        playPauseBtn.parentNode.replaceChild(newPlayPauseBtn, playPauseBtn);

        // Play/Pause functionality
        newPlayPauseBtn.addEventListener('click', function () {
            if (video.paused) {
                video.play();
                newPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                newPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Update play/pause button based on video state
        video.addEventListener('play', function () {
            newPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });

        video.addEventListener('pause', function () {
            newPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        // Video ended
        video.addEventListener('ended', function () {
            newPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        // Update video time and progress
        video.addEventListener('timeupdate', function () {
            updateVideoProgress();
        });
    }
}

function updateVideoProgress() {
    // Function to update video progress
    // Can be expanded for custom controls
}

// Star Rating System
function initializeStarRating() {
    const stars = document.querySelectorAll('.star-rating-interactive i');

    // 기존 이벤트 리스너 제거
    stars.forEach((star) => {
        const newStar = star.cloneNode(true);
        star.parentNode.replaceChild(newStar, star);
    });

    // 새로운 별점 요소들에 이벤트 추가
    const newStars = document.querySelectorAll('.star-rating-interactive i');
    newStars.forEach((star, index) => {
        star.addEventListener('mouseenter', function () {
            highlightStars(index + 1);
        });

        star.addEventListener('mouseleave', function () {
            highlightStars(currentRating);
        });

        star.addEventListener('click', function () {
            currentRating = index + 1;
            highlightStars(currentRating);
            submitRating(currentRating);
        });
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating-interactive i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitRating(rating) {
    // Submit rating to server
    console.log('Rating submitted:', rating);

    // Update UI feedback
    const currentRatingDisplay = document.querySelector('.current-rating');
    if (currentRatingDisplay) {
        currentRatingDisplay.textContent = `평균 4.2점 (235개 평가) - 내 평가: ${rating}점`;
    }

    // Show success message
    showNotification('평가가 등록되었습니다!', 'success');
}

// Together Mode Functions
function initializeTogetherMode() {
    const togetherBtn = document.getElementById('togetherBtn');
    const togetherPanel = document.getElementById('togetherPanel');
    const closeTogetherBtn = document.getElementById('closeTogetherBtn');
    const sendMessageBtn = document.querySelector('.send-message-btn');
    const chatInput = document.querySelector('.chat-input');

    if (togetherBtn) {
        // 기존 이벤트 리스너 제거
        const newTogetherBtn = togetherBtn.cloneNode(true);
        togetherBtn.parentNode.replaceChild(newTogetherBtn, togetherBtn);

        newTogetherBtn.addEventListener('click', function () {
            toggleTogetherMode();
        });
    }

    if (closeTogetherBtn) {
        const newCloseBtn = closeTogetherBtn.cloneNode(true);
        closeTogetherBtn.parentNode.replaceChild(newCloseBtn, closeTogetherBtn);

        newCloseBtn.addEventListener('click', function () {
            toggleTogetherMode();
        });
    }

    if (sendMessageBtn && chatInput) {
        const newSendBtn = sendMessageBtn.cloneNode(true);
        sendMessageBtn.parentNode.replaceChild(newSendBtn, sendMessageBtn);

        const newChatInput = chatInput.cloneNode(true);
        chatInput.parentNode.replaceChild(newChatInput, chatInput);

        newSendBtn.addEventListener('click', function () {
            sendChatMessage();
        });

        newChatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function toggleTogetherMode() {
    const togetherBtn = document.getElementById('togetherBtn');
    const togetherPanel = document.getElementById('togetherPanel');

    if (!togetherBtn || !togetherPanel) return;

    isTogetherModeActive = !isTogetherModeActive;

    if (isTogetherModeActive) {
        togetherPanel.classList.add('active');
        togetherBtn.classList.add('active');
        togetherBtn.innerHTML = '<i class="fas fa-users"></i> Together 활성';

        // Simulate connecting to together session
        showNotification('Together 모드가 활성화되었습니다!', 'success');
        simulateParticipantJoin();
    } else {
        togetherPanel.classList.remove('active');
        togetherBtn.classList.remove('active');
        togetherBtn.innerHTML = '<i class="fas fa-users"></i> Together 모드';

        showNotification('Together 모드가 비활성화되었습니다.', 'info');
    }
}

function sendChatMessage() {
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    if (!chatInput || !chatMessages || chatInput.value.trim() === '') return;

    const message = chatInput.value.trim();
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>나:</strong> ${message}`;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = '';

    // Simulate response from other participants
    setTimeout(() => {
        simulateChatResponse();
    }, 1000 + Math.random() * 2000);
}

function simulateParticipantJoin() {
    setTimeout(() => {
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            const joinMessage = document.createElement('div');
            joinMessage.classList.add('chat-message');
            joinMessage.style.color = 'var(--secondary-color)';
            joinMessage.innerHTML = '<em>사용자3님이 함께 시청을 시작했습니다.</em>';
            chatMessages.appendChild(joinMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 2000);
}

function simulateChatResponse() {
    const responses = [
        '동감해요!',
        '이 장면 정말 좋네요',
        '같이 보니까 더 재미있어요 ㅎㅎ',
        '다음 영상도 함께 봐요!'
    ];

    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        const responseMessage = document.createElement('div');
        responseMessage.classList.add('chat-message');
        responseMessage.innerHTML = `<strong>사용자${Math.floor(Math.random() * 3) + 1}:</strong> ${responses[Math.floor(Math.random() * responses.length)]}`;

        chatMessages.appendChild(responseMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Comments Functions
function initializeComments() {
    const commentTextarea = document.querySelector('.comment-textarea');
    const commentActions = document.querySelector('.comment-actions');
    const submitBtn = commentActions?.querySelector('.btn-primary');
    const cancelBtn = commentActions?.querySelector('.btn-cancel');

    // Show/hide comment actions based on textarea focus
    if (commentTextarea && commentActions) {
        // 기존 이벤트 제거
        const newTextarea = commentTextarea.cloneNode(true);
        commentTextarea.parentNode.replaceChild(newTextarea, commentTextarea);

        newTextarea.addEventListener('focus', function () {
            commentActions.style.display = 'flex';
        });
    }

    if (cancelBtn) {
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newCancelBtn.addEventListener('click', function () {
            const textarea = document.querySelector('.comment-textarea');
            if (textarea) {
                textarea.value = '';
                commentActions.style.display = 'none';
                textarea.blur();
            }
        });
    }

    if (submitBtn) {
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

        newSubmitBtn.addEventListener('click', function () {
            submitComment();
        });
    }

    // Initialize comment interaction buttons
    initializeCommentButtons();
}

function initializeCommentButtons() {
    // Like/Dislike buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');
    const replyButtons = document.querySelectorAll('.reply-btn');

    likeButtons.forEach(btn => {
        if (!btn.hasAttribute('data-vue-initialized')) {
            btn.setAttribute('data-vue-initialized', 'true');
            btn.addEventListener('click', function () {
                toggleLike(this);
            });
        }
    });

    dislikeButtons.forEach(btn => {
        if (!btn.hasAttribute('data-vue-initialized')) {
            btn.setAttribute('data-vue-initialized', 'true');
            btn.addEventListener('click', function () {
                toggleDislike(this);
            });
        }
    });

    replyButtons.forEach(btn => {
        if (!btn.hasAttribute('data-vue-initialized')) {
            btn.setAttribute('data-vue-initialized', 'true');
            btn.addEventListener('click', function () {
                showReplyForm(this);
            });
        }
    });
}

function submitComment() {
    const commentTextarea = document.querySelector('.comment-textarea');
    const commentsList = document.querySelector('.comments-list');

    if (!commentTextarea || !commentsList || commentTextarea.value.trim() === '') return;

    const commentContent = commentTextarea.value.trim();
    const newComment = createCommentElement(commentContent);

    commentsList.insertBefore(newComment, commentsList.firstChild);

    commentTextarea.value = '';
    const commentActions = document.querySelector('.comment-actions');
    if (commentActions) {
        commentActions.style.display = 'none';
    }

    showNotification('댓글이 등록되었습니다!', 'success');

    // Update comment count
    updateCommentCount();
}

function createCommentElement(content) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment-item');

    commentDiv.innerHTML = `
        <div class="comment-avatar">
            <img src="https://via.placeholder.com/40" alt="내 프로필">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="commenter-name">나</span>
                <span class="comment-time">방금 전</span>
            </div>
            <p class="comment-text">${content}</p>
            <div class="comment-actions">
                <button class="comment-btn like-btn" data-vue-initialized="true">
                    <i class="fas fa-thumbs-up"></i>
                    0
                </button>
                <button class="comment-btn dislike-btn" data-vue-initialized="true">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <button class="comment-btn reply-btn" data-vue-initialized="true">답글</button>
                <button class="comment-btn report-btn">신고</button>
            </div>
        </div>
    `;

    // Re-initialize buttons for the new comment
    const newLikeBtn = commentDiv.querySelector('.like-btn');
    const newDislikeBtn = commentDiv.querySelector('.dislike-btn');
    const newReplyBtn = commentDiv.querySelector('.reply-btn');

    newLikeBtn.addEventListener('click', function () {
        toggleLike(this);
    });

    newDislikeBtn.addEventListener('click', function () {
        toggleDislike(this);
    });

    newReplyBtn.addEventListener('click', function () {
        showReplyForm(this);
    });

    return commentDiv;
}

function toggleLike(button) {
    const isActive = button.classList.contains('active');
    const countSpan = button.querySelector('i').nextSibling;
    let count = parseInt(countSpan.textContent.trim()) || 0;

    if (isActive) {
        button.classList.remove('active');
        count = Math.max(0, count - 1);
    } else {
        button.classList.add('active');
        count += 1;

        // Remove dislike if active
        const dislikeBtn = button.parentElement.querySelector('.dislike-btn');
        if (dislikeBtn) {
            dislikeBtn.classList.remove('active');
        }
    }

    countSpan.textContent = ` ${count}`;
}

function toggleDislike(button) {
    const isActive = button.classList.contains('active');

    if (isActive) {
        button.classList.remove('active');
    } else {
        button.classList.add('active');

        // Remove like if active
        const likeBtn = button.parentElement.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.classList.remove('active');
            const countSpan = likeBtn.querySelector('i').nextSibling;
            let count = parseInt(countSpan.textContent.trim()) || 0;
            if (count > 0) {
                countSpan.textContent = ` ${count - 1}`;
            }
        }
    }
}

function showReplyForm(button) {
    // Toggle reply form display
    const commentItem = button.closest('.comment-item');
    let replyForm = commentItem.querySelector('.reply-form');

    if (replyForm) {
        replyForm.remove();
        return;
    }

    replyForm = document.createElement('div');
    replyForm.classList.add('reply-form');
    replyForm.innerHTML = `
        <div style="margin-top: 1rem; margin-left: 3rem;">
            <div style="display: flex; gap: 1rem;">
                <img src="https://via.placeholder.com/30" alt="내 프로필" style="width: 30px; height: 30px; border-radius: 50%;">
                <div style="flex: 1;">
                    <textarea class="reply-textarea" placeholder="답글을 입력해주세요..." style="width: 100%; min-height: 60px; background-color: var(--hover-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-primary); font-family: inherit; resize: vertical; outline: none;"></textarea>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem;">
                        <button class="btn btn-cancel reply-cancel">취소</button>
                        <button class="btn btn-primary reply-submit">답글</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    commentItem.appendChild(replyForm);

    const cancelBtn = replyForm.querySelector('.reply-cancel');
    const submitBtn = replyForm.querySelector('.reply-submit');
    const textarea = replyForm.querySelector('.reply-textarea');

    cancelBtn.addEventListener('click', function () {
        replyForm.remove();
    });

    submitBtn.addEventListener('click', function () {
        if (textarea.value.trim()) {
            submitReply(commentItem, textarea.value.trim());
            replyForm.remove();
        }
    });

    textarea.focus();
}

function submitReply(commentItem, replyContent) {
    let repliesContainer = commentItem.querySelector('.replies');

    if (!repliesContainer) {
        repliesContainer = document.createElement('div');
        repliesContainer.classList.add('replies');
        commentItem.querySelector('.comment-content').appendChild(repliesContainer);
    }

    const replyElement = document.createElement('div');
    replyElement.classList.add('reply-item');
    replyElement.innerHTML = `
        <div class="comment-avatar">
            <img src="https://via.placeholder.com/30" alt="내 프로필">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="commenter-name">나</span>
                <span class="comment-time">방금 전</span>
            </div>
            <p class="comment-text">${replyContent}</p>
            <div class="comment-actions">
                <button class="comment-btn like-btn" data-vue-initialized="true">
                    <i class="fas fa-thumbs-up"></i>
                    0
                </button>
                <button class="comment-btn dislike-btn" data-vue-initialized="true">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <button class="comment-btn reply-btn" data-vue-initialized="true">답글</button>
            </div>
        </div>
    `;

    repliesContainer.appendChild(replyElement);

    // Re-initialize buttons for the new reply
    const newLikeBtn = replyElement.querySelector('.like-btn');
    const newDislikeBtn = replyElement.querySelector('.dislike-btn');
    const newReplyBtn = replyElement.querySelector('.reply-btn');

    newLikeBtn.addEventListener('click', function () {
        toggleLike(this);
    });

    newDislikeBtn.addEventListener('click', function () {
        toggleDislike(this);
    });

    newReplyBtn.addEventListener('click', function () {
        showReplyForm(this);
    });

    showNotification('답글이 등록되었습니다!', 'success');
}

function updateCommentCount() {
    const commentCountElement = document.querySelector('.comment-count');
    if (commentCountElement) {
        let count = parseInt(commentCountElement.textContent.replace('개', '')) || 0;
        count += 1;
        commentCountElement.textContent = `${count}개`;
    }
}

// Mobile Menu Functions
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        // 기존 이벤트 제거
        const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);

        newMobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('mobile-active');

            const icon = newMobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Search Functions
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        // 기존 이벤트 제거
        const newSearchBtn = searchBtn.cloneNode(true);
        searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);

        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);

        newSearchBtn.addEventListener('click', function () {
            performSearch();
        });

        newSearchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Search suggestions (could be expanded)
        newSearchInput.addEventListener('input', function () {
            showSearchSuggestions(this.value);
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (query === '') return;

    console.log('Searching for:', query);
    showNotification(`"${query}" 검색 중...`, 'info');

    // In a real implementation, this would navigate to search results page
    // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

function showSearchSuggestions(query) {
    // This could show a dropdown with search suggestions
    // Implementation depends on the search API and design requirements
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? 'var(--secondary-color)' : type === 'error' ? 'var(--primary-color)' : 'var(--hover-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Playlist Functions
function addToPlaylist() {
    // This would open a playlist selection modal
    showNotification('플레이리스트 기능은 개발 중입니다.', 'info');
}

// Share Functions
function shareVideo() {
    // Copy video URL to clipboard
    if (navigator.share) {
        const videoTitle = document.querySelector('.video-title');
        navigator.share({
            title: videoTitle ? videoTitle.textContent : '비디오 공유',
            url: window.location.href
        }).then(() => {
            showNotification('공유가 완료되었습니다!', 'success');
        }).catch(() => {
            copyToClipboard(window.location.href);
        });
    } else {
        copyToClipboard(window.location.href);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('링크가 클립보드에 복사되었습니다!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('링크가 클립보드에 복사되었습니다!', 'success');
    }
}

// Initialize additional features
function initializeAdditionalFeatures() {
    // Add event listeners for share and playlist buttons
    const shareBtn = document.querySelector('.share-btn');
    const playlistBtn = document.querySelector('.playlist-btn');

    if (shareBtn && !shareBtn.hasAttribute('data-vue-initialized')) {
        shareBtn.setAttribute('data-vue-initialized', 'true');
        shareBtn.addEventListener('click', shareVideo);
    }

    if (playlistBtn && !playlistBtn.hasAttribute('data-vue-initialized')) {
        playlistBtn.setAttribute('data-vue-initialized', 'true');
        playlistBtn.addEventListener('click', addToPlaylist);
    }

    // Add subscribe button functionality
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn && !subscribeBtn.hasAttribute('data-vue-initialized')) {
        subscribeBtn.setAttribute('data-vue-initialized', 'true');
        subscribeBtn.addEventListener('click', function () {
            if (this.textContent === '구독') {
                this.textContent = '구독 중';
                this.style.backgroundColor = 'var(--border-color)';
                showNotification('채널을 구독했습니다!', 'success');
            } else {
                this.textContent = '구독';
                this.style.backgroundColor = 'var(--primary-color)';
                showNotification('구독을 취소했습니다.', 'info');
            }
        });
    }

    // Add message button functionality
    const messageBtn = document.querySelector('.btn-message');
    if (messageBtn && !messageBtn.hasAttribute('data-vue-initialized')) {
        messageBtn.setAttribute('data-vue-initialized', 'true');
        messageBtn.addEventListener('click', function () {
            showNotification('DM 기능은 개발 중입니다.', 'info');
        });
    }
}

// Additional responsive utilities
function handleResize() {
    // Handle window resize events
    const togetherPanel = document.getElementById('togetherPanel');
    if (togetherPanel && window.innerWidth <= 768) {
        // Adjust together panel for mobile
        togetherPanel.style.width = 'calc(100vw - 20px)';
        togetherPanel.style.left = '10px';
        togetherPanel.style.right = '10px';
    }
}

// Vue 컴포넌트에서 사용할 수 있도록 전역으로 노출
if (typeof window !== 'undefined') {
    window.initializeVideoPlayerForVue = initializeVideoPlayerForVue;
    window.handleResize = handleResize;

    // 리사이즈 이벤트 리스너 추가 (중복 방지)
    if (!window.videoPlayerResizeListenerAdded) {
        window.addEventListener('resize', handleResize);
        window.addEventListener('load', handleResize);
        window.videoPlayerResizeListenerAdded = true;
    }
}