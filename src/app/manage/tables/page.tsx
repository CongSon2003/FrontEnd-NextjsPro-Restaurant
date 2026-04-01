import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TableTable from './table-table'

export default function TablesPage() {
  // flex-1: chiếm toàn bộ không gian còn lại của phần tử cha
  // grid: Thiết lập kiểu hiển thị là Grid Layout, giúp quản lý các phần tử con theo hàng và cột.
  // Khoảng cách giữa các phần tử con bên trong là 1rem.
  return (
    <main className='p-4 flex-1 grid sm:py-0 items-start gap-4 sm:px-6'>
      {/* Thêm min-w-0 ở đây là cực kỳ quan trọng */}
      <div className='space-y-2 min-w-0 w-full'>
        <Card>
          <CardHeader>
            <CardTitle>Bàn ăn</CardTitle>
            <CardDescription>Quản lý bàn ăn</CardDescription>
          </CardHeader>
          <CardContent className='px-6'>
            {/* Tùy chỉnh padding cho mobile */}
            <TableTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
