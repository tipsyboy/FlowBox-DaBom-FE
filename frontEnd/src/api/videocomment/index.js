import api from "@/plugins/axiosinterceptor";

export const getComments = async (videoId, params = {}) => {
    try {
        const res = await api.get(`/api/videos/comment/list/${videoId}/paged`, { params });
        return res.data;
    } catch (error) {
        console.error("댓글 목록 불러오기 실패:", error);
        throw error;
    }
};

export const postComment = async (videoId, commentData) => {
    try {
        const res = await api.post(`/api/videos/comment/register/${videoId}`, commentData);
        return res.data;
    } catch (error) {
        console.error("댓글 작성 실패:", error);
        throw error;
    }
};

export const deleteComment = async (commentId) => {
    try {
        const res = await api.delete(`/api/videos/comment/delete/${commentId}`);
        return res.data;
    } catch (error) {
        console.error("댓글 삭제 실패:", error);
        throw error;
    }
};

export const videoCommentLikes = async (idx) => {
    let data = {};
    let url = `/api/likes/videoComment/${idx}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
}

export default { getComments, deleteComment, postComment, videoCommentLikes }