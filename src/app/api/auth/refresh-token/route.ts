import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import { authApiRequest } from '@/apiRequests/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const cookieStore = cookies()
  const refreshToken = (await cookieStore).get('refreshToken')?.value
  if (!refreshToken) {
    return NextResponse.json(
      { message: 'Không tìm thấy refreshToken' },
      {
        status: 401
      }
    )
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken })

    // Lưu accessToken và refreshToken
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(payload.data.accessToken) as { exp: number }

    ;(await cookieStore).set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    ;(await cookieStore).set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    }
    return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 401 })
  }
}
