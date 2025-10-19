
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SherlockForensicLogo } from '@/components/ui/sherlock-forensic-logo';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (emailRef.current) {
            localStorage.setItem('userEmail', emailRef.current.value);
            const loginEvent = {
                userEmail: emailRef.current.value,
                loginTime: new Date().toISOString(),
            };
            localStorage.setItem('lastLoginEvent', JSON.stringify(loginEvent));
        }

        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <Image
                src="/tank.jpg"
                alt="Abstract background"
                fill
                quality={100}
                className="object-cover animate-pan"
                data-ai-hint="dark abstract technology"
            />
            <div className="absolute inset-0 bg-background/60" />
        </div>
        
        {/* Left Side - Login Form */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center p-4 md:items-start md:p-12 lg:p-24">
            <div className="w-full max-w-md animate-fade-in-up">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10 text-white shadow-2xl shadow-primary/10">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                        <SherlockForensicLogo className="h-24 w-24" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white font-headline">Welcome Back</CardTitle>
                    <CardDescription className="text-white/80">
                        Sign in to access your forensic dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input ref={emailRef} id="email" type="email" placeholder="analyst@agency.gov" required className="bg-white/5 border-white/20 placeholder:text-white/50 pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="ml-auto inline-block text-sm underline text-white/80 hover:text-primary transition-colors">
                            Forgot your password?
                        </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="password" type="password" required className="bg-white/5 border-white/20 placeholder:text-white/50 pl-10" placeholder="••••••••" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full transform bg-primary py-6 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                    <span className="text-white/60">Don&apos;t have an account?{' '}</span>
                    <Link href="/signup" className="underline text-primary font-semibold">
                        Sign up
                    </Link>
                    </div>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
