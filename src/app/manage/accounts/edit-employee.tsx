'use client'

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
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useUpdateAccountMutatuion, useGetAccountQuery } from '@/queries/useAccount'
import { useMediaMutation } from '@/queries/useMedia'
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from '@/validationsSchema/account.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface Props {
  id?: number
  setEmployeeIdEdit: (id: number | undefined) => void
  onSubmitSuccess?: () => void
}

export default function EditEmployee({ id, setEmployeeIdEdit, onSubmitSuccess }: Props) {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileAvatar, setFileAvatar] = useState<File | null>(null)

  // Các Mutation hooks
  const updateEmployeeMutation = useUpdateAccountMutatuion()
  const uploadMediaMutation = useMediaMutation()

  // Fetch dữ liệu nhân viên theo ID
  const { data: employeeRes, isSuccess } = useGetAccountQuery(id as number)

  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: '',
      password: '',
      confirmPassword: '',
      changePassword: false
    }
  })

  // Watch các field để xử lý UI
  const isChangePassword = form.watch('changePassword')
  const name = form.watch('name')
  const avatarFromForm = form.watch('avatar')

  // Preview ảnh thông minh
  const previewAvatar = useMemo(() => {
    if (fileAvatar) return URL.createObjectURL(fileAvatar)
    return avatarFromForm || ''
  }, [fileAvatar, avatarFromForm])

  // Cleanup URL để tránh tràn bộ nhớ
  useEffect(() => {
    return () => {
      if (previewAvatar && previewAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(previewAvatar)
      }
    }
  }, [previewAvatar])

  // Fill dữ liệu vào form khi fetch thành công
  useEffect(() => {
    if (employeeRes && isSuccess) {
      const data = employeeRes.data
      form.reset({
        name: data.name,
        email: data.email,
        avatar: data.avatar ?? '',
        changePassword: false,
        password: '',
        confirmPassword: ''
      })
    }
  }, [employeeRes, isSuccess, form])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileAvatar(file)
      // Set tạm tên file để pass qua validation nếu Zod yêu cầu string
      form.setValue('avatar', file.name)
    }
  }

  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    if (isLoadingSubmit) return
    setIsLoadingSubmit(true)

    try {
      let currentAvatarUrl = values.avatar

      // BƯỚC 1: Nếu người dùng chọn file mới, phải upload lên server trước
      if (fileAvatar) {
        const formData = new FormData()
        formData.append('file', fileAvatar)
        const uploadRes = await uploadMediaMutation.mutateAsync(formData)
        currentAvatarUrl = uploadRes.payload.data // Lấy link URL thật từ server
      }

      // BƯỚC 2: Chuẩn bị payload gửi đi
      const payload = {
        ...values,
        avatar: currentAvatarUrl
      }

      if (payload.avatar === '' || payload.avatar === null) {
        delete payload.avatar
      }
      // Nếu không chọn "Đổi mật khẩu", xóa các field liên quan mật khẩu để tránh lỗi API
      if (!values.changePassword) {
        delete payload.password
        delete payload.confirmPassword
      }

      // BƯỚC 3: Gọi API cập nhật
      await updateEmployeeMutation.mutateAsync({ id, body: payload })

      toast.success('Cập nhật nhân viên thành công')
      setEmployeeIdEdit(undefined) // Đóng dialog
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (error) {
      toast.error(error?.payload?.message || 'Có lỗi xảy ra khi cập nhật')
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeIdEdit(undefined)
          setFileAvatar(null)
          form.reset()
        }
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto flex flex-col sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin nhân viên tại đây.</DialogDescription>
        </DialogHeader>

        <form
          id='edit-form'
          className='grid gap-6'
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log('Zod Validation Errors:', err) // THÊM DÒNG NÀY
          })}
          noValidate
        >
          <FieldGroup className='grid gap-4'>
            {/* Avatar */}
            <div className='flex flex-col items-center gap-3'>
              <Avatar className='h-24 w-24 border'>
                <AvatarImage src={previewAvatar} className='object-cover' />
                <AvatarFallback>{name?.slice(0, 2).toUpperCase() || 'NV'}</AvatarFallback>
              </Avatar>
              <input type='file' ref={fileInputRef} onChange={handleUpload} accept='image/*' className='hidden' />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='gap-2'
              >
                <Upload className='h-4 w-4' /> Thay đổi ảnh
              </Button>
            </div>

            {/* Tên */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='edit-name'>Tên</FieldLabel>
                  <Input id='edit-name' {...field} />
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
                  <FieldLabel htmlFor='edit-email'>Email</FieldLabel>
                  <Input id='edit-email' type='email' {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Switch đổi mật khẩu */}
            <div className='flex items-center space-x-2 py-2'>
              <Switch
                id='change-pw'
                checked={isChangePassword}
                onCheckedChange={(val) => form.setValue('changePassword', val)}
              />
              <FieldLabel htmlFor='change-pw' className='cursor-pointer'>
                Đổi mật khẩu mới?
              </FieldLabel>
            </div>

            {isChangePassword && (
              <div className='grid gap-4'>
                <Controller
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Mật khẩu mới</FieldLabel>
                      <Input type='password' {...field} placeholder='Nhập mật khẩu mới' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='confirmPassword'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Xác nhận mật khẩu</FieldLabel>
                      <Input type='password' {...field} placeholder='Nhập lại mật khẩu mới' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            )}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type='submit' form='edit-form' disabled={isLoadingSubmit} className='w-full sm:w-auto'>
            {isLoadingSubmit ? <Spinner data-icon='inline-start' /> : null}
            {isLoadingSubmit ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
