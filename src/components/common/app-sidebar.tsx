"use client";

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
import {
  SIDEBAR_MENU_LIST,
  type SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { USER_ROLES } from "@/constants/user-roles";
import { signOut } from "@/actions/auth-action";

export default function AppSidebar() {
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-latte/20 p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-latte/20 bg-espresso text-latte shadow-md group-data-[collapsible=icon]:size-8">
            <Coffee className="size-6 group-data-[collapsible=icon]:size-4" />
          </div>

          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-semibold tracking-tight text-white">
              Ankow Coffee
            </span>
            <span className="text-xs font-medium text-latte/70">
              {profile.role === USER_ROLES.ADMIN
                ? "Admin CMS Studio"
                : profile.role === USER_ROLES.KITCHEN
                  ? "Kitchen Display"
                  : ""}
            </span>
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
                        render={<Link href={item.url} />}
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
              onClick={signOut}
              size="lg"
              className="flex h-12 w-full items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
              <Avatar className="h-10 w-10 shrink-0 rounded-lg group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
                <h4 className="truncate font-semibold text-sm text-text-primary">
                  {profile.full_name}
                </h4>
                <p className="text-muted-foreground truncate text-xs capitalize">
                  {profile.role}
                </p>
              </div>

              <LogOut className="size-5 text-text-secondary transition-colors group-hover:text-destructive group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
