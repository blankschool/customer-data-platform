import { Fragment } from 'react'
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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import { ThemeSwitcher } from '@/components/kibo-ui/theme-switcher'
import AppSidebar from '@/components/app-sidebar'
import { routes } from '@/lib/routes'
import { steps } from '@/lib/mock-data'

export default function AppLayout() {
  const { pathname } = useLocation()
  const currentRoute = routes.find((r) => r.path === pathname)

  return (
    <SidebarProvider className='h-screen overflow-hidden'>
      <AppSidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Topbar */}
        <header className='flex items-center justify-between border-b border-border bg-background px-10 h-16 flex-shrink-0'>
          <div className='flex items-center gap-4'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='h-4' />
            {/* Dynamic breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to='/'>
                      <HomeIcon className='size-4' />
                      <span className='sr-only'>Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentRoute?.breadcrumbParent && (
                  <>
                    <BreadcrumbSeparator>
                      <ChevronsRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        {currentRoute.breadcrumbParent}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {currentRoute && currentRoute.path !== '/' && (
                  <>
                    <BreadcrumbSeparator>
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

          <div className='flex items-center gap-3'>
            {/* Step indicator - hidden on small screens */}
            <div className='hidden lg:flex items-center'>
              {steps.map((step, i) => (
                <Fragment key={step.n}>
                  <div
                    className={`flex items-center gap-1.5 text-xs ${
                      step.state === 'done'
                        ? 'text-[hsl(var(--success))]'
                        : step.state === 'active'
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`size-[18px] rounded-full border flex items-center justify-center text-[8px] flex-shrink-0 ${
                        step.state === 'done'
                          ? 'bg-[hsl(var(--success))] border-[hsl(var(--success))] text-white'
                          : 'border-current'
                      }`}
                    >
                      {step.state === 'done' ? '\u2713' : step.n}
                    </div>
                    {step.label}
                  </div>
                  {i < steps.length - 1 && (
                    <div className='w-6 h-px bg-border mx-1' />
                  )}
                </Fragment>
              ))}
            </div>

            <Separator orientation='vertical' className='h-4 mx-0.5' />

            <Button size='sm' className='h-7 text-[11px] px-3 hidden lg:flex'>
              Iniciar diagnóstico →
            </Button>

            <Separator orientation='vertical' className='h-4 mx-0.5' />

            <ThemeSwitcher defaultValue='dark' />

            <Separator orientation='vertical' className='h-4 mx-0.5' />

            <ProfileDropdown
              trigger={
                <Button variant='ghost' size='icon' className='size-9'>
                  <Avatar className='size-8 rounded-md'>
                    <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                    <AvatarFallback>OP</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
          </div>
        </header>

        {/* Page content */}
        <div className='flex flex-1 overflow-hidden'>
          <main className='flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8'>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
