import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#070A11] text-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} onMobileToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
