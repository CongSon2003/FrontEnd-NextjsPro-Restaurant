'use client'

import { checkAndRefreshToken } from '@/lib/utils'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const UNAUTHENTITICATED_PATH = ['/login', '/register']

export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    /*
      Note: Lâu ngày không vào web thì không thể tạo accessToken mới vì không gọi refreshToken được lên.
      +, Lên accessToken hết hạn sẽ xóa khỏi cookie()
      +, refreshToken chỉ hoạt động khi online trong web còn khi offline không gọi được lên accessToken hết hạn và bị xóa khỏi cookies
    */
    if (UNAUTHENTITICATED_PATH.includes(pathname)) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null

    // Chay lan dau tien khi component mount
    // để chánh accessToken hết hạn trước khi interval chạy
    // Hàm sử lý logic refreshToken
    checkAndRefreshToken({
      onSuccess: () => {},
      onError: () => {
        clearInterval(interval)
        toast.warning('Phiên đăng nhập của bạn hết hạn. Vui lòng đăng nhập lại!')
        router.push('/login')
      }
    })

    interval = setInterval(() => {
      return checkAndRefreshToken({
        onSuccess: () => {},
        onError: () => {
          clearInterval(interval)
          toast.warning('Phiên đăng nhập của bạn hết hạn. Vui lòng đăng nhập lại!')
          router.push('/login')
        }
      })
    }, 3000)

    // Goi khi unmount component: Xoa interval khi unmount
    return () => clearInterval(interval)
  }, [pathname, router])

  return null
}
