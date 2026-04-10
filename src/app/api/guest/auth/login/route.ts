import guestApiRequest from '@/apiRequests/guest'
import { HttpError } from '@/lib/http'
import { GuestLoginBodyType } from '@/validationsSchema/guest.shema'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const body = (await req.json()) as GuestLoginBodyType
  const cookieStore = cookies()
  try {
    const { payload } = await guestApiRequest.sLogin(body)
    const { accessToken, refreshToken } = payload?.data
    const decodedAccessToken = jwt.decode(accessToken) as { exp?: number } | null
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp?: number } | null
    ;(await cookieStore).set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    ;(await cookieStore).set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })

    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json({ message: 'Có lỗi xảy ra' }, { status: 500 })
    }
  }
}
