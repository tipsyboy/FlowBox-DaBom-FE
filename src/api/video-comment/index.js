import api from '@/plugins/axiosinterceptor.js';

export const getComments = async (videoId, params = {}) => {
    return api.get(`/api/videos/comment/list/${videoId}/paged`, { params })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.error("댓글 목록 불러오기 실패:", error);
            throw error;
        });
};

export const postComment = async (videoId, commentData) => {
    return api.post(`/api/videos/comment/register/${videoId}`, commentData)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.error("댓글 작성 실패:", error);
            throw error;
        });
};

export const deleteComment = async (commentId) => {
    return api.delete(`/api/videos/comment/delete/${commentId}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.error("댓글 삭제 실패:", error);
            throw error;
        });
};

export const videoCommentLikes = async (idx) => {
    let url = `/api/likes/videoComment/${idx}`;

    return api.get(url)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response?.data || {};
        });
}

export default { getComments, deleteComment, postComment, videoCommentLikes }
