import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { getSession } from '@/lib/session';
import { SidebarProvider } from '@/contexts/SidebarContext';

export const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getSession();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden w-full relative">
          <Header user={user} />
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
