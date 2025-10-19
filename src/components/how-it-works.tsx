
'use client';

import { UploadCloud, Cpu, Search, FileDown, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: UploadCloud,
        title: "Upload UFDR Report",
        description: "Officers upload extracted files securely."
    },
    {
        icon: Cpu,
        title: "AI Analyzes & Indexes Data",
        description: "The engine structures chats, calls, and media."
    },
    {
        icon: Search,
        title: "Ask Natural Queries",
        description: "Type or speak queries to extract evidence."
    },
    {
        icon: FileDown,
        title: "Generate Reports & Insights",
        description: "Export findings instantly for the case file."
    }
];


export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20 sm:py-32 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">How Sherlock Forensic Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">A simple, 4-step journey from raw data to actionable intelligence.</p>
        </div>

        <div className="relative mt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
            {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                    <div key={index} className="relative flex flex-col items-center text-center">
                        <div
                            className="relative flex flex-col items-center justify-center animate-fade-in w-full"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="relative inline-flex items-center justify-center">
                                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"></div>
                                <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-card border border-border text-primary ring-4 ring-background z-10">
                                    <Icon className="h-10 w-10" />
                                </div>
                            </div>

                            <h3 className="mt-6 text-lg font-semibold text-foreground font-headline">{step.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <ArrowRight className="absolute top-8 left-full -translate-x-1/2 h-8 w-8 text-primary/30 hidden md:block" />
                        )}
                    </div>
                );
            })}
            </div>
        </div>
      </div>
    </section>
  );
}
