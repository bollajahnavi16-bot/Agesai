import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading analysis data...',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Loader2 className={`${sizeMap[size]} text-indigo-500 animate-spin mb-3`} />
      {label && <p className="text-sm font-medium text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
};
