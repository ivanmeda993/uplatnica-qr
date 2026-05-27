'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
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
import { getBankByAccount } from '@/lib/banks/data';
import { type RecipientFormInput, recipientFormSchema } from '@/lib/ips-qr';
import { normalizeAccount } from '@/lib/ips-qr';
import { qk } from '@/lib/query-keys';
import { cn } from '@/lib/utils';

import { PaymentCodeField } from '../../uplatnica/components/payment-code-field';
import { RECIPIENT_COLORS } from '../lib/format';

interface RecipientFormProps {
  recipientId?: string;
  defaultValues?: Partial<RecipientFormInput>;
  onSuccess: () => void;
}

export function RecipientForm({ recipientId, defaultValues, onSuccess }: RecipientFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<RecipientFormInput>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      label: '',
      name: '',
      address: '',
      account: '',
      reference: '',
      defaultAmount: '',
      paymentCode: '289',
      purpose: '',
      color: RECIPIENT_COLORS[0],
      ...defaultValues,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: RecipientFormInput) => {
      const body = {
        label: values.label,
        name: values.name,
        address: values.address || undefined,
        account: normalizeAccount(values.account),
        purpose: values.purpose || undefined,
        paymentCode: values.paymentCode || undefined,
        reference: values.reference || undefined,
        defaultAmount: values.defaultAmount || undefined,
        color: values.color || undefined,
      };
      if (recipientId) {
        const res = await api.api.v1.recipients({ id: recipientId }).patch(body);
        if (res.error) throw new Error(getApiErrorMessage(res.error));
        return res.data?.recipient;
      }
      const res = await api.api.v1.recipients.post(body);
      if (res.error) throw new Error(getApiErrorMessage(res.error));
      return res.data?.recipient;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.recipients.all });
      toast.success(recipientId ? 'Primalac izmenjen' : 'Primalac dodat');
      onSuccess();
    },
    onError: (e) => toast.error(e.message),
  });

  const colorValue = form.watch('color') || RECIPIENT_COLORS[0];
  const accountValue = form.watch('account');
  const detectedBank = getBankByAccount(accountValue || '');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        noValidate
        className="mx-auto w-full max-w-2xl space-y-5 px-5 pb-4 sm:px-6"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Naziv šablona</FormLabel>
              <FormControl>
                <Input placeholder="Mama Ljubica" {...field} />
              </FormControl>
              <FormDescription>Tako će biti prikazan u listi.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Boja</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {RECIPIENT_COLORS.map((c) => {
                    const selected = colorValue === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Boja ${c}`}
                        aria-pressed={selected}
                        onClick={() => field.onChange(c)}
                        className={cn(
                          'flex size-9 items-center justify-center rounded-full border-2 transition-all',
                          selected
                            ? 'border-foreground scale-110'
                            : 'border-transparent hover:scale-105'
                        )}
                        style={{ backgroundColor: c }}
                      >
                        {selected && <Check className="size-4 text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Naziv primaoca</FormLabel>
              <FormControl>
                <Input placeholder="Ljubica Petrović" {...field} />
              </FormControl>
              <FormDescription>Ide u IPS QR kao polje N (max 70 znakova).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresa primaoca</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder={'Bulevar kralja Aleksandra 1\n11000 Beograd'}
                  {...field}
                />
              </FormControl>
              <FormDescription>Popunjava adresu primaoca u IPS QR polju N.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Račun primaoca</FormLabel>
              <FormControl>
                <Input
                  placeholder="265-1710320000001-66 ili 18 cifara"
                  inputMode="numeric"
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              {detectedBank ? (
                <FormDescription>
                  Banka: <span className="text-foreground font-medium">{detectedBank.name}</span>
                </FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poziv na broj</FormLabel>
              <FormControl>
                <Input
                  placeholder="265000000245182930"
                  inputMode="numeric"
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>Prve 2 cifre = model (npr. 97).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default iznos</FormLabel>
              <FormControl>
                <Input placeholder="8612,80" inputMode="decimal" className="font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Šifra plaćanja</FormLabel>
              <FormControl>
                <PaymentCodeField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Svrha plaćanja</FormLabel>
              <FormControl>
                <Input placeholder="Mesečna pomoć" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DrawerFooter className="-mx-5 sm:-mx-6">
          <DrawerClose asChild>
            <Button type="button" variant="outline">
              Otkaži
            </Button>
          </DrawerClose>
          <Button type="submit" variant="brand" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Čuvam…' : recipientId ? 'Sačuvaj izmene' : 'Dodaj primaoca'}
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
}
