<script setup>
import ChannelPostCard from '@/components/channel/community/ChannelPostCard.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { getChannelBoardListPaged } from '@/api/channel'; 

const route = useRoute();
const posts = ref([]);
const loading = ref(false);


const currentPage = ref(0);
const hasNext = ref(true);
const isLoadingMore = ref(false);
const pageSize = 10;
const observerTarget = ref(null);
let observer = null;

const channelName  = computed(() => {
    return route.params.channelName ? (route.params.channelName) : null;
    
});

const loadPosts = async (page = 0, reset = false) => {
    if (isLoadingMore.value && !reset) return;
    
    isLoadingMore.value = true;
    try {
        
        
        if (page > 0 && !reset) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        const response = await getChannelBoardListPaged(page, pageSize, 'latest', channelName.value); // 최신순
        
        if (reset) {
            posts.value = response.content || [];
        } else {
            posts.value = [...posts.value, ...(response.content || [])];
        }
        
        hasNext.value = response.hasNext;
        currentPage.value = page;
        
        
        if (reset) {
            setTimeout(setupObserver, 100);
        }
        
    } catch (error) {
        console.error('게시글 로딩 실패:', error);
        if (reset) {
            posts.value = [];
        }
    } finally {
        isLoadingMore.value = false;
    }
};

const loadMorePosts = () => {
    if (hasNext.value && !isLoadingMore.value) {
        loadPosts(currentPage.value + 1);
    }
};

const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNext.value && !isLoadingMore.value) {
        loadMorePosts();
    }
};


const setupObserver = () => {
    if (observer) observer.disconnect();
    
    if (observerTarget.value && hasNext.value) {
        observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        observer.observe(observerTarget.value);
    }
};


const fetchPosts = async () => {
    loading.value = true;
    try {
        await loadPosts(0, true); 
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchPosts();
    
    
    setTimeout(setupObserver, 500);
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<template>
<section class="content-tab" id="community-tab">
    <div class="tab-header">
        <h2>커뮤니티</h2>
    </div>

    <div class="community-posts">
        <div v-if="loading" class="loading-text">로딩 중...</div>
        <div v-else-if="posts.length === 0" class="no-posts-text">게시글이 없습니다.</div>
        <template v-else>
           
            <ChannelPostCard 
                v-for="post in posts" 
                :key="post.idx"
                :post-data="post"
            />
            
           
            <div 
                v-if="hasNext" 
                ref="observerTarget" 
                class="loading-trigger"
            >
                <div v-if="isLoadingMore" class="loading-more">
                    <i class="fas fa-spinner fa-spin"></i>
                    게시글을 더 불러오는 중...
                </div>
            </div>
            
            <div v-if="!hasNext && posts.length > 0" class="posts-end">
                모든 게시글을 불러왔습니다.
            </div>
        </template>
    </div>
</section>
</template>

<style scoped>
@import url('@/assets/channel/communityHeader.css');

.loading-text,
.no-posts-text {
    color: white;
    text-align: center;
    padding: 2rem;
    font-size: 2rem;
}

/* 무한 스크롤 관련 스타일 */
.loading-trigger {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-more {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #888;
    font-size: 0.875rem;
}

.loading-more i {
    color: #3b82f6;
}

.posts-end {
    text-align: center;
    color: #666;
    font-size: 0.875rem;
    padding: 1.5rem;
    border-top: 1px solid #444;
    margin-top: 1rem;
    font-style: italic;
}
</style>