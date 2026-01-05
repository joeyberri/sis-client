import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIS Dashboard',
  description: 'School Information System Dashboard'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <KBar>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </KBar>
      </SidebarInset>
    </SidebarProvider>
  );
}
