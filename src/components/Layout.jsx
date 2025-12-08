'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Logo, Logomark } from '@/components/Logo'
import { MobileNavigation } from '@/components/MobileNavigation'
import { Navigation } from '@/components/Navigation'
import { Search } from '@/components/Search'
import { ThemeSelector } from '@/components/ThemeSelector'

function Header() {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 flex flex-none flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8 dark:shadow-none',
        isScrolled
          ? 'dark:bg-slate-900/95 dark:backdrop-blur-sm dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent',
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative flex grow basis-0 items-center">
        <a href="https://tabsy.artisanscloud.com.my/sales" target="_blank" rel="noopener noreferrer" aria-label="TabsyPOS Sales" className="flex gap-3">
          <Logomark className="h-9 w-9 lg:hidden" />
          <Logo className="hidden h-9 w-auto fill-slate-700 lg:block dark:fill-sky-100" />
        </a>
      </div>
      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div>
      <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:grow">
        <ThemeSelector className="relative z-10" />
      </div>
    </header>
  )
}

export function Layout({ children }) {
  return (
    <div className="flex w-full flex-col">
      <Header />
      <div className="relative mx-auto flex w-full max-w-8xl flex-auto justify-between sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:w-64 xl:w-72">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="absolute top-16 right-0 bottom-0 hidden h-12 w-px bg-linear-to-t from-slate-800 dark:block" />
          <div className="absolute top-28 right-0 bottom-0 hidden w-px bg-slate-800 dark:block" />
          <div className="sticky top-19 -ml-0.5 h-[calc(100vh-4.75rem)] overflow-x-hidden overflow-y-auto py-16 pr-8 pl-0.5 xl:pr-16">
            <Navigation />
          </div>
        </div>
        <div className="min-w-0 max-w-3xl flex-auto px-4 py-16 lg:ml-0 lg:mr-auto lg:px-8 lg:pt-0">
          {children}
        </div>
      </div>
      <footer className="p-3 md:p-6 mx-auto w-full rounded-md bg-card">
        <div className="flex items-center justify-center gap-2 text-center text-gray-600 text-lg">
          A free AI-powered POS from{' '}
          <span className="font-semibold">
            <a href="https://artisanscloud.com/" target="_blank" rel="noopener noreferrer">
              Artisans.
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
