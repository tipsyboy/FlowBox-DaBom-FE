import api from '@/plugins/axiosinterceptor';

const getAverageScore = async (type, idx) => {
  const requestUrl = `/api/score/${type}/${idx}/average`;
  try {
    const response = await api.get(requestUrl);
    return response.data.data || 0.0;
  } catch (error) {
    console.error(`Failed to fetch average score for ${type} ${idx}:`, error);
    return 0.0;
  }
};

const registerScore = async (scoreData) => {
  const requestUrl = `/api/score/register`;
  try {
    const response = await api.post(requestUrl, scoreData);
    return response.data; // BaseResponse<Void>
  } catch (error) {
    console.error('Failed to register score:', error);
    // 에러 응답에 커스텀 메시지가 있다면 Error 객체에 담아 던짐
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error; // 커스텀 메시지가 없으면 원래 에러를 던짐
  }
};

const updateScore = async (scoreData) => {
  const requestUrl = `/api/score/update`;
  try {
    const response = await api.post(requestUrl, scoreData);
    return response.data; // BaseResponse<Void>
  } catch (error) {
    console.error('Failed to update score:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

const deleteScore = async (type, idx) => {
  const requestUrl = `/api/score/delete/${type},${idx}`;
  try {
    const response = await api.get(requestUrl); // 백엔드가 GET 메소드를 사용하므로 GET 사용
    return response.data; // BaseResponse<Void>
  } catch (error) {
    console.error('Failed to delete score:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

const saveOrUpdateVideoScore = async (scoreData) => {
  const requestUrl = `/api/score/register`;
  try {
    const response = await api.post(requestUrl, scoreData);
    return response.data;
  } catch (error) {
    console.error('Failed to save or update video score:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export default { getAverageScore, registerScore, updateScore, deleteScore, saveOrUpdateVideoScore };
