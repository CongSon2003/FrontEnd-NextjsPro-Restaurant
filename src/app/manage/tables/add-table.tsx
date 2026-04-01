import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getVietnameseTableStatus } from '@/lib/utils'
import { createTableBody, CreateTableBodyType, TableStatus, TableStatusValues } from '@/validationsSchema/table.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@radix-ui/react-dialog'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAddTableMutation } from '@/queries/useTable' // Giả sử file bạn vừa đưa nằm ở đây
import { toast } from 'react-toastify'

export default function AddTable() {
  const [open, setOpen] = useState(false)

  // 1. Khởi tạo Mutation
  const addTableMutation = useAddTableMutation()

  const form = useForm({
    resolver: zodResolver(createTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden
    }
  })

  // 2. Hàm xử lý khi Submit
  const onSubmit = async (values: CreateTableBodyType) => {
    // Tránh việc gửi trùng lặp nếu đang loading
    if (addTableMutation.isPending) return

    try {
      await addTableMutation.mutateAsync(values)

      // Thông báo thành công
      toast.success(`Đã thêm bàn số ${values.number} thành công!`)

      // Reset form và đóng Dialog
      form.reset()
      setOpen(false)
    } catch (error) {
      // Xử lý lỗi từ server (ví dụ: số bàn đã tồn tại)
      toast.error(error?.payload?.message || 'Không thể thêm bàn mới')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) form.reset() // Reset khi người dùng đóng dialog thủ công
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm' className='h-8 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm Bàn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Thêm Bàn</DialogTitle>
        </DialogHeader>
        <form
          className='grid auto-rows-max items-start gap-4'
          id='form-add-table'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className='space-y-4'>
            {/* Số hiệu bàn */}
            <Controller
              name='number'
              control={form.control}
              render={({ fieldState, field }) => (
                <Field>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <FieldLabel htmlFor='number'>Số hiệu bàn</FieldLabel>
                    <div className='col-span-3'>
                      <Input
                        {...field}
                        id='number'
                        type='number'
                        placeholder='Ví dụ: 101'
                        value={field.value as number}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </div>
                  {fieldState.error && (
                    <p className='text-xs text-red-500 text-start mt-1'>{fieldState.error.message}</p>
                  )}
                </Field>
              )}
            />

            {/* Sức chứa */}
            <Controller
              name='capacity'
              control={form.control}
              render={({ fieldState, field }) => (
                <Field>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <FieldLabel htmlFor='capacity'>Sức chứa</FieldLabel>
                    <div className='col-span-3'>
                      <Input
                        {...field}
                        id='capacity'
                        type='number'
                        placeholder='Số người tối đa'
                        value={field.value as number}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </div>
                  {fieldState.error && (
                    <p className='text-xs text-red-500 text-start mt-1'>{fieldState.error.message}</p>
                  )}
                </Field>
              )}
            />

            {/* Trạng thái */}
            <Controller
              name='status'
              control={form.control}
              render={({ fieldState, field }) => (
                <Field>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <FieldLabel htmlFor='status'>Trạng thái</FieldLabel>
                    <div className='col-span-3'>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id='status' className='w-full'>
                          <SelectValue placeholder='Chọn trạng thái' />
                        </SelectTrigger>
                        <SelectContent>
                          {TableStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseTableStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {fieldState.error && (
                    <p className='text-xs text-red-500 text-start mt-1'>{fieldState.error.message}</p>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type='submit' form='form-add-table' disabled={addTableMutation.isPending}>
            {addTableMutation.isPending ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
