'use client'
import revalidateApiRequest from '@/apiRequests/revalidate'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Textarea } from '@/components/ui/textarea'
import { DishStatusValues } from '@/constants/types'
import { getVietnameseDishStatus, handleErrorApi } from '@/lib/utils'
import { useGetDishQuery, useUpdateDishMutation } from '@/queries/useDish'
import { useMediaMutation } from '@/queries/useMedia'
import { UpdateDishBody, UpdateDishBodyType } from '@/validationsSchema/dish.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function EditDish({
  id,
  setDishIdEdit,
  onSubmitSuccess
}: {
  id: number | undefined
  setDishIdEdit?: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const fileInputRef = useRef(null)
  const [file, setFile] = useState<File | null>(null)
  const updateDish = useUpdateDishMutation()
  const { data: dishData, isSuccess } = useGetDishQuery(id)
  const uploadMediaMutation = useMediaMutation()
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      status: 'Unavailable'
    }
  })
  const name = form.watch('name')
  const image = form.watch('image')
  const status = form.watch('status')
  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return image
  }, [file, image])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Pass invalid
      form.setValue('image', selectedFile.name)
    }
  }

  // Fill dữ liệu vào form khi fetch thành công
  useEffect(() => {
    if (dishData && isSuccess) {
      const data = dishData
      form.reset({
        image: data.image || '',
        description: data.description,
        name: data.name,
        price: data.price,
        status: data.status
      })
    }
  }, [dishData, isSuccess, form])

  const onSubmit = async (values: UpdateDishBodyType) => {
    if (updateDish.isPending) return
    try {
      const body = { ...values }
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body.image = imageUrl
      }
      const result = await updateDish.mutateAsync({ id, body })
      await revalidateApiRequest('dishes') // Revalidate cache cho danh sách món ăn
      toast.success('Update Successfully')
      form.reset()
      setFile(null)
      setDishIdEdit(undefined)
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
        if (!value) {
          setDishIdEdit(undefined)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id='form-update-dish' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='image'
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Ảnh đại diện</FieldLabel>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-25 w-25 rounded-md border'>
                      {previewAvatar && <AvatarImage src={previewAvatar} className='object-cover' />}
                      <AvatarFallback className='rounded-md'>{name?.slice(0, 2).toUpperCase() || 'AV'}</AvatarFallback>
                    </Avatar>
                    <input type='file' ref={fileInputRef} onChange={handleUpload} accept='image/*' className='hidden' />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => fileInputRef.current?.click()}
                      className='gap-2 h-25 w-25 border border-dashed flex justify-center items-center bg-white'
                    >
                      <Upload className='h-5 w-5' />
                      <span className='sr-only'>Tải ảnh lên</span>
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Tên món */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tên món ăn</FieldLabel>
                  <Input {...field} placeholder='VD: Trà sữa trân châu' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              {/* Giá cả */}
              <Controller
                name='price'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Giá (VNĐ)</FieldLabel>
                    <Input type='number' {...field} value={field.value as number} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Trạng thái */}
              <Controller
                name='status'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Trạng thái</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                      <SelectContent>
                        {DishStatusValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {getVietnameseDishStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
            {/* Mô tả */}
            <Controller
              name='description'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Mô tả</FieldLabel>
                  <Textarea {...field} placeholder='Nhập mô tả món ăn...' className='min-h-[100px]' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type='submit' form='form-update-dish'>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
