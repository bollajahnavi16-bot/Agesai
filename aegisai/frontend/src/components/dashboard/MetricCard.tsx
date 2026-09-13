import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'neutral'
}) => {
  const trendColors = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-slate-400'
  };

  return (
    <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-2 rounded-lg bg-slate-800/60 text-indigo-400">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1 text-xs">
            {trend && <span className={`font-semibold ${trendColors[trendType]}`}>{trend}</span>}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
