import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset>
        <Header />

        <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-100 via-white to-orange-50 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}