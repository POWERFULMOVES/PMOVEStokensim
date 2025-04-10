"use client";

import { MathModelDocumentation } from '@/components/documentation/MathModelDocumentation';

export default function MathModelPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mathematical Model Documentation</h1>
      <MathModelDocumentation />
    </div>
  );
}
