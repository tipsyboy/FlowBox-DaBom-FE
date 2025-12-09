
import { defineStore } from 'pinia';
import { ref } from 'vue';
import subscribeApi from '@/api/subscribe/index.js';

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscriptions = ref([]);

  async function fetchSubscriptions() {
    try {
      // API 응답의 전체 구조를 받아옵니다.
      const response = await subscribeApi.getSubscribe();
      
      // 백엔드 응답이 BaseResponse.of(data, HttpStatus.OK) 형태이므로,
      // 실제 데이터는 response.data 에 있습니다.
      if (response && response.data) {
        subscriptions.value = response.data;
      } else {
        // 응답에 data 필드가 없는 경우를 대비하여 초기화합니다.
        subscriptions.value = [];
        console.log("No subscription data found in response:", response);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      subscriptions.value = [];
    }
  }

  return {
    subscriptions,
    fetchSubscriptions,
  };
});
