// video-player index.js

import api from '@/plugins/axiosinterceptor.js';

const getVideoById = async (videoId) => {
    const requestUrl = `/api/videos/${videoId}`;

    return api.get(requestUrl)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        });
}

const getRecommendVideo = async (req) => {
    let url = '/api/recommend-video.json';

    return api.get(url, req)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        });
}

export default { getRecommendVideo, getVideoById }
