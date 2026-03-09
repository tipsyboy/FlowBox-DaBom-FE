import api from '@/plugins/axiosinterceptor.js'

export const getPresignedUrl = async (fileInfo, requestPath) => {
  const requestUrl = `/api/images/presigned/${requestPath}`
  const response = await api.post(requestUrl, fileInfo)
  return response.data
}

export const uploadToPresignedUrl = async (presignedUrl, file) => {
  return await api.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type
    }
  })
}

export const createMemberImageEntity = async (requestData) => {
  const requestUrl = `/api/images`
  const response = await api.post(requestUrl, requestData)
  return response.data
}

export default {
  getPresignedUrl,
  uploadToPresignedUrl,
  createMemberImageEntity
}
