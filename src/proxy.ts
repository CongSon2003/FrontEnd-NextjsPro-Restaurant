/*
  Proxy chạy:
  Trước khi request vào route
  Trước Server Component
  Trước API route
  Nó giống như một "cổng kiểm soát".
*/
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const unAuthPaths = ['/login']
const privatePaths = ['/manage']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = Boolean(request.cookies.get('accessToken')?.value)
  // pathname : manage/dashboard
  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    console.log('🚀 ~ middleware ~ loginUrl:', loginUrl)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu người dùng đã đăng nhập mà truy cập vào trang login thì redirect về home
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/login', '/manage/:path*']
}
