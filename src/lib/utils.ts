/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'

import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'

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
