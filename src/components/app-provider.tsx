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
import { RoleType, RoleValues } from '@/constants/types'

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
  role: RoleType | undefined
  setRole: (role?: RoleType) => void
}

const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {},

  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType) => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // Nếu có accessToken là có đăng nhập thì set ISauthstate = true
  const [isAuthState, setIsAuthState] = useState(false)
  const [role, setRole] = useState<RoleType>(undefined)
  const handleSetIsAuthState = useCallback((isAuth: boolean) => {
    setIsAuthState(isAuth)
  }, [])

  const handleSetRole = useCallback((role) => {
    setRole(role)
  }, [])

  useEffect(() => {
    const isAccessToken = getAccessTokenFromLocalStorage()
    if (isAccessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthState(true)
      setRole(role)
    }
  }, [role])
  console.log(role)
  console.log(isAuthState)
  return (
    <AppContext.Provider
      value={{
        isAuth: isAuthState,
        role,
        setRole: handleSetRole, //Tham chiếu đến hàm handleSetRole
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
