
'use client';

import {
  Upload,
  Sparkles,
  Unlock,
  EyeOff,
  Network,
  CalendarClock,
  ScanText,
  ScanSearch,
  Mic,
  Regex,
  DatabaseZap,
  Hash,
  LayoutDashboard,
  ShieldAlert,
  Voicemail,
  FileText,
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Multi-format UFDR Ingestion',
    description: 'Supports parsing and loading UFDRs in XML and JSON formats for forensic data extraction.',
  },
  {
    icon: Sparkles,
    title: 'Automated Normalization/Cleaning',
    description: 'Automatically standardizes and cleans UFDR data to ensure consistency and usability.',
  },
  {
    icon: Unlock,
    title: 'Cryptic Code Decryption',
    description: 'Decrypts encrypted data within UFDRs using secure cryptographic techniques.',
  },
  {
    icon: EyeOff,
    title: 'Privacy Controls with Anonymization',
    description: 'Implements anonymization to protect sensitive personal data during analysis.',
  },
  {
    icon: Network,
    title: 'NER-driven Entity Graphing',
    description: 'Uses spaCy to identify and visualize entities (e.g., names, addresses) as graphs for investigation.',
  },
  {
    icon: CalendarClock,
    title: 'AI-powered Timeline Reconstruction',
    description: 'Constructs timelines from UFDR data using AI to correlate events and activities.',
  },
  {
    icon: ScanText,
    title: 'Multimedia OCR Analysis',
    description: 'Extracts text from images and videos in UFDRs using Tesseract for evidence review.',
  },
  {
    icon: ScanSearch,
    title: 'Steganography Detection',
    description: 'Identifies hidden data in UFDR multimedia files using Stegano for security analysis.',
  },
  {
    icon: Voicemail,
    title: 'Sentiment/Voice Analysis',
    description: 'Analyzes audio sentiment and tone using TextBlob and SpeechRecognition for emotional insights.',
  },
  {
    icon: Regex,
    title: 'Pattern Matching',
    description: 'Detects specific patterns (e.g., crypto addresses) in UFDR text using regex and NLP.',
  },
  {
    icon: DatabaseZap,
    title: 'Steganography Heatmap Visualization',
    description: 'Visualizes steganography findings in UFDR files with Matplotlib heatmaps.',
  },
  {
    icon: Hash,
    title: 'Basic Hashing for Evidence Integrity',
    description: 'Ensures data integrity in UFDRs using hashlib SHA-256 verification.',
  },
  {
    icon: LayoutDashboard,
    title: 'Real-time Decoding Dashboard',
    description: 'Provides a Flask-based dashboard for live decryption and monitoring of UFDR data.',
  },
  {
    icon: ShieldAlert,
    title: 'Evidence Prioritization',
    description: 'Ranks UFDR evidence based on relevance using automated prioritization logic.',
  },
  {
    icon: Mic,
    title: 'NLP with Voice Command Support',
    description: 'Enables natural language queries and voice commands via NLTK and SpeechRecognition.',
  },
  {
    icon: FileText,
    title: 'Auto-summarized Report Generation',
    description: 'Generates concise reports from UFDR analysis using ReportLab for quick insights.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative w-full py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Powerful Features for Modern Forensics</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to accelerate your digital investigations and uncover critical evidence.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border border-border/20 overflow-hidden transform-gpu transition-all duration-300 will-change-transform hover:!scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-foreground font-headline">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
