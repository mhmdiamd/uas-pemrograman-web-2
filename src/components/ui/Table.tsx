import React from 'react';

export const Table = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className="w-full overflow-x-auto neo-border neo-shadow bg-white">
    <table className={`w-full text-left border-collapse ${className}`}>
      {children}
    </table>
  </div>
);

export const Thead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-[var(--color-neo-secondary)] border-b-3 border-neo-text">
    {children}
  </thead>
);

export const Tbody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

export const Tr = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <tr className={`border-b-3 border-neo-text last:border-b-0 hover:bg-gray-50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const Th = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-6 py-4 font-bold border-r-3 border-neo-text last:border-r-0 ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <td className={`px-6 py-4 border-r-3 border-neo-text last:border-r-0 ${className}`}>
    {children}
  </td>
);
