'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { Popover } from '../ui/Popover';
import { Badge } from '../ui/Badge';

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export const Header = () => {
  const pathname = usePathname();
  
  // Create a simple breadcrumb from the pathname
  const paths = pathname === '/' ? ['Dashboard'] : pathname.split('/').filter(p => p);
  
  return (
    <header className="bg-white border-b-3 border-t-3 border-neo-text px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm h-[91px]">
      <div className="flex items-center gap-2">
        {paths.map((p, index) => (
          <React.Fragment key={index}>
            <span className="text-2xl font-black capitalize text-neo-text">
              {p.replace('-', ' ')}
            </span>
            {index < paths.length - 1 && <span className="text-2xl font-black mx-1 opacity-50">/</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center space-x-8">
        
        {/* Notifications Popover */}
        <Popover 
          position="bottom-right" 
          trigger={
            <div className="relative cursor-pointer hover:-translate-y-1 transition-transform p-1">
              <BellIcon />
              {/* Notification Dot */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-neo-accent)] rounded-full border-3 border-neo-text"></span>
            </div>
          }
        >
          <div className="w-80 font-bold p-2 text-left">
            <h3 className="text-xl border-b-3 border-neo-text pb-2 mb-4 bg-[var(--color-neo-secondary)] inline-block px-2">Notifications</h3>
            <div className="space-y-4">
              <div className="bg-white p-3 neo-border neo-shadow-sm flex flex-col gap-2 relative">
                <div className="absolute top-3 right-3 w-3 h-3 bg-[var(--color-neo-accent)] rounded-full border-2 border-neo-text"></div>
                <Badge variant="warning" className="w-fit">Low Stock</Badge>
                <p className="text-sm font-bold text-neo-text/80">Printer Ink (Black) is running critically low. Only 2 units remain in Storage A.</p>
              </div>
              <div className="bg-white p-3 neo-border neo-shadow-sm flex flex-col gap-2">
                <Badge variant="info" className="w-fit">System</Badge>
                <p className="text-sm font-bold text-neo-text/80">Nightly database backup completed successfully.</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-4">View All Alerts</Button>
          </div>
        </Popover>

        {/* User Profile Popover */}
        <Popover 
          position="bottom-right" 
          trigger={
            <div className="cursor-pointer w-12 h-12 bg-[var(--color-neo-primary)] neo-border flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_var(--color-neo-text)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-neo-text)] active:translate-y-0 active:shadow-none">
              AD
            </div>
          }
        >
          <div className="w-64 font-bold flex flex-col p-2 text-left">
            <div className="flex items-center gap-3 border-b-3 border-neo-text pb-4 mb-2">
               <div className="w-12 h-12 bg-[var(--color-neo-primary)] neo-border flex items-center justify-center font-black text-xl shrink-0 shadow-[2px_2px_0px_0px_var(--color-neo-text)]">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-lg truncate">Admin User</p>
                <p className="text-sm opacity-60 truncate">admin@system.local</p>
              </div>
            </div>
            <button className="text-left px-4 py-2 hover:bg-[var(--color-neo-secondary)] transition-colors neo-border border-transparent hover:border-neo-text mt-1">Profile Settings</button>
            <button className="text-left px-4 py-2 hover:bg-[var(--color-neo-secondary)] transition-colors neo-border border-transparent hover:border-neo-text mt-1">System Logs</button>
            <div className="border-t-3 border-neo-text my-2"></div>
            <button className="text-left px-4 py-2 bg-[var(--color-neo-accent)] hover:opacity-90 transition-opacity neo-border mt-1 text-neo-text shadow-[2px_2px_0px_0px_var(--color-neo-text)] hover:shadow-[4px_4px_0px_0px_var(--color-neo-text)] hover:-translate-y-0.5">Log Out</button>
          </div>
        </Popover>

      </div>
    </header>
  );
};
