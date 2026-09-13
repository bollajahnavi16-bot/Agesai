import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070A11] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/40 focus:ring-indigo-500',
    secondary: 'bg-slate-850 hover:bg-slate-800 text-slate-100 border border-slate-700/80 focus:ring-slate-500',
    outline: 'border border-slate-700/80 hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 border border-rose-500/40 focus:ring-rose-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/40 focus:ring-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs font-bold gap-2',
    lg: 'px-6 py-2.5 text-sm font-bold gap-2.5',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
