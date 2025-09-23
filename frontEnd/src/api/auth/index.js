import api from "@/plugins/axiosinterceptor";


export const signup = async (signupForm) => {
    const requestUrl = `/api/member/signup`
    let data = {}
    await api.post(requestUrl, signupForm)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
}

export const login = async (loginForm) => {
    const requestUrl = `/api/member/login`
    let data = {}

    await api.post(requestUrl, loginForm)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
}

export const logout = async () => {
    const requestUrl = `/api/member/logout`
    let data = {}

    await api.get(requestUrl)
        .then((response) => {
            console.log(response)
            console.log(response.data)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
}

export const checkEmailExists = async (email) => {
    const requestUrl = `/api/member/exists/email`
    let data = {}
    await api.post(requestUrl, email)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const checkChannelNameExists = async (channelName) => {
    const requestUrl = `/api/member/exists/channel`
    let data = {}
    await api.post(requestUrl, channelName)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const getCurrentMemberInfo = async () => {
    const requestUrl = `/api/member/info`
    let data = {}
    await api.get(requestUrl)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
}

export const getChannelInfoByIdx = async (channelIdx) => {
    const requestUrl = `/api/member/info/${channelIdx}`
    let data = {}
    await api.get(requestUrl)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
}

export const deleteMember = async () => {
    const requestUrl = `/api/member`
    let data = {}
    await api.delete(requestUrl)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
}

export const updateProfileImage = async (formData) => {
    const requestUrl = `/api/member/profileimage`
    return await api.post(requestUrl, formData, {
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