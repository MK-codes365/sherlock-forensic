
'use client';

import { Fingerprint, Target, Landmark, Building2, Share2 } from 'lucide-react';

const useCases = [
  {
    icon: Fingerprint,
    title: "Cybercrime Investigations",
    description: "Analyze digital evidence from various devices to track and prosecute cybercriminals effectively."
  },
  {
    icon: Target,
    title: "Counter-Terrorism",
    description: "Trace communication patterns and networks to prevent threats and identify suspects."
  },
  {
    icon: Landmark,
    title: "Fraud & Financial Crime",
    description: "Uncover hidden financial transactions and fraudulent activities within large datasets."
  },
  {
    icon: Building2,
    title: "Corporate Internal Audits",
    description: "Conduct internal investigations to ensure compliance and identify unauthorized data access."
  },
  {
    icon: Share2,
    title: "Inter-Agency Intelligence Sharing",
    description: "Securely share and correlate intelligence across different agencies to build stronger cases."
  }
];

export function UseCases() {
  return (
    <section id="use-cases" className="w-full py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Real-World Applications</h2>
          <p className="mt-4 text-lg text-muted-foreground">From national security to corporate compliance, Sherlock Forensic provides critical intelligence across various sectors.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="group relative text-center p-8 rounded-2xl bg-card border border-border/20 overflow-hidden transform-gpu transition-all duration-300 will-change-transform hover:!scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground font-headline">{useCase.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
