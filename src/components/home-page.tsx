
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Features } from './features-section';
import { HowItWorks } from './how-it-works';
import { Architecture } from './architecture';
import { Security } from './security';
import { AiHighlights } from './ai-highlights';
import { Team } from './team';
import { ContactUs } from './contact-us';
import { Footer } from './footer';
import { SherlockForensicLogo } from './ui/sherlock-forensic-logo';
import { LiveDemo } from './live-demo';
import { ReportsOutput } from './reports-output';
import { UseCases } from './use-cases';
import { ImpactVision } from './impact-vision';

export function HomePage() {
  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background text-foreground">
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/tank.jpg"
            alt="Abstract background"
            fill
            quality={100}
            className="object-cover animate-pan"
            data-ai-hint="dark abstract technology"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <Link href="/" className="flex items-center gap-3">
            <SherlockForensicLogo className="h-16 w-16 text-primary" />
            <h1 className="text-xl font-bold text-primary font-headline">
              Sherlock Forensic
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <p className="text-sm font-medium text-white/80">
              AI-Powered UFDR Analysis Assistant
            </p>
          </div>

          <Button asChild variant="ghost" className="transform text-white transition-all duration-300 hover:scale-105 hover:bg-white/10">
            <Link href="/login">Sign In</Link>
          </Button>
        </header>

        {/* Hero Content */}
        <main className="container relative z-10 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-fade-in-up">
              From Data to Evidence — <span className="text-primary">Instantly.</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white/80 md:text-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Analyze UFDRs, search in natural language, and uncover digital linkages using our advanced AI-powered forensic tool.
            </p>
            <div className="mt-10 flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="bg-primary text-primary-foreground text-lg font-semibold transition-transform duration-300 hover:scale-105">
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg font-semibold border-white/30 text-white transition-transform duration-300 hover:scale-105 hover:bg-white/10">
                <a href="#features" onClick={handleLearnMoreClick}>
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Features />
      <HowItWorks />
      <Architecture />
      <Security />
      <AiHighlights />
      <LiveDemo />
      <ReportsOutput />
      <Team />
      <UseCases />
      <ImpactVision />
      <ContactUs />
      <Footer />

    </div>
  );
}
