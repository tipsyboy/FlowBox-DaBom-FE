// SearchQueryForm.js - 검색어 관리를 위한 엔티티 클래스

export default class SearchQueryForm {
    constructor(query = '') {
        this.query = query;
    }

    // 검색어 유효성 검증
    isValid() {
        return this.query && this.query.trim().length > 0;
    }

    // 검색어 정리 (앞뒤 공백 제거)
    getCleanQuery() {
        return this.query ? this.query.trim() : '';
    }

    // 검색어 초기화
    reset() {
        this.query = '';
    }

    // 검색어 설정
    setQuery(query) {
        this.query = query || '';
    }

    // 최소 길이 검증 (기본 1글자)
    hasMinLength(minLength = 1) {
        const cleanQuery = this.getCleanQuery();
        return cleanQuery.length >= minLength;
    }

    // 최대 길이 검증 (기본 100글자)
    hasMaxLength(maxLength = 100) {
        const cleanQuery = this.getCleanQuery();
        return cleanQuery.length <= maxLength;
    }


}