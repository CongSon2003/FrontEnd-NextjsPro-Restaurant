import http from '@/lib/http'

// Revalidate API request để gọi API revalidate ở route /api/revalidate, giúp invalid cache của NextJS khi có sự thay đổi dữ liệu, đảm bảo người dùng luôn nhận được dữ liệu mới nhất mà không cần phải refresh thủ công
export default function revalidateApiRequest(tag: string) {
  return http.get(`/api/revalidate?tag=${tag}`, {
    baseUrl: ''
  })
}
