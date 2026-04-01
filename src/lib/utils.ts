/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import jwt from 'jsonwebtoken'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { authApiRequest } from '@/apiRequests/auth'
import { DishStatus } from '@/constants/types'
import { TableStatus } from '@/validationsSchema/table.shema'
import { envClientConfig } from '@/config'

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

  // 1. Nếu không có token -> Báo lỗi để redirect về Login
  if (!accessToken || !refreshToken) {
    return params?.onError?.()
  }

  const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number } | null
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number } | null

  if (!decodedAccessToken || !decodedRefreshToken) {
    return params?.onError?.()
  }

  const now = Date.now() / 1000

  // 2. RefreshToken đã hết hạn hẳn
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return params?.onError?.()
  }

  const tokenLife = decodedAccessToken.exp - decodedAccessToken.iat
  const timeLeft = decodedAccessToken.exp - now

  // 3. QUAN TRỌNG: Nếu Token còn hạn (chưa đến mốc 1/3) -> Báo SUCCESS luôn để Page redirect
  if (timeLeft >= tokenLife / 3) {
    console.log('access-token còn hạn')
    return params?.onSuccess?.()
  }

  // 4. Nếu sắp hết hạn (< 1/3) -> Tiến hành gọi API
  try {
    const res = await authApiRequest.RefreshToken()

    if (res.status === 401 || res.status === 404) {
      removeTokensFromLocalStorage()
      return params?.onError?.()
    }

    // Lưu token mới
    setAccessTokenToLocalStorage(res?.payload?.data.accessToken)
    setRefreshTokenToLocalStorage(res?.payload?.data.refreshToken)

    // BẮT BUỘC: Gọi onSuccess sau khi đã lưu xong
    console.log('Refresh-token Success!')
    return params?.onSuccess?.()
  } catch (error) {
    console.error('Refresh Token Error:', error)
    return params?.onError?.()
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

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}
export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return (envClientConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token) as string
}
