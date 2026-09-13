import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useAnalysis } from '../hooks/useAnalysis';
import { SeverityBadge } from '../components/dashboard/SeverityBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Finding } from '../types';
import { Search, Filter, FileCode, X, AlertCircle, CheckCircle, ShieldAlert, Code2, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProjectIssues: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, findings, loading } = useAnalysis(id);

  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeFinding, setActiveFinding] = useState<Finding | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <PageContainer title="Issues & Findings">
        <LoadingSpinner label="Loading static AST & security findings..." />
      </PageContainer>
    );
  }

  const toggleResolved = (findingId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setResolvedIds(prev => ({ ...prev, [findingId]: !prev[findingId] }));
  };

  const filtered = findings.filter(f => {
    const status = resolvedIds[f.id] ? 'resolved' : 'open';
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
                          f.description.toLowerCase().includes(search.toLowerCase()) ||
                          (f.file_path || '').toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || f.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  return (
    <PageContainer title="Issues & Findings">
      {/* Top Filter Bar */}
      <div className="saas-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search findings by title, file, or description..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="security">Security</option>
            <option value="ai_rag">AI / RAG</option>
            <option value="performance">Performance</option>
            <option value="reliability">Reliability</option>
            <option value="code_quality">Code Quality</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Findings Table */}
      <div className="saas-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">File Path</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No findings match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map(finding => {
                  const isResolved = Boolean(resolvedIds[finding.id]);
                  return (
                    <tr
                      key={finding.id}
                      onClick={() => setActiveFinding(finding)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer group ${isResolved ? 'opacity-50' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <SeverityBadge severity={finding.severity} />
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans font-medium uppercase text-[10px]">
                        {finding.category}
                      </td>
                      <td className="py-3 px-4 text-slate-100 font-sans font-bold group-hover:text-indigo-300 transition-colors">
                        {finding.title}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {finding.file_path ? (
                          <span>{finding.file_path}:{finding.line_number}</span>
                        ) : (
                          <span className="text-slate-600">Global</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isResolved ? (
                          <Badge variant="success" size="sm" icon={<Check className="w-3 h-3" />}>Resolved</Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">Open</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => toggleResolved(finding.id, e)}
                        >
                          {isResolved ? 'Reopen' : 'Mark Resolved'}
                        </Button>
                        <span className="text-indigo-400 text-xs font-sans font-bold group-hover:underline">
                          Details →
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Detail Drawer */}
      {activeFinding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
          <div className="bg-[#0B101D] border-l border-slate-800 w-full max-w-xl h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={activeFinding.severity} />
                <span className="text-xs font-mono uppercase text-slate-400">{activeFinding.category}</span>
              </div>
              <button
                onClick={() => setActiveFinding(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">{activeFinding.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeFinding.description}</p>
            </div>

            {activeFinding.file_path && (
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span>{activeFinding.file_path}:{activeFinding.line_number}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/projects/${id}/files`)}
                  icon={<Code2 className="w-3.5 h-3.5" />}
                >
                  View Code
                </Button>
              </div>
            )}

            {activeFinding.evidence && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">EVIDENCE SNIPPET</h4>
                <pre className="bg-[#070A11] p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-rose-300 whitespace-pre-wrap">
                  {activeFinding.evidence}
                </pre>
              </div>
            )}

            {activeFinding.root_cause && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">PROBABLE ROOT CAUSE</h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800 leading-relaxed">
                  {activeFinding.root_cause}
                </p>
              </div>
            )}

            {activeFinding.impact && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-amber-400">IMPACT ASSESSMENT</h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800 leading-relaxed">
                  {activeFinding.impact}
                </p>
              </div>
            )}

            {activeFinding.recommendation && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-indigo-400">RECOMMENDED REMEDIATION</h4>
                <div className="text-xs text-slate-200 bg-indigo-950/40 p-4 rounded-xl border border-indigo-800/40 leading-relaxed">
                  {activeFinding.recommendation}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Button
                variant={resolvedIds[activeFinding.id] ? 'secondary' : 'primary'}
                onClick={() => toggleResolved(activeFinding.id)}
              >
                {resolvedIds[activeFinding.id] ? 'Reopen Finding' : 'Mark as Resolved'}
              </Button>
              <Button variant="ghost" onClick={() => setActiveFinding(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
