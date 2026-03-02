import React from 'react'
import NavLinks from './nav-links'
import DropdownAvatar from './dropdown-avartar'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import MobileNavLinks from './mobile-nav-links'

export default function LayoutMangage({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-muted/40'>
      <NavLinks />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14 '>
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <MobileNavLinks />
          <div className='ml-auto'>
            <DropdownAvatar />
          </div>
          <div className=''>
            <div className='flex justify-end'>
              <DarkModeToggle />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
