import { Role } from '@/constants/types'
import z from 'zod'

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.Owner, Role.Employee]),
  avatar: z.string().nullable()
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2, { message: 'Tên phải có ít nhấ 2 ký tự' }).max(256),
    avatar: z.string().url().optional()
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
