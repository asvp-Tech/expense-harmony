import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container px-4 py-6">
        {children}
      </main>
    </div>
  );
}
