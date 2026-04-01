import { DishStatusValues } from '@/constants/types'
import z, { optional } from 'zod'
/*
  * input = Dữ liệu "bẩn/thô" lúc mới vào.
  TypeOf = Dữ liệu "sạch" đã qua kiểm duyệt.
*/
export const CreateDishBody = z
  .object({
    name: z.string().min(1, { message: 'Tên món ăn phải có ít nhất 1 ký tự' }).max(256),
    price: z.coerce.number().positive({ message: 'Giá món ăn phải lớn hơn 0' }), // Ép kiểu từ bất cứ thứ gì sang số
    description: z.string().max(10000),
    image: z.string(),
    status: z.enum(DishStatusValues).optional()
  })
  .superRefine(({ image }, ctx) => {
    if (image === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'Vui lòng tải ảnh món ăn',
        path: ['image']
      })
    }
  })

export type CreateDishBodyType = z.input<typeof CreateDishBody>

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  image: z.string(),
  status: z.enum(DishStatusValues),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const DishRes = z.object({
  data: DishSchema,
  message: z.string()
})

export type DishResType = z.TypeOf<typeof DishRes>

export const DishListRes = z.object({
  data: z.array(DishSchema),
  message: z.string()
})

export type DishListResType = z.TypeOf<typeof DishListRes>

export const UpdateDishBody = CreateDishBody
export type UpdateDishBodyType = z.input<typeof UpdateDishBody>
export const DishParams = z.object({
  id: z.coerce.number()
})
export type DishParamsType = z.TypeOf<typeof DishParams>
