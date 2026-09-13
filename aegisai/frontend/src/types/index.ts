export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  created_at: string;
  updated_at: string;
  status: 'created' | 'analyzing' | 'completed' | 'failed';
  health_score: number;
}

export interface Finding {
  id: string;
  project_id: string;
  analysis_id: string;
  category: 'code_quality' | 'security' | 'dependency' | 'ai_rag' | 'performance' | 'reliability' | 'maintainability';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file_path?: string;
  line_number?: number;
  evidence?: string;
  root_cause?: string;
  impact?: string;
  recommendation?: string;
  confidence: number;
  source: string;
  status: 'open' | 'resolved' | 'ignored';
  created_at: string;
}

export interface Analysis {
  id: string;
  project_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  files_analyzed: number;
  summary?: string;
}

export interface HealthBreakdown {
  code_quality: number;
  security: number;
  performance: number;
  reliability: number;
  ai_rag: number;
  maintainability: number;
}

export interface HealthScore {
  overall_score: number;
  health_status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  category_scores: HealthBreakdown;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export interface ArchitectureComponent {
  name: string;
  category: string;
  detected: boolean;
  confidence: number;
  details?: string;
}

export interface Architecture {
  project_id: string;
  components: ArchitectureComponent[];
  flow: string[];
}

export interface FileItem {
  path: string;
  name: string;
  is_dir: boolean;
  size?: number;
  extension?: string;
}

export interface FileContent {
  file_path: string;
  content: string;
  lines_count: number;
}

export interface IncidentResult {
  classification: string;
  probable_root_cause: string;
  evidence: string;
  impact: string;
  recommendation: string;
  confidence: number;
  limitations: string;
  detected_stack_frames?: string[];
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  context_used?: string[];
}

export interface TelemetryPoint {
  id: string;
  project_id: string;
  timestamp: string;
  metric_type: string;
  value: number;
}

export interface AnomalyItem {
  metric_type: string;
  timestamp: string;
  value: number;
  expected_mean: number;
  z_score: number;
  severity: string;
  description: string;
}

export interface TelemetryAnalysis {
  project_id: string;
  is_demo_data: boolean;
  total_data_points: number;
  anomalies: AnomalyItem[];
  metrics_summary: Record<string, {
    count: number;
    mean: number;
    min: number;
    max: number;
    std_dev: number;
  }>;
}
