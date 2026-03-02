import http from '@/lib/http'
import { UploadImageResType } from '@/validationsSchema/media.shema'

export const mediaApiRequest = {
  upload: (formData: FormData) => {
    return http.post<UploadImageResType>('/media/upload', formData)
  }
}
