import React from 'react';
import { FileItem } from '../../types';
import { FileCode, Folder, ChevronRight, FileText } from 'lucide-react';

interface ProjectTreeProps {
  files: FileItem[];
  selectedFile?: string | null;
  onSelectFile: (path: string) => void;
}

export const ProjectTree: React.FC<ProjectTreeProps> = ({ files, selectedFile, onSelectFile }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 h-full overflow-y-auto font-mono text-xs select-none">
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
        FILE TREE ({files.length} FILES)
      </div>

      <div className="space-y-0.5">
        {files.map((file) => {
          const isSelected = selectedFile === file.path;
          const isPy = file.extension === '.py';
          return (
            <div
              key={file.path}
              onClick={() => onSelectFile(file.path)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {isPy ? (
                <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className="truncate">{file.path}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
