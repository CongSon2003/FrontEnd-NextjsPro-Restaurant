'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { toast } from 'react-toastify'
import { useLoginMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '../ui/spinner'
import { removeTokensFromLocalStorage } from '@/lib/utils'
import { useAppContext } from '../app-provider'

const loginFormSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export default function LoginForm() {
  // state eye open close password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { mutateAsync, isPending } = useLoginMutation()
  const searchParams = useSearchParams()
  const clearTokens = searchParams.get('clearTokens')
  const { setIsAuth } = useAppContext()
  const router = useRouter()
  // TypeScript + Zod + React Hook Form để form có type an toàn tuyệt đối
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const result = await mutateAsync(values)
      if (result.status === 200) {
        setIsAuth(true)
        toast.success('Đăng nhập thành công!')
        router.push('/manage/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Đăng nhập thất bại!')
    }
  }

  useEffect(() => {
    if (clearTokens) {
      setIsAuth(false)
      removeTokensFromLocalStorage()
    }
  }, [clearTokens, setIsAuth])
  return (
    <Form {...form}>
      <form method='POST' className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className='h-10 placeholder:text-base' placeholder='Email' {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <Input
                    className='h-10 placeholder:text-base pr-10 text-base'
                    size={100}
                    placeholder='Password'
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className='absolute right-3 text-muted-foreground cursor-pointer hover:text-foreground'
                  >
                    {isPasswordVisible ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-col gap-4'>
          {isPending === false ? (
            <Button className='w-full ' type='submit'>
              Đăng nhập
            </Button>
          ) : (
            <Button type='button' className='cursor-not-allowed w-full' form='form-change-password'>
              <Spinner data-icon='inline-start' />
              Đang đăng nhập...
            </Button>
          )}
          <div className='w-full border-t relative flex justify-center my-2'>
            <span className='absolute flex bg-white top-[-14px] px-3 font-semibold'>Hoặc</span>
          </div>
          <Button className='w-full cursor-pointer' variant={'outline'}>
            Đăng nhập bằng Google
          </Button>
        </div>
      </form>
    </Form>
  )
}
