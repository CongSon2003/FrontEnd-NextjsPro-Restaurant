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
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from '@/validationsSchema/account.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function EditEmployee({ id, setEmployeeIdEdit, onSubmitSuccess }) {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileAvatar, setFileAvatar] = useState(null)
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '', // Đừng quên email nếu trong schema có
      avatar: '', // Thay undefined bằng ''
      password: '', // Thay undefined bằng ''
      confirmPassword: '', // Thay undefined bằng ''
      changePassword: false
    }
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const ischangePassword = form.watch('changePassword')
  const name = form.watch('name')
  const avatar = form.watch('avatar')
  const previewAvatarFromFile = fileAvatar ? URL.createObjectURL(fileAvatar) : avatar
  console.log(previewAvatarFromFile)
  console.log(ischangePassword)
  const onSubmit = (data: UpdateEmployeeAccountBodyType) => {
    setIsLoadingSubmit(true)
    setTimeout(() => {
      setIsLoadingSubmit(false)
      toast.success('Lưu thông tin thành công')
    }, 1000)
    console.log(data)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileAvatar = e.target.files?.[0]
    console.log(fileAvatar)
    if (!fileAvatar) {
      return
    }
    setFileAvatar(fileAvatar)
    form.setValue('avatar', `http://localhost:3000/${fileAvatar.name}`)
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeIdEdit(undefined)
        }
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto flex flex-col'>
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <form
          id='form-profile'
          className='grid gap-6'
          onSubmit={form.handleSubmit(onSubmit, (error) => {
            console.log(error)
          })}
          noValidate
        >
          <FieldGroup className='grid gap-6'>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Tên</FieldLabel>
                  <Input id='name' type='text' {...field} placeholder='Nhập tên...' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input id='email' type='email' {...field} placeholder='Nhập email...' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='avatar'
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='upload-avatar'>Avatar</FieldLabel>
                    <div className='flex items-center gap-2 justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatarFromFile} alt='@shadcn' className='grayscale' />
                        <AvatarFallback>{name || 'Avatar'}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleUpload}
                        id='upload-avatar'
                        accept='image/*'
                        className='hidden'
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        type='button'
                        className='w-[100px] flex justify-center items-center bg-white h-[100px] rounded  border border-dashed'
                      >
                        <Upload className='h-5 w-5' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />

            <Controller
              name='changePassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='change-password-switch'>Đổi mật khẩu</FieldLabel>
                  <div className='flex items-center space-x-2'>
                    <Switch checked={field.value} id='change-password-switch' onCheckedChange={field.onChange} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                </Field>
              )}
            />

            {ischangePassword && (
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Mật khẩu mới</FieldLabel>
                    <Input type='password' {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}

            {ischangePassword && (
              <Controller
                name='confirmPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='confirmPassword'>Xác nhận mật khẩu mới</FieldLabel>
                    <Input id='confirmPassword' type='password' {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </form>
        <DialogFooter>
          {/* Nút này dù nằm ngoài form vẫn sẽ trigger submit cho form có id tương ứng */}
          {isLoadingSubmit ? (
            <Button type='submit' form='form-profile'>
              <Spinner data-icon='inline-start' />
              Đang Lưu thông tin...
            </Button>
          ) : (
            <Button type='submit' form='form-profile'>
              Lưu thông tin
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
