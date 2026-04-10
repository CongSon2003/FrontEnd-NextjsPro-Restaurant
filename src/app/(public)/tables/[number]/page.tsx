// app/tables/[number]/page.tsx

import GuestLoginForm from './guest-login-form'

type Props = {
  params: Promise<{ number: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TableNumberPage() {
  return (
    <div>
      <GuestLoginForm />
    </div>
  )
}
