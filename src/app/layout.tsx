import type { Metadata } from 'next'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastContainer } from 'react-toastify'
import AppProvider from '@/components/app-provider'

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
        <AppProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <ToastContainer />
            {children}
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
