import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, FileArchive } from 'lucide-react';
import { Button } from '../common/Button';
import { apiService } from '../../services/api';

interface UploadProjectProps {
  projectId: string;
  onSuccess: () => void;
}

export const UploadProject: React.FC<UploadProjectProps> = ({ projectId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.zip')) {
        setError('Only .zip files are supported.');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await apiService.uploadProjectZip(projectId, file);
      setSuccessMsg('ZIP uploaded, safely extracted, and analyzed successfully!');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload ZIP archive.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
      <div className="p-3 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-3">
        <UploadCloud className="w-8 h-8" />
      </div>

      <h4 className="font-semibold text-slate-100 mb-1">Upload Project ZIP Archive</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-4">
        Safely uploads source code ZIP. Path traversal checks are strictly enforced. Code is never executed.
      </p>

      {error && (
        <div className="p-3 mb-4 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 mb-4 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-2 transition-colors">
            <FileArchive className="w-4 h-4 text-indigo-400" />
            <span>{file ? file.name : 'Choose .ZIP File'}</span>
          </div>
        </label>

        <Button
          onClick={handleUpload}
          disabled={!file}
          loading={loading}
          variant="primary"
          size="sm"
        >
          Extract & Analyze
        </Button>
      </div>
    </div>
  );
};
