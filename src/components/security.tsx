
'use client';
import { ShieldCheck, Lock, Fingerprint, History, ShieldEllipsis } from 'lucide-react';

const securityFeatures = [
    { icon: Lock, text: "AES-256 encryption for all uploaded UFDRs." },
    { icon: Fingerprint, text: "Role-Based Access Control (RBAC) for investigators." },
    { icon: ShieldEllipsis, text: "Two-Factor Authentication for secure login." },
    { icon: History, text: "Comprehensive audit trail for every data access." },
];

export function Security() {
  return (
    <section id="security" className="w-full py-20 sm:py-32 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
             <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mb-6 border-4 border-primary/20">
                <ShieldCheck className="h-12 w-12 text-primary" />
             </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Security You Can Trust</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built from the ground up with security as a priority, ensuring that sensitive forensic data remains protected at all times.
            </p>
          </div>
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
