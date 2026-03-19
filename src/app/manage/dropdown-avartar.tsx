'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircleUserRound, LogOut, RotateCcwKey, SquarePen } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/queries/useAuth'
import { useAccountMeQuery } from '@/queries/useAccount'
import { useAppContext } from '@/components/app-provider'
const account = {
  name: 'Nguyễn Văn A',
  avatar: 'https://i.pravatar.cc/150'
}

export default function DropdownAvatar() {
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const { data } = useAccountMeQuery()
  const { setIsAuth } = useAppContext()
  const handleLogout = async () => {
    // Xử lý logic đăng xuất ở đây, ví dụ: gọi API để đăng xuất, xóa token, chuyển hướng đến trang đăng nhập, v.v.
    await logoutMutation.mutateAsync()
    setIsAuth(false)
    router.push('/')
    toast.success('Đăng xuất thành công')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='w-8 h-8 cursor-pointer'>
            <AvatarImage
              src={`${data?.payload?.data?.avatar || account.avatar}`}
              alt='@shadcn'
              // className="grayscale"
            />
            <AvatarFallback>{account.name}</AvatarFallback>
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
    </>
  )
}
