'use client'

import { Input } from '@/components/ui/input'
import { TableListResponseType } from '@/validationsSchema/table.shema'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AddTable from './add-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AutoPagination from '@/components/auto-pagination'
import EditTable from './edit-table'
import { useDeleteTableMutation, useTableListQuery } from '@/queries/useTable'
import QRCodeTable from '@/components/qrcode-table'
import { toast } from 'react-toastify'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

type TableItem = TableListResponseType['data'][0]

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void
  tableIdEdit: number | undefined
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}>({
  setTableIdEdit: (value: number) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {}
})

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: 'number',
    header: 'Số bàn',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('number')}</div>,
    // Hàm lọc tùy chỉnh để tìm kiếm số bàn
    filterFn: (row, id, filterValue) => {
      const rowValue = row.getValue(id)
      return rowValue.toString().includes(filterValue)
    }
  },
  {
    accessorKey: 'capacity',
    header: 'Sức chứa',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('capacity')}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue('status'))}</div>
  },
  {
    accessorKey: 'token',
    header: ({}) => {
      return <div className='text-center'>QR Code</div>
    },
    cell: ({ row }) => (
      <div className='text-center w-full flex items-center justify-center'>
        {QRCodeTable({ token: row.getValue('token'), tableNumber: row.getValue('number') })}
      </div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useContext(TableTableContext)
      const openEditTable = () => {
        setTableIdEdit(row.original.number)
      }

      const openDeleteTable = () => {
        setTableDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete
}: {
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}) {
  const { mutateAsync } = useDeleteTableMutation()
  const onDeleteEmployee = async () => {
    if (tableDelete) {
      try {
        await mutateAsync(
          { id: tableDelete.number },
          {
            onSuccess: () => {
              toast.success('Deleted Successfully')
            }
          }
        )
      } catch (error) {
        handleErrorApi({ error })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) setTableDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bàn ăn{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>{tableDelete?.number}</span> này không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteEmployee}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
const PageSize = 10
export default function TableTable() {
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>(undefined)
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null)

  const searchParams = useSearchParams()
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const pageIndex = page - 1
  const { data: queryData } = useTableListQuery()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PageSize
  })

  const finalData = useMemo(() => {
    if (queryData) {
      return queryData
    } else {
      return []
    }
  }, [queryData])
  const table = useReactTable({
    data: finalData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  // Cập nhật pagination khi pageIndex thay đổi (ví dụ: khi người dùng chuyển trang)
  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PageSize
    })
  }, [table, pageIndex])
  return (
    <TableTableContext.Provider value={{ setTableIdEdit, tableIdEdit, tableDelete, setTableDelete }}>
      <div className=''>
        <EditTable id={tableIdEdit} setTableIdEdit={setTableIdEdit} />
        <AlertDialogDeleteTable setTableDelete={setTableDelete} tableDelete={tableDelete} />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc số bàn'
            value={(table.getColumn('number')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('number')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddTable />
          </div>
        </div>
        <div className='w-full overflow-hidden'>
          <div className='overflow-x-auto rounded-md border'>
            <Table className='min-w-[800px] w-full'>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
        </div>
        <div className='flex items-center justify-end space-x-2 pt-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table?.getPaginationRowModel()?.rows?.length}</strong> trong{' '}
            <strong>{finalData?.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/dishes'
            />
          </div>
        </div>
      </div>
    </TableTableContext.Provider>
  )
}
