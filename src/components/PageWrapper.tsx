import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface PageWrapperProps {
  children: ReactNode;
  pageTitle: string;
}

export function PageWrapper({ children, pageTitle }: PageWrapperProps) {
  return (
    <div className="flex h-screen bg-white dark:bg-navy-900">
      <Sidebar />
      <main className="flex-1 ml-60">
        <TopNav pageTitle={pageTitle} />
        <div className="p-6 bg-slate-50 dark:bg-navy-900 min-h-[calc(100vh-4rem)]">{children}</div>
      </main>
    </div>
  );
}
