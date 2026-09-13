import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Tabs } from '../components/common/Tabs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { API_BASE_URL } from '../utils/constants';
import { Settings as SettingsIcon, ShieldCheck, Cpu, Lock, Database, Sliders, Eye, Server, Key } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [autoScanOnUpload, setAutoScanOnUpload] = useState(true);
  const [maxUploadSizeMB, setMaxUploadSizeMB] = useState(50);
  const [themeMode, setThemeMode] = useState('dark');

  const settingsTabs = [
    { id: 'general', label: 'General', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'analysis', label: 'Analysis', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'api', label: 'API & Integrations', icon: <Key className="w-3.5 h-3.5" /> },
    { id: 'system', label: 'System', icon: <Server className="w-3.5 h-3.5" /> },
  ];

  return (
    <PageContainer title="Platform Settings">
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Platform Settings</h2>
            <p className="text-xs text-slate-400">Configure system parameters, AI provider abstractions, and security guardrails.</p>
          </div>
        </div>

        {/* Settings Tab Bar */}
        <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: General Settings */}
        {activeTab === 'general' && (
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">
              GENERAL WORKSPACE SETTINGS
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                <div>
                  <h4 className="font-bold text-slate-200">Automatic AST Scan on ZIP Upload</h4>
                  <p className="text-slate-500 text-[11px]">Automatically trigger static analysis pipeline immediately after ZIP extraction.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoScanOnUpload}
                  onChange={(e) => setAutoScanOnUpload(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-bold text-slate-200">Max Archive Upload Limit (MB)</h4>
                  <p className="text-slate-500 text-[11px]">Maximum allowed ZIP upload size per project archive.</p>
                </div>
                <input
                  type="number"
                  value={maxUploadSizeMB}
                  onChange={(e) => setMaxUploadSizeMB(Number(e.target.value))}
                  className="w-24 bg-slate-950 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Appearance */}
        {activeTab === 'appearance' && (
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">
              THEME & INTERFACE APPEARANCE
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-200 mb-2">Theme Mode</label>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      themeMode === 'dark'
                        ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">Deep Dark SaaS (Default)</div>
                    <p className="text-[11px] text-slate-500 font-normal">Minimal dark engineering dashboard theme.</p>
                  </button>
                  <button
                    onClick={() => setThemeMode('slate')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      themeMode === 'slate'
                        ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">Slate Studio</div>
                    <p className="text-[11px] text-slate-500 font-normal">Balanced dark slate theme.</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Analysis Config */}
        {activeTab === 'analysis' && (
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">
              MULTI-ANALYZER PIPELINE ENGINE
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">Python AST Parser (`ast.parse`)</span>
                  <p className="text-slate-500 text-[11px]">Inspects bare exceptions, unhandled timeouts, breakpoint calls.</p>
                </div>
                <Badge variant="success" size="sm">Enabled</Badge>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">Security Credential Scanner</span>
                  <p className="text-slate-500 text-[11px]">Scans for API keys, SQL injection string formatting, shell=True subprocesses.</p>
                </div>
                <Badge variant="success" size="sm">Enabled</Badge>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">RAG Pattern Inspector</span>
                  <p className="text-slate-500 text-[11px]">Evaluates document chunk size, chunk overlap, top_k limits, metadata filters.</p>
                </div>
                <Badge variant="success" size="sm">Enabled</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-3">
              ZERO CODE EXECUTION GUARANTEES
            </h3>

            <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-sans">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">Static AST Execution Boundary</h4>
                <p>Uploaded source files are statically parsed into AST data structures and are <strong>never executed or imported</strong> into the runtime environment.</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">Path Traversal Defense</h4>
                <p>ZIP extractions reject all filenames containing relative traversal sequences (<code className="text-indigo-300">..</code>) or leading absolute paths.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: API & Integrations */}
        {activeTab === 'api' && (
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-3">
              API CONFIGURATION & PROVIDER ABSTRACTION
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">AI Provider Abstraction State</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When <code className="text-indigo-300">OPENAI_API_KEY</code> is present in backend environment, OpenAI API is used. Otherwise, system operates in <strong>Deterministic Demo Mode</strong>.
                </p>
                <div className="pt-2 flex items-center justify-between text-slate-300 font-mono text-[11px] border-t border-slate-800/80">
                  <span>Operating Mode:</span>
                  <span className="text-indigo-400 font-bold">Deterministic Demo Provider (Offline Ready)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">REST API Base Endpoint</span>
                  <span className="font-mono text-indigo-300 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    {API_BASE_URL}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: System Information */}
        {activeTab === 'system' && (
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">
              SYSTEM STATUS & VERSION INFO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">Platform Version:</span>
                <span className="text-slate-200 font-bold">1.0.0</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">Database Engine:</span>
                <span className="text-slate-200 font-bold">SQLite / SQLAlchemy</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">Frontend Stack:</span>
                <span className="text-slate-200 font-bold">React 18 / TypeScript / Vite</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">Backend Framework:</span>
                <span className="text-slate-200 font-bold">Python FastAPI 0.110</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
