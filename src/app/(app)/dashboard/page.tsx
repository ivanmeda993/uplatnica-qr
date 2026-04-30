import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { DashboardContent } from '@/modules/dashboard/components/dashboard-content';

export const metadata = {
  title: 'Početna',
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const greetingName = (
    session?.user.name?.split(' ')[0] ??
    session?.user.email.split('@')[0] ??
    'Ivan'
  ).trim();

  return <DashboardContent greetingName={greetingName} />;
}
