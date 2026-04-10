'use client'
import AutoPagination from '@/components/auto-pagination'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DishListResType } from '@/validationsSchema/dish.schema'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import EditDish from './edit-dish'

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
import AddDish from './add-dish'
import { useDeleteDishMutatuion, useGetDishListQuery } from '@/queries/useDish'
import { getVietnameseDishStatus, handleErrorApi } from '@/lib/utils'
import { toast } from 'react-toastify'
import revalidateApiRequest from '@/apiRequests/revalidate'

type DishItem = DishListResType['data'][0]

export const DISH_DATA_MOCK: DishItem[] = [
  {
    id: 1,
    name: 'Trà Sữa Trân Châu Đường Đen',
    price: 35000,
    image: 'https://picsum.photos/200/200',
    description: 'Vị ngọt thanh của đường đen kết hợp trân châu dai giòn.',
    status: 'Available',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Trà Đào Cam Sả',
    price: 45000,
    image: 'https://picsum.photos/200/200',
    description: 'Thức uống giải nhiệt mùa hè với miếng đào mọng nước.',
    status: 'Available',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Cà Phê Muối',
    price: 29000,
    image: 'https://picsum.photos/200/200',
    description:
      'Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.Sự kết hợp hoàn hảo giữa vị đắng và vị mặn béo của kem muối.',
    status: 'Unavailable',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: 'Bạc Xỉu',
    price: 25000,
    image: 'https://picsum.photos/200/200',
    description: 'Dành cho những người thích uống cafe nhiều sữa.',
    status: 'Hidden',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
const DishTableContext = createContext<{
  setDishIdEdit: (value: number) => void
  dishIdEdit: number | undefined
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}>({
  setDishIdEdit: () => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: () => {}
})

const columns: ColumnDef<DishItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => (
      <Avatar className='w-[100px] h-[100px] rounded-md aspect-square object-cover'>
        <AvatarImage src={row.getValue('image')} />
        <AvatarFallback>{row.original.name}</AvatarFallback>
      </Avatar>
    )
  },
  {
    accessorKey: 'name',
    header: 'Tên'
  },
  {
    accessorKey: 'price',
    header: 'Giá cả',
    cell: ({ row }) => <p>{(row.getValue('price') as number).toLocaleString('vi-VN')} đ</p>
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate' title={row.getValue('description')}>
        {row.getValue('description')}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <p>{getVietnameseDishStatus(row.getValue('status'))}</p>
  },
  {
    id: 'actions',
    cell: function Actions({ row }) {
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext)
      const openEditDish = () => {
        setDishIdEdit(row.original.id)
      }
      const openDeleteDish = () => {
        setDishDelete(row.original)
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditDish} className='cursor-pointer'>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish} className='cursor-pointer'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete
}: {
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}) {
  const { mutateAsync } = useDeleteDishMutatuion()
  const onDeleteEmployee = async () => {
    if (dishDelete) {
      try {
        await mutateAsync(dishDelete.id, {
          onSuccess: async () => {
            toast.success('Deleted Successfully')
            await revalidateApiRequest('dishes') // Revalidate cache cho danh sách món ăn
          }
        })
      } catch (error) {
        handleErrorApi({ error })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) setDishDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa món ăn{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>{dishDelete?.name}</span> này không?
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

const PAGE_SIZE = 10
export default function DishTable() {
  const searchParam = useSearchParams()
  const { data: queryData } = useGetDishListQuery()
  const finalData = useMemo(() => {
    if (queryData) {
      return queryData
    } else {
      return []
    }
  }, [queryData])
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>(undefined)
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null)
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const table = useReactTable({
    data: finalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])
  console.log(table)
  return (
    <DishTableContext.Provider value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}>
      <div className='w-full'>
        <EditDish id={dishIdEdit} onSubmitSuccess={() => {}} setDishIdEdit={setDishIdEdit} />
        <AlertDialogDeleteDish dishDelete={dishDelete} setDishDelete={setDishDelete} />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc Tên...'
            value={(table.getColumn('name')?.getFilterValue() as string) || ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto'>
            <AddDish />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
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
                )
              })}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='text-center'>
                    Không có món ăn.
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
              pathname='/manage/dishes'
            />
          </div>
        </div>
      </div>
    </DishTableContext.Provider>
  )
}
