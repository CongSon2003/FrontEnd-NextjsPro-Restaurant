import type { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')

  if (tag) {
    // 1. Xóa Data Cache theo tag
    revalidateTag(tag, 'max')
    // max là để ưu tiên xóa cache có tag này trước, nếu có nhiều cache cùng tag thì sẽ xóa cache cũ nhất trước,
    // giúp giảm thiểu việc xóa cache mới hơn mà có thể vẫn còn đang được sử dụng

    // 2. VŨ KHÍ HẠNG NẶNG: Quét sạch luôn Full Route Cache của trang chủ
    revalidatePath('/')
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing tag to revalidate'
  })
}
