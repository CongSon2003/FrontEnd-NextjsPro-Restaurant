'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppContext } from '../app-provider'

export default function NavItem({ className }: { className?: string }) {
  const pathname = usePathname()
  const { isAuth } = useAppContext()

  const menuNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Đơn hàng', href: '/orders', authRequired: true },
    { name: 'Đăng nhập', href: '/login', authRequired: false },
    { name: 'Quản lý', href: '/manage/dashboard', authRequired: true }
  ]

  const filteredItems = menuNavItems.filter((item) => {
    if (item.authRequired === undefined) return true
    if (item.authRequired === true) return isAuth
    if (item.authRequired === false) return !isAuth
  })

  return filteredItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={`${className} ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
    >
      {item.name}
    </Link>
  ))
}
