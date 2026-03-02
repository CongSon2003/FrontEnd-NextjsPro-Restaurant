import { mediaApiRequest } from '@/apiRequests/media'
import { useMutation } from '@tanstack/react-query'

export const useMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload
  })
}
