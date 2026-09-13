import { useState, useEffect, useCallback } from 'react';
import { Project, Finding, HealthScore, Architecture, Analysis } from '../types';
import { apiService } from '../services/api';

export const useAnalysis = (projectId?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [architecture, setArchitecture] = useState<Architecture | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [projData, healthData, findingsData, archData] = await Promise.all([
        apiService.getProject(projectId),
        apiService.getHealthScore(projectId).catch(() => null),
        apiService.getFindings(projectId).catch(() => []),
        apiService.getArchitecture(projectId).catch(() => null)
      ]);

      setProject(projData);
      setHealthScore(healthData);
      setFindings(findingsData);
      setArchitecture(archData);

      try {
        const anl = await apiService.getLatestAnalysis(projectId);
        setAnalysis(anl);
      } catch {
        setAnalysis(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load project analysis');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const triggerAnalysis = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      await apiService.runAnalysis(projectId);
      await fetchProjectData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { project, healthScore, findings, architecture, analysis, loading, error, refresh: fetchProjectData, triggerAnalysis };
};
