'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { login } from '@/actions/auth';
import { motion } from 'framer-motion';

export const LoginClientPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Agreement Modal State
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const agreed = localStorage.getItem('inventory_realm_agreement') === 'true';
    if (!agreed) {
      setIsWelcomeOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('inventory_realm_agreement', 'true');
    setIsWelcomeOpen(false);
  };

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

  if (!isMounted) return null;

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
        className="w-full max-w-md z-10 flex flex-col items-center"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter text-neo-text">
            Inventory<br/>System
          </h1>
          <p className="mt-2 font-bold inline-block px-3 py-1 bg-white neo-border neo-shadow-sm rotate-[-2deg]">
            Authorized Access Only
          </p>
        </div>

        <Card className="bg-white w-full">
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
        
        <div className="mt-8 text-center text-sm font-bold opacity-60 flex flex-col items-center gap-2">
          <span>Created by Muhamad Ilham Darmawan</span>
          <button 
            onClick={() => setIsWelcomeOpen(true)}
            className="underline hover:text-[var(--color-neo-accent)] cursor-pointer transition-colors"
          >
            Review System Specifications & Lore
          </button>
        </div>
      </motion.div>

      <Modal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        title={
          <span className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            Tale of the Inventory Realm
          </span>
        }
        className="bg-[#fdf6e3] font-serif border-4 border-[#8b5a2b] shadow-[8px_8px_0px_0px_#5c3a21] max-w-2xl"
        headerClassName="bg-[#f5e6c4] border-b-4 border-[#8b5a2b] text-[#5c3a21]"
        footer={
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#5c3a21] font-bold">
              <Checkbox 
                checked={hasAgreed} 
                onChange={(e) => setHasAgreed(e.target.checked)} 
                className="border-[#8b5a2b] checked:bg-[#8b5a2b]"
                aria-label="Agreement Checkbox"
              />
              <label className="cursor-pointer select-none" onClick={() => setHasAgreed(!hasAgreed)}>
                I swear the oath to abide by these specifications.
              </label>
            </div>
            <Button 
              variant="primary" 
              onClick={handleAgree} 
              disabled={!hasAgreed}
              className={`whitespace-nowrap w-full sm:w-auto shadow-[4px_4px_0px_0px_#5c3a21] ${hasAgreed ? 'bg-[#8b5a2b] hover:bg-[#5c3a21] border-[#5c3a21] text-[#fdf6e3]' : 'bg-[#e2c792] border-[#8b5a2b] text-[#8b5a2b] cursor-not-allowed'}`}
            >
              Sign the Pact
            </Button>
          </div>
        }
      >
        <div className="space-y-6 text-[#5c3a21]">
          <p className="text-lg leading-relaxed border-b border-[#8b5a2b]/30 pb-4">
            Hear ye, brave traveler! Thou art standing at the gates of the <strong>Inventory System Realm</strong>. A grand construct forged by <em>Muhamad Ilham Darmawan</em> to banish the chaos of manual Excel scrolls and bring order to the kingdom's assets.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-2 text-[#8b5a2b]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 6 7 1-5 5 1.5 7.5L12 18l-6.5 3.5L7 14l-5-5 7-1 3-6z"></path></svg>
              I. The Grand Quest (Tujuan Sistem)
            </h3>
            <ul className="list-disc pl-5 space-y-1 opacity-90">
              <li>Manage inventory records centrally from the high tower.</li>
              <li>Record the arrival and departure of mystical and mundane goods.</li>
              <li>Track the exact location of assets across buildings and rooms.</li>
              <li>Provide wise council through stock and transaction reports.</li>
              <li>Govern the kingdom's budget and expenditure.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-2 text-[#8b5a2b]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              II. Realm Features (Fitur Sistem)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-[#8b5a2b]/10 p-3 border border-[#8b5a2b] border-dashed rounded-sm">
                <strong className="block mb-1">Master Data (Codex)</strong>
                <span className="text-sm">Manage Categories, Items, Buildings, Rooms, and Transaction Types.</span>
              </div>
              <div className="bg-[#8b5a2b]/10 p-3 border border-[#8b5a2b] border-dashed rounded-sm">
                <strong className="block mb-1">Inventory & Transmutation</strong>
                <span className="text-sm">Add/Update stock, perform purchases, distribution, mutations, and write-offs.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-2 text-[#8b5a2b]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              III. The Master Key
            </h3>
            <p className="mb-2 text-sm">To unlock the heavy iron doors, invoke these credentials:</p>
            <div className="font-mono text-sm bg-black text-green-400 p-3 border-2 border-[#8b5a2b] shadow-inner rounded-sm">
              <div className="flex justify-between items-center border-b border-green-800 pb-2 mb-2">
                <span>Email:</span>
                <span className="font-bold">admin@example.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Password:</span>
                <span className="font-bold">password123</span>
              </div>
            </div>
          </div>

          <p className="text-center italic mt-6 font-bold text-[#8b5a2b] border-t border-[#8b5a2b]/30 pt-4">
            "By checking the box below, thou doth agree to respect the code and maintain the harmony of the database."
          </p>
        </div>
      </Modal>
    </div>
  );
}
