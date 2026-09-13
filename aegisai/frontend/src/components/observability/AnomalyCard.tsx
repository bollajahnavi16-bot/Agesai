import React from 'react';
import { AnomalyItem } from '../../types';
import { formatDate } from '../../utils/formatting';
import { AlertOctagon, TrendingUp } from 'lucide-react';

interface AnomalyCardProps {
  anomaly: AnomalyItem;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({ anomaly }) => {
  const isCritical = anomaly.severity === 'critical';

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
      isCritical
        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
        : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
    }`}>
      <div className={`p-2 rounded-lg shrink-0 ${isCritical ? 'bg-rose-900/40 text-rose-400' : 'bg-amber-900/40 text-amber-400'}`}>
        <AlertOctagon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            {anomaly.metric_type} Statistical Anomaly
          </span>
          <span className="text-[11px] font-mono opacity-70">
            {formatDate(anomaly.timestamp.toString())}
          </span>
        </div>

        <p className="text-xs leading-relaxed opacity-90">{anomaly.description}</p>

        <div className="mt-2 flex items-center gap-4 text-[11px] font-mono opacity-80 pt-2 border-t border-current/10">
          <span>Observed: <strong>{anomaly.value}</strong></span>
          <span>Baseline Mean: <strong>{anomaly.expected_mean}</strong></span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Z-score: <strong>{anomaly.z_score}σ</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
