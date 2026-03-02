import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const cookieStore = cookies()

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    console.log('🚀 ~ POST ~ apiRes:', apiRes)

    const apiData = await apiRes.json()
    console.log('🚀 ~ POST ~ apiData:', apiData)

    // 🔥 QUAN TRỌNG: check status trước
    if (!apiRes.ok) {
      return NextResponse.json(apiData, {
        status: apiRes.status
      })
    }

    const { accessToken, refreshToken } = apiData.data

    const decodedAccessToken = jwt.decode(accessToken) as { exp?: number } | null
    console.log('🚀 ~ POST ~ decodedAccessToken:', decodedAccessToken)
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp?: number } | null
    console.log('🚀 ~ POST ~ decodedRefreshToken:', decodedRefreshToken)

    if (!decodedAccessToken?.exp || !decodedRefreshToken?.exp) {
      return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 500 })
    }

    ;(await cookieStore).set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(decodedAccessToken.exp * 1000),
      sameSite: 'lax'
    })
    ;(await cookieStore).set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(decodedRefreshToken.exp * 1000),
      sameSite: 'lax'
    })

    return NextResponse.json(apiData)
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    }
    return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 })
  }
}
