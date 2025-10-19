
'use client';

import { BrainCircuit, Cpu, Zap, BadgeCheck } from 'lucide-react';

const highlights = [
  {
    icon: Zap,
    title: "Crypto Wallet Detection",
    description: "Automatically flags Bitcoin, Ethereum, and other crypto wallet addresses in any text.",
  },
  {
    icon: Cpu,
    title: "Cross-Device Communication Linking",
    description: "Identifies and links conversations between individuals across multiple seized devices.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Conversation Summarization",
    description: "Generates summaries of long chat threads, complete with risk scoring and sentiment analysis.",
  },
  {
    icon: BadgeCheck,
    title: "Explainable AI Justifications",
    description: "Provides clear reasoning for its findings, ensuring transparency for investigators.",
  },
];

export function AiHighlights() {
  return (
    <section id="ai-highlights" className="w-full py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Intelligence Beyond Search</h2>
          <p className="mt-4 text-lg text-muted-foreground">Our AI engine doesn't just find data—it uncovers insights, patterns, and hidden connections.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="group relative flex items-start gap-6 p-6 rounded-xl bg-card border border-border/20 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/80 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-headline">{highlight.title}</h3>
                  <p className="mt-1 text-muted-foreground">{highlight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
