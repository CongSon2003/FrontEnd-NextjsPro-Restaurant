import { LoginResType } from '@/validationsSchema/auth.schema'
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from './utils'
/*
  1. HTTP : Giao thức truyền tải siêu văn bản là "ngôn ngữ" chung mà trình duyệt (Client) và máy chủ (Server) dùng để nói chuyện với nhau
    HTTP REQUEST : 
      +, url
      +, body
      +, headers
      +, method (GET, POST, PUT, DELETE,...)
    HTTP RESPONSE:
      +, status code (200, 201, 400, 401, 403, 404, 500,...)
      +, body
      +, headers
  2. Hãy tưởng tượng HTTP giống như quy tắc giao tiếp trong một nhà hàng:
    Bạn (Client/Trình duyệt): Khách hàng.
    Server (Backend): Nhà bếp.
  3. HTTP: Là tờ thực đơn và quy cách gọi món. Bạn không thể cứ hét lên vọng vào bếp, bạn phải tuân thủ quy tắc: Chọn món (URL), ghi chú thêm (Headers/Body), và đưa cho bồi bàn (Request).
*/
type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

// Đảm bảo chỉ có một request logout được gửi đi từ phía client tại một thời điểm
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// let clientLogoutRequest: null | Promise<Response> = null
const isClient = typeof window !== 'undefined'

// Mã lỗi thực thể (Entity Error) thường được sử dụng để biểu thị lỗi liên quan đến dữ liệu đầu vào không hợp lệ, ví dụ như khi người dùng gửi dữ liệu mà không đáp ứng được các yêu cầu xác thực hoặc ràng buộc dữ liệu của backend server
const ENTITY_ERROR_STATUS = 422
// Mã lỗi xác thực (Authentication Error) thường được sử dụng để biểu thị lỗi liên quan đến việc người dùng không có quyền truy cập vào tài nguyên hoặc hành động nào đó do thiếu hoặc có token không hợp lệ
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    [key: string]: any
  }
  constructor({ status, payload, message = 'Lỗi HTTP' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Lỗi thực thể' })
    this.status = status
    this.payload = payload
  }
}

const request = async <Response>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions) => {
  // 1. Chuẩn bị dữ liệu gửi đi (Body & Headers)
  let body = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else {
    body = JSON.stringify(options?.body)
  }

  // Nếu body là FormData thì chúng ta sẽ không set Content-Type vì trình duyệt sẽ tự động set với boundary phù hợp, còn nếu body là JSON thì chúng ta sẽ set Content-Type là application/json
  const baseHeaders: { [Key: string]: string } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  if (isClient) {
    // Nếu đang ở phía client (trình duyệt) thì chúng ta sẽ lấy accessToken từ localStorage và set vào header Authorization để gửi đi trong các request tiếp theo, còn nếu đang ở phía server (Next.js Server) thì chúng ta sẽ không làm điều này vì Next.js Server sẽ không lưu token ở localStorage mà sẽ lấy token từ cookie được gửi lên trong mỗi request
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl: string | undefined = options?.baseUrl === undefined ? process.env.NEXT_PUBLIC_API_URL : options.baseUrl
  const fullUrl = `${baseUrl}/${normalizePath(url)}`

  console.log(`${fullUrl}`)
  console.log('🚀 ~ request ~ options:', options)
  // Gọi API NEXTjs server thông qua fetch API của trình duyệt
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  })

  const payload: Response = await res.json()
  console.log({
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  })

  const data = {
    status: res.status,
    payload
  }

  // Interceptor là nơi chúng ta xử lý request và response trước khi trả về cho phía component
  /*
    API 401
    ↓
    Nếu do accessToken hết hạn
    ↓
    Gọi refresh
    ↓
    Nếu refresh fail
    ↓
    Logout
    ↓
    Redirect login
  */
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    }
    // else if (res.status === AUTHENTICATION_ERROR_STATUS) {
    //   if (isClient) {
    //     const locale = Cookies.get('NEXT_LOCALE')
    //     if (!clientLogoutRequest) {
    //       clientLogoutRequest = fetch('/api/auth/logout', {
    //         method: 'POST',
    //         body: null, // Logout mình sẽ cho phép luôn luôn thành công
    //         headers: {
    //           ...baseHeaders
    //         }
    //       })
    //       try {
    //         await clientLogoutRequest
    //       } catch (error) {
    //       } finally {
    //         removeTokensFromLocalStorage()
    //         clientLogoutRequest = null
    //         // Redirect về trang login có thể dẫn đến loop vô hạn
    //         // Nếu không không được xử lý đúng cách
    //         // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
    //         // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
    //         location.href = `/${locale}/login`
    //       }
    //     }
    //   } else {
    //     // Đây là trường hợp khi mà chúng ta vẫn còn access token (còn hạn)
    //     // Và chúng ta gọi API ở Next.js Server (Route Handler , Server Component) đến Server Backend
    //     const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1]
    //     redirect(`/login?accessToken=${accessToken}`)
    //   }
    // }
    else {
      // Lỗi HTTP thông thường, chúng ta sẽ ném lỗi và hiển thị thông báo chung chung, không hiển thị chi tiết lỗi từ backend server trả về cho người dùng cuối để tránh rò rỉ thông tin nhạy cảm có thể được sử dụng để tấn công hệ thống
      throw new HttpError(data)
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url)
    if (['api/auth/login', 'api/guest/login'].includes(normalizeUrl)) {
      // Khi login thành công, chúng ta sẽ nhận được accessToken và refreshToken từ backend server thông qua Next.js Server, lúc này chúng ta sẽ lưu accessToken vào localStorage để tiện cho việc gửi đi trong các request tiếp theo còn refreshToken thì chúng ta sẽ không lưu vào localStorage mà sẽ lưu vào cookie với HttpOnly flag để tăng cường bảo mật
      const { accessToken, refreshToken } = (payload as LoginResType).data
      setAccessTokenToLocalStorage(accessToken)
      setRefreshTokenToLocalStorage(refreshToken)
    } else if ('api/auth/token' === normalizeUrl) {
      // Khi refresh token thành công, chúng ta sẽ nhận được accessToken và refreshToken mới từ backend server thông qua Next.js Server, lúc này chúng ta sẽ cập nhật accessToken mới vào localStorage để tiện cho việc gửi đi trong các request tiếp theo còn refreshToken thì chúng ta sẽ không cập nhật vào localStorage mà sẽ cập nhật vào cookie với HttpOnly flag để tăng cường bảo mật
      const { accessToken, refreshToken } = payload as {
        accessToken: string
        refreshToken: string
      }
      setAccessTokenToLocalStorage(accessToken)
      setRefreshTokenToLocalStorage(refreshToken)
    } else if (['api/auth/logout', 'api/guest/logout'].includes(normalizeUrl)) {
      // Khi logout thành công, chúng ta sẽ xóa accessToken và refreshToken ở phía client
      removeTokensFromLocalStorage()
    }
  }
  return data
}

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options })
  }
}

export default http
