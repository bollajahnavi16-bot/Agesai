import React from 'react';
import { Project } from '../../types';
import { formatDate } from '../../utils/formatting';
import { FolderGit2, Trash2, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const score = project.health_score ?? 100;

  const getSemanticHealth = (s: number) => {
    if (s >= 85) return { label: 'Healthy', variant: 'success' as const, icon: ShieldCheck };
    if (s >= 65) return { label: 'Needs Attention', variant: 'warning' as const, icon: AlertTriangle };
    return { label: 'Critical Risk', variant: 'danger' as const, icon: ShieldAlert };
  };

  const health = getSemanticHealth(score);
  const StatusIcon = health.icon;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="saas-card-interactive p-5 rounded-xl cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Title & Health Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                {project.project_type}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-bold font-mono text-slate-100">
              {score.toFixed(1)}<span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <Badge variant={health.variant} size="sm" icon={<StatusIcon className="w-3 h-3" />}>
              {health.label}
            </Badge>
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {project.description || 'Static AST, security, and RAG architectural workspace.'}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-500">
        <span className="font-mono text-[11px]">Analyzed {formatDate(project.updated_at || project.created_at)}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete workspace"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 text-indigo-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
