'use client';

import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within a Tabs provider");
  return context;
}

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs = ({ defaultValue, className = '', children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className = '', children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`flex flex-wrap gap-2 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className = '', children }: { value: string, className?: string, children: React.ReactNode }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`
        px-6 py-2 font-bold text-lg neo-border transition-all cursor-pointer whitespace-nowrap
        ${isActive 
          ? 'bg-[var(--color-neo-primary)] text-neo-text shadow-[4px_4px_0px_0px_var(--color-neo-text)] -translate-y-1' 
          : 'bg-white text-neo-text hover:bg-[var(--color-neo-secondary)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-neo-text)] active:translate-y-0 active:shadow-none shadow-[2px_2px_0px_0px_var(--color-neo-text)]'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className = '', children }: { value: string, className?: string, children: React.ReactNode }) => {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  
  return (
    <div className={`neo-border bg-white p-6 shadow-[6px_6px_0px_0px_var(--color-neo-text)] ${className}`}>
      {children}
    </div>
  );
};
