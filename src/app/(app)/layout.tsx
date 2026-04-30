import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { BottomNav } from '@/components/layout/bottom-nav';
import { auth } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pt-[max(2.5rem,env(safe-area-inset-top)+1rem)] pb-32 sm:px-8 sm:pt-[max(3rem,env(safe-area-inset-top)+1rem)] md:px-12 md:pt-[max(3.5rem,env(safe-area-inset-top)+1rem)] lg:px-14">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
