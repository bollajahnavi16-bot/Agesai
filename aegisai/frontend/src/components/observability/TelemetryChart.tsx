import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TelemetryPoint } from '../../types';
import { formatDate } from '../../utils/formatting';

interface TelemetryChartProps {
  title: string;
  data: TelemetryPoint[];
  metricType: string;
  unit?: string;
  color?: string;
  isDemoData?: boolean;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  title,
  data,
  metricType,
  unit = 'ms',
  color = '#3B82F6',
  isDemoData = true
}) => {
  const filtered = data.filter(d => d.metric_type === metricType);
  const chartData = filtered.map(d => ({
    time: formatDate(d.timestamp),
    value: d.value
  }));

  return (
    <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col h-72 relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">{title}</h4>
        {isDemoData && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
            DEMO DATA
          </span>
        )}
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px', color: '#F8FAFC' }}
              formatter={(val: number) => [`${val} ${unit}`, title]}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
