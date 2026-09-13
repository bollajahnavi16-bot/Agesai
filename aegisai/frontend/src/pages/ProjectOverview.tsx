import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useAnalysis } from '../hooks/useAnalysis';
import { HealthScoreGauge } from '../components/dashboard/HealthScore';
import { MetricCard } from '../components/dashboard/MetricCard';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { IssueCard } from '../components/dashboard/IssueCard';
import { UploadProject } from '../components/projects/UploadProject';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Tabs } from '../components/common/Tabs';
import { formatDate } from '../utils/formatting';
import {
  ShieldAlert,
  RefreshCw,
  Cpu,
  Layers,
  FileCode2,
  ArrowRight,
  ShieldCheck,
  Package,
  GitFork,
  AlertOctagon,
  Code2
} from 'lucide-react';

export const ProjectOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, healthScore, findings, architecture, analysis, loading, error, refresh, triggerAnalysis } = useAnalysis(id);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <PageContainer title="Project Overview">
        <LoadingSpinner label="Loading project engineering intelligence..." />
      </PageContainer>
    );
  }

  if (error || !project) {
    return (
      <PageContainer title="Project Overview">
        <ErrorState message={error || 'Project workspace not found.'} onRetry={refresh} />
      </PageContainer>
    );
  }

  const criticals = findings.filter(f => f.severity === 'critical');
  const highs = findings.filter(f => f.severity === 'high');

  const securityFindings = findings.filter(f => f.category === 'security');
  const ragFindings = findings.filter(f => f.category === 'ai_rag');
  const depFindings = findings.filter(f => f.category === 'dependency');
  const qualityFindings = findings.filter(f => f.category === 'code_quality' || f.category === 'maintainability');

  const tabItems = [
    { id: 'overview', label: '1. Project Health', count: findings.length },
    { id: 'security', label: '2. Security', count: securityFindings.length },
    { id: 'architecture', label: '3. Architecture' },
    { id: 'dependencies', label: '4. Dependencies', count: depFindings.length },
    { id: 'rag', label: '5. AI & RAG', count: ragFindings.length },
    { id: 'quality', label: '6. Code Quality', count: qualityFindings.length },
    { id: 'incidents', label: '7. Risks & Incidents', count: criticals.length + highs.length },
  ];

  return (
    <PageContainer title={`Project: ${project.name}`}>
      {/* Header Info Banner */}
      <div className="saas-card p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <Badge variant="default" size="sm">{project.project_type}</Badge>
            <span className="text-xs text-slate-500 font-mono">
              Last analyzed: {formatDate(analysis?.completed_at?.toString() || project.updated_at)}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {project.description || 'Static AST, security credentials, and RAG architectural assessment workspace.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerAnalysis}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Re-Analyze Project
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/projects/${id}/issues`)}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Issues ({findings.length})
          </Button>
        </div>
      </div>

      {/* Top Metrics Row with Health Score as Focal Point */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <HealthScoreGauge healthScore={healthScore} />
        <MetricCard
          title="Critical Issues"
          value={criticals.length}
          subtitle="Vulnerabilities"
          icon={<ShieldAlert className="w-5 h-5 text-rose-400" />}
          trendType={criticals.length > 0 ? 'negative' : 'positive'}
        />
        <MetricCard
          title="High Severity Risks"
          value={highs.length}
          subtitle="Operational risks"
          icon={<Cpu className="w-5 h-5 text-amber-400" />}
        />
        <MetricCard
          title="Files Analyzed"
          value={analysis?.files_analyzed || 0}
          subtitle="Statically parsed"
          icon={<FileCode2 className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Upload Archive Box */}
      <UploadProject projectId={id!} onSuccess={refresh} />

      {/* Tabbed Domain Inspection Navigation */}
      <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content 1: Overview & Health */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryChart breakdown={healthScore?.category_scores} />
          </div>

          <div className="lg:col-span-2 saas-card p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-3">
                AI ANALYSIS & EXECUTIVE SUMMARY
              </h3>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {analysis?.summary || 'Analysis summary generated statically...'}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-2">
                DETECTED ARCHITECTURAL SIGNATURES
              </h4>
              <div className="flex flex-wrap gap-2">
                {architecture?.components.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-700 text-indigo-300 flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    {comp.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Security Findings */}
      {activeTab === 'security' && (
        <div className="saas-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>SECURITY VULNERABILITIES ({securityFindings.length})</span>
            </h3>
          </div>
          {securityFindings.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-4">No security vulnerabilities detected.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityFindings.map(f => (
                <IssueCard key={f.id} finding={f} onClick={() => navigate(`/projects/${id}/issues`)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Architecture */}
      {activeTab === 'architecture' && (
        <div className="saas-card p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">
            EXTRACTED ARCHITECTURE & PIPELINE FLOW
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-3">
            {architecture?.flow.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-md">
                  {step}
                </span>
                {idx < (architecture.flow.length - 1) && <ArrowRight className="w-4 h-4 text-slate-600" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Dependencies */}
      {activeTab === 'dependencies' && (
        <div className="saas-card p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">
            DEPENDENCY AUDIT FINDINGS ({depFindings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {depFindings.map(f => (
              <IssueCard key={f.id} finding={f} onClick={() => navigate(`/projects/${id}/issues`)} />
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 5: RAG Findings */}
      {activeTab === 'rag' && (
        <div className="saas-card p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-purple-400">
            AI & RAG ARCHITECTURAL ANTI-PATTERNS ({ragFindings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ragFindings.map(f => (
              <IssueCard key={f.id} finding={f} onClick={() => navigate(`/projects/${id}/issues`)} />
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 6: Code Quality */}
      {activeTab === 'quality' && (
        <div className="saas-card p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
            AST CODE QUALITY & COMPLEXITY ({qualityFindings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityFindings.map(f => (
              <IssueCard key={f.id} finding={f} onClick={() => navigate(`/projects/${id}/issues`)} />
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 7: Incidents & Risks */}
      {activeTab === 'incidents' && (
        <div className="saas-card p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400">
            OPERATIONAL RISKS & HIGH PRIORITY INCIDENTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...criticals, ...highs].map(f => (
              <IssueCard key={f.id} finding={f} onClick={() => navigate(`/projects/${id}/issues`)} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
