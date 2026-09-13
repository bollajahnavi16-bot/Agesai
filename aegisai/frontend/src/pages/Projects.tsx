import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Plus, Sparkles, FolderGit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Projects: React.FC = () => {
  const { projects, loading, createDemoProject, createProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    setDemoLoading(true);
    try {
      const proj = await createDemoProject();
      navigate(`/projects/${proj.id}`);
    } catch {
      setDemoLoading(false);
    }
  };

  return (
    <PageContainer title="Projects & Workspaces">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Projects & Workspaces</h2>
          <p className="text-xs text-slate-400">Manage and inspect software codebases, ZIP archives and RAG pipelines.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            loading={demoLoading}
            onClick={handleLaunchDemo}
            icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
          >
            Launch Customer RAG Demo
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Project
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading project workspaces..." />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description="Create a project workspace or launch the Customer Support RAG demo project to perform full static AST & security analysis."
          actionLabel="Launch Customer RAG Demo"
          onAction={handleLaunchDemo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createProject}
      />
    </PageContainer>
  );
};
