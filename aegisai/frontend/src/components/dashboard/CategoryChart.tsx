import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { HealthBreakdown } from '../../types';
import { CATEGORY_LABELS } from '../../utils/constants';

interface CategoryChartProps {
  breakdown?: HealthBreakdown;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ breakdown }) => {
  if (!breakdown) return null;

  const data = Object.entries(breakdown).map(([key, score]) => ({
    name: CATEGORY_LABELS[key] || key,
    score: score,
    key: key
  }));

  const getBarColor = (score: number) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 50) return '#F59E0B';
    return '#F43F5E';
  };

  return (
    <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
        HEALTH SCORE BY CATEGORY
      </h3>
      <div className="flex-1 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px', color: '#F8FAFC' }}
              formatter={(value: number) => [`${value}/100`, 'Score']}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
