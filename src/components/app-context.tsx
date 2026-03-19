'use client'

import { createContext, useContext } from 'react'

export const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {}
})
