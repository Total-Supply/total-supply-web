import { DashboardThemeToggle } from '@/src/components/layout/dashboard-theme-toggle'
import { AppSidebar } from '@/src/components/nav/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/src/components/ui/breadcrumb'
import { Separator } from '@/src/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/src/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-foreground" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <DashboardThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
