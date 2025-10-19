
'use client';

import Image from 'next/image';
import { Linkedin, Github } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const teamMembers = [
  {
    name: 'Shreya Jain',
    role: 'Team Leader & AI/ML Engineer',
    imageUrlId: 'team-member-1',
    linkedin: 'https://www.linkedin.com/in/shreya-jain-ba7034275?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    github: '#',
  },
  {
    name: 'Mukut Kumar',
    role: 'Frontend Developer',
    imageUrlId: 'team-member-2',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Vimal Singh',
    role: 'Backend Developer',
    imageUrlId: 'team-member-3',
    linkedin: 'https://www.linkedin.com/in/vimal-singh-it?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: '#',
  },
  {
    name: 'Madhu Maddheshiya',
    role: 'UI/UX Designer',
    imageUrlId: 'team-member-4',
    linkedin: 'https://www.linkedin.com/in/madhu-maddheshiya-212395323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    github: '#',
  },
  {
    name: 'Ashutosh Singh',
    role: 'Security Analyst',
    imageUrlId: 'team-member-5',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Ayush Singh',
    role: 'Logo Designer',
    imageUrlId: 'team-member-6',
    linkedin: '#',
    github: '#',
  },
];

export function Team() {
  return (
    <section id="team" className="w-full py-20 sm:py-32 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Meet the Team</h2>
          <p className="mt-4 text-lg text-muted-foreground">The brilliant minds behind Sherlock Forensic, dedicated to revolutionizing digital forensics.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            const image = PlaceHolderImages.find(img => img.id === member.imageUrlId);
            return (
              <div
                key={member.imageUrlId}
                className="group relative flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border/30 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-card opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-px rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-300"></div>

                <div className="relative h-32 w-32 rounded-full border-4 border-primary/50 mb-4 overflow-hidden transition-all duration-300 group-hover:border-primary">
                  <Image
                    src={image?.imageUrl || ''}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={image?.imageHint}
                    unoptimized
                  />
                </div>
                <h3 className="relative text-lg font-bold text-foreground font-headline">{member.name}</h3>
                <p className="relative text-sm text-primary">{member.role}</p>

                <div className="relative mt-4 flex gap-4">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
