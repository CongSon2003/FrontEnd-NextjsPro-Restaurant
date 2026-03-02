'use client'
import { authApiRequest } from '@/apiRequests/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { CircleUserRound, LogOut, RotateCcwKey, SquarePen } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AvatarMenu({ accessToken }) {
  const isLoggedIn = Boolean(accessToken)
  const router = useRouter()
  const handleLogout = async () => {
    // Xử lý logic đăng xuất ở đây, ví dụ: gọi API để đăng xuất, xóa token, chuyển hướng đến trang đăng nhập, v.v.
    const response = authApiRequest.logout()
    const result = await response
    console.log('🚀 ~ handleLogout ~ result:', result)
    router.push('/')
  }
  return (
    <>
      {isLoggedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className='w-8 h-8 cursor-pointer'>
              <AvatarImage
                src='https://github.com/shadcn.png'
                alt='@shadcn'
                // className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-44' align='end'>
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer'>
                <CircleUserRound />
                Trang cá nhân
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer'>
                <SquarePen /> Cập nhật hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <RotateCcwKey />
                Đổi mật khẩu
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup onClick={handleLogout}>
              <DropdownMenuItem className='cursor-pointer'>
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
