'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { qk } from '@/lib/query-keys';

import { RecipientCard, type RecipientItem } from './recipient-card';
import { RecipientSheet } from './recipient-sheet';

export function RecipientList() {
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<RecipientItem | undefined>(undefined);

  const recipientsQuery = useQuery({
    queryKey: qk.recipients.list(),
    queryFn: async () => {
      const res = await api.api.v1.recipients.get();
      if (res.error) throw new Error(String(res.error.value));
      return (res.data?.items ?? []) as RecipientItem[];
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.v1.recipients({ id }).delete();
      if (res.error) throw new Error(String(res.error.value));
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.recipients.all });
      toast.success('Primalac arhiviran');
    },
    onError: (e) => toast.error(e.message),
  });

  function openNew() {
    setEditing(undefined);
    setSheetOpen(true);
  }

  function openEdit(r: RecipientItem) {
    setEditing(r);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            {recipientsQuery.data?.length
              ? `${recipientsQuery.data.length} sačuvanih primalaca.`
              : 'Sačuvaj primaoce koje često plaćaš da uštediš vreme.'}
          </p>
          <Button variant="brand" size="sm" onClick={openNew} aria-label="Dodaj primaoca">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Dodaj</span>
          </Button>
        </div>

        {recipientsQuery.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        ) : recipientsQuery.isError ? (
          <EmptyState
            title="Greška pri učitavanju"
            description={recipientsQuery.error.message}
            action={
              <Button variant="outline" onClick={() => recipientsQuery.refetch()}>
                Pokušaj ponovo
              </Button>
            }
          />
        ) : recipientsQuery.data && recipientsQuery.data.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {recipientsQuery.data.map((r) => (
              <RecipientCard
                key={r.id}
                recipient={r}
                onEdit={() => openEdit(r)}
                onArchive={() => archiveMutation.mutate(r.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Još nema primalaca"
            description="Dodaj banku, telefonskog operatera ili naplatu komunalija — kad ti zatreba QR, otvoriš šablon i menjaš samo iznos."
            action={
              <Button variant="brand" onClick={openNew}>
                <Plus className="size-4" />
                Dodaj primaoca
              </Button>
            }
          />
        )}
      </div>

      <RecipientSheet open={sheetOpen} onOpenChange={setSheetOpen} recipient={editing} />
    </>
  );
}
