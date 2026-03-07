import { accountApiRequest } from '@/apiRequests/account'
import { useMutation, useQuery } from '@tanstack/react-query'

// custom hook
export const useAccountMeQuery = () => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () =>
      accountApiRequest.getMe().then((res) => {
        return res
      })
  })
}
export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword
  })
}
