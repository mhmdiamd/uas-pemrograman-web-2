'use client';

import { useEffect } from 'react';
import { ErrorHero } from '@/components/ui/ErrorHero';
import { motion } from 'framer-motion';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Internal Server Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text flex items-center justify-center p-4">
      <ErrorHero 
        code="500" 
        title="Server Error" 
        message="Whoops! Something broke on our end. Our gears are jammed."
        actionLabel="Try Again"
        onAction={reset}
      >
        <motion.div
          animate={{ 
            rotate: [0, -15, 15, -10, 10, 0],
            x: [0, -8, 8, -5, 5, 0]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          {/* Broken Gear SVG */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--color-neo-accent)" stroke="var(--color-neo-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[8px_8px_0px_var(--color-neo-text)]">
            <circle cx="12" cy="12" r="3" strokeWidth="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2"></path>
            {/* Crack */}
            <path d="M12 9l-2 3 4 1-2 3" stroke="white" strokeWidth="3"></path>
          </svg>
        </motion.div>
      </ErrorHero>
    </div>
  );
}
