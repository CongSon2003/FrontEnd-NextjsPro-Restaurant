import { authApiRequest } from '@/apiRequests/auth'
import { useMutation } from '@tanstack/react-query'

// custom hook
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login
  })
}

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout
  })
}
