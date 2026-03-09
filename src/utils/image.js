export const withImageCacheBust = (imageUrl, cacheKey = Date.now()) => {
  if (!imageUrl || imageUrl.startsWith('blob:')) {
    return imageUrl || ''
  }

  try {
    const url = new URL(imageUrl, window.location.origin)
    url.searchParams.set('v', String(cacheKey))

    if (/^https?:\/\//.test(imageUrl)) {
      return url.toString()
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    const separator = imageUrl.includes('?') ? '&' : '?'
    return `${imageUrl}${separator}v=${cacheKey}`
  }
}
