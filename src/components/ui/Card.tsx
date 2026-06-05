import React from 'react';

// 1. Base Card
export const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white neo-border neo-shadow p-6 ${className}`} {...props}>
    {children}
  </div>
);

// 2. Interactive Card (Clickable with hover lift)
export const InteractiveCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`bg-white neo-border neo-shadow p-6 cursor-pointer hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_var(--color-neo-text)] transition-all duration-200 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// 3. Image Card (For profiles, products, or posts)
export const ImageCard = ({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  className = '', 
  children 
}: { 
  imageSrc: string; 
  imageAlt: string; 
  title: string; 
  description?: string; 
  className?: string; 
  children?: React.ReactNode 
}) => (
  <div className={`bg-white neo-border neo-shadow flex flex-col overflow-hidden ${className}`}>
    <div className="border-b-3 border-neo-text h-48 overflow-hidden bg-[var(--color-neo-secondary)] flex items-center justify-center relative group">
      {/* Fallback to a placeholder pattern if image fails or isn't loaded properly in demo, but try rendering image first */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)" }} />
      <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-black mb-2">{title}</h3>
      {description && <p className="text-neo-text/80 font-medium mb-4 flex-grow">{description}</p>}
      {children}
    </div>
  </div>
);

// 4. Detail Card (Optimized for Key-Value data like Inventory Specs)
export const DetailCard = ({ 
  title, 
  details, 
  className = '' 
}: { 
  title: string; 
  details: { label: string; value: React.ReactNode }[]; 
  className?: string; 
}) => (
  <Card className={className}>
    <h3 className="text-xl font-black mb-4 border-b-3 border-neo-text pb-2 bg-[var(--color-neo-primary)] inline-block px-2">{title}</h3>
    <div className="space-y-3 mt-2">
      {details.map((detail, idx) => (
        <div key={idx} className="flex justify-between items-start border-b-2 border-dashed border-gray-200 last:border-0 pb-2 last:pb-0">
          <span className="font-bold text-neo-text/60">{detail.label}</span>
          <span className="font-black text-right">{detail.value}</span>
        </div>
      ))}
    </div>
  </Card>
);

// 5. Article Card (Optimized for long text, announcements, or logs)
export const ArticleCard = ({
  badge,
  title,
  content,
  date,
  className = ''
}: {
  badge?: string;
  title: string;
  content: string;
  date?: string;
  className?: string;
}) => (
  <Card className={`relative pt-8 ${className}`}>
    {badge && (
      <div className="absolute -top-3 -left-3 bg-[var(--color-neo-accent)] text-neo-text px-3 py-1 neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)] font-black rotate-[-3deg] z-10">
        {badge}
      </div>
    )}
    {date && <div className="text-sm font-bold text-neo-text/50 mb-2">{date}</div>}
    <h3 className="text-2xl font-black mb-3 leading-tight">{title}</h3>
    <div className="text-neo-text/80 font-medium leading-relaxed space-y-2">
      {/* Allow splitting content by newlines for paragraphs */}
      {content.split('\n').map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
  </Card>
);

// 6. Metric Card (For KPI statistics)
export const MetricCard = ({
  title,
  value,
  icon,
  trend,
  className = ''
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  className?: string;
}) => (
  <Card className={`flex flex-col ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-bold border-b-3 border-neo-text pb-1 inline-block">{title}</h3>
      {icon && <div className="p-2 bg-white neo-border shadow-[2px_2px_0px_0px_var(--color-neo-text)]">{icon}</div>}
    </div>
    <div className="flex items-end justify-between mt-auto">
      <p className="text-5xl font-display font-black tracking-tighter">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 font-bold px-2 py-1 neo-border shadow-[2px_2px_0px_0px_var(--color-neo-text)] text-sm ${trend.isPositive ? 'bg-[var(--color-neo-primary)] text-neo-text' : 'bg-red-400 text-neo-text'}`}>
          {trend.isPositive ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
          )}
          {trend.value}
        </div>
      )}
    </div>
  </Card>
);
