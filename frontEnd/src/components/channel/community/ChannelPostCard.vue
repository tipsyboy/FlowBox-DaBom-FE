<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import api from '@/api/channel';

const props = defineProps({
    postData: {
        type: Object,
        required: true
    }
});

const router = useRouter();
const isProcessing = ref(false);

const localPost = reactive({
    ...props.postData
});

const clickLikeBtn = async (idx) => {
    if (isProcessing.value) return;
    
    try {
        isProcessing.value = true;
        
        
        if (typeof api.ChannelBoardLikes === 'function') {
            const data = await api.ChannelBoardLikes(idx);
            
            if (data) {
                localPost.isLikes = !localPost.isLikes;
                if (localPost.isLikes) {
                    localPost.likesCount++;
                } else {
                    localPost.likesCount = Math.max(0, localPost.likesCount - 1);
                }
            }
        } else {
        }
    } catch (error) {
        console.error('좋아요 처리 오류:', error);
    } finally {
        isProcessing.value = false;
    }
};

const clickPost = () => {
    router.push(`/post/${localPost.idx}`);
};
</script>

<template>
<div class="community-post">
    <div class="posts"> 
        <div class="post-header">
            <div class="post-author">
                <!-- <img src="https://via.placeholder.com/40" alt="채널" class="author-avatar"> -->
                <div class="author-info">
                    <span class="author-name">크리에이티브 채널</span>
                    <span class="post-time">{{ localPost.createdAt || localPost.createAt }}</span>
                </div>
            </div>
            <div class="post-title">
                <span class="title">{{ localPost.title }}</span>
            </div>
        </div>
        <div class="post-content">
            <p>{{ localPost.contents }}</p>
            <!-- 이미지가 있다면 표시 -->
            <div class="post-image" v-if="localPost.imageUrl">
                <img :src="localPost.imageUrl" alt="게시물 이미지">
            </div>
        </div>
    </div>
    <div class="post-actions">
        <button 
            class="post-action-btn like-btn" 
            :class="{ 'liked': localPost.isLikes }"
            :disabled="isProcessing"
            @click="clickLikeBtn(localPost.idx)"
        >   
            <i 
                class="fas fa-heart" 
                :style="{ color: localPost.isLikes ? '#ff3040' : '#8e8e8e' }"
            ></i>
            {{ localPost.likesCount }}
        </button>
        <button class="post-action-btn comment-btn" @click="clickPost">
            <i class="fas fa-comment"></i>
            {{ localPost.commentCount }} 
        </button>
    </div>
</div>
</template>

<style scoped>
    @import url('@/assets/channel/ChannelPostCard.css');
    
    /* 좋아요 버튼 추가 스타일 */
    .like-btn.liked {
        color: #ff3040;
    }
    
    .like-btn:hover:not(:disabled) {
        opacity: 0.8;
    }
    
    .like-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .like-btn i {
        transition: color 0.3s ease;
    }
</style>