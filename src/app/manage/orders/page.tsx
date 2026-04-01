import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OrdersPage() {
  return (
    <main className='p-4 flex-1 grid sm:py-0 items-start gap-4 sm:px-6'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
            <CardDescription>Quản lý đơn hàng</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  )
}
