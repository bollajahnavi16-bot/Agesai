/// <reference types="vite/client" />

export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api';

export const CATEGORY_LABELS: Record<string, string> = {
  security: 'Security Risks',
  reliability: 'Reliability & Errors',
  ai_rag: 'AI & RAG Architecture',
  code_quality: 'Code Quality',
  performance: 'Performance & Latency',
  maintainability: 'Maintainability & Debt'
};

export const SEVERITY_ORDER: Record<string, number> = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4
};
