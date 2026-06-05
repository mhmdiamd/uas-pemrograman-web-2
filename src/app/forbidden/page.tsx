'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center neo-card flex flex-col items-center justify-center py-16 px-8 relative overflow-hidden bg-white">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-neo-text) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Animated Warning Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 relative"
        >
          {/* Giant Hexagon background */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--color-neo-primary)" className="drop-shadow-[8px_8px_0px_var(--color-neo-text)]">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--color-neo-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {/* Padlock Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neo-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-display font-black uppercase mb-4 tracking-tight drop-shadow-[4px_4px_0px_var(--color-neo-secondary)]">
          Access Denied
        </h1>
        
        <p className="text-xl md:text-2xl font-bold mb-8 opacity-80 max-w-lg">
          You don't have the necessary permissions to view this section of the inventory.
        </p>
        
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full md:w-auto"
          onClick={() => router.push('/')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
