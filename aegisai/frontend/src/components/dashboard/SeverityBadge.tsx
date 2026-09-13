import React from 'react';
import { getSeverityColor } from '../../utils/formatting';

interface SeverityBadgeProps {
  severity: string;
  count?: number;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, count }) => {
  const colorClass = getSeverityColor(severity);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{severity}</span>
      {count !== undefined && <span className="font-mono text-[11px] opacity-80">({count})</span>}
    </span>
  );
};
