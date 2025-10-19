'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

export function DashboardPage() {
  const auth = useAuth();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-primary">Welcome, Officer</h1>
      <p className="text-muted-foreground">You have successfully logged in.</p>
      <Button onClick={() => auth.signOut()} className="mt-8">
        Log Out
      </Button>
    </div>
  );
}
