'use client'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useChangePasswordMutation } from '@/queries/useAccount'
import { UpdatePasswordBody, UpdatePasswordBodyType } from '@/validationsSchema/account.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
export default function ChangePasswordForm() {
  const { mutateAsync } = useChangePasswordMutation()
  const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false)
  const form = useForm<UpdatePasswordBodyType>({
    resolver: zodResolver(UpdatePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = (data: UpdatePasswordBodyType) => {
    setIsLoadingChangePassword(true)
    setTimeout(async () => {
      try {
        // mutation
        const resultChangePassword = await mutateAsync(data)

        form.reset()
        setIsLoadingChangePassword(false)
        toast.success(`${resultChangePassword.payload.message || 'Đổi mật khẩu thành công'}`)
      } catch (error) {
        setIsLoadingChangePassword(false)
        console.error(error)
        toast.error('Đổi mật khẩu thất bạn!')
      }
    }, 500)
  }
  return (
    <div>
      <Card className='grid auto-rows-max items-start gap-6'>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <form id='form-change-password' className='grid gap-6' onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup className='grid gap-6'>
              <Controller
                name='oldPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Mật khẩu cũ</FieldLabel>
                    <Input type='password' {...field} autoComplete='current-password' placeholder='Nhập mật khẩu...' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Mật khẩu mới</FieldLabel>
                    <Input type='password' autoComplete='new-password' {...field} placeholder='Nhập Mật khẩu mới...' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='confirmPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nhập lại mật khẩu mới</FieldLabel>
                    <Input
                      type='password'
                      {...field}
                      autoComplete='new-password'
                      placeholder='Nhập Lại Mật khẩu mới ...'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className='flex items-center gap-4 ml-auto'>
              <Button type='button' variant='outline' onClick={() => form.reset()}>
                Reset
              </Button>
              {isLoadingChangePassword ? (
                <Button type='button' form='form-change-password'>
                  <Spinner data-icon='inline-start' />
                  Đang thay đổi...
                </Button>
              ) : (
                <Button type='submit' form='form-change-password'>
                  Lưu thay đổi
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        {/* <CardFooter>
          <Field orientation='horizontal'>
            <Button type='button' variant='outline' onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type='submit' form='form-rhf-demo' onClick={() => onSubmit(form.getValues())}>
              Submit
            </Button>
          </Field>
        </CardFooter> */}
      </Card>
    </div>
  )
}
