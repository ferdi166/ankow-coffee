import AppSidebar from "@/components/common/app-sidebar";
import DashboardBreadcrumb from "@/components/common/dashboard-breadcumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 bg-latte-light shadow-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="cursor-pointer" />
            <Separator orientation="vertical" className="mr-2" />
            <DashboardBreadcrumb />
          </div>
        </header>
        <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
