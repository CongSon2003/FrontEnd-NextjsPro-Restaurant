import http from '@/lib/http'
import {
  AccountListResType,
  AddEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
  UpdatePasswordBodyType
} from '@/validationsSchema/account.shema'
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
  // Đổi mật khẩu passworld me
  changePassword: (body: UpdatePasswordBodyType) => {
    return http.put<AccountResType>(`${prefix}/change-password`, body)
  },
  // List account : Lấy danh sách nhân viên
  list: () => {
    return http.get<AccountListResType>(`${prefix}`)
  },
  // lay thong tin ca nhan nhan vien theo id
  getEmployee: (id: number) => {
    return http.get<AccountResType>(`${prefix}/detail/${id}`)
  },
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => {
    return http.put<AccountResType>(`${prefix}/detail/${id}`, body)
  },
  // add nhan vien accounts employee
  addEmployee: (body: AddEmployeeAccountBodyType) => {
    return http.post<AccountResType>(`${prefix}`, body)
  },
  deleteEmployee: (id: number) => {
    return http.delete<AccountResType>(`${prefix}/detail/${id}`)
  }
}
