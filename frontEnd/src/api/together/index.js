import api from "@/plugins/axiosinterceptor";


export const getRandomTogetherList = async () => {
    const requestUrl = `/api/together`
    let data = {}

    await api.get(requestUrl)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const getRandomTogetherListTest = async (page, size) => {
    const requestUrl = `/api/together?page=${page}&size=${size}`
    let data = {}

    await api.get(requestUrl)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const getTogetherListInMember = async () => {
  const requestUrl = `/api/together/member`
  let data = {}

  await api.get(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const getTogetherListInMaster = async () => {
    const requestUrl = `/api/together/my_room`
    let data = {}

    await api.get(requestUrl)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const searchTogether = async (search, page, size) => {
    const requestUrl = `/api/together/search?page=${page}&size=${size}&search=${search}`
    // const requestUrl = `/api/together/search`
    let data = {}

    // await api.get(requestUrl, {params: searc h})
    await api.get(requestUrl)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const saveTogether = async (body) => {
  const requestUrl = `/api/together/save`
  let data = {}

  await api.post(requestUrl, body)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const joinTogether = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx
  let data = {}

  await api.get(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const joinOpenTogether = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx
  let data = {}

  await api.post(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const joinTogetherWithCode = async (code) => {
  const requestUrl = `/api/together/code`
  let data = {}
  const json = {
      "code": code
  }

  await api.post(requestUrl, json)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const changeTogetherTitle = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/title`
    const json = {
        "title": body
    }
    let data = {}

    await api.patch(requestUrl, json)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const changeTogetherMaxMember = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/max_number`
    let data = {}
    const json = {
        "maxMember": body
    }

    await api.patch(requestUrl, json)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const changeTogetherIsOpen = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/open`
    let data = {}
    const json = {
        "isOpen": body
    }

    await api.patch(requestUrl, json)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const changeTogetherVideo = async (togetherIdx, body) => {
    const requestUrl = `/api/together/` + togetherIdx + `/change/video`
    let data = {}
    const json = {
        "videoUrl": body
    }

    await api.patch(requestUrl, json)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const leaveTogether = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx + `/member`
  let data = {}

  await api.delete(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const deleteTogether = async (togetherIdx) => {
    const requestUrl = `/api/together/` + togetherIdx
    let data = {}

    await api.delete(requestUrl)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const kickTogetherMember = async (togetherIdx, memberIdx) => {
    const requestUrl = `/api/together/` + togetherIdx + "/kick"
    let data = {}
    const json = {
        "kickedMemberIdx": memberIdx
    }

    await api.delete(requestUrl, {data: json})
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const getMembersByMaster = async (togetherIdx) => {
    const requestUrl = `/api/together/` + togetherIdx + "/master/member"
    let data = {}

    await api.get(requestUrl)
        .then((response) => {
            console.log(response)
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const getTogetherInfo = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx
  let data = {}

  await api.get(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const isMaster = async (togetherIdx) => {
  const requestUrl = `/api/together/` + togetherIdx + `/master`
  let data = {}

  await api.get(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export const getToken = async () => {
  const requestUrl = `/api/member/token`
  let data = {}

  await api.get(requestUrl)
    .then((response) => {
      console.log(response)
      data = response.headers
    })
    .catch((error) => {
      data = error.data
    })
  return data
};

export default { getRandomTogetherList, getTogetherListInMember, searchTogether, getMembersByMaster, getTogetherInfo, getRandomTogetherListTest,
  joinTogether, joinOpenTogether, joinTogetherWithCode, saveTogether, leaveTogether, deleteTogether, isMaster,
    changeTogetherTitle, changeTogetherMaxMember, changeTogetherIsOpen, changeTogetherVideo, kickTogetherMember,
  getTogetherListInMaster, getToken}