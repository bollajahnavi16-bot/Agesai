import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = ''
}) => {
  const variantStyles = {
    default: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1 font-mono',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border uppercase tracking-wider ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
