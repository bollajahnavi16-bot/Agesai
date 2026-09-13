import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ShieldCheck, Cpu, Bell, User, Menu, ChevronRight } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

interface TopbarProps {
  title?: string;
  onMobileToggle?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'Dashboard', onMobileToggle }) => {
  const { id: currentProjectId } = useParams<{ id: string }>();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const currentProject = projects.find(p => p.id === currentProjectId);

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      navigate(`/projects/${val}`);
    }
  };

  return (
    <header className="h-14 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileToggle}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500 font-sans font-medium">AEGISAI</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          {currentProject ? (
            <div className="flex items-center gap-2">
              <select
                value={currentProjectId}
                onChange={handleProjectSelect}
                className="bg-slate-900 border border-slate-700/80 text-xs font-sans font-semibold text-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-sans font-semibold">{title}</span>
            </div>
          ) : (
            <span className="text-slate-200 font-sans font-semibold">{title}</span>
          )}
        </div>
      </div>

      {/* Right: Status Indicators, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Status Indicators */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-800 text-emerald-400 px-2.5 py-1 rounded-md font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AST Scanner</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-800 text-indigo-300 px-2.5 py-1 rounded-md font-mono">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Engine</span>
          </div>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0D121F] border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="font-bold text-white">Notifications</span>
                <span className="text-[10px] text-slate-500 font-mono">2 System Alerts</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <p className="font-semibold text-indigo-300">AST Analysis Complete</p>
                  <p className="text-[11px] text-slate-400">Customer Support RAG API scanned with 7 findings.</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <p className="font-semibold text-amber-400">Telemetry Anomaly Detected</p>
                  <p className="text-[11px] text-slate-400">Latency spike (+340ms) detected in vector search.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
              AI
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0D121F] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="font-bold text-white">Engineer Workspace</p>
                <p className="text-[10px] text-slate-400 truncate">aegis-admin@company.internal</p>
              </div>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                Settings & API Status
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
