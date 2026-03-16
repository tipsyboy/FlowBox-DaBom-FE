import api from '@/plugins/axiosinterceptor.js';


export const signup = async (signupForm) => {
    const requestUrl = `/api/member/signup`
    return api.post(requestUrl, signupForm)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
}

export const login = async (loginForm) => {
    const requestUrl = `/api/member/login`
    return api.post(requestUrl, loginForm)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
}

export const logout = async () => {
    const requestUrl = `/api/member/logout`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
}

export const checkEmailExists = async (email) => {
    const requestUrl = `/api/member/exists/email`
    return api.post(requestUrl, email)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const checkChannelNameExists = async (channelName) => {
    const requestUrl = `/api/member/exists/channel`
    return api.post(requestUrl, channelName)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const getCurrentMemberInfo = async () => {
    const requestUrl = `/api/member/info`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
}

export const getChannelInfoByIdx = async (channelIdx) => {
    const requestUrl = `/api/member/info/${channelIdx}`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
}

export const deleteMember = async () => {
    const requestUrl = `/api/member`
    return api.delete(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
}

export const updateProfileImage = async (formData) => {
    const requestUrl = `/api/member/profileimage`
    return api.post(requestUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error('프로필 이미지 업로드 실패:', error)
            throw error
        })
}


export default {
    signup, login, logout, checkEmailExists, checkChannelNameExists, getCurrentMemberInfo, getChannelInfoByIdx,
    deleteMember, updateProfileImage
}
