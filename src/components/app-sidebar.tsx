import { Link, useLocation } from 'react-router-dom'
import { routes, routeGroups } from '@/lib/routes'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export default function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        {routeGroups.map((group) => {
          const groupRoutes = routes.filter((r) => r.group === group.key)
          return (
            <SidebarGroup key={group.key}>
              {group.label && (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupRoutes.map((route) => (
                    <SidebarMenuItem key={route.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === route.path}
                      >
                        <Link to={route.path}>
                          <route.icon />
                          <span>{route.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {route.badge && (
                        <SidebarMenuBadge className='badge-error rounded-full border text-[9px]'>
                          {route.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
