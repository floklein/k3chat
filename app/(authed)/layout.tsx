import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden relative">
        <SidebarTrigger className="absolute top-3 left-3" variant="secondary" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
