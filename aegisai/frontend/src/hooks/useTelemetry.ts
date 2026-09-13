import { useState, useEffect, useCallback } from 'react';
import { TelemetryPoint, TelemetryAnalysis } from '../types';
import { apiService } from '../services/api';

export const useTelemetry = (projectId?: string) => {
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [analysis, setAnalysis] = useState<TelemetryAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [points, anl] = await Promise.all([
        apiService.getTelemetry(projectId),
        apiService.getTelemetryAnalysis(projectId)
      ]);
      setTelemetry(points);
      setAnalysis(anl);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load telemetry metrics');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  return { telemetry, analysis, loading, error, refresh: fetchTelemetry };
};
