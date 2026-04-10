import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/validationsSchema/dish.schema'

export const dishApiRequest = {
  /*
    Note: NextJS 15 thì mặc định fetch sẽ có cache, để tắt cache thì thêm { cache: 'no-store' } vào options của fetch, và http ở đây là wrapper của fetch nên mình sẽ thêm vào đó luôn
    Còn nếu bạn muốn cache thì có thể để mặc định hoặc thêm { cache: 'force-cache' } vào options của fetch, tùy vào nhu cầu của bạn nhé
    { cache: 'force-cache' }: VĨNH VIỄN (Nó không bao giờ tự cũ). Luôn trả về dữ liệu từ cache nếu có, nếu không có thì mới thực hiện fetch mới. Điều này giúp giảm thiểu số lần gọi API và tăng hiệu suất, nhưng có thể dẫn đến việc hiển thị dữ liệu cũ nếu cache chưa được cập nhật.
    { cache: 'no-store' }: Luôn thực hiện fetch mới và không sử dụng cache. Điều này đảm bảo rằng bạn luôn nhận được dữ liệu mới nhất từ server, nhưng có thể làm tăng thời gian tải và số lần gọi API.
    { next: { tags: ['dishes'] } }: Đây là một phần của hệ thống cache tagging của Next.js. Khi bạn sử dụng revalidateTag('dishes') ở một nơi nào đó trong ứng dụng, tất cả các request có tag 'dishes' sẽ bị invalidated và sẽ thực hiện fetch mới khi có request tiếp theo. Điều này giúp bạn dễ dàng quản lý cache và đảm bảo rằng dữ liệu luôn được cập nhật khi có sự thay đổi.
    */
  listDish: (options?: any) => {
    return http.get<DishListResType>('dishes', options)
  },
  addDish: (body: CreateDishBodyType) => {
    return http.post<DishResType>('dishes', body)
  },
  updateDish: (id: number, body: UpdateDishBodyType) => {
    return http.put<DishResType>(`dishes/${id}`, body)
  },
  getDish: (id: number) => {
    return http.get<DishResType>(`dishes/${id}`)
  },
  deleteDish: (id: number) => {
    return http.delete<DishResType>(`dishes/${id}`)
  }
}
