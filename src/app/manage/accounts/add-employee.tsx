import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAddAccountMutation } from '@/queries/useAccount'
import { useMediaMutation } from '@/queries/useMedia'
import { AddEmployeeAccountBody, AddEmployeeAccountBodyType } from '@/validationsSchema/account.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function AddEmployee({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileAvatar, setFileAvatar] = useState<File | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string>('')

  const { mutateAsync: uploadMedia } = useMediaMutation()
  const { mutateAsync: addEmployee } = useAddAccountMutation()

  const form = useForm<AddEmployeeAccountBodyType>({
    resolver: zodResolver(AddEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: '',
      password: '',
      confirmPassword: ''
    }
  })

  const name = form.watch('name')

  // Xử lý Preview Avatar và dọn dẹp bộ nhớ
  useEffect(() => {
    if (fileAvatar) {
      const url = URL.createObjectURL(fileAvatar)
      setPreviewAvatar(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewAvatar('')
  }, [fileAvatar])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileAvatar(file)
      // Giả lập set giá trị để pass qua validation nếu cần
      form.setValue('avatar', file.name)
    }
  }

  const onSubmit = async (data: AddEmployeeAccountBodyType) => {
    setIsLoadingSubmit(true)
    try {
      const payload = {
        ...data
      }
      // BƯỚC 1: Nếu có file chọn từ máy, phải upload lên server trước
      if (fileAvatar) {
        const formData = new FormData()
        formData.append('file', fileAvatar)
        const uploadRes = await uploadMedia(formData)
        payload.avatar = uploadRes.payload.data // Đây là URL thật (vd: http://localhost:4000/static/...)
      } else {
        delete payload.avatar
      }
      // Giả lập gọi API
      await addEmployee(payload, {
        onSuccess: () => {
          toast.success('Thêm nhân viên thành công')
        }
      })

      setFileAvatar(null)
      setPreviewAvatar('')

      setOpen(false) // Đóng dialog
      form.reset() // Reset form về mặc định
      setFileAvatar(null)
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-8 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm nhân viên</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để tạo tài khoản nhân viên.</DialogDescription>
        </DialogHeader>

        <form id='add-employee-form' className='grid gap-6' onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup className='grid gap-6'>
            {/* Tên */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='add-name'>Tên nhân viên</FieldLabel>
                  <Input id='add-name' {...field} placeholder='VD: Nguyễn Văn A' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='add-email'>Email</FieldLabel>
                  <Input id='add-email' type='email' {...field} placeholder='email@example.com' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Avatar */}
            <Controller
              name='avatar'
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

            {/* Mật khẩu */}
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='add-pass'>Mật khẩu</FieldLabel>
                  <Input id='add-pass' type='password' {...field} placeholder='••••••••' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Xác nhận mật khẩu */}
            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='add-confirm'>Xác nhận mật khẩu</FieldLabel>
                  <Input id='add-confirm' type='password' {...field} placeholder='••••••••' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter className='mt-4'>
          <Button type='submit' form='add-employee-form' disabled={isLoadingSubmit} className='w-full sm:w-auto'>
            {isLoadingSubmit ? (
              <>
                <Spinner data-icon='inline-start' /> Đang xử lý...
              </>
            ) : (
              'Tạo nhân viên'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
