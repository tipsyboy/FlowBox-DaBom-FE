<script setup>
import useMemberStore from '@/stores/useMemberStore';
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { getChannelBoardListPaged, deleteChannelBoard, updateChannelBoard, createChannelBoard } from '@/api/channel';

import PostCard from '@/components/channel/community-management/PostCard.vue';
import CreatePostModal from '@/components/channel/community-management/CreatePostModal.vue';
import SortDropdown from '@/components/channel/community-management/SortDropdown.vue';

const props = defineProps({
  isActive: Boolean
});

const posts = ref([]);
const loading = ref(false);
const totalPostCount = ref(0);

const currentPage = ref(0);
const hasNext = ref(true);
const isLoadingMore = ref(false);
const pageSize = 10;

const memberStore = useMemberStore();
const route = useRoute();
const getChannelName = () => {
  if (route.path === '/mychannel') {
    return memberStore.getChannelNameWithEncrypt();
  } else {
    return route.params.channelName;
  }
};
const channelName = getChannelName();

const sortBy = ref('oldest');
const showCreateModal = ref(false);
const infiniteScrollTrigger = ref(null);

const loadPosts = async (page = 0, reset = false) => {
  if (isLoadingMore.value && !reset) return;
  
  isLoadingMore.value = true;
  try {
    if (page > 0 && !reset) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const response = await getChannelBoardListPaged(page, pageSize, sortBy.value, channelName);
    
    if (reset || page === 0) {
      totalPostCount.value = response.totalCount || 0;
    }
    
    if (reset) {
      posts.value = (response.content || []).map(post => ({
        ...post,
        isEditing: false,
        editTitle: post.title,
        editContent: post.contents
      }));
    } else {
      const newPosts = (response.content || []).map(post => ({
        ...post,
        isEditing: false,
        editTitle: post.title,
        editContent: post.contents
      }));
      posts.value = [...posts.value, ...newPosts];
    }
    
    hasNext.value = response.hasNext;
    currentPage.value = page;
    
    if (reset && infiniteScrollTrigger.value) {
      setTimeout(() => {
        infiniteScrollTrigger.value.setupObserver();
      }, 100);
    }
    
  } catch (error) {
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

const handleSortChange = (newSort) => {
  sortBy.value = newSort;
  currentPage.value = 0;
  hasNext.value = true;
  loadPosts(0, true);
};

const handleEdit = (post) => {
  post.isEditing = !post.isEditing;
  if (post.isEditing) {
    post.editIdx = post.idx;
    post.editTitle = post.title;
    post.editContent = post.contents;
  }
};

const handleDeletePost = async (postIdx) => {
  if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    return;
  }

  try {
    const response = await deleteChannelBoard(postIdx);
    if (response.code === 200 || response.success) {
      alert('게시글이 삭제되었습니다.');
      currentPage.value = 0;
      hasNext.value = true;
      await loadPosts(0, true);
    } else {
      throw new Error(response.message || '삭제에 실패했습니다.');
    }
  } catch (error) {
    alert('게시글 삭제에 실패했습니다.');
  }
};

const handleSaveEdit = async (post) => {
  if (!post.editTitle.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }
  
  if (!post.editContent.trim()) {
    alert('내용을 입력해주세요.');
    return;
  }

  try {
    const response = await updateChannelBoard(post.idx, {
      idx: post.idx,
      title: post.editTitle.trim(),
      contents: post.editContent.trim()
    });
    
    if (response.code === 200 || response.success) {
      alert('게시글이 수정되었습니다.');
      post.title = post.editTitle;
      post.contents = post.editContent;
      post.isEditing = false;
      currentPage.value = 0;
      hasNext.value = true;
      await loadPosts(0, true);
    } else {
      throw new Error(response.message || '수정에 실패했습니다.');
    }
  } catch (error) {
    alert('게시글 수정에 실패했습니다.');
  }
};

const handleCancelEdit = (post) => {
  post.isEditing = false;
  post.editTitle = post.title;
  post.editContent = post.contents;
};

const handleCreatePost = async (postData) => {
  try {
    const response = await createChannelBoard(postData);
    
    if (response.code === 200 || response.success) {
      alert('게시글이 작성되었습니다.');
      showCreateModal.value = false;
      currentPage.value = 0;
      hasNext.value = true;
      await loadPosts(0, true);
    } else {
      throw new Error(response.message || '작성에 실패했습니다.');
    }
  } catch (error) {
    alert('게시글 작성에 실패했습니다.');
  }
};

const handleCloseModal = () => {
  showCreateModal.value = false;
};

const handleCommentManage = (postTitle) => {
  alert(`게시글 "${postTitle}" 의 댓글 관리 기능은 추후 구현 예정입니다.`);
};

onMounted(() => {
  if (props.isActive) {
    loadPosts(0, true);
  }
});

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    currentPage.value = 0;
    hasNext.value = true;
    loadPosts(0, true);
  }
});
</script>

<template>
  <section id="section-community" class="dashboard-section" :class="{ active: isActive }">
    <div class="community-header">
      <h2>커뮤니티 게시글 관리</h2>

      <SortDropdown 
        :sortBy="sortBy" 
        @sort-change="handleSortChange"
      />
    </div>
    
    <button class="btn-create" @click="showCreateModal = true">
      <i class="fas fa-pen"></i> 새 게시글 작성
    </button>
    
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> 게시글을 불러오는 중...
    </div>
    
    <div v-else class="community-posts-manage">
      <div v-if="posts.length === 0 && !isLoadingMore" class="no-posts">
        <i class="fas fa-inbox"></i>
        <p>작성된 게시글이 없습니다.</p>
        <small>새 게시글을 작성해보세요!</small>
      </div>
      
      <div v-else>
        <div class="posts-count">
          총 {{ totalPostCount }}개의 게시글 ({{ posts.length }}개 로드됨)
        </div>
        
        <PostCard 
          v-for="post in posts" 
          :key="post.idx"
          :post="post"
          @edit="handleEdit"
          @delete="handleDeletePost"
          @save="handleSaveEdit"
          @cancel="handleCancelEdit"
          @comment-manage="handleCommentManage"
        />
        
        <InfiniteScrollTrigger 
          ref="infiniteScrollTrigger"
          :hasNext="hasNext" 
          :isLoading="isLoadingMore"
          :showEndMessage="posts.length > 0"
          @load-more="loadMorePosts"
        />
      </div>
    </div>
    
    <CreatePostModal 
      :show="showCreateModal"
      @submit="handleCreatePost"
      @close="handleCloseModal"
    />
  </section>
</template>

<style scoped>
.dashboard-section {
  display: none;
  padding: 2rem;
}

.dashboard-section.active {
  display: block;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.community-header h2 {
  margin: 0;
  color: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.no-posts {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.no-posts i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.posts-count {
  margin-bottom: 1rem;
  color: #888;
  font-size: 0.875rem;
}

.btn-create {
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-create:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .community-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>