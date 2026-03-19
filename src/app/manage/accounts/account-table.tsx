'use client'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AccountListResType, AccountType } from '@/validationsSchema/account.shema'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import AddEmployee from './add-employee'
import { ArrowUp, ArrowUpDown, Cigarette, CirclePlus, DotSquareIcon, Ellipsis } from 'lucide-react'
import Pagination from '@/components/auto-pagination'
import AutoPagination from '@/components/auto-pagination'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import EditEmployee from './edit-employee'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

export type AccountItem = AccountListResType['data'][0]
const columnHelper = createColumnHelper()

// Tạo themeContext với giá trị :
const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number) => void
  employeeIdEdit: number | undefined
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem) => void
}>({
  setEmployeeIdEdit: (value: number) => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (value: AccountItem) => {}
})

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar'
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.getValue('name')}</div>
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <ArrowUpDown className='h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{row.getValue('email')}</div>
    }
  },
  {
    id: 'actions',
    // Sử dụng arrow function để gọn hơn hoặc giữ nguyên function nếu muốn đặt tên
    cell: ({ row }) => {
      const user = row.original // Lấy dữ liệu của user tại hàng này
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { setEmployeeIdEdit, setEmployeeDelete } = useContext(AccountTableContext)
      const openEditEdit = () => {
        console.log('Sửa user:', user.id)
        setEmployeeIdEdit(user.id)
      }

      const openDeleteEmployee = () => {
        console.log('Xóa user:', user.id)
        setEmployeeDelete(user)
      }

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open Menu</span>
              <Ellipsis className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' sideOffset={5} className='bg-white border p-2 rounded shadow-md z-50 '>
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={openEditEdit} className='cursor-pointer'>
              Sửa thông tin
            </DropdownMenuItem>

            <DropdownMenuItem onClick={openDeleteEmployee} className='text-red-600 focus:bg-red-50 focus:text-red-600'>
              Xóa người dùng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

const data: AccountType[] = [
  { id: 31, name: 'Anh Tuấn', email: 'anhtuan@example.com', role: 'Employee', avatar: '' },
  { id: 32, name: 'Bảo Ngọc', email: 'baongoc@example.com', role: 'Employee', avatar: '' },
  { id: 33, name: 'Công Phượng', email: 'phuong.cong@example.com', role: 'Employee', avatar: '' },
  { id: 34, name: 'Diệu Nhi', email: 'dieunhi@example.com', role: 'Employee', avatar: '' },
  { id: 35, name: 'Đăng Khôi', email: 'khoidang@example.com', role: 'Employee', avatar: '' },
  { id: 36, name: 'Gia Bảo', email: 'giabao@example.com', role: 'Employee', avatar: '' },
  { id: 37, name: 'Hải Đăng', email: 'haidang@example.com', role: 'Employee', avatar: '' },
  { id: 38, name: 'Hoàng Yến', email: 'hoangyen@example.com', role: 'Employee', avatar: '' },
  { id: 39, name: 'Hồng Đào', email: 'hongdao@example.com', role: 'Employee', avatar: '' },
  { id: 40, name: 'Hữu Thắng', email: 'thanghuu@example.com', role: 'Owner', avatar: '' },
  { id: 41, name: 'Khắc Việt', email: 'khacviet@example.com', role: 'Employee', avatar: '' },
  { id: 42, name: 'Lam Trường', email: 'lamtruong@example.com', role: 'Employee', avatar: '' },
  { id: 43, name: 'Lệ Quyên', email: 'lequyen@example.com', role: 'Employee', avatar: '' },
  { id: 44, name: 'Lương Bằng Quang', email: 'quanglb@example.com', role: 'Employee', avatar: '' },
  { id: 45, name: 'Mỹ Tâm', email: 'mytam@example.com', role: 'Employee', avatar: '' },
  { id: 46, name: 'Ngô Kiến Huy', email: 'huyngo@example.com', role: 'Employee', avatar: '' },
  { id: 47, name: 'Ngọc Trinh', email: 'trinhngoc@example.com', role: 'Employee', avatar: '' },
  { id: 48, name: 'Phan Mạnh Quỳnh', email: 'quynhpm@example.com', role: 'Employee', avatar: '' },
  { id: 49, name: 'Quang Dũng', email: 'quangdung@example.com', role: 'Employee', avatar: '' },
  { id: 50, name: 'Quốc Cơ', email: 'quocco@example.com', role: 'Employee', avatar: '' },
  { id: 51, name: 'Quốc Nghiệp', email: 'quocnghiep@example.com', role: 'Employee', avatar: '' },
  { id: 52, name: 'Sơn Tùng', email: 'sontungmtp@example.com', role: 'Employee', avatar: '' },
  { id: 53, name: 'Thanh Hằng', email: 'thanhhang@example.com', role: 'Employee', avatar: '' },
  { id: 54, name: 'Thu Minh', email: 'thuminh@example.com', role: 'Employee', avatar: '' },
  { id: 55, name: 'Tiến Luật', email: 'tienluat@example.com', role: 'Employee', avatar: '' },
  { id: 56, name: 'Trấn Thành', email: 'tranthanh@example.com', role: 'Employee', avatar: '' },
  { id: 57, name: 'Trường Giang', email: 'giangtruong@example.com', role: 'Employee', avatar: '' },
  { id: 58, name: 'Tuấn Hưng', email: 'tuanhung@example.com', role: 'Employee', avatar: '' },
  { id: 59, name: 'Ưng Hoàng Phúc', email: 'phucuhp@example.com', role: 'Employee', avatar: '' },
  { id: 60, name: 'Việt Hương', email: 'viethuong@example.com', role: 'Employee', avatar: '' },
  { id: 61, name: 'Xuân Bắc', email: 'xuanbac@example.com', role: 'Employee', avatar: '' },
  { id: 62, name: 'Xuân Hinh', email: 'xuanhinh@example.com', role: 'Employee', avatar: '' },
  { id: 63, name: 'Đông Nhi', email: 'dongnhi@example.com', role: 'Employee', avatar: '' },
  { id: 64, name: 'Isaac', email: 'isaac@example.com', role: 'Employee', avatar: '' },
  { id: 65, name: 'Soobin', email: 'soobin@example.com', role: 'Employee', avatar: '' },
  { id: 66, name: 'Binz', email: 'binz@example.com', role: 'Employee', avatar: '' },
  { id: 67, name: 'Đen Vâu', email: 'denvau@example.com', role: 'Employee', avatar: '' },
  { id: 68, name: 'Suboi', email: 'suboi@example.com', role: 'Employee', avatar: '' },
  { id: 69, name: 'Karik', email: 'karik@example.com', role: 'Employee', avatar: '' },
  { id: 70, name: 'JustaTee', email: 'justatee@example.com', role: 'Owner', avatar: '' },
  { id: 1, name: 'An', email: 'an@example.com', role: 'Owner', avatar: '' },
  { id: 2, name: 'Bình', email: 'binh@example.com', role: 'Employee', avatar: '' },
  { id: 3, name: 'Cường', email: 'cuong@example.com', role: 'Employee', avatar: '' },
  { id: 4, name: 'Dung', email: 'dung@example.com', role: 'Employee', avatar: '' },
  { id: 5, name: 'Em', email: 'em@example.com', role: 'Employee', avatar: '' },
  { id: 6, name: 'Giang', email: 'giang@example.com', role: 'Employee', avatar: '' },
  { id: 7, name: 'Hạnh', email: 'hanh@example.com', role: 'Employee', avatar: '' },
  { id: 8, name: 'Hòa', email: 'hoa@example.com', role: 'Employee', avatar: '' },
  { id: 9, name: 'Hùng', email: 'hung@example.com', role: 'Employee', avatar: '' },
  { id: 10, name: 'Hương', email: 'huong@example.com', role: 'Employee', avatar: '' },
  { id: 11, name: 'Khánh', email: 'khanh@example.com', role: 'Employee', avatar: '' },
  { id: 12, name: 'Lan', email: 'lan@example.com', role: 'Employee', avatar: '' },
  { id: 13, name: 'Linh', email: 'linh@example.com', role: 'Owner', avatar: '' },
  { id: 14, name: 'Long', email: 'long@example.com', role: 'Employee', avatar: '' },
  { id: 15, name: 'Mai', email: 'mai@example.com', role: 'Employee', avatar: '' },
  { id: 16, name: 'Minh', email: 'minh@example.com', role: 'Employee', avatar: '' },
  { id: 17, name: 'Nam', email: 'nam@example.com', role: 'Employee', avatar: '' },
  { id: 18, name: 'Nga', email: 'nga@example.com', role: 'Employee', avatar: '' },
  { id: 19, name: 'Ngọc', email: 'ngoc@example.com', role: 'Employee', avatar: '' },
  { id: 20, name: 'Nhân', email: 'nhan@example.com', role: 'Employee', avatar: '' },
  { id: 21, name: 'Nhung', email: 'nhung@example.com', role: 'Employee', avatar: '' },
  { id: 22, name: 'Oanh', email: 'oanh@example.com', role: 'Employee', avatar: '' },
  { id: 23, name: 'Phúc', email: 'phuc@example.com', role: 'Employee', avatar: '' },
  { id: 24, name: 'Quân', email: 'quan@example.com', role: 'Employee', avatar: '' },
  { id: 25, name: 'Sơn', email: 'son@example.com', role: 'Employee', avatar: '' },
  { id: 26, name: 'Thảo', email: 'thao@example.com', role: 'Employee', avatar: '' },
  { id: 27, name: 'Tuấn', email: 'tuan@example.com', role: 'Employee', avatar: '' },
  { id: 28, name: 'Vinh', email: 'vinh@example.com', role: 'Employee', avatar: '' },
  { id: 29, name: 'Xuân', email: 'xuan@example.com', role: 'Employee', avatar: '' },
  { id: 30, name: 'Yến', email: 'yen@example.com', role: 'Employee', avatar: '' },
  { id: 71, name: 'Bùi Anh Tuấn', email: 'tuanba@example.com', role: 'Employee', avatar: '' },
  { id: 72, name: 'Phan Anh', email: 'anhphan@example.com', role: 'Employee', avatar: '' },
  { id: 73, name: 'Lê Hiếu', email: 'hieule@example.com', role: 'Employee', avatar: '' },
  { id: 74, name: 'Trịnh Thăng Bình', email: 'binhtt@example.com', role: 'Employee', avatar: '' },
  { id: 75, name: 'Chi Dân', email: 'chidan@example.com', role: 'Employee', avatar: '' },
  { id: 76, name: 'Erik', email: 'erik@example.com', role: 'Employee', avatar: '' },
  { id: 77, name: 'Đức Phúc', email: 'phucduc@example.com', role: 'Employee', avatar: '' },
  { id: 78, name: 'Hoà Minzy', email: 'hoaminzy@example.com', role: 'Employee', avatar: '' },
  { id: 79, name: 'Min', email: 'min@example.com', role: 'Employee', avatar: '' },
  { id: 80, name: 'Tóc Tiên', email: 'toctien@example.com', role: 'Owner', avatar: '' },
  { id: 81, name: 'Bảo Anh', email: 'baoanh@example.com', role: 'Employee', avatar: '' },
  { id: 82, name: 'Hương Tràm', email: 'huongtram@example.com', role: 'Employee', avatar: '' },
  { id: 83, name: 'Trọng Hiếu', email: 'hieutrong@example.com', role: 'Employee', avatar: '' },
  { id: 84, name: 'Vũ Cát Tường', email: 'tuongvu@example.com', role: 'Employee', avatar: '' },
  { id: 85, name: 'Tiên Tiên', email: 'tientien@example.com', role: 'Employee', avatar: '' },
  { id: 86, name: 'Sơn Thạch', email: 'sthach@example.com', role: 'Employee', avatar: '' },
  { id: 87, name: 'Will', email: 'will@example.com', role: 'Employee', avatar: '' },
  { id: 88, name: 'Jun Phạm', email: 'junpham@example.com', role: 'Employee', avatar: '' },
  { id: 89, name: 'Ngô Thanh Vân', email: 'vanngo@example.com', role: 'Employee', avatar: '' },
  { id: 90, name: 'Johnny Trí Nguyễn', email: 'johnny@example.com', role: 'Employee', avatar: '' },
  { id: 91, name: 'Dustin Nguyễn', email: 'dustin@example.com', role: 'Employee', avatar: '' },
  { id: 92, name: 'Thái Hòa', email: 'thaihoa@example.com', role: 'Employee', avatar: '' },
  { id: 93, name: 'Thu Trang', email: 'thutrang@example.com', role: 'Employee', avatar: '' },
  { id: 94, name: 'Kiều Minh Tuấn', email: 'tuankm@example.com', role: 'Employee', avatar: '' },
  { id: 95, name: 'Kaity Nguyễn', email: 'kaity@example.com', role: 'Employee', avatar: '' },
  { id: 96, name: 'Ninh Dương Lan Ngọc', email: 'ngocndl@example.com', role: 'Employee', avatar: '' },
  { id: 97, name: 'Diệu Nhi', email: 'nhi.dieu@example.com', role: 'Employee', avatar: '' },
  { id: 98, name: 'Puka', email: 'puka@example.com', role: 'Employee', avatar: '' },
  { id: 99, name: 'Gin Tuấn Kiệt', email: 'ginkiet@example.com', role: 'Employee', avatar: '' },
  { id: 100, name: 'Hứa Vĩ Văn', email: 'vanhv@example.com', role: 'Owner', avatar: '' },
  { id: 101, name: 'Quang Trung', email: 'trungq@example.com', role: 'Employee', avatar: '' },
  { id: 102, name: 'Duy Khánh', email: 'khanhduy@example.com', role: 'Employee', avatar: '' },
  { id: 103, name: 'Cris Phan', email: 'crisphan@example.com', role: 'Employee', avatar: '' },
  { id: 104, name: 'Misthy', email: 'misthy@example.com', role: 'Employee', avatar: '' },
  { id: 105, name: 'PewPew', email: 'pewpew@example.com', role: 'Employee', avatar: '' },
  { id: 106, name: 'ViruSs', email: 'viruss@example.com', role: 'Employee', avatar: '' },
  { id: 107, name: 'Độ Mixi', email: 'domixi@example.com', role: 'Employee', avatar: '' },
  { id: 108, name: 'Xemesis', email: 'xemesis@example.com', role: 'Employee', avatar: '' },
  { id: 109, name: 'Linh Ngọc Đàm', email: 'linhnd@example.com', role: 'Employee', avatar: '' },
  { id: 110, name: 'Phạm Công Sơn', email: 'son.pham@example.com', role: 'Owner', avatar: '' }
]
// Số lượng item trên 1 trang
const PAGE_SIZE = 10

// Tanstack table là headless nên nó chỉ xử lý logic, không render UI.

function AlertDialogDeleteAccount({ employeeDelete, setEmployeeDelete }) {
  return (
    <AlertDialog
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg-foreground text-primary-foreground rounded px-1'>{employeeDelete?.name}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function AccountTable() {
  /*
    sắp xếp (sorting), 
    lọc (filtering), 
    phân trang (pagination), 
    ẩn/hiện cột (column visibility) ,
    chọn hàng (row selection).
  */
  // const data: any[] = []
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const pageIndex = page - 1
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>()
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // lấy row cơ bản
    getPaginationRowModel: getPaginationRowModel(), // Kích hoạt khả năng tự động cắt nhỏ dữ liệu thành các trang khi state pagination (gồm pageIndex và pageSize) thay đổi.
    getSortedRowModel: getSortedRowModel(), // Kích hoạt khả năng tự động sắp xếp dữ liệu khi state sorting thay đổi.
    getFilteredRowModel: getFilteredRowModel(), // Kích hoạt khả năng tự động lọc dữ liệu khi state columnFilters thay đổi.
    // UX Optimization
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    //  (Controlled State Pattern)
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })
  console.log(columnFilters)
  console.log(employeeIdEdit, employeeDelete)
  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <AccountTableContext.Provider value={{ employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete }}>
      <div className='w-full'>
        <EditEmployee id={employeeIdEdit} setEmployeeIdEdit={setEmployeeIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteAccount employeeDelete={employeeDelete} setEmployeeDelete={setEmployeeDelete} />
        <div className='flex items-center justify-center py-4'>
          <Input
            placeholder='Filter emails...'
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddEmployee />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/accounts'
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
