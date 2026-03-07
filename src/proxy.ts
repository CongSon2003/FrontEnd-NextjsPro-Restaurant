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
  const refreshToken = Boolean(request.cookies.get('refreshToken')?.value)
  // pathname : manage/dashboard

  // Nếu người dùng chưa đăng nhập thì điều hướng sang route : /login
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu người dùng đã đăng nhập không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Trường hợp đăng nhập rồi, nhưng muốn vào route và accessToken lại hết hạn hoặc bị xóa thì logout
  // Tự động logout khi accessToken hết hạn
  // if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
  //   const url = new URL('/logout', request.url)
  //   const refreshTokenEncode = encodeURIComponent(request.cookies.get('refreshToken')?.value)
  //   url.searchParams.set('refreshToken', refreshTokenEncode)
  //   return NextResponse.redirect(url)
  // }
}

export const config = {
  matcher: ['/login', '/manage/:path*']
}
