import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  Sparkles,
  AlertOctagon,
  Bot,
  Activity,
  ArrowRight,
  Layers,
  Lock,
  ShieldCheck,
  Package,
  GitFork,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useProjects } from '../hooks/useProjects';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { createDemoProject } = useProjects();
  const [loadingDemo, setLoadingDemo] = React.useState(false);

  const handleTryDemo = async () => {
    setLoadingDemo(true);
    try {
      const proj = await createDemoProject();
      navigate(`/projects/${proj.id}`);
    } catch {
      navigate('/projects');
    } finally {
      setLoadingDemo(false);
    }
  };

  const capabilities = [
    {
      title: 'AI/ML Code Analysis',
      description: 'AST-based static inspection of Python models, FastAPI logic, network timeouts, and unhandled exception paths.',
      icon: Cpu,
      badge: 'Python AST'
    },
    {
      title: 'Security Analysis',
      description: 'Automated regex & AST scanning for exposed API keys, hardcoded credentials, raw SQL string construction, and unsafe subprocess calls.',
      icon: ShieldCheck,
      badge: 'Zero Leaks'
    },
    {
      title: 'Dependency Intelligence',
      description: 'Static manifest parsing for requirements.txt, pyproject.toml, and package.json to construct package inventories and flag unpinned specs.',
      icon: Package,
      badge: 'Manifest Audit'
    },
    {
      title: 'RAG Architecture Analysis',
      description: 'Deep evaluation of document chunk size, chunk overlap parameters, vector retriever top_k bounds, and metadata filtering.',
      icon: Layers,
      badge: 'RAG Inspection'
    },
    {
      title: 'Incident Intelligence',
      description: 'Instant root cause analysis and impact evaluation for backend stack traces, connection timeouts, and HTTP 500 error logs.',
      icon: AlertOctagon,
      badge: 'Log Diagnosis'
    },
    {
      title: 'Engineering AI Agent',
      description: 'Interactive copilot grounded strictly in your project AST findings, architectural flow, and calculated health score.',
      icon: Bot,
      badge: 'Copilot RAG'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans">
      {/* SaaS Navigation */}
      <header className="px-6 md:px-12 py-4 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#070A11]/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-none">
              AEGIS<span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">
              ENGINEERING INTEL PLATFORM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/projects')}>
            Launch Platform
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED SOFTWARE & RAG CODE ANALYSIS</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Find the problem.<br />
          Understand the cause.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
            Fix it faster.
          </span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mt-6 leading-relaxed">
          AEGISAI analyzes AI/ML, Python and full-stack projects to identify architectural risks, security vulnerabilities, dependency issues, RAG problems and operational risks before they become production incidents.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-9">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/projects')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Analyze a Project
          </Button>
          <Button
            size="lg"
            variant="secondary"
            loading={loadingDemo}
            onClick={handleTryDemo}
            icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
          >
            Try Customer RAG Demo
          </Button>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80 w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-2">
            CORE PLATFORM CAPABILITIES
          </h2>
          <p className="text-lg font-semibold text-slate-200">Integrated engineering intelligence for modern AI applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="saas-card-interactive p-6 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="default" size="sm">{cap.badge}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{cap.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Zero Execution Security Banner */}
      <section className="py-12 px-6 max-w-4xl mx-auto my-8 w-full">
        <div className="saas-card p-6 rounded-xl flex items-center gap-5 border-l-4 border-l-emerald-500">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 hidden sm:block">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span>Zero Code Execution Guarantee</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              AEGISAI performs pure static analysis on uploaded files. Code is parsed directly into Python AST data structures and is **never executed, compiled, or deployed**.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500">
        AEGISAI — AI Engineering Intelligence Platform © 2026. Enterprise SaaS Architecture.
      </footer>
    </div>
  );
};
