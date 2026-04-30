'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CircleAlert, Sparkles, Wand2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { getBankByAccount } from '@/lib/banks/data';
import {
  encodeUplatnica,
  normalizeAccount,
  type UplatnicaFormInput,
  uplatnicaFormSchema,
  validateAccountChecksum,
} from '@/lib/ips-qr';
import { qk } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import { QrDisplay } from '@/modules/qr/components/qr-display';
import { formatAmountDisplay } from '@/modules/recipient/lib/format';

import { PaymentCodeField } from './payment-code-field';

interface RecipientOption {
  id: string;
  label: string;
  name: string;
  account: string;
  reference: string | null;
  defaultAmount: string | null;
  paymentCode: string | null;
  purpose: string | null;
  color: string | null;
}

interface UplatnicaFormProps {
  defaultValues?: Partial<UplatnicaFormInput>;
  selectedRecipientId?: string;
  onRecipientChange?: (id: string) => void;
  qrPayload: string | null;
  onQrPayload: (payload: string | null) => void;
  /** Hide the recipient select (e.g. on /scan page) */
  hideRecipientSelect?: boolean;
  /**
   * Anonymous demo mode for the public landing page.
   * Hides the template card + save mutation, shows a single "Generate" button,
   * never calls the auth-protected /api/v1/* endpoints.
   */
  anonymous?: boolean;
}

export function UplatnicaForm({
  defaultValues,
  selectedRecipientId,
  onRecipientChange,
  qrPayload,
  onQrPayload,
  hideRecipientSelect,
  anonymous = false,
}: UplatnicaFormProps) {
  const queryClient = useQueryClient();
  const hideTemplate = anonymous || hideRecipientSelect;

  const recipientsQuery = useQuery({
    queryKey: qk.recipients.list(),
    queryFn: async () => {
      const res = await api.api.v1.recipients.get();
      if (res.error) throw new Error(String(res.error.value));
      return (res.data?.items ?? []) as RecipientOption[];
    },
    enabled: !hideTemplate,
  });

  const form = useForm<UplatnicaFormInput>({
    resolver: zodResolver(uplatnicaFormSchema),
    defaultValues: {
      recipientId: selectedRecipientId ?? '',
      payerName: '',
      payerAddress: '',
      recipientName: '',
      recipientAddress: '',
      account: '',
      purpose: '',
      paymentCode: '',
      reference: '',
      amount: '',
      ...defaultValues,
    },
  });

  // Prefill from selected recipient
  useEffect(() => {
    if (!selectedRecipientId || !recipientsQuery.data) return;
    const r = recipientsQuery.data.find((x) => x.id === selectedRecipientId);
    if (!r) return;
    form.reset({
      recipientId: r.id,
      payerName: form.getValues('payerName'),
      payerAddress: form.getValues('payerAddress'),
      recipientName: r.name,
      recipientAddress: '',
      account: r.account,
      purpose: r.purpose ?? '',
      paymentCode: r.paymentCode ?? '',
      reference: r.reference ?? '',
      amount: r.defaultAmount ?? '',
    });
    onQrPayload(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipientId, recipientsQuery.data]);

  const qrCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrPayload) return;
    const id = requestAnimationFrame(() => {
      qrCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [qrPayload]);

  const saveMutation = useMutation({
    mutationFn: async (values: UplatnicaFormInput) => {
      const { qrString } = encodeUplatnica(values);
      const res = await api.api.v1.uplatnice.post({
        recipientId: values.recipientId || undefined,
        payerName: values.payerName || undefined,
        payerAddress: values.payerAddress || undefined,
        recipientName: values.recipientName,
        recipientAddress: values.recipientAddress || undefined,
        account: normalizeAccount(values.account),
        purpose: values.purpose || undefined,
        paymentCode: values.paymentCode || undefined,
        reference: values.reference || undefined,
        amount: values.amount,
      });
      if (res.error) throw new Error(String(res.error.value));
      return { qrString, uplatnica: res.data?.uplatnica };
    },
    onSuccess: ({ qrString }) => {
      onQrPayload(qrString);
      void queryClient.invalidateQueries({ queryKey: qk.uplatnice.all });
      toast.success('Uplatnica sačuvana u istoriji');
    },
    onError: (e) => toast.error(e.message),
  });

  function onPreview(values: UplatnicaFormInput) {
    try {
      const { qrString } = encodeUplatnica(values);
      onQrPayload(qrString);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neuspešno generisanje QR-a');
    }
  }

  const watchedAmount = form.watch('amount');
  const watchedRecipient = form.watch('recipientName');

  const printCaption = useMemo(() => {
    if (!watchedRecipient && !watchedAmount) return undefined;
    const amount = watchedAmount ? `${formatAmountDisplay(watchedAmount)} RSD` : '';
    return [watchedRecipient, amount].filter(Boolean).join(' · ');
  }, [watchedRecipient, watchedAmount]);

  return (
    <div className="space-y-5">
      {!hideTemplate && (
        <Card className="bg-mesh-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Brzo iz šablona
            </CardTitle>
            <CardDescription className="text-foreground">
              Odaberi sačuvanog primaoca pa će se polja popuniti.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedRecipientId || undefined}
              onValueChange={(v) => onRecipientChange?.(v)}
              disabled={recipientsQuery.isLoading}
            >
              <SelectTrigger className="bg-card">
                <SelectValue
                  placeholder={
                    recipientsQuery.isLoading
                      ? 'Učitavam šablone…'
                      : recipientsQuery.data?.length
                        ? 'Izaberi primaoca'
                        : 'Nemaš još sačuvane šablone'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {recipientsQuery.data?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: r.color || 'oklch(0.62 0.18 155)' }}
                      />
                      {r.label}
                      {r.defaultAmount && (
                        <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                          {formatAmountDisplay(r.defaultAmount)} RSD
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <Card className="bg-mesh-soft">
        <CardHeader>
          <CardTitle>Podaci o uplatnici</CardTitle>
          <CardDescription>Polja označena * su obavezna prema NBS standardu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onPreview)} noValidate className="space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Hero amount input — full width on every breakpoint */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel required>Iznos</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="0,00"
                            inputMode="decimal"
                            className="h-12 rounded-xl pr-16 text-xl font-semibold tabular-nums"
                            {...field}
                          />
                          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium">
                            RSD
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Primalac</FormLabel>
                      <FormControl>
                        <Input placeholder="Marko Petrović" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => {
                    const raw = field.value || '';
                    const bank = getBankByAccount(raw);
                    const cleaned = raw.replace(/[\s-]/g, '');
                    const checksum =
                      cleaned.length === 18 && /^\d{18}$/.test(cleaned)
                        ? validateAccountChecksum(cleaned)
                        : null;
                    return (
                      <FormItem>
                        <FormLabel required>Račun primaoca</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="265-1710320000001-66 ili 18 cifara"
                            inputMode="numeric"
                            className={cn(
                              'font-mono',
                              checksum && !checksum.valid && 'border-destructive'
                            )}
                            {...field}
                          />
                        </FormControl>
                        {checksum && !checksum.valid ? (
                          <FormDescription className="text-destructive">
                            Kontrolne cifre{' '}
                            <span className="font-mono font-semibold">{checksum.provided}</span> ne
                            važe po MOD 97-10. Po pravilu bi trebalo da budu{' '}
                            <span className="font-mono font-semibold">{checksum.expected}</span>.{' '}
                            <button
                              type="button"
                              className="underline underline-offset-2 hover:no-underline"
                              onClick={() =>
                                field.onChange(cleaned.slice(0, 16) + checksum.expected)
                              }
                            >
                              Popravi
                            </button>
                          </FormDescription>
                        ) : bank ? (
                          <FormDescription>
                            Banka: <span className="text-foreground font-medium">{bank.name}</span>
                            {checksum?.valid && (
                              <>
                                {' · '}
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  kontrolna cifra OK
                                </span>
                              </>
                            )}
                          </FormDescription>
                        ) : null}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="recipientAddress"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Adresa primaoca</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder={'Bulevar kralja Aleksandra 1\n11000 Beograd'}
                          {...field}
                        />
                      </FormControl>
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
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Svrha</FormLabel>
                      <FormControl>
                        <Input placeholder="Stanarina za maj" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uplatilac</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresa uplatioca</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {anonymous ? (
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="brand"
                    className="h-14 w-full text-base font-semibold"
                  >
                    <Sparkles className="size-[18px]" />
                    Generiši QR
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-14 flex-1 text-base font-semibold"
                  >
                    <Wand2 className="size-[18px]" />
                    Brzi pregled
                  </Button>
                  <Button
                    type="button"
                    variant="brand"
                    className="h-14 flex-1 text-base font-semibold"
                    disabled={saveMutation.isPending}
                    onClick={form.handleSubmit((values) => saveMutation.mutate(values))}
                  >
                    <Sparkles className="size-[18px]" />
                    {saveMutation.isPending ? 'Čuvam…' : 'Sačuvaj i generiši'}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* QR display panel — sits below the form, scrolled into view on generate */}
      <Card ref={qrCardRef} className="bg-mesh-soft scroll-mt-20">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>NBS IPS QR</CardTitle>
            <CardDescription>Skeniraj sa mobilnom bankom.</CardDescription>
          </div>
          {qrPayload && <Badge variant="success">Validan</Badge>}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-0">
          {qrPayload ? (
            <QrDisplay
              payload={qrPayload}
              size={280}
              errorCorrectionLevel="M"
              caption={printCaption}
              filename={
                watchedRecipient
                  ? `IPS-${watchedRecipient.replace(/\s+/g, '_').slice(0, 24)}`
                  : 'IPS-uplatnica'
              }
            />
          ) : (
            <div className="border-border-strong bg-surface/60 flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed px-4 py-12 text-center">
              <div className="bg-brand-soft text-brand flex size-12 items-center justify-center rounded-2xl">
                <CircleAlert className="size-6" />
              </div>
              <p className="text-muted-foreground text-sm">
                {anonymous ? (
                  <>
                    Popuni iznos, primaoca i račun pa pritisni{' '}
                    <span className="text-foreground font-medium">Generiši QR</span>.
                  </>
                ) : (
                  <>
                    Popuni iznos, primaoca i račun pa pritisni{' '}
                    <span className="text-foreground font-medium">Brzi pregled</span> ili{' '}
                    <span className="text-foreground font-medium">Sačuvaj i generiši</span>.
                  </>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print-only A4 receipt */}
      {qrPayload && (
        <div className="print-only print-receipt border-border text-foreground mx-auto mt-12 hidden max-w-[210mm] rounded-2xl border bg-white p-10">
          <div className="grid grid-cols-[1fr_auto] gap-10">
            <div className="space-y-3 text-sm">
              <h2 className="text-xl font-semibold">Nalog za uplatu</h2>
              <PrintRow label="Primalac" value={form.getValues('recipientName')} />
              <PrintRow label="Račun" value={form.getValues('account')} mono />
              <PrintRow label="Iznos" value={`${form.getValues('amount')} RSD`} emphasize />
              <PrintRow label="Poziv na broj" value={form.getValues('reference') || '—'} mono />
              <PrintRow label="Šifra plaćanja" value={form.getValues('paymentCode') || '—'} />
              <PrintRow label="Svrha" value={form.getValues('purpose') || '—'} />
            </div>
            <div className="border-border rounded-2xl border bg-white p-4">
              <QrDisplay payload={qrPayload} size={220} actions={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PrintRow({
  label,
  value,
  mono,
  emphasize,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-dashed border-black/20 pb-1.5">
      <dt className="text-black/60">{label}</dt>
      <dd
        className={cn(
          'tabular-nums',
          mono && 'font-mono text-xs',
          emphasize && 'text-base font-semibold'
        )}
      >
        {value}
      </dd>
    </div>
  );
}
