'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker = ({ label, value, onChange, className = '', placeholder = 'Select date' }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentViewDate(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewDate(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    if (onChange) onChange(newDate);
    setIsOpen(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDate?.getDate() === d && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
    const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
    
    days.push(
      <button
        key={d}
        type="button"
        onClick={(e) => { e.stopPropagation(); handleDateSelect(d); }}
        className={`w-8 h-8 flex items-center justify-center font-bold text-sm neo-border cursor-pointer transition-all
          ${isSelected 
            ? 'bg-[var(--color-neo-primary)] text-white shadow-[2px_2px_0px_0px_var(--color-neo-text)] -translate-y-0.5' 
            : isToday 
              ? 'bg-[var(--color-neo-secondary)] text-neo-text' 
              : 'bg-white hover:bg-[var(--color-neo-accent)] text-neo-text'
          }
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block font-bold mb-2 text-neo-text">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-neo-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neo-accent)] focus:-translate-y-1 focus:shadow-[6px_6px_0px_0px_var(--color-neo-text)] transition-all text-left font-bold cursor-pointer"
      >
        <span className={selectedDate ? 'text-neo-text' : 'text-gray-500 font-normal'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 bg-white neo-border p-4 shadow-[8px_8px_0px_0px_var(--color-neo-text)] min-w-[300px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-[var(--color-neo-secondary)] neo-border cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="font-black text-lg">
              {MONTHS[month]} {year}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-[var(--color-neo-secondary)] neo-border cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="w-8 h-8 flex items-center justify-center font-bold text-xs text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
          
          {/* Footer controls */}
          <div className="mt-4 pt-3 border-t-2 border-neo-text flex justify-between">
             <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setCurrentViewDate(new Date()); }}
                className="text-xs font-bold underline hover:text-[var(--color-neo-primary)] cursor-pointer"
             >
                Go to Today
             </button>
             <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setSelectedDate(undefined); if(onChange) onChange(undefined as any); setIsOpen(false); }}
                className="text-xs font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
             >
                Clear
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
