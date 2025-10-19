
'use client';

import { Globe } from 'lucide-react';

export function ImpactVision() {
  return (
    <section id="impact-vision" className="relative w-full py-20 sm:py-32 bg-card/30 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 border-4 border-primary/20">
                <Globe className="h-12 w-12 text-primary" />
              </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Transforming Digital Forensics with AI</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Sherlock Forensic empowers law enforcement agencies to analyze terabytes of forensic data in minutes, accelerating investigations and enabling faster justice. Our vision is to build a unified, secure AI ecosystem for digital forensics across India.
          </p>
        </div>
      </div>
    </section>
  );
}
