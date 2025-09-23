import api from "@/plugins/axiosinterceptor.js";

// 구독 목록을 가져오는 함수 (백엔드: GET /api/member/subscriptions)
export const getSubscribe = async () => { // subscribeId 파라미터는 필요 없을 수 있습니다.
    const requestUrl = `/api/member/subscribe`;
    let data = {};
    await api.get(requestUrl) // POST 대신 GET 사용
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response ? error.response.data : error; // 에러 응답 처리 개선
        });
    return data;
};

// 구독을 시도하는 함수 (백엔드: POST /api/member/subscribe/{channelIdx})
export const trySubscribe = async (channelIdx) => { // subscribeId 대신 channelIdx로 명확히
    const requestUrl = `/api/member/subscribe/${channelIdx}`; // 경로 변수 사용
    let data = {};
    // 백엔드 SubscribeCreateDto에 따라 요청 본문이 필요할 수 있습니다.
    // 현재는 빈 객체로 가정하거나, 필요에 따라 { "someField": "value" } 형태로 전달해야 합니다.
    await api.post(requestUrl, { channelIdx }) // 요청 본문은 백엔드 DTO에 맞춰야 함
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response ? error.response.data : error;
        });
    return data;
};

// 구독을 취소하는 함수 (백엔드: DELETE /api/member/unsubscribe/{channelIdx})
export const deleteSubscribe = async (channelIdx) => { // subscribeId 대신 channelIdx로 명확히
    const requestUrl = `/api/member/subscribe/${channelIdx}`; // 경로 변수 사용
    let data = {};
    await api.delete(requestUrl) // POST 대신 DELETE 사용
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response ? error.response.data : error;
        });
    return data;
};

// 구독을 확인하는 함수
export const isSubscribe = async (channelIdx) => {
    const requestUrl = `/api/member/subscribe/${channelIdx}`;
    let data = {};
    await api.get(requestUrl)
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response ? error.response.data : error;
        });
    return data;
};


export default { getSubscribe, deleteSubscribe, trySubscribe, isSubscribe };
