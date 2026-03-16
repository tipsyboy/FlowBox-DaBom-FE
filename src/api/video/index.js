// video.index js

import api from '@/plugins/axiosinterceptor.js';

export const getVideoList = async (page = 0, size = 10, keyword = '', channelName = '') => {
    let url = `/api/search/videos?page=${page}&size=${size}`;

    if (keyword) {
        url += `&keyword=${keyword}`;
    }
    if (channelName) {
        url += `&channelName=${channelName}`;
    }
    return api.get(url)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error('API 호출 실패:', error);
            throw error;
        });
};



export const uploadVideo = async (file) => {
    const url = `/api/videos/upload`;

    const formData = new FormData();
    formData.append('file', file);

    return api.post(url, formData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error('비디오 업로드 실패:', error);
            return error.response?.data || { error: '업로드 실패' };
        });
};

export const uploadVideoMetadata = async (videoIdx, metadata) => {
    const url = `/api/videos/metadata/${videoIdx}`;

    return api.patch(url, metadata, {
            timeout: 0,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error('메타데이터 저장 실패:', error);
            return error.response?.data || { error: '메타데이터 저장 실패' };
        });
};

export const getPresignedUrl = async (fileInfo) => {
    const requestUrl = `/api/videos/presigned`

    return api.post(requestUrl, fileInfo)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error('Presigned URL 요청 실패:', error)
            throw error
        })
}

export const uploadToPresignedUrl = async (presignedUrl, file) => {
    const axiosResponse = await api.put(presignedUrl, file, {
        headers: {
            'Content-Type': file.type
        },
        timeout: 120000, // 2분으로 오버라이드
        maxBodyLength: Infinity,
        maxContentLength: Infinity
    });
    return axiosResponse;
}

export const getMyVideoList = async () => {
    const requestUrl = `/api/channels/videos/manage`

    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error('내 비디오 리스트 요청 실패', error)
            throw error
        })
}

export const toggleVideoVisibility = async (videoIdx) => {
    const requestUrl = `/api/videos/${videoIdx}/visibility`

    return api.patch(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            throw error
        })
}

export const cleanupS3TempVideo = (videoIdx) => {
    const requestUrl = `/api/videos/${videoIdx}/cleanup`
    return api.delete(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            throw error;
        })
}


export default {
    uploadVideo, uploadVideoMetadata, uploadToPresignedUrl,
    getVideoList, getPresignedUrl, getMyVideoList,
    toggleVideoVisibility,
    cleanupS3TempVideo
}
