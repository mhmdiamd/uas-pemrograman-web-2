'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorHero } from '@/components/ui/ErrorHero';
import { motion } from 'framer-motion';

export default function Forbidden() {
  return (
    <MainLayout>
      <ErrorHero 
        code="403" 
        title="Access Denied" 
        message="Hold it right there! You don't have the right permissions to enter this area."
      >
        <motion.div
          animate={{ 
            rotate: [0, -20, 20, -20, 20, 0],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          {/* Padlock SVG */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--color-neo-primary)" stroke="var(--color-neo-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[8px_8px_0px_var(--color-neo-text)]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="3"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="4"></path>
            {/* Keyhole */}
            <circle cx="12" cy="15" r="1.5" fill="var(--color-neo-text)" stroke="none"></circle>
            <path d="M11 15.5h2v3h-2z" fill="var(--color-neo-text)" stroke="none"></path>
          </svg>
        </motion.div>
      </ErrorHero>
    </MainLayout>
  );
}
