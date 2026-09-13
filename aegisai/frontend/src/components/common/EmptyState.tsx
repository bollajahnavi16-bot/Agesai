import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto my-8">
      <div className="p-3 rounded-full bg-slate-800/80 text-slate-400 mb-4 border border-slate-700">
        {icon || <AlertCircle className="w-8 h-8 text-indigo-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
