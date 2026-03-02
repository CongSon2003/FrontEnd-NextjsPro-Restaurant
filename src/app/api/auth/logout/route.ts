import { authApiRequest } from '@/apiRequests/auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value || ''
    console.log('🚀 ~ POST ~ accessToken:', accessToken)
    const refreshToken = (await cookieStore).get('refreshToken')?.value || ''
    console.log('🚀 ~ POST ~ refreshToken:', refreshToken)

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ message: 'Token không tồn tại' }, { status: 200 })
    }

    // Xoa token trong cookie
    ;(await cookieStore).delete('accessToken')
    ;(await cookieStore).delete('refreshToken')

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

    const result = await response.json()
    console.log('🚀 ~ POST ~ response:', response)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error)
    return NextResponse.json({ message: 'Lỗi khi đăng xuất' }, { status: 200 })
  }
}
