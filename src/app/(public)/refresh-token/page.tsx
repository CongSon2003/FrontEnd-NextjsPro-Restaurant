'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshTokenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const TokenFromUrl = searchParams.get('token')
  const redirectFromUrl = searchParams.get('redirect')
  console.log(redirectFromUrl)

  useEffect(() => {
    // Kiểm tra/Bảo vệ page không cho refreshToken nếu không có refreshToken đúng đã lưu ở localstorage
    if (TokenFromUrl && TokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          alert('thanh cong')
          router.push(redirectFromUrl || '/')
        },
        onError: () => {
          alert('No thanh cong')
        }
      })
      router.push(redirectFromUrl)
    } else {
      router.push('/')
    }
  }, [searchParams, TokenFromUrl, redirectFromUrl, router])
  return <div>refreshToken</div>
}
