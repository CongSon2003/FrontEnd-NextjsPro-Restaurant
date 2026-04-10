import guestApiRequest from '@/apiRequests/guest'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useQuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}

export const useQuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.sOrder
  })
}

export const useGuestOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequest.sGetOrderList,
    queryKey: ['orders-guest']
  })
}
