import React, { useState } from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  FolderGit2,
  AlertOctagon,
  Bot,
  Settings as SettingsIcon,
  Layers,
  ShieldCheck,
  Package,
  GitFork,
  Menu,
  X,
  Activity,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { id: projectId } = useParams<{ id: string }>();
  const location = useLocation();

  const activeProjPath = projectId ? `/projects/${projectId}` : '';

  const platformNav = [
    { name: 'Overview', path: '/', icon: ShieldAlert, end: true },
    { name: 'Global Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Incident Analyzer', path: '/incidents', icon: AlertOctagon },
    { name: 'Engineering Agent', path: '/agent', icon: Bot },
  ];

  const toolsNav = projectId
    ? [
        { name: 'RAG Analysis', path: `${activeProjPath}/architecture`, icon: Layers },
        { name: 'Security', path: `${activeProjPath}/issues?category=security`, icon: ShieldCheck },
        { name: 'Dependencies', path: `${activeProjPath}/issues?category=dependency`, icon: Package },
        { name: 'Architecture', path: `${activeProjPath}/architecture`, icon: GitFork },
      ]
    : [
        { name: 'RAG Analysis', path: '/projects', icon: Layers },
        { name: 'Security', path: '/projects', icon: ShieldCheck },
        { name: 'Dependencies', path: '/projects', icon: Package },
        { name: 'Architecture', path: '/projects', icon: GitFork },
      ];

  const systemNav = [
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const renderNavSection = (title: string, items: typeof platformNav) => (
    <div className="mb-6">
      <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-150 relative ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-300 font-bold border-l-2 border-indigo-500 pl-2.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-[#090D16] border-r border-slate-800/80 flex flex-col h-screen shrink-0 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Branding */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:border-indigo-500/60 transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight leading-none">
                AEGIS<span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">
                ENGINEERING INTEL
              </p>
            </div>
          </NavLink>

          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-5 select-none">
          {renderNavSection('PLATFORM', platformNav)}
          {renderNavSection('TOOLS', toolsNav)}
          {renderNavSection('SYSTEM', systemNav)}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-300">System Ready</span>
            </div>
            <span className="text-slate-600 font-bold">v1.0.0</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono truncate">AST Engine: Active</p>
        </div>
      </aside>
    </>
  );
};
