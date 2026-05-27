'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { getApiErrorMessage } from '@/lib/api-error';
import { qk } from '@/lib/query-keys';
import { type SettingsFormInput, settingsFormSchema } from '@/lib/validation/settings';

const EMPTY_SETTINGS: SettingsFormInput = {
  defaultPayerName: '',
  defaultPayerAddress: '',
};

export function PayerSettingsCard() {
  const queryClient = useQueryClient();
  const hydratedRef = useRef(false);

  const settingsQuery = useQuery({
    queryKey: qk.settings.detail(),
    queryFn: async () => {
      const res = await api.api.v1.settings.get();
      if (res.error) throw new Error(getApiErrorMessage(res.error));
      return res.data?.settings ?? EMPTY_SETTINGS;
    },
  });

  const form = useForm<SettingsFormInput>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: EMPTY_SETTINGS,
  });

  useEffect(() => {
    if (!settingsQuery.data || hydratedRef.current) return;
    form.reset(settingsQuery.data);
    hydratedRef.current = true;
  }, [form, settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (values: SettingsFormInput) => {
      const res = await api.api.v1.settings.patch({
        defaultPayerName: values.defaultPayerName || undefined,
        defaultPayerAddress: values.defaultPayerAddress || undefined,
      });
      if (res.error) throw new Error(getApiErrorMessage(res.error));
      return res.data?.settings;
    },
    onSuccess: (settings) => {
      const nextSettings = settings ?? EMPTY_SETTINGS;
      queryClient.setQueryData(qk.settings.detail(), nextSettings);
      form.reset(nextSettings);
      void queryClient.invalidateQueries({ queryKey: qk.settings.all });
      toast.success('Moji podaci su sačuvani');
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moji podaci</CardTitle>
        <CardDescription>
          Automatski se popunjavaju kao uplatilac kada generišeš novu uplatnicu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {settingsQuery.isError ? (
          <div className="border-border bg-surface/60 space-y-3 rounded-xl border p-4 text-sm">
            <p className="text-destructive">{settingsQuery.error.message}</p>
            <Button variant="outline" onClick={() => settingsQuery.refetch()}>
              Pokušaj ponovo
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
              noValidate
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="defaultPayerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uplatilac</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Petar Petrović"
                        disabled={settingsQuery.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ime koje će se upisivati u IPS polje P.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultPayerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresa uplatioca</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder={'Bulevar kralja Aleksandra 1\n11000 Beograd'}
                        disabled={settingsQuery.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Možeš da je promeniš za svaku pojedinačnu uplatnicu.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="brand"
                disabled={saveMutation.isPending || settingsQuery.isLoading}
              >
                <Save className="size-4" />
                {saveMutation.isPending ? 'Čuvam…' : 'Sačuvaj'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
