import api from "@/plugins/axiosinterceptor";

// 내 모든 플레이리스트 조회
export const getMyPlaylists = async () => {
    let data = {};
    try {
        const response = await api.post('/api/playlist/list');
        data = response.data; // Assuming response.data is the BaseResponse
    } catch (error) {
        data = error.response ? error.response.data : { message: error.message };
    }
    return data;
};

// 특정 플레이리스트 상세 정보 조회
export const getPlaylistDetails = async (playlistIdx) => {
    let data = {};
    try {
        const response = await api.get(`/api/playlist/${playlistIdx}`);
        data = response.data; // Assuming response.data is the BaseResponse
    } catch (error) {
        data = error.response ? error.response.data : { message: error.message };
    }
    return data;
};

// 새 플레이리스트 생성
export const createPlaylist = async (playlistTitle) => {
    let data = {};
    try {
        const response = await api.post('/api/playlist/register', { playlistTitle });
        data = response.data; // Assuming response.data is the BaseResponse
    } catch (error) {
        data = error.response ? error.response.data : { message: error.message };
    }
    return data;
};

// 플레이리스트에 비디오 추가
export const addVideoToPlaylist = async (playlistIdx, videoIdx) => {
    let data = {};
    try {
        const response = await api.post('/api/playlist/add', { playlistIdx, videoIdx });
        data = response.data; // Assuming response.data is the BaseResponse
    } catch (error) {
        data = error.response ? error.response.data : { message: error.message };
    }
    return data;
};

// --- 백엔드에 추가 구현이 필요한 API ---

// 플레이리스트 이름 수정
export const updatePlaylist = async (playlistIdx, playlistTitle) => {
    // 참고: 이 API는 현재 백엔드에 구현되어 있지 않습니다.
    // 백엔드에 PUT /api/playlist/{playlistIdx} 와 같은 엔드포인트 구현이 필요합니다.
    let data = {};
    try {
        const response = await api.put(`/api/playlist/${playlistIdx}`, { playlistTitle });
        data = response.data;
    } catch (error) {
        data = error.response ? error.response.data : { message: error.message };
    }
    return data;
};

// 플레이리스트 삭제
export const deletePlaylist = async (playlistIdx) => {
    // 참고: 이 API는 현재 백엔드에 구현되어 있지 않습니다.
    // 백엔드에 DELETE /api/playlist/{playlistIdx} 와 같은 엔드포인트 구현이 필요합니다.
    let data = {};
    try {
        const response = await api.delete(`/api/playlist/${playlistIdx}`);
        data = response.data;
    } catch (error) {
        data = error.response ? error.response.data : { message: error.message };
    }
    return data;
};

export default {
    getMyPlaylists,
    getPlaylistDetails,
    createPlaylist,
    addVideoToPlaylist,
    updatePlaylist,
    deletePlaylist,
};
