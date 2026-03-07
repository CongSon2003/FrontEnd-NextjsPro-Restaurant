import type { Metadata } from 'next'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastContainer } from 'react-toastify'
import TanstackProvider from '@/components/Tanstack-provider'
import RefreshToken from '@/components/refresh-token'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Quán lý nhà hàng'
  // description: "",
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning className={`${fontSans.variable} antialiased`}>
        <TanstackProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <ToastContainer />
            <RefreshToken />
            {children}
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  )
}
