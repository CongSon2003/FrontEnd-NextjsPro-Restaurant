'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function RefreshTokenHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tokenFromUrl = searchParams.get('token')
  const redirectFromUrl = searchParams.get('redirect')

  // Dùng useRef để chặn việc useEffect gọi API 2 lần liên tiếp
  // (rất hay xảy ra khi chuyển trang hoặc do network delay)
  const isProcessing = useRef(false)

  useEffect(() => {
    // Nếu đang xử lý rồi thì bỏ qua, không chạy lại
    if (isProcessing.current) return

    const storedToken = getRefreshTokenFromLocalStorage()

    // 1. Kiểm tra an toàn: Nếu URL không có token hoặc token không khớp với máy
    if (!tokenFromUrl || tokenFromUrl !== storedToken) {
      isProcessing.current = true // Khóa luồng
      router.replace('/login') // Trục xuất về trang đăng nhập
      return
    }

    // 2. Khởi tạo luồng xử lý bất đồng bộ (Async Flow)
    const processRefresh = async () => {
      isProcessing.current = true
      console.log('Đang bắt đầu refresh tại Page...')

      await checkAndRefreshToken({
        onSuccess: () => {
          console.log('done checkRefreshToken')
          router.push(redirectFromUrl || '/')
        },
        onError: () => {}
      })
    }

    processRefresh()
  }, [router, tokenFromUrl, redirectFromUrl])

  // 3. UI Loading chuyên nghiệp che toàn bộ màn hình trong lúc chờ 2-3s
  return (
    <div className='fixed inset-0 z-9999 flex h-screen w-screen flex-col items-center justify-center bg-white'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600'></div>
        <p className='text-lg font-semibold text-gray-700'>Đang xác thực phiên đăng nhập...</p>
      </div>
    </div>
  )
}

export default function RefreshTokenPage() {
  return (
    // Bọc Suspense là bắt buộc trong Next.js khi dùng useSearchParams
    <Suspense
      fallback={
        <div className='flex h-screen w-full items-center justify-center bg-white'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600'></div>
        </div>
      }
    >
      <RefreshTokenHandler />
    </Suspense>
  )
}
