<script setup>
import { useRouter } from 'vue-router';

const props = defineProps(['video'])
const router = useRouter()

const playVideo = () => {
    router.push({ name: 'videoPlayer', params: { id: props.video.videoId } })
}

const goToChannel = () => {
    // channel 정보가 있을 때만 이동하도록 수정
    if (props.video.channel && props.video.channel.name) {
        router.push(`/channel/${props.video.channel.name}`);
    }
}
</script>

<template>
    <div class="video-card">
        <div class="video-thumbnail">
            <img :src="video.videoImage || '@/assets/images/dabom2.png'"  alt="썸네일" />
            <div class="video-duration">{{ props.video.duration }}</div>
            <div class="video-overlay">
                <button class="video-overlay__play-btn" @click="playVideo">
                    <i class="fas fa-play"></i>
                </button>
                <button class="video-overlay__together-btn" title="Together 모드로 시청">
                    <i class="fas fa-users"></i>
                </button>
            </div>
        </div>

        <!-- 비디오 정보 -->
        <div class="video-info">
            <div class="channel-avatar" @click="goToChannel">
                <img 
                    :src="props.video.channel?.profileImg || '@/assets/images/dabom2.png'" 
                    alt="채널이미지" 
                />
            </div>
            <div class="video-details">
                <h4 class="video-title">{{ props.video.title }}</h4>
                <!-- Optional Chaining (?.)을 사용해서 안전하게 접근하도록 수정 -->
                <p class="channel-name">{{ props.video.channel?.name || '채널 정보 없음' }}</p>
                <div class="video-meta">
                    <div class="star-rating">

                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <span class="rating-score">{{ props.video.rating || 0}}</span>
                    </div>
                    <span class="view-count">{{ props.video.views || 0 }}</span>
                    <span class="upload-time">{{ props.video.uploadedAt || 0}}일 전</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.video-card {
    /* max-width: 21rem; */
    /* margin-bottom: 0.05rem; */
    width: 100%;
    max-width: unset;
    background-color: var(--card-bg);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* .video-thumbnail {
    position: relative;
    overflow: hidden;
}

.video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
} */

.video-thumbnail {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    /* 또는 4 / 3 등 원하는 비율 */
    border-radius: 8px;
}

.video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}


.video-duration {
    position: absolute;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px var(--spacing-xs);
    border-radius: 4px;
    font-size: var(--font-xs);
    font-weight: 500;
}

.video-info {
    padding: var(--spacing-md);
    display: flex;
    gap: var(--spacing-md);
}

.channel-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.channel-avatar {
    cursor: pointer; /* 마우스 올리면 포인터로 변경 */
    transition: transform 0.2s ease;
}

.channel-avatar:hover {
    transform: scale(1.05); /* 살짝 확대 효과 */
}

.video-details {
    flex: 1;
}

.video-title {
    color: var(--text-primary);
    font-size: var(--font-md);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    line-height: 1.4;
    overflow: hidden;
}

.channel-name {
    color: var(--text-secondary);
    font-size: var(--font-sm);
    margin-bottom: var(--spacing-xs);
}

.video-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-xs);
    color: var(--text-secondary);
    flex-wrap: wrap;
}

.star-rating {
    display: flex;
    align-items: center;
    gap: 2px;
}

.star-rating i {
    color: var(--star-color);
}

.rating-score {
    margin-left: var(--spacing-xs);
    font-weight: 500;
}

.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 6px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.video-card:hover .video-overlay {
    opacity: 1;
}

.video-overlay__play-btn,
.video-overlay__together-btn {
    background-color: var(--primary-color);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: var(--font-lg);
    transition: all 0.3s ease;
}

.video-overlay__together-btn {
    background-color: var(--together-color);
}
</style>
