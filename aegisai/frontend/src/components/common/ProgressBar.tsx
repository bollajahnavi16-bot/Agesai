import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'indigo',
  size = 'md',
  showLabel = false,
  label
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantFills = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    cyan: 'bg-cyan-500',
  };

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {showLabel && <span className="font-mono text-slate-400 font-semibold">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 ${sizeHeights[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${variantFills[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
