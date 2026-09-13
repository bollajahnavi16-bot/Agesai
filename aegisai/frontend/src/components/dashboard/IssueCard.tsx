import React from 'react';
import { Finding } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { FileCode, AlertCircle, ArrowRight } from 'lucide-react';

interface IssueCardProps {
  finding: Finding;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ finding, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <SeverityBadge severity={finding.severity} />
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">{finding.category}</span>
        </div>
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
          {finding.title}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {finding.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-1.5 truncate max-w-[80%]">
          <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{finding.file_path || 'Global Project'}</span>
          {finding.line_number && <span className="text-indigo-400">:L{finding.line_number}</span>}
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </div>
  );
};
