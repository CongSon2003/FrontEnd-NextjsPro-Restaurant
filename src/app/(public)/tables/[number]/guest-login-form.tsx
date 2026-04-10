'use client'
import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { handleErrorApi } from '@/lib/utils'
import { useQuestLoginMutation } from '@/queries/useguest'
import { GuestLoginBody, GuestLoginBodyType } from '@/validationsSchema/guest.shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function GuestLoginForm() {
  const loginMutation = useQuestLoginMutation()
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const { setRole } = useAppContext()
  const tableNumber = Number(params.number)
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      tableNumber: 0,
      token: ''
    }
  })
  const onSubmit = async (values: GuestLoginBodyType) => {
    if (loginMutation.isPending) return
    let payload: GuestLoginBodyType = values
    console.log(values)
    try {
      payload = {
        ...values,
        tableNumber,
        token
      }
      console.log(payload)
      const result = await loginMutation.mutateAsync(payload)
      setRole(result.payload.data.guest.role)
      console.log(result)
      toast.success('Dang nhap thanh cong')
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
    console.log(values)
  }

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [router, token])
  return (
    <Card className='max-w-sm mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <form id='guest-login-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='space-y-2 grid gap-4'>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='grid gap-2'>
                  {' '}
                  <FieldLabel htmlFor='guest-login-form-title'>Tên khách hàng</FieldLabel>
                  <Input
                    {...field}
                    id='guest-login-form-title'
                    aria-invalid={fieldState.invalid}
                    placeholder='Vui lòng nhập tên khách hàng...'
                    autoComplete='off'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button type='submit' className='w-full'>
              Đăng nhập
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
