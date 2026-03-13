import { Outlet, useLocation, Link } from 'react-router-dom'
import { ChevronsRightIcon, HomeIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import { ThemeSwitcher } from '@/components/kibo-ui/theme-switcher'
import { useAuth, useAuthIdentity } from '@/lib/auth/auth'
import AppSidebar from '@/components/app-sidebar'
import { routes } from '@/lib/routes'

export default function AppLayout() {
  const { pathname } = useLocation()
  const currentRoute = routes.find((r) => r.path === pathname)
  const { signOut } = useAuth()
  const identity = useAuthIdentity()

  return (
    <SidebarProvider className='h-screen overflow-hidden'>
      <AppSidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Topbar */}
        <header className='flex items-center justify-between border-b border-border bg-background px-3 sm:px-6 lg:px-10 h-14 sm:h-16 flex-shrink-0'>
          <div className='flex items-center gap-2 sm:gap-4 min-w-0'>
            <SidebarTrigger className='flex-shrink-0' />
            <Separator orientation='vertical' className='h-4' />

            {/* Breadcrumb — parent items hidden on mobile, only current page shown */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden sm:inline-flex'>
                  <BreadcrumbLink asChild>
                    <Link to='/'>
                      <HomeIcon className='size-4' />
                      <span className='sr-only'>Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {currentRoute?.breadcrumbParent && (
                  <>
                    <BreadcrumbSeparator className='hidden sm:inline-flex'>
                      <ChevronsRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem className='hidden sm:inline-flex'>
                      <BreadcrumbLink>{currentRoute.breadcrumbParent}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}

                {currentRoute && currentRoute.path !== '/' && (
                  <>
                    <BreadcrumbSeparator className='hidden sm:inline-flex'>
                      <ChevronsRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentRoute.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
            <ThemeSwitcher defaultValue='system' />
            <Separator orientation='vertical' className='h-4' />
            <ProfileDropdown
              name={identity.name}
              email={identity.email}
              avatarUrl={identity.avatarUrl}
              avatarFallback={identity.avatarFallback}
              onSignOut={signOut}
              trigger={
                <button className='rounded-md'>
                  <Avatar className='size-8 rounded-md'>
                    <AvatarImage src={identity.avatarUrl} />
                    <AvatarFallback>{identity.avatarFallback}</AvatarFallback>
                  </Avatar>
                </button>
              }
            />
          </div>
        </header>

        {/* Page content */}
        <div className='flex flex-1 overflow-hidden'>
          <main className='flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-10 flex flex-col gap-8'>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
