'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Activity,
  BarChart3,
  Bell,
  FolderOpen,
  Globe,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
} from 'lucide-react'
import { authUtils } from '@/lib/apiCalls/authApi'

const navigation = [
  { name: 'Dashboard',    href: '/dashboard', icon: Home },
  { name: 'Projects',     href: '/projects',  icon: FolderOpen },
  { name: 'Alerts',       href: '/alerts',    icon: Bell },
  { name: 'API Checker',  href: '/check',     icon: BarChart3 },
]

const userNavigation = [
  { name: 'Profile',  href: '/profile',  icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function SidebarContent() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await authUtils.logout()
    window.location.href = '/login'
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex h-full flex-col bg-sidebar">

      {/* Brand header */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 border border-white/10 flex-shrink-0">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight leading-none">API Sentinel</p>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Monitoring dashboard</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Main
        </p>
        {navigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150
                ${active
                  ? 'bg-white/10 text-white'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }
              `}
            >
              {/* Active left indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
              )}
              <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-white' : 'text-muted-foreground'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-4 space-y-0.5">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Account
        </p>
        {userNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150
              ${isActive(item.href)
                ? 'bg-white/10 text-white'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }
            `}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.name}
          </Link>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground h-auto rounded-lg"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-sidebar-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed top-3 left-3 z-40 h-9 w-9 p-0 bg-card border border-border hover:bg-accent"
            size="icon"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 border-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}