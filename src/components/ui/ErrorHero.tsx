'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

interface ErrorHeroProps {
  code: string;
  title: string;
  message: string;
  children: React.ReactNode; // The animated SVG
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorHero = ({ code, title, message, children, actionLabel = 'Go Home', onAction }: ErrorHeroProps) => {
  const router = useRouter();

  const handleAction = onAction || (() => router.push('/'));

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white neo-border neo-shadow p-8 max-w-2xl w-full text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Background decorative diagonal stripes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)" }} />
        
        <div className="bg-[var(--color-neo-primary)] text-neo-text font-black text-6xl px-6 py-3 neo-border rotate-[-3deg] shadow-[6px_6px_0px_0px_var(--color-neo-text)] mt-4 z-10">
          {code}
        </div>

        <div className="my-10 z-10">
          {children}
        </div>

        <h1 className="text-4xl font-black z-10">{title}</h1>
        <p className="text-xl font-bold max-w-md z-10">{message}</p>

        <Button onClick={handleAction} variant="secondary" className="mt-4 text-lg px-8 py-3 z-10">
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};
