import { authApiRequest } from '@/apiRequests/auth'
import { error } from 'console'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value || ''
    const refreshToken = (await cookieStore).get('refreshToken')?.value || ''

    if (!refreshToken || !accessToken) {
      return NextResponse.json({ message: 'accessToken or refreshToken không tồn tại' }, { status: 200 })
    }

    // Gọi API đến backend server để thực hiện đăng xuất
    // const apiRes = await authApiRequest.sLogout({
    //   refreshToken: accessToken,
    //   accessToken: refreshToken
    // })

    const response = await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    })
    if (!response.ok) {
      throw new Error('Lỗi khi đăng xuất')
    }

    const result = await response.json()

    // delete cookie sau khi logout thành công
    ;(await cookieStore).delete('accessToken')
    ;(await cookieStore).delete('refreshToken')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error)
    return NextResponse.json({ message: 'Lỗi khi đăng xuất' }, { status: 500 })
  }
}
