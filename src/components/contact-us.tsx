
'use client';

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin } from 'lucide-react';

export function ContactUs() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here.
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <section id="contact" className="relative w-full py-20 sm:py-32 bg-background overflow-hidden">
       <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card/50 to-transparent -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Get In Touch</h2>
          <p className="mt-4 text-lg text-muted-foreground">We'd love to hear from you. Whether you have a question, feedback, or need a demo, reach out to us.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Email</h3>
                        <p className="text-muted-foreground">Contact us for support or inquiries.</p>
                        <a href="mailto:support@sherlockforensics.com" className="text-primary hover:underline">support@sherlockforensics.com</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Phone</h3>
                        <p className="text-muted-foreground">Our team is available during business hours.</p>
                        <a href="tel:+917535947485" className="text-primary hover:underline">+91 7535947485</a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Office</h3>
                        <p className="text-muted-foreground">Kalyanpur, Kanpur, Uttar Pradesh, India-208024</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-lg animate-fade-in" style={{ animationDelay: '300ms' }}>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <Input type="text" id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <Input type="email" id="email" name="email" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                        <Textarea id="message" name="message" placeholder="How can we help you?" rows={4} required />
                    </div>
                    <Button type="submit" className="w-full text-lg">Send Message</Button>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
}
