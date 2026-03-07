import http from '@/lib/http'
import { UpdateMeBodyType, UpdatePasswordBodyType } from '@/validationsSchema/account.shema'
import { AccountResType } from '@/validationsSchema/auth.schema'

const prefix = '/accounts'
export const accountApiRequest = {
  // Nấy thông tin profile me
  getMe: () => {
    return http.get<AccountResType>(`${prefix}/me`)
  },
  // Cập nhật profile me
  updateMe: (body: UpdateMeBodyType) => {
    return http.put<AccountResType>(`${prefix}/me`, body)
  },
  // Đổi mật khẩu passworld
  changePassword: (body: UpdatePasswordBodyType) => {
    return http.put<AccountResType>(`${prefix}/change-password`, body)
  }
}
