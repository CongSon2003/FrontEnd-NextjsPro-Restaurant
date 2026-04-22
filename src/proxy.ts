/*
  Proxy chạy:
  Trước khi request vào route
  Trước Server Component
  Trước API route
  Nó giống như một "cổng kiểm soát".
*/
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { Role, RoleType, TokenType } from './constants/types'
import jwt from 'jsonwebtoken'
const guestPaths = ['/guest']
const managePaths = ['/manage']
const unAuthPaths = ['/login']
const onlyOwnerPaths = ['/manage/account']
const loginPaths = ['/login']
const privatePaths = [...guestPaths, ...managePaths]

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export interface TokenPayload {
  userId: number
  role: RoleType
  tokenType: TokenTypeValue
  exp: number
  iat: number
}
const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const searchParams = request.url
  const accessToken = Boolean(request.cookies.get('accessToken')?.value)
  const refreshToken = Boolean(request.cookies.get('refreshToken')?.value)
  // pathname : manage/dashboard

  // Nếu người dùng chưa đăng nhập thì điều hướng sang route : /login
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2. Trường nhập đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      // Ngoại lệ: Nếu có truyền accessToken trên URL (có thể là flow chuyển hướng sau đăng nhập)
      // if (searchParams.get('accessToken')) return response
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 2.2 Nhưng access token lại hết hạn

  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    const url = new URL('/refresh-token', request.url)
    url.searchParams.set('token', request.cookies.get('refreshToken')?.value)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 2.3 Vào không đúng role, redirect về trang chủ
  const role = decodeToken(request.cookies.get('refreshToken')?.value).role
  // Không phải Guest nhưng cố vào route guest
  const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
  // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner
  const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))
  if (isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/login', '/manage/:path*']
}
