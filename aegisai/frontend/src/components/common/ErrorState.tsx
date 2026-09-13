import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-rose-950/20 border border-rose-900/40 text-center max-w-lg mx-auto my-8">
      <div className="p-3 rounded-full bg-rose-900/30 text-rose-400 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-rose-200 mb-2">Operation Error</h3>
      <p className="text-sm text-rose-300/80 mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
