import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import { IncidentResult } from '../types';
import { AlertOctagon, Sparkles, CheckCircle2, ShieldAlert, Cpu, HelpCircle, History, Terminal } from 'lucide-react';

const SAMPLES = [
  {
    name: 'Network Connection Timeout',
    log: `Traceback (most recent call last):\n  File "/app/service.py", line 12, in fetch_external_user_tickets\n    response = requests.get(f"{CRM_ENDPOINT}?user_id={user_id}")\nrequests.exceptions.ConnectTimeout: HTTPSConnectionPool(host='crm.internal.example.com', port=443): Read timed out.`
  },
  {
    name: 'Unsafe Subprocess Invocation',
    log: `Traceback (most recent call last):\n  File "/app/main.py", line 42, in run_diagnostics\n    output = subprocess.check_output(f"echo {cmd}", shell=True).decode()\nsubprocess.CalledProcessError: Command 'echo test; cat /etc/passwd' returned non-zero exit status 1.`
  },
  {
    name: 'Vector Database Failure',
    log: `Traceback (most recent call last):\n  File "/app/rag.py", line 18, in get_vector_store\n    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))\nopenai.AuthenticationError: Incorrect API key provided.`
  }
];

export const IncidentAnalyzer: React.FC = () => {
  const [errorText, setErrorText] = useState('');
  const [result, setResult] = useState<IncidentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!errorText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.analyzeIncident(errorText);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Incident analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Incident & Traceback Analyzer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample Logs & Recent List (3 cols) */}
        <div className="lg:col-span-3 saas-card p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-300">INCIDENT LOG SAMPLES</h3>
          </div>

          <div className="space-y-2">
            {SAMPLES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setErrorText(s.log);
                  setResult(null);
                }}
                className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800/60 border border-slate-800 transition-colors text-xs font-sans font-semibold text-slate-300 hover:text-white"
              >
                <div className="text-[10px] font-mono text-indigo-400 mb-0.5">Sample 0{idx + 1}</div>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Traceback Input Editor (5 cols) */}
        <div className="lg:col-span-5 saas-card p-5 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="font-bold text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>INPUT ERROR TRACEBACK / LOG</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Paste stack traces or HTTP error logs for automated AST pattern matching and AI root cause diagnosis.
            </p>

            <textarea
              value={errorText}
              onChange={(e) => setErrorText(e.target.value)}
              placeholder="Paste an error, traceback, or application log..."
              rows={14}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
              {error}
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            loading={loading}
            disabled={!errorText.trim()}
            variant="primary"
            className="w-full"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Analyze Incident
          </Button>
        </div>

        {/* Right Column: AI Analysis & Diagnosis (4 cols) */}
        <div className="lg:col-span-4 saas-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-widest">
              AI ROOT CAUSE DIAGNOSIS
            </h3>
            {result && (
              <Badge variant="default" size="sm">
                {(result.confidence * 100).toFixed(0)}% Confidence
              </Badge>
            )}
          </div>

          {!result ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
              <HelpCircle className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">Awaiting Log Analysis</p>
              <p className="text-xs text-slate-600 max-w-xs mt-1">
                Select a sample on the left or paste an error trace to evaluate root cause.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  CLASSIFICATION
                </span>
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 font-bold text-xs">
                  {result.classification}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  PROBABLE ROOT CAUSE
                </span>
                <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
                  {result.probable_root_cause}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  IMPACT ASSESSMENT
                </span>
                <p className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300 leading-relaxed">
                  {result.impact}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  RECOMMENDED ACTION
                </span>
                <p className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                Limitations: {result.limitations}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
