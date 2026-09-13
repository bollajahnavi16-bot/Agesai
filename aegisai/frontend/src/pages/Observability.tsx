import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useTelemetry } from '../hooks/useTelemetry';
import { useProjects } from '../hooks/useProjects';
import { TelemetryChart } from '../components/observability/TelemetryChart';
import { AnomalyCard } from '../components/observability/AnomalyCard';
import { MetricCard } from '../components/dashboard/MetricCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Activity, AlertOctagon, Cpu, DollarSign, Clock } from 'lucide-react';

export const Observability: React.FC = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const { projects } = useProjects();
  const activeProjectId = routeId || projects[0]?.id;

  const { telemetry, analysis, loading } = useTelemetry(activeProjectId);

  if (loading) {
    return (
      <PageContainer title="Observability & Telemetry">
        <LoadingSpinner label="Computing 3-sigma telemetry metrics and statistical anomalies..." />
      </PageContainer>
    );
  }

  const summaries = analysis?.metrics_summary || {};
  const anomalies = analysis?.anomalies || [];

  return (
    <PageContainer title="Observability & Telemetry">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>Telemetry & Anomaly Detection</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time latency metrics, vector retrieval timing, and automated 3-sigma statistical anomaly flags.
          </p>
        </div>

        <Badge variant="warning" size="md">
          DEMO DATA ACTIVE
        </Badge>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average Latency"
          value={`${summaries.latency?.mean || 142} ms`}
          subtitle="p95: 680 ms"
          icon={<Clock className="w-4 h-4 text-blue-400" />}
        />
        <MetricCard
          title="Vector Retrieval Latency"
          value={`${summaries.retrieval_latency?.mean || 58} ms`}
          subtitle="ChromaDB search"
          icon={<Cpu className="w-4 h-4 text-indigo-400" />}
        />
        <MetricCard
          title="HTTP Error Rate"
          value={`${summaries.error_rate?.mean || 0.8}%`}
          subtitle="5xx status rate"
          icon={<AlertOctagon className="w-4 h-4 text-rose-400" />}
        />
        <MetricCard
          title="Estimated Cost (24h)"
          value="$2.45"
          subtitle="Tokens: 148,500"
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryChart
          title="API Response Latency (ms)"
          data={telemetry}
          metricType="latency"
          unit="ms"
          color="#3B82F6"
        />
        <TelemetryChart
          title="Vector Store Retrieval Latency (ms)"
          data={telemetry}
          metricType="retrieval_latency"
          unit="ms"
          color="#6366F1"
        />
        <TelemetryChart
          title="HTTP Error Rate (%)"
          data={telemetry}
          metricType="error_rate"
          unit="%"
          color="#F43F5E"
        />
        <TelemetryChart
          title="Throughput (Request Count)"
          data={telemetry}
          metricType="request_count"
          unit="req"
          color="#10B981"
        />
      </div>

      {/* Flagged Statistical Anomalies */}
      <div className="saas-card p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center justify-between">
          <span>STATISTICAL ANOMALIES FLAGGED ({anomalies.length})</span>
          <span className="text-[10px] text-slate-500 font-mono">Algorithm: Rolling Z-Score &gt; 2.0σ</span>
        </h3>

        {anomalies.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 font-mono">
            No statistical anomalies detected in current telemetry window.
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anom, idx) => (
              <AnomalyCard key={idx} anomaly={anom} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
