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
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDeleteAccountMutatuion, useGetAccountListQuery } from '@/queries/useAccount'
import { toast } from 'react-toastify'
import { handleErrorApi } from '@/lib/utils'

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
  // {
  //   id: 'id',
  //   header: '#',
  //   cell: ({ row }) => {
  //     return <span>{row.index}</span>
  //   }
  // },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      return (
        <Avatar className='w-20 h-20'>
          <AvatarImage src={row.getValue('avatar') || 'https://github.com/shadcn.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )
    }
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
        setEmployeeIdEdit(user.id)
      }

      const openDeleteEmployee = () => {
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

// Số lượng item trên 1 trang
const PAGE_SIZE = 10

// Tanstack table là headless nên nó chỉ xử lý logic, không render UI.

function AlertDialogDeleteAccount({ employeeDelete, setEmployeeDelete }) {
  const { mutateAsync } = useDeleteAccountMutatuion()
  const onDeleteAccount = async () => {
    if (employeeDelete) {
      try {
        await mutateAsync(employeeDelete.id, {
          onSuccess: () => {
            setEmployeeDelete(null)
            toast.success('Delete Successfully!')
          }
        })
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(employeeDelete)} // Open
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
          <AlertDialogAction onClick={onDeleteAccount}>Continue</AlertDialogAction>
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

  // call api accounts Query
  const { data: queryData, refetch } = useGetAccountListQuery()
  const { mutateAsync: deleteAccount } = useDeleteAccountMutatuion()
  const finalData = useMemo(() => {
    return queryData ?? []
  }, [queryData])
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: finalData,
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
  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  const onSubmitSuccess = () => {}
  return (
    <AccountTableContext.Provider value={{ employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete }}>
      <div className='w-full'>
        <EditEmployee id={employeeIdEdit} setEmployeeIdEdit={setEmployeeIdEdit} onSubmitSuccess={onSubmitSuccess} />
        <AlertDialogDeleteAccount employeeDelete={employeeDelete} setEmployeeDelete={setEmployeeDelete} />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Filter emails...'
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddEmployee onSubmitSuccess={onSubmitSuccess} />
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
        <div className='flex items-center justify-end space-x-2 pt-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{finalData.length}</strong> kết quả
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
