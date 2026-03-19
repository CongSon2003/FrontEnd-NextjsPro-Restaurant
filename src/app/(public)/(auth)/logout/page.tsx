'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rToken = searchParams.get('rToken')
  const acToken = searchParams.get('acToken')
  const { mutateAsync } = useLogoutMutation()
  const { setIsAuth } = useAppContext()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null)
  useEffect(() => {
    // Bảo vệ route logout
    // refreshToken || accessToken phải đúng trong local thì mới cho logout nếu không thì return
    if (rToken && acToken && !ref.current) {
      if (rToken !== getRefreshTokenFromLocalStorage() || acToken !== getAccessTokenFromLocalStorage()) {
        return router.push('/')
      }
      ref.current = mutateAsync
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        setIsAuth(false)
        return router.push('/login')
      })
    }
    return router.push('/')
  }, [router, mutateAsync, rToken, acToken, setIsAuth])
  return null
}
