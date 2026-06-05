'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AssetDetailClientProps {
  asset: any;
}

export default function AssetDetailClient({ asset }: AssetDetailClientProps) {
  // Depreciation Math
  const depreciationDetails = useMemo(() => {
    const purchaseDate = new Date(asset.purchaseDate);
    const now = new Date();
    
    // Calculate difference in months
    let ageInMonths = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth());
    if (ageInMonths < 0) ageInMonths = 0; // Guard against future dates

    const usefulLifeMonths = asset.item.usefulLifeMonths || 60;
    const price = asset.price || 0;
    const salvageValue = asset.salvageValue || 0;

    const depreciableAmount = price - salvageValue;
    const monthlyDepreciation = depreciableAmount / usefulLifeMonths;
    
    // Bound the age to max useful life
    const effectiveAge = Math.min(ageInMonths, usefulLifeMonths);
    const accumulatedDepreciation = monthlyDepreciation * effectiveAge;
    
    let currentBookValue = price - accumulatedDepreciation;
    
    // Safety bound
    if (currentBookValue < salvageValue) currentBookValue = salvageValue;

    const remainingLifeMonths = usefulLifeMonths - effectiveAge;
    const lifePercentage = Math.max(0, Math.min(100, 100 - (effectiveAge / usefulLifeMonths) * 100));

    return {
      ageInMonths: effectiveAge,
      usefulLifeMonths,
      monthlyDepreciation,
      accumulatedDepreciation,
      currentBookValue,
      remainingLifeMonths,
      lifePercentage
    };
  }, [asset]);

  const activeRoom = asset.inventoryRooms?.[0]?.room;
  const buildingName = activeRoom?.building?.name || 'Unassigned';
  const roomName = activeRoom?.name || 'No Room';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-[var(--color-neo-background)] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mb-8"
        >
          <div className="inline-block px-4 py-1 bg-black text-white font-bold neo-border rotate-[-2deg] mb-2 shadow-[4px_4px_0px_0px_var(--color-neo-accent)]">
            PUBLIC ASSET RECORD
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-neo-text">
            {asset.item.name}
          </h1>
          <p className="font-bold text-neo-text opacity-70">
            ID: {asset.id.split('-')[0].toUpperCase()}
          </p>
        </motion.div>

        {/* General Info Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white neo-border neo-shadow p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-neo-primary)] rounded-bl-full opacity-20 -z-0"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Asset Specs
            </h2>
            <div className={`px-3 py-1 font-bold border-2 border-black ${asset.status === 'GOOD' ? 'bg-green-400' : asset.status === 'DAMAGED' ? 'bg-red-400' : 'bg-yellow-400'}`}>
              {asset.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <p className="text-sm font-bold opacity-60 uppercase">Category</p>
              <p className="text-lg font-bold">{asset.item.itemType?.name || 'General'}</p>
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase">Brand/Merk</p>
              <p className="text-lg font-bold">{asset.merk || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase">Barcode</p>
              <p className="text-lg font-mono font-bold bg-black text-white px-2 py-0.5 inline-block mt-1">{asset.barcode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase">Quantity</p>
              <p className="text-lg font-bold">{asset.quantity} {asset.item.unit}</p>
            </div>
            {asset.specification && (
              <div className="col-span-2">
                <p className="text-sm font-bold opacity-60 uppercase">Specification</p>
                <p className="text-base font-medium mt-1">{asset.specification}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--color-neo-secondary)] neo-border neo-shadow p-6"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Current Location
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white p-3 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
              <p className="text-sm font-bold opacity-60 uppercase">Building</p>
              <p className="text-xl font-black">{buildingName}</p>
            </div>
            <div className="flex-1 bg-white p-3 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
              <p className="text-sm font-bold opacity-60 uppercase">Room</p>
              <p className="text-xl font-black">{roomName}</p>
            </div>
          </div>
        </motion.div>

        {/* Financial & Depreciation Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white neo-border neo-shadow p-6"
        >
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-3 border-black flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Financial & Depreciation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold opacity-60 uppercase">Purchase Price</p>
                <p className="text-2xl font-black text-green-600">{formatCurrency(asset.price)}</p>
              </div>
              <div>
                <p className="text-sm font-bold opacity-60 uppercase">Purchase Date</p>
                <p className="text-lg font-bold">{formatDate(asset.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-sm font-bold opacity-60 uppercase">Salvage Value</p>
                <p className="text-lg font-bold">{formatCurrency(asset.salvageValue)}</p>
              </div>
            </div>

            <div className="bg-[var(--color-neo-accent)]/10 p-4 border-3 border-[var(--color-neo-accent)] rounded-lg flex flex-col justify-center">
              <p className="text-sm font-bold opacity-80 uppercase text-[var(--color-neo-accent)]">Current Book Value</p>
              <p className="text-3xl font-black mt-1 mb-2">
                {formatCurrency(depreciationDetails.currentBookValue)}
              </p>
              <div className="text-sm font-medium flex justify-between items-center bg-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <span>Depreciated:</span>
                <span className="font-bold text-red-500">-{formatCurrency(depreciationDetails.accumulatedDepreciation)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <p className="text-sm font-bold opacity-60 uppercase">Useful Life Remaining</p>
              <p className="font-black text-xl">{depreciationDetails.remainingLifeMonths} / {depreciationDetails.usefulLifeMonths} Mo</p>
            </div>
            
            {/* Progress Bar Container */}
            <div className="h-8 w-full bg-gray-200 border-3 border-black rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${depreciationDetails.lifePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className={`h-full border-r-3 border-black ${depreciationDetails.lifePercentage > 50 ? 'bg-green-400' : depreciationDetails.lifePercentage > 20 ? 'bg-yellow-400' : 'bg-red-400'}`}
              />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm pointer-events-none mix-blend-difference text-white">
                {Math.round(depreciationDetails.lifePercentage)}% Health
              </div>
            </div>
            
            <p className="text-xs font-bold text-center mt-3 opacity-50 uppercase tracking-widest">
              Straight-Line Depreciation Method
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
