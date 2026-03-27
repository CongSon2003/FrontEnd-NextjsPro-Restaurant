'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAccountMeQuery, useUpdateMeMutation } from '@/queries/useAccount'
import { useMediaMutation } from '@/queries/useMedia'
import { UpdateMeBody, UpdateMeBodyType } from '@/validationsSchema/account.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
export default function UpdateProfileForm() {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [fileAvatar, setFileAvatar] = useState<File | null>(null)
  console.log('🚀 ~ UpdateProfileForm ~ fileAvatar:', fileAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data, isSuccess, refetch } = useAccountMeQuery()
  const updateMeMutation = useUpdateMeMutation()
  const { mutateAsync } = useMediaMutation()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    }
  })

  const onSubmit = (data: UpdateMeBodyType) => {
    setIsLoadingSubmit(true)

    // Dùng setTimeout như bạn muốn hoặc bỏ đi cũng được
    setTimeout(async () => {
      try {
        // MẶC ĐỊNH: Lấy avatar hiện tại từ form (có thể là URL cũ từ DB)
        let avatarUrl = data.avatar

        // Nếu có file mới được chọn, tiến hành upload để lấy URL mới
        if (fileAvatar) {
          const formData = new FormData()
          formData.append('file', fileAvatar)
          const res = await mutateAsync(formData)
          avatarUrl = res.payload.data // URL trả về từ server upload
        }
        const payload: UpdateMeBodyType = {
          ...data
        }

        if (avatarUrl !== null && avatarUrl !== '') {
          payload.avatar = avatarUrl
        } else {
          delete payload.avatar
        }
        // Gửi dữ liệu cập nhật
        // Nếu avatarUrl vẫn là null/undefined từ DB, hãy đảm bảo API chấp nhận nó
        await updateMeMutation.mutateAsync(payload)

        refetch()
        toast.success('Lưu thông tin thành công')
      } catch (error) {
        console.error(error)
        toast.error('Lưu thông tin không thành công')
      } finally {
        setIsLoadingSubmit(false)
      }
    }, 500)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileAvatar = e.target.files?.[0]
    if (!fileAvatar) return
    setFileAvatar(fileAvatar)
    // fake avatar để thông qua zod khi submit
    form.setValue('avatar', `http://localhost:3000/${fileAvatar.name}`)
  }

  const reset = () => {
    form.reset()
    setFileAvatar(null)
  }

  // Nếu không có upload từ người dùng thì previewAvatar mặc định là nấy từ db
  const previewAvatar = fileAvatar ? URL.createObjectURL(fileAvatar) : form.watch('avatar')
  console.log('🚀 ~ UpdateProfileForm ~ previewAvatar:', previewAvatar)

  // set default form
  useEffect(() => {
    if (isSuccess && data) {
      form.reset({
        name: data.payload.data.name,
        avatar: data.payload.data.avatar ?? ''
      })
    }
  }, [data, isSuccess, form])

  return (
    <div>
      <Card className='grid auto-rows-max items-start gap-4 md:gap-8'>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id='form-profile'
            className='grid gap-6'
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors)
            })}
            noValidate
          >
            <FieldGroup className='grid gap-6'>
              <Controller
                name='avatar'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tên</FieldLabel>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>
                          {previewAvatar === '' ? 'null' : <Spinner className='size-10' />}
                        </AvatarFallback>
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
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tên</FieldLabel>
                    <Input type='text' {...field} placeholder='Nhập tên...' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className='ml-auto flex gap-4 items-center'>
              <Button variant='outline' type='button' onClick={reset}>
                Hủy
              </Button>

              {isLoadingSubmit ? (
                <Button disabled>
                  <Spinner data-icon='inline-start' />
                  Đang Lưu...
                </Button>
              ) : (
                <Button type='submit'>Lưu thông tin</Button>
              )}
            </div>
          </form>
        </CardContent>
        {/* <CardFooter className='ml-auto flex gap-3'>
          <Button variant='outline'>Hủy</Button>
          <Button>Lưu thông tin</Button>
        </CardFooter> */}
      </Card>
    </div>
  )
}
