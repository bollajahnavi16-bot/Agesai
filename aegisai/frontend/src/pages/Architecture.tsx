import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useAnalysis } from '../hooks/useAnalysis';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { GitFork, CheckCircle2, HelpCircle, ArrowRight, Layers, Cpu, Database, Search, MessageSquare, Terminal } from 'lucide-react';

export const Architecture: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { architecture, loading } = useAnalysis(id);

  if (loading) {
    return (
      <PageContainer title="RAG Architecture">
        <LoadingSpinner label="Inspecting detected RAG architecture & pipeline flow..." />
      </PageContainer>
    );
  }

  const flow = architecture?.flow || [
    "User Query Input",
    "FastAPI Router",
    "Vector Retriever",
    "Vector Store (ChromaDB)",
    "LLM Generation (ChatOpenAI)"
  ];

  const pipelineIcons = [MessageSquare, Terminal, Search, Database, Cpu];

  return (
    <PageContainer title="RAG Architecture & Pipeline">
      <div className="saas-card p-6 rounded-xl space-y-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <GitFork className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">RAG Architecture & Observability Pipeline</h2>
          </div>
          <p className="text-xs text-slate-400">
            Extracted vector retrieval & LLM pipeline flow derived from static source inspection.
          </p>
        </div>

        {/* Enterprise Visual RAG Pipeline Flow */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
            PIPELINE FLOW STAGES
          </h3>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto py-2">
            {flow.map((step, idx) => {
              const StepIcon = pipelineIcons[idx % pipelineIcons.length];
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center p-4 bg-slate-900 rounded-xl border border-slate-800 min-w-[150px] text-center shadow-lg hover:border-slate-700 transition-colors">
                    <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 mb-2 border border-indigo-500/30">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">
                      STAGE 0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-100">{step}</span>
                  </div>
                  {idx < flow.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-600 shrink-0 hidden lg:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Component Inventory Grid */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
            DETECTED FRAMEWORKS & VECTOR STORES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architecture?.components.map((comp, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  comp.detected
                    ? 'bg-slate-900 border-slate-700 text-slate-100'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${comp.detected ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{comp.name}</h4>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{comp.category}</span>
                  </div>
                </div>

                {comp.detected ? (
                  <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>Detected</Badge>
                ) : (
                  <Badge variant="neutral" size="sm" icon={<HelpCircle className="w-3 h-3" />}>Not Detected</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
