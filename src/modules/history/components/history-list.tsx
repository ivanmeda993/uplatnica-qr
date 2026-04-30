'use client';

import { useQuery } from '@tanstack/react-query';
import { History as HistoryIcon } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { qk } from '@/lib/query-keys';
import {
  UplatnicaList,
  type UplatnicaListItem,
} from '@/modules/uplatnica/components/uplatnica-list';

export function HistoryList() {
  const uplatniceQuery = useQuery({
    queryKey: qk.uplatnice.list(100),
    queryFn: async () => {
      const res = await api.api.v1.uplatnice.get({ query: { limit: 100 } });
      if (res.error) throw new Error(String(res.error.value));
      return (res.data?.items ?? []) as UplatnicaListItem[];
    },
  });

  if (uplatniceQuery.isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  const items = uplatniceQuery.data ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon={HistoryIcon}
        title="Istorija je prazna"
        description="Kad generišeš prvu uplatnicu, pojaviće se ovde — sa mogućnošću označavanja kao plaćene."
      />
    );
  }

  return <UplatnicaList items={items} grouped invalidateQueryKey={qk.uplatnice.all} />;
}
