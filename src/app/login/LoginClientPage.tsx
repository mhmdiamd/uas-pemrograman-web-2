'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login } from '@/actions/auth';
import { motion } from 'framer-motion';

export const LoginClientPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neo-background)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)" }} />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--color-neo-primary)] rounded-full blur-3xl opacity-20 z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--color-neo-accent)] rounded-full blur-3xl opacity-20 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter text-neo-text">
            Inventory<br/>System
          </h1>
          <p className="mt-2 font-bold inline-block px-3 py-1 bg-white neo-border neo-shadow-sm rotate-[-2deg]">
            Authorized Access Only
          </p>
        </div>

        <Card className="bg-white">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-3 border-neo-text">Log In</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border-3 border-neo-text font-bold text-red-800 flex items-start gap-2">
              <svg className="shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold mb-2">Email Address</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="admin@example.com" 
                required 
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Password</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
              />
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Secure Log In'}
            </Button>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-sm font-bold opacity-60">
          Created by Muhamad Ilham Darmawan
        </div>
      </motion.div>
    </div>
  );
}
