'use client'

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { authApiRequest } from '@/apiRequests/auth'

// Không check refreshToken
const UNAUTHENTITICATED_PATH = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENTITICATED_PATH.includes(pathname)) return
    let interval = null
    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage()
      const refreshToken = getRefreshTokenFromLocalStorage()

      // Chưa đăng nhập thì không cho chạy
      if (!accessToken || !refreshToken) return

      const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
      const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }

      // Thời điểm hiện tại
      const now = new Date().getTime() / 1000 // ms => s

      // Trường hợp 2: Nếu refreshToken hết hạn thì return không sử lý nữa
      if (decodedRefreshToken.exp <= now) return

      // Trường hợp 1:  Nếu accessToken gần hết hạn thì RefreshToken => at mới và rt mới
      // vd: accessToken của chúng ta có thời gian hết hạn là 10s thì kiểm tra 1/3 s
      // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now()
      // Thời gian hết hạn của accessToken là: decodedAccessToken.iat - decodedAccessToken.exp
      if (decodedAccessToken.exp - now < (decodedAccessToken.iat - decodedAccessToken.exp) / 3) {
        try {
          const res = await authApiRequest.RefreshToken()
          // Sau khi nấy được accessToken và refreshToken mới thì set vào localstorage
          setAccessTokenToLocalStorage(res.payload.data.accessToken)
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
        } catch (error) {
          clearInterval(interval)
        }
      }
    }

    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau TIMEOUT
    checkAndRefreshToken()
    // Timeout interval phải bé hơn thời gian hết hạn của accessToken
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)
  }, [pathname])
  return null
}
