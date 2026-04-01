'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getTableLink, getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { TableStatusValues, UpdateTableBody, UpdateTableBodyType } from '@/validationsSchema/table.shema'
import { useGetTableQuery, useUpdateTableMutation } from '@/queries/useTable'
import Link from 'next/link'
import TableQRCode from '@/components/qrcode-table'
import { Loader2 } from 'lucide-react' // Thêm icon loading từ lucide-react

export default function EditTable({
  id,
  setTableIdEdit,
  onSubmitSuccess
}: {
  id: number | undefined
  setTableIdEdit: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { data: tableData, isSuccess } = useGetTableQuery(id)
  const updateTable = useUpdateTableMutation()

  const form = useForm({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatusValues[0],
      changeToken: false
    },
    mode: 'onBlur'
  })

  useEffect(() => {
    if (tableData && isSuccess) {
      form.reset({
        capacity: tableData.data.capacity,
        status: tableData.data.status,
        changeToken: false
      })
    }
  }, [tableData, isSuccess, form])

  const onSubmit = async (values: UpdateTableBodyType) => {
    if (updateTable.isPending) return
    try {
      await updateTable.mutateAsync({ id: id as number, body: values })
      toast.success('Cập nhật bàn thành công')
      onSubmitSuccess?.()
      setTableIdEdit(undefined)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) setTableIdEdit(undefined)
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-[100vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn: {tableData?.data.number}</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin sức chứa và trạng thái của bàn.</DialogDescription>
        </DialogHeader>

        <form id='form-update-table' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup className='grid gap-4'>
            {/* Số hiệu bàn - Tối ưu Stack trên mobile */}
            <div className='grid grid-cols-1 items-center gap-2'>
              <FieldLabel className='sm:col-span-1'>Số hiệu bàn</FieldLabel>
              <Input
                value={tableData?.data.number?.toString() ?? ''}
                readOnly
                className='bg-muted cursor-not-allowed'
              />
            </div>

            {/* Sức chứa & Trạng thái - 1 cột mobile, 2 cột desktop */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <Controller
                name='capacity'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Sức chứa (người)</FieldLabel>
                    <Input type='number' {...field} value={(field.value as number) ?? 0} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name='status'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Trạng thái</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
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
                  </Field>
                )}
              />
            </div>

            {/* Phần hiển thị QR và URL - Thiết kế lại để Responsive */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6'>
              <div className='flex flex-col items-center sm:items-start gap-3'>
                <label className='text-sm font-medium'>Mã QR Bàn</label>
                <div>
                  {tableData && (
                    <TableQRCode
                      width={200}
                      font='15px Arial'
                      tableNumber={tableData.data.number}
                      token={tableData.data.token}
                    />
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <label className='text-sm font-medium'>URL Gọi món</label>
                <div className='p-3 bg-muted rounded-md border border-dashed'>
                  {tableData && (
                    <Link
                      className='text-blue-600 hover:text-blue-800 text-sm break-all leading-relaxed'
                      href={getTableLink({ tableNumber: tableData.data.number, token: tableData.data.token })}
                      target='_blank'
                    >
                      {getTableLink({ tableNumber: tableData.data.number, token: tableData.data.token })}
                    </Link>
                  )}
                </div>
                <p className='text-[10px] text-muted-foreground'>* Quét mã hoặc bấm vào link để mở trang gọi món</p>
              </div>
            </div>
          </FieldGroup>
        </form>

        <DialogFooter className='mt-4'>
          <Button type='submit' form='form-update-table' disabled={updateTable.isPending} className='w-full sm:w-auto'>
            {updateTable.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
