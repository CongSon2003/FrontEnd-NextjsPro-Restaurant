/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
const menuNavItems = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Menu',
    href: '/menu'
  },
  {
    name: 'Đơn hàng',
    href: '/orders',
    authRequired: true // False :  Chỉ hiển thị khi chưa có access token
  },
  {
    name: 'Đăng nhập',
    href: '/login',
    authRequired: false // False :  Chỉ hiển thị khi chưa có access token
  },
  {
    name: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true // true: Chỉ hiển thị khi đã có access token
  }
]

const active = 'text-foreground'
const inactive = 'text-muted-foreground'

export default function NavItem({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false)
  // Remove isAuth state, derive directly from getAccessTokenFromLocalStorage
  const pathname = usePathname()
  console.log('pathname', pathname)

  useEffect(() => {
    const isAccessToken = Boolean(getAccessTokenFromLocalStorage())
    setIsAuth(isAccessToken)
  }, [])

  return menuNavItems.map((item, index) => {
    if ((item.authRequired === false && isAuth) || (item.authRequired === true && !isAuth)) {
      return null
    }
    return (
      <Link href={item.href} key={index} className={`${className} ${pathname === item.href ? active : inactive}`}>
        {item.name}
      </Link>
    )
  })
}
