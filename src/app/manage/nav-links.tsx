'use client'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Package2, Settings } from 'lucide-react'
import Link from 'next/link'
import menuItems from './menu-item'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function NavLinks() {
  const pathname = usePathname()
  console.log('pathname', pathname)
  return (
    <TooltipProvider>
      <aside className='fixed inset-y-0 hidden left-0 z-10 flex-col border-r bg-background w-14 sm:flex justify-between'>
        <nav className='flex items-center flex-col gap-4 py-4'>
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
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Link
                    href={item.href}
                    className={cn(
                      `flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`,
                      {
                        'bg-accent text-accent-foreground': isActive,
                        'text-muted-foreground': !isActive
                      }
                    )}
                  >
                    <item.Icon className='h-5 w-5' />
                    <span className='sr-only'>{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
        <nav className='flex flex-col items-center py-4'>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={`/manage/setting`}
                className={cn(
                  `flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`,
                  {
                    'bg-accent text-accent-foreground': pathname === '/manage/setting',
                    'text-muted-foreground': pathname !== '/manage/setting'
                  }
                )}
              >
                <Settings className='h-5 w-5' />
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>
              <p>Cài đặt </p>
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  )
}
