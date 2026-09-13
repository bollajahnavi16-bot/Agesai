import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { apiService } from '../services/api';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createDemoProject = async () => {
    setLoading(true);
    try {
      const proj = await apiService.createDemoProject();
      await fetchProjects();
      return proj;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create demo project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: { name: string; description?: string; project_type?: string }) => {
    try {
      const proj = await apiService.createProject(data);
      await fetchProjects();
      return proj;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create project');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete project');
    }
  };

  return { projects, loading, error, refresh: fetchProjects, createDemoProject, createProject, deleteProject };
};
