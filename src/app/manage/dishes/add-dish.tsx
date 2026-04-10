import revalidateApiRequest from '@/apiRequests/revalidate'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DishStatusValues } from '@/constants/types'
import { getVietnameseDishStatus } from '@/lib/utils'
import { useAddDishMutation } from '@/queries/useDish'
import { useMediaMutation } from '@/queries/useMedia'
import { CreateDishBody, CreateDishBodyType } from '@/validationsSchema/dish.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { PlusCircle, Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function AddDish({}) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadMedia } = useMediaMutation()
  const addDishMutation = useAddDishMutation()

  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      status: 'Unavailable'
    }
  })
  const image = form.watch('image')
  const name = form.watch('name')
  console.log(image)

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return image
  }, [image, file])

  const handleUploadFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      // Giả lập set giá trị để pass qua validation nếu cần
      form.setValue('image', file.name)
    }
  }
  console.log(file)
  const onSubmit = async (data: CreateDishBodyType) => {
    if (addDishMutation.isPending) return
    console.log(data)
    const payload = { ...data }
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const uploadImageResult = await uploadMedia(formData)
      payload.image = uploadImageResult.payload.data
    }

    const result = await addDishMutation.mutateAsync({ body: payload })
    await revalidateApiRequest('dishes') // Revalidate cache cho danh sách món ăn
    toast.success('Add Successfully')

    setOpen(false)
    form.reset()
    setFile(null)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm món ăn</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
        </DialogHeader>
        <form
          id='form-add-dish'
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log(errors)
          })}
        >
          <FieldGroup>
            <Controller
              name='image'
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Ảnh Món Ăn</FieldLabel>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-25 w-25 rounded-md border'>
                      {previewAvatar && <AvatarImage src={previewAvatar} className='object-cover' />}
                      <AvatarFallback className='rounded-md'>{name?.slice(0, 2).toUpperCase() || 'AV'}</AvatarFallback>
                    </Avatar>
                    <input
                      type='file'
                      ref={fileInputRef}
                      onChange={handleUploadFileImage}
                      accept='image/*'
                      className='hidden'
                    />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Button type='submit' form='form-add-dish'>
            Thêm món ăn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
