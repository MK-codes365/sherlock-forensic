
'use client';

import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { SherlockForensicLogo } from './ui/sherlock-forensic-logo';

export function Footer() {
  return (
    <footer className="w-full bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <SherlockForensicLogo className="h-12 w-12 text-primary" />
              <h1 className="text-xl font-bold text-primary font-headline">
                Sherlock Forensic
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              AI-Powered UFDR Analysis Assistant for Modern Digital Forensics.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6 mb-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin /></a>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Sherlock Forensic. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
