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
    // KHÔNG chạy logic này nếu đang ở trang login hoặc chính trang refresh-token
    if (UNAUTHENTITICATED_PATH.includes(pathname) || pathname === '/refresh-token') return

    const interval = setInterval(async () => {
      // Sử dụng await ở đây để đảm bảo check xong rồi mới chạy tiếp
      await checkAndRefreshToken({
        onSuccess: () => {},
        onError: () => {
          clearInterval(interval)
          toast.warning('Phiên đăng nhập hết hạn!')
          router.push('/login')
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [pathname, router])

  return null
}
