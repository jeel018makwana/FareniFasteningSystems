import { Link, useLocation } from "react-router-dom";

import { navigation } from "@/constants/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="bg-black">
      <SidebarHeader className="border-b border-gray-800 bg-black">
        <div className="flex items-center gap-3 px-2 py-2">
                        <img src="/images/logo.png" alt="Fareni Logo" className="w-full max-w-sm object-contain" />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                }
                isActive={location.pathname === item.url}
                tooltip={item.title}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}