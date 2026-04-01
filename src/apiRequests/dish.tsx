import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/validationsSchema/dish.schema'

export const dishApiRequest = {
  listDish: () => {
    return http.get<DishListResType>('dishes')
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
