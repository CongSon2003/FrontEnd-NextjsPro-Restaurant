/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import jwt from 'jsonwebtoken'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { authApiRequest } from '@/apiRequests/auth'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  // eslint-disable-next-
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Lỗi không xác định', {
      autoClose: duration ?? 5000
    })
  }
}

// Xóa ký tự '/' đầu tên của path
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

//
const isBrowser = typeof window !== 'undefined'

// Hàm sử lý logic refreshToken lấy access Và refresh ở trong local
export const checkAndRefreshToken = async (params?: { onError: () => void; onSuccess: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) return

  const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number } | null
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number } | null

  if (!decodedAccessToken || !decodedRefreshToken) return

  const now = Date.now() / 1000 // milliseconds → seconds

  /*
    note: Khi set cookie với expires thì sẽ bị lệch từ 0 - 1000ms
    Router cache mặc định NextJs là 30s kể từ lần request gần nhất
  */
  if (decodedRefreshToken.exp <= now) {
    // Nếu RefreshToken mà hết hạn thì logout và xóa accessToken và refreshToken trong localstorage
    console.log('RefreshToken đã hết hạn')
    removeTokensFromLocalStorage()
    return params?.onError && params.onError()
  }

  // VD:Kiểm tra khi accessToken còn 1/3 thời gian hết hạn

  const tokenLife = decodedAccessToken.exp - decodedAccessToken.iat
  const timeLeft = decodedAccessToken.exp - now

  if (timeLeft < tokenLife / 3) {
    try {
      const res = await authApiRequest.RefreshToken()
      console.log(res)
      // Trong trường hợp có gửi nhưng refreshToken lại hết hạn mà không check được thì clear localstorage
      if (res.status === 401 || res.status === 404) {
        removeTokensFromLocalStorage()
      }
      setAccessTokenToLocalStorage(res?.payload?.data.accessToken)
      setRefreshTokenToLocalStorage(res?.payload?.data.refreshToken)

      params?.onSuccess?.()
    } catch (error) {
      console.error(error)
      params?.onError?.()
    }
  }
}

// Lấy accessToken từ localStorage (chỉ thực hiện trên client)
export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)

// Lấy refreshToken từ localStorage (chỉ thực hiện trên client)
export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

// Lưu accessToken vào localStorage (chỉ thực hiện trên client)
export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('accessToken', value)

// Lưu refreshToken vào localStorage (chỉ thực hiện trên client)
export const setRefreshTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('refreshToken', value)

// Xóa accessToken và refreshToken khỏi localStorage (chỉ thực hiện trên client)
export const removeTokensFromLocalStorage = () => {
  if (isBrowser) localStorage.removeItem('accessToken')
  if (isBrowser) localStorage.removeItem('refreshToken')
}
