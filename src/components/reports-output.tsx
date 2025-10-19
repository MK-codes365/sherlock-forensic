
'use client';
import { CheckCircle, FileText, Download, ListTree, Highlighter } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const reportFeatures = [
    { icon: FileText, text: "Case summary PDF with timestamps." },
    { icon: ListTree, text: "Evidence list with all associated metadata." },
    { icon: Highlighter, text: "Key findings, keyword highlights, and communication patterns." },
    { icon: Download, text: "Exportable for legal and court submission." },
];

export function ReportsOutput() {
  return (
    <section id="reports-output" className="w-full py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
             <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Auto-Generated Investigation Reports</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sherlock Forensic transforms complex data into clear, concise, and court-ready reports. Instantly generate and export comprehensive summaries of your findings.
            </p>
             <div className="mt-8 space-y-6">
                {reportFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div 
                        key={index} 
                        className="flex items-start gap-4 p-4 rounded-lg"
                    >
                    <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-foreground">{feature.text}</p>
                    </div>
                );
                })}
            </div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Card className="p-4 bg-card/80 border-border/50 shadow-lg">
                <CardContent className="p-0">
                    <div className="relative aspect-[3/4] bg-secondary rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FileText className="w-24 h-24 text-primary/30" />
                        <h3 className="mt-4 font-semibold text-lg">CASE-001_Report.pdf</h3>
                        <Badge variant="secondary" className="mt-2">Ready to Download</Badge>
                         <div className="absolute top-4 right-4">
                            <Download className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer" />
                         </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
