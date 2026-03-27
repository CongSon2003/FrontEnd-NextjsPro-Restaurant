import { Role } from '@/constants/types'
import z, { email } from 'zod'

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.Owner, Role.Employee]),
  avatar: z.string().nullable()
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const AccountListRes = z.object({
  data: z.array(AccountSchema),
  message: z.string()
})

export type AccountListResType = z.TypeOf<typeof AccountListRes>

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }).max(256),
    avatar: z.string().nullable().optional()
  })
  .strict()

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

export const UpdatePasswordBody = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
      .max(100, { message: 'Mật khẩu không được quá 100 ký tự' }),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
      .max(100, { message: 'Mật khẩu không được quá 100 ký tự' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
      .max(100, { message: 'Mật khẩu không được quá 100 ký tự' })
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type UpdatePasswordBodyType = z.TypeOf<typeof UpdatePasswordBody>

// Update EmployeeBody
export const UpdateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }).max(256),
    email: z.string().email({ message: 'Email không đúng định dạng' }),
    avatar: z.string().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    // CHỈ KHI gạt nút "Đổi mật khẩu" mới nhảy vào kiểm tra
    if (changePassword) {
      if (!password || password.length < 6) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 6 ký tự',
          path: ['password']
        })
      } else if (password && password.length > 100) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu không được quá 100 ký tự',
          path: ['password']
        })
      }

      // 2. Kiểm tra mật khẩu khớp nhau
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu mới không khớp',
          path: ['confirmPassword'] // Báo lỗi ngay tại ô nhập lại
        })
      }
      // 3. Kiểm tra confirmPassword có trống không
      if (!confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng xác nhận mật khẩu mới',
          path: ['confirmPassword']
        })
      }
    }
  })

export type UpdateEmployeeAccountBodyType = z.TypeOf<typeof UpdateEmployeeAccountBody>

// Add EmployeeBody
export const AddEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2, { message: 'Tên ít nhất 2 ký tự' }).max(256),
    email: z.string().email({ message: 'Email không đúng định dạng' }),
    avatar: z.string().optional().or(z.literal('')),
    password: z.string().min(6, { message: 'Mật khẩu ít nhất 6 ký tự' }),
    confirmPassword: z.string().min(6, { message: 'Vui lòng xác nhận mật khẩu' })
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type AddEmployeeAccountBodyType = z.TypeOf<typeof AddEmployeeAccountBody>
