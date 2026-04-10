'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from '../app-provider'
import { Role, RoleType } from '@/constants/types'

import { toast } from 'react-toastify'
import { useGuestLogoutMutation } from '@/queries/useguest'
export default function NavItem({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const logoutMutation = useGuestLogoutMutation()
  // isAuth: true nếu đã đăng nhập, false nếu chưa
  // role: quyền hiện tại (VD: 'Owner', 'Guest', null)
  const { isAuth, role, setIsAuth, setRole } = useAppContext()
  console.log(role, isAuth)
  const menuNavItems: {
    name: string
    href: string
    role?: RoleType[]
    authRequired?: boolean
  }[] = [
    { name: 'Trang chủ', href: '/' }, // Public: Ai cũng xem được
    { name: 'Thực đơn', href: '/guest/menu', role: [Role.Guest] }, // Chỉ dành cho Role Guest
    { name: 'Đăng nhập', href: '/login', authRequired: false }, // Chỉ hiện khi CHƯA đăng nhập
    { name: 'Quản lý', href: '/manage/dashboard', authRequired: true, role: [Role.Owner, Role.Employee] } // Cần đăng nhập & Role tương ứng
  ]

  // Hàm helper quyết định việc hiển thị
  const checkCanShow = (item: (typeof menuNavItems)[0]) => {
    // 1. Trạng thái 1: Menu yêu cầu Role cụ thể
    if (item.role) {
      return Boolean(role && item.role.includes(role))
    }

    // 2. Trạng thái 2: Menu bắt buộc ĐÃ ĐĂNG NHẬP (authRequired: true)
    if (item.authRequired === true) {
      return Boolean(isAuth)
    }

    // 3. Trạng thái 3: Menu bắt buộc CHƯA ĐĂNG NHẬP (authRequired: false) -> VD: Nút Đăng nhập
    if (item.authRequired === false) {
      return !isAuth
    }

    // 4. Trạng thái 4: Không cấu hình gì cả (undefined) -> Public (VD: Trang chủ)
    return true
  }
  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    // Xử lý logic đăng xuất ở đây, ví dụ: gọi API để đăng xuất, xóa token, chuyển hướng đến trang đăng nhập, v.v.
    const result = await logoutMutation.mutateAsync()
    setIsAuth(false)
    setRole()
    router.push('/')
    toast.success('Đăng xuất thành công')
  }
  return (
    <>
      {menuNavItems.map((item, index) => {
        // Dùng hàm helper ở trên để check
        if (checkCanShow(item)) {
          return (
            <Link
              href={item.href}
              key={index}
              className={`${className} ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {item.name}
            </Link>
          )
        }
        return null // Ẩn nếu không thỏa mãn điều kiện
      })}
      {role && (
        <button onClick={handleLogout} className='text-muted-foreground bg-none hover:text-foreground cursor-pointer'>
          Đăng xuất
        </button>
      )}
    </>
  )
}
