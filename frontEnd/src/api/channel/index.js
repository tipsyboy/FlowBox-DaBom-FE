import api from "@/plugins/axiosinterceptor";

export const getChannelInfo = async () => {
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
};

export const getChannelInfoByChannelName = async (channelName) => {
    const requestUrl = `/api/member/info/${channelName}`
    return await api.get(requestUrl)
        .then((response) => {
            return response.data.data
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
}

export const updateChannelInfo = async (channelInfoForm) => {
    const requestUrl = `/api/member/update`
    let data = {}

    await api.patch(requestUrl, channelInfoForm)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const updatePlaylistItem = async (playlistedit) => {

    const requestUrl = `/api/channel_playlist_update.json`
    let data = {}

    await api.get(requestUrl, playlistedit)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};

export const deletePlaylistItem = async (playlistdelete) => {

    const requestUrl = `/api/channel_playlist_delete.json`
    let data = {}

    await api.get(requestUrl, playlistdelete)
        .then((response) => {
            data = response.data
        })
        .catch((error) => {
            data = error.data
        })
    return data
};


export const getChannelBoardList = async () => {
    const requestUrl = `/api/channel/board/list`;
    let data = [];

    try {
        const response = await api.get(requestUrl);

        if (response.data.code === 200) {
            data = response.data.data.content || response.data.data;
        }
    } catch (error) {
        data = [];
    }

    return data;
};

export const getChannelBoardListPaged = async (page = 0, size = 10, sort = 'oldest', channelName) => {
    const requestUrl = `/api/channel/board/list`;
    let data = {};

    try {
        const response = await api.get(requestUrl, {
            params: {
                page: page,
                size: size,
                sort: sort,
                channelName: channelName
            }
        });
        if (response.data.code === 200) {
            data = response.data.data;
        } else {
            data = { content: [], hasNext: false, totalCount: 0 };
        }
    } catch (error) {
        data = { content: [], hasNext: false, totalCount: 0 };
    }
    return data;
};

export const getChannelBoardDetail = async (boardIdx) => {
    const requestUrl = `/api/channel/board/read/${boardIdx}`;
    let data = {};

    await api.get(requestUrl)
        .then((response) => {
            data = response.data.data;
        })
        .catch((error) => {
            console.error('게시글 상세 조회 에러:', error);
            data = {};
        })
    return data;
};

export const getBoardComments = async (boardIdx) => {
    const requestUrl = `/api/channel/board/comment/list/${boardIdx}`;

    try {
        const response = await api.get(requestUrl);

        if (response.data.code === 200) {
            const responseData = response.data.data;

            // 배열이면 그대로 반환, 아니면 빈 배열
            return Array.isArray(responseData) ? responseData : [];
        }
        return [];
    } catch (error) {
        console.error('댓글 조회 에러:', error);
        return [];
    }
};

export const getBoardCommentsSorted = async (boardIdx, sortBy = 'oldest') => {
    const requestUrl = `/api/channel/board/comment/list/${boardIdx}/sorted`;
    let data = [];

    await api.get(requestUrl, { params: { sort: sortBy } })
        .then((response) => {
            if (response.data.code === 200) {
                data = response.data.data || [];
            }
        })
        .catch((error) => {
            data = [];
        })
    return data;
};

export const getBoardCommentsPagedSorted = async (boardIdx, page = 0, size = 10, sortBy = 'oldest') => {
    const requestUrl = `/api/channel/board/comment/list/${boardIdx}/paged`;
    let data = {};

    await api.get(requestUrl, {
        params: {
            page: page,
            size: size,
            sort: sortBy
        }
    })
        .then((response) => {
            if (response.data.code === 200) {
                data = response.data.data;
            }
        })
        .catch((error) => {
            data = { content: [], hasNext: false };
        })

    return data;
};

export const createBoardComment = async (boardIdx, commentData) => {
    const requestUrl = `/api/channel/board/comment/create/${boardIdx}`;
    let data = {};

    await api.post(requestUrl, commentData)
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response?.data || {};
        })
    return data;
};

export const deleteBoardComment = async (commentIdx) => {
    const requestUrl = `/comment/delete/${commentIdx}`;
    let data = {};

    await api.delete(requestUrl)
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response?.data || {};
        })
    return data;
};

export const deleteChannelBoard = async (boardIdx) => {
    const requestUrl = `/api/channel/board/delete/${boardIdx}`;
    let data = {};

    await api.delete(requestUrl)
        .then((response) => {
            data = { code: 200, success: true };
        })
        .catch((error) => {
            data = error.response?.data || {};
        })
    return data;
};

export const updateChannelBoard = async (boardIdx, boardData) => {
    const requestUrl = `/api/channel/board/update`;

    const updateData = {
        boardIdx: boardIdx,
        title: boardData.title,
        contents: boardData.contents
    };

    let data = {};

    await api.post(requestUrl, updateData)
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response?.data || {};
        })
    return data;
};

export const createChannelBoard = async (boardData) => {
    const requestUrl = `/api/channel/board/register`;
    let data = {};

    await api.post(requestUrl, boardData)
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            data = error.response?.data || {};
        })
    return data;
};

const ChannelBoardLikes = async (idx) => {
    let data = {};
    let url = `/api/likes/channelBoard/${idx}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
}

export const BoardCommentLikes = async (idx) => {
    let data = {};
    let url = `/api/likes/boardComment/${idx}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
}

export const getChannelBannerImage = async () => {
    const requestUrl = `/api/member/info/banner`;
    try {
        const response = await api.get(requestUrl);
        if (response.data && response.data.code === 200) {
            return response.data.data;
        } else {
          console.log("실패")
            return null;
        }
    } catch (error) {
        return null;
    }
};

export default {
    getChannelInfo, updateChannelInfo, updatePlaylistItem, deletePlaylistItem,
    getChannelBoardList, getChannelBoardDetail,
    getBoardComments, createBoardComment, deleteBoardComment,
    deleteChannelBoard, updateChannelBoard, createChannelBoard, getBoardCommentsSorted, getChannelBoardListPaged, ChannelBoardLikes, BoardCommentLikes,
    getChannelInfoByChannelName, getChannelBannerImage
}