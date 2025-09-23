<script setup>
import SearchQueryForm from '@/entity/SearchQueryForm';
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const state = reactive({
    searchQueryForm: new SearchQueryForm()
})

// 현재 URL의 키워드로 초기화
if (route.query.keyword) {
    state.searchQueryForm.query = route.query.keyword;
}

const onSubmit = () => {
    const keyword = state.searchQueryForm.query.trim();
    
    // 메인 페이지로 이동하면서 검색어를 쿼리 파라미터로 전달
    router.push({
        name: 'main', // 또는 메인 페이지의 라우트 이름
        query: { 
            keyword: keyword || undefined // 빈 문자열이면 undefined로 설정
        }
    });
}

const onInputKeydown = (event) => {
    if (event.key === 'Enter') {
        onSubmit();
    }
}
</script>

<template>
    <div class="search-container">
        <form class="search-form" @submit.prevent="onSubmit">
            <div class="search-input-wrapper">
                <input 
                    type="text" 
                    v-model="state.searchQueryForm.query" 
                    @keydown="onInputKeydown"
                    placeholder="검색어를 입력하세요..."
                    class="search-input" 
                />
                <button type="submit" class="search-btn">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.search-container {
    display: flex;
    justify-content: center;
    position: relative;
    margin: 0 auto;
}

.search-input-wrapper {
    display: flex;
    width: 100%;
    max-width: 45rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-color);
    border-radius: 25px 0 0 25px;
    background-color: var(--card-bg);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition);
    width: 90rem;
}

.search-input:focus {
    outline: none;
    border: 2px solid var(--primary-color);
}

.search-btn {
    display: flex;
    outline: none;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--border-color);
    border-radius: 0 25px 25px 0;
    background-color: var(--hover-color);
    color: var(--text-primary);
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
}

.search-btn:hover {
    border: 2px solid var(--primary-color);
    background-color: var(--primary-color);
}

.search-btn i {
    font-size: 1rem;
}
</style>