'use client'
import {
  /*
    useQueryClient: là một Custom Hook. 
    useQueryClient: Bạn dùng nó bên trong các Component con để truy cập vào cái "kho" QueryClient mà bạn đã tạo ở trên.
    useQueryClient: Thực hiện các hành động "thao túng" cache như làm mới dữ liệu, xóa cache hoặc cập nhật dữ liệu thủ công.
  */
  QueryClient, // là một class đóng vai trò là trung tâm điều khiển, Khởi tạo môi trường cho TanStack Query hoạt động.
  QueryClientProvider
} from '@tanstack/react-query'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import RefreshToken from './refresh-token'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

type AppContextType = {
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
}

const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // Nếu có accessToken là có đăng nhập thì set ISauthstate = true
  const [isAuthState, setIsAuthState] = useState(false)

  const handleSetIsAuthState = useCallback((isAuth: boolean) => {
    setIsAuthState(isAuth)
  }, [])

  useEffect(() => {
    const isAccessToken = getAccessTokenFromLocalStorage()
    if (isAccessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthState(true)
    }
  }, [])
  console.log(isAuthState)
  return (
    <AppContext.Provider
      value={{
        isAuth: isAuthState,
        setIsAuth: handleSetIsAuthState //Tham chiếu đến hàm handleSetIsAuthState
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        {children}
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
