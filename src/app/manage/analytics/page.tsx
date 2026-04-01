import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <main className='p-4 flex-1 grid sm:py-0 items-start gap-4 sm:px-6'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Phân tích dữ liệu</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  )
}
