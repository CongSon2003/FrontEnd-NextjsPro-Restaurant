import z, { email } from 'zod'
import { Role } from '@/constants/types'

export const loginBodySchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }).max(100, {
    message: 'Mật khẩu không được quá 100 ký tự'
  })
})

// Tự động sinh TypeScript type từ schema
/*
  Tương ứng với : 
  type LoginBodyType = {
    email: string
    password: string
  }
*/
export type LoginBodyType = z.TypeOf<typeof loginBodySchema>

export const LoginResponse = z.object({
  message: z.string(),
  data: z.object({
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum([Role.Owner, Role.Employee, Role.Guest])
    }),
    accessToken: z.string(),
    refreshToken: z.string()
  })
})

export type LoginResType = z.TypeOf<typeof LoginResponse>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.Owner, Role.Employee]),
  avatar: z.string().nullable()
})

export const AccountResponse = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountResponse>
