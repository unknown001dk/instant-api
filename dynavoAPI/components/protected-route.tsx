'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-9rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}