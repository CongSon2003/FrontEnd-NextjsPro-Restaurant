'use client'

import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const { mutateAsync } = useLogoutMutation()
  useEffect(() => {
    mutateAsync().then((res) => {
      router.push('/login')
    })
  }, [router, mutateAsync])
  return null
}
