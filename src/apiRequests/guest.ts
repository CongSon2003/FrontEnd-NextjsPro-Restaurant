import http from '@/lib/http'
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from '@/validationsSchema/auth.schema'
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType
} from '@/validationsSchema/guest.shema'

const guestApiRequest = {
  sLogin: (body: GuestLoginBodyType) => {
    return http.post<GuestLoginResType>('/guest/auth/login', body)
  },
  login: (body: GuestLoginBodyType) => {
    return http.post<GuestLoginResType>('/api/guest/auth/login', body, {
      baseUrl: ''
    })
  },
  logout: () => {
    return http.post('/api/guest/auth/logout', null, {
      baseUrl: ''
    })
  },
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) => {
    return http.post(
      '/quest/auth/logout',
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    )
  },

  // Từ route handle gọi đến backend
  sRefreshToken: (body: RefreshTokenBodyType) => {
    return http.post<RefreshTokenResType>('auth/refresh-token', body)
  },

  // Từ client gọi đến route handler
  /* request
   ↓
  token expired
   ↓
  refreshTokenRequest có chưa?
  ↓
   chưa → gọi refresh API
   có rồi → await promise đó*/
  // => Khi refreshToken dang chay, khong cho chay them 1 lan nao nua
  async RefreshToken() {
    if (this.refreshTokenRequest) return this.refreshTokenRequest

    this.refreshTokenRequest = http.post<RefreshTokenResType>('api/auth/refresh-token', null, {
      baseUrl: ''
    })

    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null

    return result
  },

  // create order cho guest id
  sOrder: (body: GuestCreateOrdersBodyType) => {
    return http.post<GuestCreateOrdersResType>('/guest/orders', body)
  },

  sGetOrderList: () => {
    return http.get<GuestGetOrdersResType>('/guest/orders')
  }
}

export default guestApiRequest
