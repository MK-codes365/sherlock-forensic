import { cn } from "@/lib/utils";

export function SherlockForensicLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="group transition-transform duration-300 ease-in-out hover:scale-110">
      <svg
        width="200"
        height="200"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-full w-full drop-shadow-[0_2px_4px_hsla(var(--primary),0.5)] transition-all duration-300 group-hover:drop-shadow-[0_4px_12px_hsla(var(--primary),0.8)]", className)}
        {...props}
      >
        <rect width="400" height="400" fill="hsl(var(--background))"/>
        <g transform="translate(200, 150)">
            <path d="M-50 -80 C-75 -80 -100 -50 -100 0 L-100 80 C-100 100 -75 120 0 120 C75 120 100 100 100 80 L100 0 C100 -50 75 -80 50 -80 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="4" opacity="0.6"/>
            <circle cx="0" cy="0" r="70" fill="none" stroke="hsl(var(--foreground))" strokeWidth="8"/>
            <rect x="50" y="50" width="70" height="20" rx="10" fill="#AAAAAA" transform="rotate(45 50 50)"/>
            <circle cx="0" cy="0" r="60" fill="hsl(var(--primary))" opacity="0.8"/>
        </g>
        <g textAnchor="middle" fontFamily="var(--font-headline), Arial, sans-serif">
            <text x="200" y="300" fontSize="50" fontWeight="900" fill="hsl(var(--primary))">
                SHERLOCK
            </text>
            <text x="200" y="345" fontSize="24" fontWeight="300" fill="hsl(var(--primary-foreground))">
                FORENSIC
            </text>
        </g>
    </svg>
    </div>
  );
}
