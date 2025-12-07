'use client';

import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const isPublicRoute = pathname === '/login';

  useEffect(() => {
    if (!isPublicRoute && !isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router, isPublicRoute]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}
