import { createError, eventHandler, setHeader, readBody } from 'h3'
import { getPageImage } from './utils/get-page-image'

export default eventHandler(async (event) => {
  const { component, props, format } = await readBody(event)
  const image = await getPageImage(event, component, props, format)
  setHeader(event, 'content-type', getMimeType(format))
  return image
})

/**
 * Get mime type for the given format.
 */
function getMimeType(format: string): string {
  switch (format) {
    case 'pdf':
      return 'application/pdf'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg'
    default:
      throw createError({ statusCode: 400, statusMessage: `Unsupported format: ${format}` })
  }
}
