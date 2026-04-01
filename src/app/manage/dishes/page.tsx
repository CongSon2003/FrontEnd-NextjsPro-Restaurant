import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DishTable from './dish-table'

export default function DishesPage() {
  return (
    <main className='p-4 flex-1 grid sm:py-0 items-start gap-4 sm:px-6'>
      <div className='space-y-2 min-w-0 w-full'>
        <Card>
          <CardHeader>
            <CardTitle>Món ăn</CardTitle>
            <CardDescription>Quản lý món ăn </CardDescription>
          </CardHeader>
          <CardContent>
            <DishTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
