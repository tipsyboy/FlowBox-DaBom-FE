import api from "@/plugins/axiosinterceptor";

export const imageUpload = async (file, directory) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);

  try {
    const response = await api.post(
      "/api/member/profileimage",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    return response.data;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return error.response?.data || null;
  }
};

export const multiImageUpload = async (files, directory) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  formData.append("directory", directory);

  try {
    const response = await api.post("/api/image/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("이미지 다중 업로드 실패:", error);
    return error.response?.data || null;
  }
};

export const getPresignedUrl = async (fileInfo, requestPath) => {
  const requestUrl = `/api/images/presigned/${requestPath}`

  return await api.post(requestUrl, fileInfo)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
}

export const uploadToPresignedUrl = async (presignedUrl, file) => {
  return await api.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type
    },
  });
}

export const createMemberImageEntity = async (requestData) => {
  const requestUrl = `/api/images`
  return await api.post(requestUrl, requestData)
      .then((response) => {
        console.log(response)
        return response.data;
      })
      .catch((error) => {
        console.error(error)
        throw error;
      })
}

export const createThumbnailImageEntity = async (requestData, videoIdx) => {
    const requestUrl = `/api/images/thumbnail/${videoIdx}`
    return await api.post(requestUrl, requestData)
        .then((response) => {
            console.log(response)
            return response.data;
        })
        .catch((error) => {
            console.error(error)
            throw error;
        })
}

export default { imageUpload, getPresignedUrl, uploadToPresignedUrl, createMemberImageEntity, createThumbnailImageEntity };
