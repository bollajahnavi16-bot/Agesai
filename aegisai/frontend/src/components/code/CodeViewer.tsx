import React from 'react';
import { Finding } from '../../types';
import { SeverityBadge } from '../dashboard/SeverityBadge';
import { AlertCircle, FileCode } from 'lucide-react';

interface CodeViewerProps {
  filePath: string;
  content: string;
  findings: Finding[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ filePath, content, findings }) => {
  const lines = content.split('\n');

  // Map line numbers to findings
  const findingsByLine: Record<number, Finding[]> = {};
  findings.forEach(f => {
    if (f.line_number) {
      if (!findingsByLine[f.line_number]) findingsByLine[f.line_number] = [];
      findingsByLine[f.line_number].push(f);
    }
  });

  return (
    <div className="bg-[#0D1322] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs flex flex-col h-full">
      {/* File Header */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold">{filePath}</span>
        </div>
        <span className="text-[11px] text-slate-500">{lines.length} lines</span>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-4 space-y-0.5 select-text">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const lineFindings = findingsByLine[lineNum] || [];
          const hasFinding = lineFindings.length > 0;

          return (
            <div key={lineNum} className="flex flex-col">
              <div
                className={`flex items-start gap-4 px-2 py-0.5 rounded transition-colors ${
                  hasFinding ? 'bg-rose-950/30 border-l-2 border-rose-500' : 'hover:bg-slate-800/30'
                }`}
              >
                <span className="w-10 text-right text-slate-600 select-none shrink-0 font-mono text-[11px]">
                  {lineNum}
                </span>
                <pre className="text-slate-200 whitespace-pre-wrap flex-1 overflow-x-auto leading-relaxed">
                  {line || ' '}
                </pre>
              </div>

              {/* Inline Finding Banner */}
              {lineFindings.map(f => (
                <div
                  key={f.id}
                  className="my-1.5 ml-14 mr-2 p-3 bg-slate-900/90 border border-slate-700/80 rounded-lg space-y-1 shadow-lg text-slate-300 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-bold text-slate-100">{f.title}</span>
                    </div>
                    <SeverityBadge severity={f.severity} />
                  </div>
                  <p className="text-slate-400 leading-normal">{f.description}</p>
                  {f.recommendation && (
                    <p className="text-indigo-300 font-sans text-[11px] bg-indigo-950/40 p-2 rounded border border-indigo-800/30 mt-1">
                      💡 <strong>Fix:</strong> {f.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
