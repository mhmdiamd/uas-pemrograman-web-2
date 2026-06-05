'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorHero } from '@/components/ui/ErrorHero';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <MainLayout>
      <ErrorHero 
        code="404" 
        title="Page Not Found" 
        message="Oops! We looked everywhere, but we couldn't find the page you were looking for."
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Giant Magnifying Glass SVG */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--color-neo-secondary)" stroke="var(--color-neo-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[8px_8px_0px_var(--color-neo-text)]">
            <circle cx="11" cy="11" r="8" strokeWidth="3"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="5"></line>
          </svg>
        </motion.div>
      </ErrorHero>
    </MainLayout>
  );
}
