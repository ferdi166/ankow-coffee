import { Coffee, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Logo from "./logo";
import {
  SIDEBAR_MENU_LIST,
  type SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { useAuthStore } from "@/stores/auth-store";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { pathname } = useLocation();
  const profile = useAuthStore((state) => state.profile);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b group-data-[collapsible=icon]:ml-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 p-2 items-center justify-center rounded-full bg-primary/10 shrink-0">
            <Logo className="text-primary" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-latte/20 bg-espresso text-latte shadow-md">
                <Coffee className="size-5" />
              </div>

              <span className="text-2xl font-bold tracking-tight text-espresso">
                Ankow Coffee
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2 justify-center group-data-[collapsible=icon]:items-center">
              {SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map(
                (item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link to={item.url} />}
                        tooltip={item.title}
                        className={cn(
                          "h-12 w-full flex items-center gap-3 px-4 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
                          {
                            "bg-primary/10 text-primary font-semibold hover:bg-primary/10 hover:text-primary":
                              isActive,
                            "text-text-secondary font-medium": !isActive,
                          },
                        )}>
                        {item.icon && (
                          <item.icon
                            className="group-data-[collapsible=icon]:size-5 shrink-0"
                            strokeWidth={1.25}
                          />
                        )}
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                },
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full flex items-center gap-3 p-2 h-12">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
                <h4 className="truncate font-semibold text-sm text-text-primary">
                  Admin
                </h4>
                <p className="text-muted-foreground truncate text-xs">
                  Administrator
                </p>
              </div>
              <LogOut className="size-5 text-text-secondary group-hover:text-destructive transition-colors" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
