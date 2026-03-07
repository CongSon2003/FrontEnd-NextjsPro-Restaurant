import http from '@/lib/http'
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from '@/validationsSchema/auth.schema'

export const authApiRequest = {
  // Khi gọi hàm login, chúng ta sẽ gọi API đến Next.js Server (baseUrl = '') và Next.js Server sẽ tiếp tục gọi API đến backend server
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (body: any) => {
    return http.post('api/auth/login', body, {
      baseUrl: ''
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slogin: (body: any) => {
    return http.post('/auth/login', body)
  },

  // Khi gọi hàm logout, chúng ta sẽ gọi API đến Next.js Server (baseUrl = '') và Next.js Server sẽ tiếp tục gọi API đến backend server
  sLogout: (body: LogoutBodyType & { accessToken: string }) => {
    return http.post(
      '/auth/logout',
      {
        refreshToken: body.refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    )
  },

  logout: () => {
    return http.post('api/auth/logout', null, {
      baseUrl: ''
    })
  }, // client Gọi route handler của nextjs, không cần chuyển tiếp access token vì route handler của nextjs sẽ lấy access token từ cookie (cookie đã được set httpOnly flag nên không thể truy cập từ phía client)

  // Từ route handle gọi đến backend
  sRefreshToken: (body: RefreshTokenBodyType) => {
    return http.post<RefreshTokenResType>('auth/refresh-token', body)
  },

  // Từ client gọi đến route handler
  RefreshToken: () => {
    return http.post<RefreshTokenResType>('api/auth/refresh-token', null, {
      baseUrl: ''
    })
  }
}
