'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Package2, PanelLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import menuItems from './menu-item'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export default function MobileNavLinks() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='outline' className='sm:hidden'>
          <PanelLeft />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[320px]'>
        {/* Thêm Title và Description với class sr-only để ẩn đi nhưng vẫn thỏa mãn Accessibility */}
        <SheetHeader>
          <SheetTitle className='sr-only'>Menu điều hướng di động</SheetTitle>
          <SheetDescription className='sr-only'>Mô tả menu điều hướng cho các thiết bị di động</SheetDescription>

          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='#'
              className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
            >
              <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
              <span className='sr-only'>Acme Inc</span>
            </Link>

            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn('flex items-center gap-4 px-2.5 hover:text-foreground', {
                    'text-foreground': isActive,
                    'text-muted-foreground': !isActive
                  })}
                >
                  <item.Icon className='h-5 w-5' />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
