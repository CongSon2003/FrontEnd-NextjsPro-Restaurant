import Layout from '@/app/(public)/layout'
import { defaultLocale } from '@/config'

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Layout>{children}</Layout>
}
