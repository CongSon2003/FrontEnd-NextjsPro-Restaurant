import apiOrderRequest from '@/apiRequests/order'
import { UpdateOrderBodyType } from '@/validationsSchema/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetOrderQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: apiOrderRequest.sGetOrderList
  })
}

export const useUpdateOrderMutatuion = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: { orderId: number } & UpdateOrderBodyType) =>
      apiOrderRequest.sUpdateOrder(orderId, body)
  })
}
