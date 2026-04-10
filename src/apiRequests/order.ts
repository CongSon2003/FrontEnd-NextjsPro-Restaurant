import http from '@/lib/http'
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/validationsSchema/order.schema'

export const apiOrderRequest = {
  sGetOrderList: () => {
    return http.get<GetOrdersResType>('/orders')
  },
  sUpdateOrder: (orderId: number, body: UpdateOrderBodyType) => {
    return http.put<UpdateOrderResType>(`/orders/${orderId}`, body)
  }
}
export default apiOrderRequest
