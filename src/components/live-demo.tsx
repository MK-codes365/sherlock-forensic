
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';

const screenshots = [
  {
    title: 'UFDR Upload Interface',
    imageId: 'screenshot-ufdr-upload',
    description: 'Securely upload and process UFDR files to begin your investigation.',
  },
  {
    title: 'AI Query Chat UI',
    imageId: 'screenshot-ai-query',
    description: 'Interact with your data using natural language to find evidence quickly.',
  },
  {
    title: 'Generated Reports Page',
    imageId: 'screenshot-reports',
    description: 'View, manage, and download all AI-generated and manual case reports.',
  },
  {
    title: 'Detailed Report View',
    imageId: 'screenshot-reports-2',
    description: 'Examine detailed, court-ready reports with summaries and key findings.',
  },
];

export function LiveDemo() {
  return (
    <section id="live-demo" className="w-full py-20 sm:py-32 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Explore the Sherlock Forensic Dashboard
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Visualize the powerful and intuitive interface of our platform.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {screenshots.map((screenshot, index) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === screenshot.imageId
            );
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card p-4 shadow-lg animate-fade-in-up transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative aspect-video overflow-hidden rounded-lg bg-black/20">
                  <Image
                    src={image?.imageUrl || ''}
                    alt={screenshot.title}
                    fill
                    className="object-cover object-center transition-transform duration-500"
                    data-ai-hint={image?.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-foreground">
                            {screenshot.title}
                        </h3>
                        <Badge variant="outline">Prototype Preview</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{screenshot.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
