import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useProjects } from '../hooks/useProjects';
import { useAnalysis } from '../hooks/useAnalysis';
import { HealthScoreGauge } from '../components/dashboard/HealthScore';
import { MetricCard } from '../components/dashboard/MetricCard';
import { IssueCard } from '../components/dashboard/IssueCard';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ShieldAlert, AlertOctagon, FileCode2, Sparkles, FolderGit2, ShieldCheck, Package, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { projects, loading: loadingProjects, createDemoProject } = useProjects();
  const activeProjectId = projects[0]?.id;
  const { healthScore, findings, analysis, loading: loadingAnalysis } = useAnalysis(activeProjectId);
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    const proj = await createDemoProject();
    navigate(`/projects/${proj.id}`);
  };

  if (loadingProjects || loadingAnalysis) {
    return (
      <PageContainer title="Global Dashboard">
        <LoadingSpinner label="Compiling engineering command center telemetry..." />
      </PageContainer>
    );
  }

  if (projects.length === 0) {
    return (
      <PageContainer title="Global Dashboard">
        <EmptyState
          title="No Workspace Projects"
          description="Create a project or launch the Customer Support RAG demo to inspect code quality, security risks, and RAG architecture."
          actionLabel="Launch Customer RAG Demo"
          onAction={handleDemoClick}
        />
      </PageContainer>
    );
  }

  const criticalCount = healthScore?.critical_count || findings.filter(f => f.severity === 'critical').length;
  const highCount = healthScore?.high_count || findings.filter(f => f.severity === 'high').length;
  const mediumCount = healthScore?.medium_count || findings.filter(f => f.severity === 'medium').length;
  const lowCount = healthScore?.low_count || findings.filter(f => f.severity === 'low').length;

  const securityCount = findings.filter(f => f.category === 'security').length;
  const dependencyCount = findings.filter(f => f.category === 'dependency').length;
  const totalFindingsCount = findings.length;

  const avgHealth = Math.round(
    projects.reduce((acc, p) => acc + (p.health_score || 100), 0) / projects.length
  );

  return (
    <PageContainer title="Engineering Overview">
      {/* Top Banner Context */}
      <div className="saas-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              Active Workspace: <span className="text-indigo-400">{projects[0]?.name}</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Status: <span className="uppercase font-bold text-emerald-400">{projects[0]?.status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')} icon={<FolderGit2 className="w-3.5 h-3.5" />}>
            All Workspaces ({projects.length})
          </Button>
          <Button variant="primary" size="sm" onClick={handleDemoClick} icon={<Sparkles className="w-3.5 h-3.5" />}>
            Try Demo
          </Button>
        </div>
      </div>

      {/* Top KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Projects Analyzed"
          value={projects.length}
          subtitle="Workspaces active"
          icon={<FolderGit2 className="w-4 h-4 text-indigo-400" />}
        />
        <MetricCard
          title="Average Health"
          value={`${avgHealth}/100`}
          subtitle="Overall Score"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        />
        <MetricCard
          title="Critical Issues"
          value={criticalCount}
          subtitle="Urgent action"
          icon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
          trendType={criticalCount > 0 ? 'negative' : 'positive'}
        />
        <MetricCard
          title="Security Findings"
          value={securityCount}
          subtitle="Vulnerabilities"
          icon={<ShieldAlert className="w-4 h-4 text-amber-400" />}
        />
        <MetricCard
          title="Dependency Risks"
          value={dependencyCount}
          subtitle="Unpinned specs"
          icon={<Package className="w-4 h-4 text-cyan-400" />}
        />
      </div>

      {/* Middle Section: Project Health & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HealthScoreGauge healthScore={healthScore} />

        <div className="lg:col-span-2 saas-card p-6 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
              RISK SEVERITY DISTRIBUTION
            </h3>
            <span className="text-xs font-mono text-slate-500">{totalFindingsCount} Total Findings</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-rose-400 font-bold">Critical Severity ({criticalCount})</span>
                <span className="text-slate-500">25 pts deduction / item</span>
              </div>
              <ProgressBar value={totalFindingsCount ? (criticalCount / totalFindingsCount) * 100 : 0} variant="rose" size="md" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-amber-400 font-bold">High Severity ({highCount})</span>
                <span className="text-slate-500">15 pts deduction / item</span>
              </div>
              <ProgressBar value={totalFindingsCount ? (highCount / totalFindingsCount) * 100 : 0} variant="amber" size="md" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-indigo-400 font-bold">Medium Severity ({mediumCount})</span>
                <span className="text-slate-500">8 pts deduction / item</span>
              </div>
              <ProgressBar value={totalFindingsCount ? (mediumCount / totalFindingsCount) * 100 : 0} variant="indigo" size="md" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400 font-bold">Low Severity ({lowCount})</span>
                <span className="text-slate-500">3 pts deduction / item</span>
              </div>
              <ProgressBar value={totalFindingsCount ? (lowCount / totalFindingsCount) * 100 : 0} variant="cyan" size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryChart breakdown={healthScore?.category_scores} />
        </div>

        <div className="lg:col-span-2 saas-card p-6 rounded-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
              RECENT ACTIVITY & FINDINGS
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${activeProjectId}/issues`)}>
              View All Issues
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {findings.slice(0, 4).map(f => (
              <IssueCard
                key={f.id}
                finding={f}
                onClick={() => navigate(`/projects/${activeProjectId}/issues`)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
