import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PMOVES Documentation',
  description: 'Documentation for the PMOVES Token Simulator',
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
          &larr; Back to Simulator
        </Link>
        <h1 className="text-3xl font-bold">PMOVES Documentation</h1>
        <p className="text-muted-foreground">
          Comprehensive documentation for the PMOVES Token Simulator
        </p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <Link href="/documentation" className="block p-2 hover:bg-gray-100 rounded">
              Overview
            </Link>
            <Link href="/documentation/mathematical-model" className="block p-2 hover:bg-gray-100 rounded">
              Mathematical Model
            </Link>
            <Link href="/documentation/presets" className="block p-2 hover:bg-gray-100 rounded">
              Preset Scenarios
            </Link>
            <Link href="/documentation/metrics" className="block p-2 hover:bg-gray-100 rounded">
              Key Metrics
            </Link>
            <Link href="/documentation/interpretation" className="block p-2 hover:bg-gray-100 rounded">
              Interpretation Guide
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
