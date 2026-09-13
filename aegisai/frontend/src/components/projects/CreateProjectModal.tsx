import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description?: string; project_type?: string }) => Promise<any>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('python');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onCreate({ name, description, project_type: projectType });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Create New Project</h3>
        <p className="text-xs text-slate-400 mb-6">Initialize a new project workspace for AST and Security analysis.</p>

        {error && (
          <div className="p-3 mb-4 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Payment Microservice"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of project purpose and architecture..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Domain Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="python">Python Service / API</option>
              <option value="rag">AI / RAG Pipeline</option>
              <option value="fullstack">Full-Stack Application</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} icon={<Plus className="w-4 h-4" />}>
              Create Workspace
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
