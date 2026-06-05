'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const DatabaseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const BoxIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const RefreshIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>;
const FileTextIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const ChevronDownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: <HomeIcon /> },
    { 
      name: 'Master Data', 
      icon: <DatabaseIcon />,
      submenus: [
        { name: 'Items', href: '/master/items' },
        { name: 'Buildings', href: '/master/buildings' },
        { name: 'Rooms', href: '/master/rooms' },
        { name: 'Types', href: '/master/types' },
      ]
    },
    { name: 'Inventory', href: '/inventory', icon: <BoxIcon /> },
    { name: 'Transactions', href: '/transactions', icon: <RefreshIcon /> },
    { name: 'Reports', href: '/reports', icon: <FileTextIcon /> },
  ];

  const handleSubmenuToggle = (name: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      className="bg-[var(--color-neo-primary)] neo-border border-l-0 border-t-0 border-b-0 h-screen sticky top-0 flex flex-col z-20 overflow-hidden shrink-0"
    >
      {/* Header & Toggle Button */}
      <div className={`p-4 border-b-3 border-neo-text bg-[var(--color-neo-secondary)] flex items-center h-[88px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: 1, display: 'block' }}
              exit={{ opacity: 0, display: 'none' }}
              className="text-xl font-black tracking-tight uppercase text-neo-text whitespace-nowrap"
            >
              Inventory<br/>System
            </motion.h1>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 neo-border bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-neo-text)] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-4 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'p-3' : 'p-4'}`}>
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.submenus ? (
              <div 
                onClick={() => handleSubmenuToggle(item.name)}
                className={`cursor-pointer flex items-center justify-between font-bold text-lg neo-border bg-white text-neo-text shadow-[4px_4px_0px_0px_var(--color-neo-text)] hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[5px_5px_0px_0px_var(--color-neo-text)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-neo-text)] transition-all ${isCollapsed ? 'p-2 justify-center' : 'px-4 py-3'}`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className="shrink-0">{item.icon}</div>
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </div>
                {!isCollapsed && (
                  <motion.div animate={{ rotate: openSubmenu === item.name ? 180 : 0 }}>
                    <ChevronDownIcon />
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`cursor-pointer flex items-center font-bold text-lg neo-border bg-white text-neo-text shadow-[4px_4px_0px_0px_var(--color-neo-text)] hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[5px_5px_0px_0px_var(--color-neo-text)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-neo-text)] transition-all ${isCollapsed ? 'p-2 justify-center' : 'px-4 py-3 gap-3'}`}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            )}

            {/* Submenus rendering */}
            <AnimatePresence>
              {item.submenus && openSubmenu === item.name && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2 ml-4 border-l-3 border-neo-text pl-4 space-y-2"
                >
                  {item.submenus.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-3 py-2 font-bold bg-white/50 hover:bg-white neo-border transition-colors whitespace-nowrap"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-3 border-neo-text bg-white">
        {!isCollapsed ? (
          <div className="text-sm font-bold text-neo-text text-center whitespace-nowrap">
            © 2026 Yayasan
          </div>
        ) : (
          <div className="text-sm font-bold text-neo-text text-center">
            ©
          </div>
        )}
      </div>
    </motion.aside>
  );
};
