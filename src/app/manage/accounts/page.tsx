import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import AccountTable from './account-table'

export default function AccountPage() {
  return (
    <main className='grid p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='min-w-0 w-full'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
            <CardDescription>Quản lý tài khoản nhân viên</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <AccountTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
