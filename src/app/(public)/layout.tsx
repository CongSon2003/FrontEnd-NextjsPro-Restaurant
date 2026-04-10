import React from 'react'
import Link from 'next/link'
import NavItem from '@/components/public/NavItem'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Menu, Package2, Search } from 'lucide-react'
import { DarkModeToggle } from '@/components/DarkModeToggle'

export default async function LayoutPublic({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen w-full flex-col relative'>
      <header className='z-998 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <Link href='#' className='flex items-center gap-2 text-lg font-semibold md:text-base'>
            <div className='text-3xl'>🍽️</div>
            <span className='sr-only'>Nhà Hàng Phố</span>
          </Link>
          <NavItem className='transition-colors hover:text-foreground shrink-0' />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <button className='border rounded-md p-2 md:hidden text-sm font-medium transition-all dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:bg-accent shadow-xs bg-background hover:text-accent-foreground cursor-pointer'>
              <Menu className='h-5 w-5' />
            </button>
          </SheetTrigger>
          <SheetContent side='left'>
            <nav className='grid gap-6 text-lg font-medium'>
              <Link href='#' className='flex items-center gap-2 text-lg font-semibold'>
                <Package2 className='h-6 w-6' />
                <span className='sr-only'>Nhà Hàng Phố</span>
              </Link>
              <NavItem className='transition-colors hover:text-foreground shrink-0' />
            </nav>
          </SheetContent>
        </Sheet>
        <div className='flex items-center ml-auto gap-4'>
          <div>
            <InputGroup>
              <InputGroupInput id='inline-start-input' placeholder='Tìm kiếm...' />
              <InputGroupAddon align='inline-start'>
                <Search className='text-muted-foreground' />
              </InputGroupAddon>
            </InputGroup>
          </div>
          {/* <DropdownAvatar /> */}
          <DarkModeToggle />
        </div>
      </header>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>{children}</main>
    </div>
  )
}
