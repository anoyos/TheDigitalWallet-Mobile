import md5 from 'md5'

export const getPhotoExtenstion = (image) => {
  switch (image.mime) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    default:
      return 'wtf'
  }
}

export const getPhotoHash = (image) => md5(image.path.split('/').pop() + image.size + Math.random() + new Date().toString())

const getS3PhotoURI = (image) => {
  const ext = getPhotoExtenstion(image)
  const hash = getPhotoHash(image)
  return `${hash}.${ext}`
}

export default async function upload(image, { url, fields }) {
  const filename = getS3PhotoURI(image)
  const form = new FormData()

  form.append('key', `images/${filename}`)
  form.append('bucket', fields.bucket)
  form.append('X-Amz-Credential', fields['X-Amz-Credential'])
  form.append('X-Amz-Algorithm', fields['X-Amz-Algorithm'])
  form.append('X-Amz-Date', fields['X-Amz-Date'])
  form.append('Policy', fields.Policy)
  form.append('X-Amz-Signature', fields['X-Amz-Signature'])
  form.append('file', {
    uri: image.path,
    type: image.mime,
    name: filename,
  })

  const response = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    const err = new Error(`Upload error: ${response.statusText}`)
    err.response = response
    throw err
  }

  return `${url}/images/${filename}`
}
