import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectOverview } from './pages/ProjectOverview';
import { ProjectIssues } from './pages/ProjectIssues';
import { ProjectFiles } from './pages/ProjectFiles';
import { Architecture } from './pages/Architecture';
import { IncidentAnalyzer } from './pages/IncidentAnalyzer';
import { EngineeringAgentPage } from './pages/EngineeringAgent';
import { Observability } from './pages/Observability';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectOverview />} />
        <Route path="/projects/:id/issues" element={<ProjectIssues />} />
        <Route path="/projects/:id/files" element={<ProjectFiles />} />
        <Route path="/projects/:id/architecture" element={<Architecture />} />
        <Route path="/projects/:id/observability" element={<Observability />} />
        <Route path="/incidents" element={<IncidentAnalyzer />} />
        <Route path="/agent" element={<EngineeringAgentPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
