import api from '@/plugins/axiosinterceptor.js';

export const getChannelInfo = async () => {
    const requestUrl = `/api/member/info`
    return api.get(requestUrl)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const getChannelInfoByChannelName = async (channelName) => {
    const requestUrl = `/api/member/info/${channelName}`
    return api.get(requestUrl)
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
    return api.patch(requestUrl, channelInfoForm)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const updatePlaylistItem = async (playlistedit) => {

    const requestUrl = `/api/channel_playlist_update.json`
    return api.get(requestUrl, playlistedit)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};

export const deletePlaylistItem = async (playlistdelete) => {

    const requestUrl = `/api/channel_playlist_delete.json`
    return api.get(requestUrl, playlistdelete)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error.response?.data || {}
        })
};


export const getChannelBoardList = async () => {
    const requestUrl = `/api/channel/board/list`;
    return api.get(requestUrl)
        .then((response) => {
            if (response.data.code === 200) {
                return response.data.data.content || response.data.data;
            }
            return [];
        })
        .catch((error) => {
            return [];
        })
};

export const getChannelBoardListPaged = async (page = 0, size = 10, sort = 'oldest', channelName) => {
    const requestUrl = `/api/channel/board/list`;
    return api.get(requestUrl, {
            params: {
                page: page,
                size: size,
                sort: sort,
                channelName: channelName
            }
        })
        .then((response) => {
            if (response.data.code === 200) {
                return response.data.data;
            }
            return { content: [], hasNext: false, totalCount: 0 };
        })
        .catch((error) => {
            return { content: [], hasNext: false, totalCount: 0 };
        })
};

export const getChannelBoardDetail = async (boardIdx) => {
    const requestUrl = `/api/channel/board/read/${boardIdx}`;
    return api.get(requestUrl)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error('게시글 상세 조회 에러:', error);
            return {};
        })
};

export const getBoardComments = async (boardIdx) => {
    const requestUrl = `/api/channel/board/comment/list/${boardIdx}`;

    return api.get(requestUrl)
        .then((response) => {
            if (response.data.code === 200) {
                const responseData = response.data.data;

                return Array.isArray(responseData) ? responseData : [];
            }
            return [];
        })
        .catch((error) => {
            console.error('댓글 조회 에러:', error);
            return [];
        })
};

export const getBoardCommentsSorted = async (boardIdx, sortBy = 'oldest') => {
    const requestUrl = `/api/channel/board/comment/list/${boardIdx}/sorted`;
    return api.get(requestUrl, { params: { sort: sortBy } })
        .then((response) => {
            if (response.data.code === 200) {
                return response.data.data || [];
            }
            return [];
        })
        .catch((error) => {
            return [];
        })
};

export const getBoardCommentsPagedSorted = async (boardIdx, page = 0, size = 10, sortBy = 'oldest') => {
    const requestUrl = `/api/channel/board/comment/list/${boardIdx}/paged`;
    return api.get(requestUrl, {
        params: {
            page: page,
            size: size,
            sort: sortBy
        }
    })
        .then((response) => {
            if (response.data.code === 200) {
                return response.data.data;
            }
            return { content: [], hasNext: false };
        })
        .catch((error) => {
            return { content: [], hasNext: false };
        })
};

export const createBoardComment = async (boardIdx, commentData) => {
    const requestUrl = `/api/channel/board/comment/create/${boardIdx}`;
    return api.post(requestUrl, commentData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        })
};

export const deleteBoardComment = async (commentIdx) => {
    const requestUrl = `/comment/delete/${commentIdx}`;
    return api.delete(requestUrl)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        })
};

export const deleteChannelBoard = async (boardIdx) => {
    const requestUrl = `/api/channel/board/delete/${boardIdx}`;
    return api.delete(requestUrl)
        .then((response) => {
            return { code: 200, success: true };
        })
        .catch((error) => {
            return error.response?.data || {};
        })
};

export const updateChannelBoard = async (boardIdx, boardData) => {
    const requestUrl = `/api/channel/board/update`;

    const updateData = {
        boardIdx: boardIdx,
        title: boardData.title,
        contents: boardData.contents
    };

    return api.post(requestUrl, updateData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        })
};

export const createChannelBoard = async (boardData) => {
    const requestUrl = `/api/channel/board/register`;
    return api.post(requestUrl, boardData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        })
};

const ChannelBoardLikes = async (idx) => {
    let url = `/api/likes/channelBoard/${idx}`;

    return api.get(url)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        });
}

export const BoardCommentLikes = async (idx) => {
    let url = `/api/likes/boardComment/${idx}`;

    return api.get(url)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        });
}

export const getChannelBannerImage = async () => {
    const requestUrl = `/api/member/info/banner`;
    return api.get(requestUrl)
        .then((response) => {
            if (response.data && response.data.code === 200) {
                return response.data.data;
            }
            return null;
        })
        .catch((error) => {
            return null;
        })
};

export default {
    getChannelInfo, updateChannelInfo, updatePlaylistItem, deletePlaylistItem,
    getChannelBoardList, getChannelBoardDetail,
    getBoardComments, createBoardComment, deleteBoardComment,
    deleteChannelBoard, updateChannelBoard, createChannelBoard, getBoardCommentsSorted, getChannelBoardListPaged, ChannelBoardLikes, BoardCommentLikes,
    getChannelInfoByChannelName, getChannelBannerImage
}
