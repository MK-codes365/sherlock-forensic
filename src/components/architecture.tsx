
'use client';

import { Smartphone, Server, BrainCircuit, Database, ShieldCheck, ArrowRight } from 'lucide-react';

const components = [
    { icon: Smartphone, title: "Frontend", description: "Next.js Dashboard" },
    { icon: Server, title: "Backend", description: "FastAPI / Node.js" },
    { icon: BrainCircuit, title: "AI Layer", description: "LLM + RAG + Embeddings" },
    { icon: Database, title: "Database", description: "PostgreSQL / MongoDB" },
    { icon: ShieldCheck, title: "Security", description: "AES Encryption + JWT" },
];

export function Architecture() {
  return (
    <section id="architecture" className="relative w-full py-20 sm:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">System Architecture Overview</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">A robust, scalable, and secure architecture designed for high-performance forensic analysis.</p>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-5 gap-8 items-center justify-center">
          {components.map((component, index) => {
            const Icon = component.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-6 bg-card/50 border border-border/20 rounded-xl transition-all duration-300 hover:bg-card hover:border-primary/50 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground font-headline">{component.title}</h3>
                <p className="text-sm text-muted-foreground">{component.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
