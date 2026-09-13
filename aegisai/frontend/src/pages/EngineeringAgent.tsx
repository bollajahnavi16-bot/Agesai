import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AgentChat } from '../components/agent/AgentChat';
import { useProjects } from '../hooks/useProjects';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { Bot, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EngineeringAgentPage: React.FC = () => {
  const { projects, loading, createDemoProject } = useProjects();
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    const proj = await createDemoProject();
    navigate(`/projects/${proj.id}`);
  };

  if (loading) {
    return (
      <PageContainer title="Engineering Agent">
        <LoadingSpinner label="Initializing AI Engineering Agent..." />
      </PageContainer>
    );
  }

  if (projects.length === 0) {
    return (
      <PageContainer title="Engineering Agent">
        <EmptyState
          title="No Project Selected"
          description="Create a project or launch the Customer Support RAG demo to interact with the Engineering Agent."
          actionLabel="Launch Customer RAG Demo"
          onAction={handleLaunchDemo}
        />
      </PageContainer>
    );
  }

  const activeProject = projects[0];

  return (
    <PageContainer title="Engineering Agent">
      <div className="space-y-4">
        <div className="saas-card p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Engineering Agent</h2>
              <p className="text-xs text-slate-400">
                AI assistance for debugging, architecture and engineering decisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Attached Context:</span>
            <Badge variant="default" size="sm" icon={<Layers className="w-3 h-3" />}>
              {activeProject.name} ({activeProject.health_score}/100)
            </Badge>
          </div>
        </div>

        <AgentChat projectId={activeProject.id} />
      </div>
    </PageContainer>
  );
};
