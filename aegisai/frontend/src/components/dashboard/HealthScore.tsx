import React from 'react';
import { HealthScore as HealthScoreType } from '../../types';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface HealthScoreProps {
  healthScore?: HealthScoreType | null;
  score?: number;
}

export const HealthScoreGauge: React.FC<HealthScoreProps> = ({ healthScore, score: rawScore }) => {
  const score = healthScore ? healthScore.overall_score : (rawScore ?? 100);

  const getScoreTheme = (s: number) => {
    if (s >= 90) return { color: '#10B981', label: 'Excellent', text: 'text-emerald-400', stroke: 'stroke-emerald-500', bg: 'bg-emerald-500/10' };
    if (s >= 75) return { color: '#3B82F6', label: 'Good', text: 'text-blue-400', stroke: 'stroke-blue-500', bg: 'bg-blue-500/10' };
    if (s >= 60) return { color: '#F59E0B', label: 'Fair', text: 'text-amber-400', stroke: 'stroke-amber-500', bg: 'bg-amber-500/10' };
    if (s >= 40) return { color: '#F97316', label: 'Poor', text: 'text-orange-400', stroke: 'stroke-orange-500', bg: 'bg-orange-500/10' };
    return { color: '#F43F5E', label: 'Critical', text: 'text-rose-400', stroke: 'stroke-rose-500', bg: 'bg-rose-500/10' };
  };

  const theme = getScoreTheme(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-center mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">PROJECT HEALTH SCORE</h3>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress gauge */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`${theme.stroke} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold font-mono tracking-tighter ${theme.text}`}>
            {score.toFixed(0)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">/ 100</span>
        </div>
      </div>

      <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.bg} ${theme.text} border border-current/20 flex items-center gap-1.5 mt-2`}>
        {score >= 75 ? <ShieldCheck className="w-3.5 h-3.5" /> : score >= 40 ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldX className="w-3.5 h-3.5" />}
        <span>{healthScore?.health_status || theme.label}</span>
      </div>
    </div>
  );
};
