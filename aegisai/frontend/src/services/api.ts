import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import {
  Project,
  Finding,
  Analysis,
  HealthScore,
  Architecture,
  FileItem,
  FileContent,
  IncidentResult,
  AgentMessage,
  TelemetryPoint,
  TelemetryAnalysis
} from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const apiService = {
  // Health
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data;
  },

  getProject: async (projectId: string): Promise<Project> => {
    const res = await api.get(`/projects/${projectId}`);
    return res.data;
  },

  createProject: async (data: { name: string; description?: string; project_type?: string }): Promise<Project> => {
    const res = await api.post('/projects', data);
    return res.data;
  },

  createDemoProject: async (): Promise<Project> => {
    const res = await api.post('/projects/demo');
    return res.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },

  uploadProjectZip: async (projectId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/projects/${projectId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getProjectFiles: async (projectId: string): Promise<FileItem[]> => {
    const res = await api.get(`/projects/${projectId}/files`);
    return res.data.files || [];
  },

  getFileContent: async (projectId: string, filePath: string): Promise<FileContent> => {
    const res = await api.get(`/projects/${projectId}/files/${filePath}`);
    return res.data;
  },

  // Analysis & Findings
  runAnalysis: async (projectId: string): Promise<Analysis> => {
    const res = await api.post(`/projects/${projectId}/analyze`);
    return res.data;
  },

  getLatestAnalysis: async (projectId: string): Promise<Analysis> => {
    const res = await api.get(`/projects/${projectId}/analysis`);
    return res.data;
  },

  getHealthScore: async (projectId: string): Promise<HealthScore> => {
    const res = await api.get(`/projects/${projectId}/health`);
    return res.data;
  },

  getArchitecture: async (projectId: string): Promise<Architecture> => {
    const res = await api.get(`/projects/${projectId}/architecture`);
    return res.data;
  },

  getFindings: async (projectId: string, params?: { category?: string; severity?: string }): Promise<Finding[]> => {
    const res = await api.get(`/projects/${projectId}/findings`, { params });
    return res.data;
  },

  // Incident Analyzer
  analyzeIncident: async (errorText: string, projectId?: string): Promise<IncidentResult> => {
    const res = await api.post('/incidents/analyze', { error_text: errorText, project_id: projectId });
    return res.data;
  },

  // Engineering Agent
  sendAgentMessage: async (projectId: string, message: string): Promise<{ response: string; context_used: string[]; mode: string }> => {
    const res = await api.post('/agent/chat', { project_id: projectId, message });
    return res.data;
  },

  // Telemetry & Observability
  getTelemetry: async (projectId: string): Promise<TelemetryPoint[]> => {
    const res = await api.get(`/projects/${projectId}/telemetry`);
    return res.data;
  },

  getTelemetryAnalysis: async (projectId: string): Promise<TelemetryAnalysis> => {
    const res = await api.get(`/projects/${projectId}/telemetry/analyze`);
    return res.data;
  }
};
