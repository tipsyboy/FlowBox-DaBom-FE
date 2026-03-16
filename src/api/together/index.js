import api from '@/plugins/axiosinterceptor.js';


export const getRandomTogetherList = async () => {
    const requestUrl = `/api/together`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const getRandomTogetherListTest = async (page, size) => {
    const requestUrl = `/api/together?page=${page}&size=${size}`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const getTogetherListInMember = async () => {
  const requestUrl = `/api/together/member`
  return api.get(requestUrl)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const getTogetherListInMaster = async () => {
    const requestUrl = `/api/together/my_room`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const searchTogether = async (search, page, size) => {
    const requestUrl = `/api/together/search?page=${page}&size=${size}&search=${search}`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const saveTogether = async (body) => {
  const requestUrl = `/api/together/save`
  return api.post(requestUrl, body)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const joinTogether = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx
  return api.get(requestUrl)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const joinOpenTogether = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx
  return api.post(requestUrl)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const joinTogetherWithCode = async (code) => {
  const requestUrl = `/api/together/code`
  const json = {
      "code": code
  }

  return api.post(requestUrl, json)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const changeTogetherTitle = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/title`
    const json = {
        "title": body
    }
    return api.patch(requestUrl, json)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const changeTogetherMaxMember = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/max_number`
    const json = {
        "maxMember": body
    }

    return api.patch(requestUrl, json)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const changeTogetherIsOpen = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/open`
    const json = {
        "isOpen": body
    }

    return api.patch(requestUrl, json)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const changeTogetherVideo = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/video`
    const json = {
        "videoUrl": body
    }

    return api.patch(requestUrl, json)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const leaveTogether = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx + `/member`
  return api.delete(requestUrl)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const deleteTogether = async (togetherIdx) => {
    const requestUrl = `/api/together/` + togetherIdx
    return api.delete(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const kickTogetherMember = async (togetherIdx, memberIdx) => {
    const requestUrl = `/api/together/` + togetherIdx + "/kick"
    const json = {
        "kickedMemberIdx": memberIdx
    }

    return api.delete(requestUrl, {data: json})
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const getMembersByMaster = async (togetherIdx) => {
    const requestUrl = `/api/together/` + togetherIdx + "/master/member"
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const getTogetherInfo = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx
  return api.get(requestUrl)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const isMaster = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx + `/master`
  return api.get(requestUrl)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export const getToken = async () => {
  const requestUrl = `/api/member/token`
  return api.get(requestUrl)
    .then((response) => {
      return response.headers
    })
    .catch((error) => {
      return error.response?.data || {}
    })
};

export default { getRandomTogetherList, getTogetherListInMember, searchTogether, getMembersByMaster, getTogetherInfo, getRandomTogetherListTest,
  joinTogether, joinOpenTogether, joinTogetherWithCode, saveTogether, leaveTogether, deleteTogether, isMaster,
    changeTogetherTitle, changeTogetherMaxMember, changeTogetherIsOpen, changeTogetherVideo, kickTogetherMember,
  getTogetherListInMaster, getToken}
