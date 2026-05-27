# Default Payer Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Repository constraint:** Do not run `git commit`, `git push`, `git tag`, `git merge`, or `git rebase` unless the user explicitly authorizes that operation in the active conversation. Commit checkpoints below are approval gates, not automatic commands.

**Goal:** Add account-level default payer details and recipient-template addresses so `/generate` can prefill uplatnica fields while keeping them editable.

**Architecture:** Store app-specific payer defaults in a new `UserSettings` table related one-to-one with `User`, and store recipient address on `Recipient`. Add a protected Elysia `/api/v1/settings` router, extend recipient routes, then consume both through TanStack Query in focused client components.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Elysia, Eden Treaty, Prisma 7, PostgreSQL, TanStack Query v5, React Hook Form, Zod, shadcn/ui.

---

## File Structure

- Modify `prisma/schema.prisma`
  - Add `User.settings`.
  - Add `Recipient.address`.
  - Add `UserSettings`.
- Create: `src/lib/ips-qr/limits.ts`
  - Shared UTF-8 byte helpers for IPS `N` and `P` field limits.
- Create `src/lib/validation/settings.ts`
  - Client-side Zod schema and inferred type for the settings form.
- Modify `src/lib/query-keys.ts`
  - Add settings query keys.
- Create `src/server/api/settings.ts`
  - Protected settings read/upsert router.
- Modify `src/server/api/index.ts`
  - Mount the settings router under `/api/v1`.
- Modify `src/server/api/recipients.ts`
  - Accept and persist recipient address.
- Create `src/modules/settings/components/payer-settings-card.tsx`
  - Settings card with RHF + Zod + TanStack Query.
- Modify `src/app/(app)/settings/page.tsx`
  - Render the settings card.
- Modify `src/lib/ips-qr/schema.ts`
  - Add optional `address` to `recipientFormSchema`.
- Modify `src/modules/recipient/components/recipient-form.tsx`
  - Render and submit `Adresa primaoca`.
- Modify `src/modules/recipient/components/recipient-sheet.tsx`
  - Preload existing recipient address for editing.
- Modify `src/modules/recipient/components/recipient-card.tsx`
  - Add `address` to `RecipientItem`.
- Modify `src/modules/uplatnica/components/uplatnica-form.tsx`
  - Load payer settings for `/generate`, expose an explicit `enablePayerDefaults` prop, render payer address as multiline, and apply recipient address from templates.
- Modify `src/app/(app)/scan/page.tsx`
  - Pass `enablePayerDefaults={false}` so scan behavior remains explicitly unchanged.
- Test files:
  - Create `src/lib/validation/__tests__/settings.test.ts`.
  - Create or extend `src/lib/ips-qr/__tests__/schema.test.ts`.

---

### Task 1: Add Database Fields

**Files:**

- Modify: `prisma/schema.prisma`
- Generated: `prisma/migrations/<timestamp>_default_payer_settings/migration.sql`

- [x] **Step 1: Update Prisma schema**

Add the `settings` relation to `User`:

```prisma
model User {
  id            String    @id
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions     Session[]
  accounts     Account[]
  recipients   Recipient[]
  uplatnice    Uplatnica[]
  history      PaymentHistory[]
  settings     UserSettings?

  @@map("user")
}
```

Add `address` after `Recipient.name`:

```prisma
  /// Adresa primaoca u QR-u, spaja se sa nazivom u N polje
  address   String?
```

Add this model after `Recipient`:

```prisma
/// App-specific settings for one signed-in user.
model UserSettings {
  id                  String   @id @default(cuid())
  userId              String   @unique
  defaultPayerName    String?
  defaultPayerAddress String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}
```

- [x] **Step 2: Check migration state before changing the database**

Run:

```bash
find prisma -maxdepth 2 -type d -name migrations -print
pnpm prisma migrate status
```

Expected:

- If the project has normal Prisma migration history, continue to Step 3.
- If Prisma reports drift, reset prompts, or missing migration history for an existing database created with `db:push`, stop and ask the user whether to baseline migrations or use `pnpm db:push` for this local database. Do not accept a destructive reset prompt.

- [ ] **Step 3: Create and apply the migration**

Deferred: `pnpm prisma migrate status` reported no `prisma/migrations` history and the current Neon database is not managed by Prisma Migrate. Do not apply schema changes to the database until the user chooses a migration/baseline or `db:push` path.

Run:

```bash
pnpm prisma migrate dev --name default-payer-settings
```

Expected:

- Prisma creates a migration under `prisma/migrations`.
- Prisma Client is regenerated.
- Existing data remains valid because all new data fields are optional.

- [x] **Step 4: Verify generated types compile with the current app**

Run:

```bash
pnpm typecheck
```

Expected:

- It may pass now, or it may reveal code that needs new generated fields handled in later tasks.
- Do not ignore schema/client generation failures.

- [ ] **Step 5: Commit gate**

Stop here if the user wants commit checkpoints. Do not commit without explicit approval.

---

### Task 2: Add Settings Validation, Query Keys, and API

**Files:**

- Create: `src/lib/ips-qr/limits.ts`
- Create: `src/lib/validation/settings.ts`
- Create: `src/lib/validation/__tests__/settings.test.ts`
- Modify: `src/lib/query-keys.ts`
- Create: `src/server/api/settings.ts`
- Modify: `src/server/api/index.ts`

- [x] **Step 1: Write failing settings schema tests**

Create `src/lib/validation/__tests__/settings.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { settingsFormSchema } from '../settings';

describe('settingsFormSchema', () => {
  it('accepts empty payer defaults', () => {
    expect(
      settingsFormSchema.parse({
        defaultPayerName: '',
        defaultPayerAddress: '',
      })
    ).toEqual({
      defaultPayerName: '',
      defaultPayerAddress: '',
    });
  });

  it('trims payer defaults', () => {
    expect(
      settingsFormSchema.parse({
        defaultPayerName: '  Petar Petrović  ',
        defaultPayerAddress: '  Bulevar 1  ',
      })
    ).toEqual({
      defaultPayerName: 'Petar Petrović',
      defaultPayerAddress: 'Bulevar 1',
    });
  });

  it('rejects payer fields over 70 characters', () => {
    const tooLong = 'a'.repeat(71);

    expect(() =>
      settingsFormSchema.parse({
        defaultPayerName: tooLong,
        defaultPayerAddress: '',
      })
    ).toThrow();

    expect(() =>
      settingsFormSchema.parse({
        defaultPayerName: '',
        defaultPayerAddress: tooLong,
      })
    ).toThrow();
  });

  it('rejects payer name and address when combined IPS P exceeds 70 UTF-8 bytes', () => {
    expect(() =>
      settingsFormSchema.parse({
        defaultPayerName: 'a'.repeat(40),
        defaultPayerAddress: 'b'.repeat(30),
      })
    ).toThrow();
  });
});
```

Run:

```bash
pnpm test src/lib/validation/__tests__/settings.test.ts
```

Expected: fails because `settings.ts` does not exist yet.

- [x] **Step 2: Create shared IPS byte-limit helpers**

Create `src/lib/ips-qr/limits.ts`:

```ts
export const IPS_NAME_FIELD_MAX_BYTES = 70;

export function utf8ByteLength(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

export function combineIpsLines(lines: Array<string | null | undefined>) {
  return lines
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line))
    .join('\n');
}

export function isWithinIpsNameFieldLimit(value: string) {
  return utf8ByteLength(value) <= IPS_NAME_FIELD_MAX_BYTES;
}
```

- [x] **Step 3: Create settings validation schema**

Create `src/lib/validation/settings.ts`:

```ts
import { z } from 'zod';

import { combineIpsLines, isWithinIpsNameFieldLimit } from '@/lib/ips-qr/limits';

const trimmed = z.string().trim();

export const settingsFormSchema = z
  .object({
    defaultPayerName: trimmed
      .max(70, 'Uplatilac ne sme biti duži od 70 znakova')
      .optional()
      .or(z.literal('')),
    defaultPayerAddress: trimmed
      .max(70, 'Adresa uplatioca ne sme biti duža od 70 znakova')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (value) =>
      isWithinIpsNameFieldLimit(
        combineIpsLines([value.defaultPayerName, value.defaultPayerAddress])
      ),
    {
      path: ['defaultPayerAddress'],
      message: 'Uplatilac i adresa zajedno ne smeju preći 70 UTF-8 bajtova',
    }
  );

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
```

- [x] **Step 4: Run the settings schema tests**

Run:

```bash
pnpm test src/lib/validation/__tests__/settings.test.ts
```

Expected: pass.

- [x] **Step 5: Add settings query keys**

Update `src/lib/query-keys.ts`:

```ts
  settings: {
    all: ['settings'] as const,
    detail: () => [...qk.settings.all, 'detail'] as const,
  },
```

Place it as a top-level sibling of `recipients`, `uplatnice`, and `history`.

- [x] **Step 6: Create the settings API router**

Create `src/server/api/settings.ts`:

```ts
import { Elysia, t } from 'elysia';

import { combineIpsLines, isWithinIpsNameFieldLimit } from '@/lib/ips-qr/limits';

import { authContext } from './context';

function cleanOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function serializeSettings(
  settings: {
    defaultPayerName: string | null;
    defaultPayerAddress: string | null;
  } | null
) {
  return {
    defaultPayerName: settings?.defaultPayerName ?? '',
    defaultPayerAddress: settings?.defaultPayerAddress ?? '',
  };
}

function payerFitsIpsLimit(name: string | undefined, address: string | undefined) {
  return isWithinIpsNameFieldLimit(combineIpsLines([name, address]));
}

const settingsBody = t.Object({
  defaultPayerName: t.Optional(t.String({ maxLength: 70 })),
  defaultPayerAddress: t.Optional(t.String({ maxLength: 70 })),
});

export const settingsRouter = new Elysia({ prefix: '/settings' })
  .use(authContext)
  .get('/', async ({ user, prisma }) => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: {
        defaultPayerName: true,
        defaultPayerAddress: true,
      },
    });

    return { settings: serializeSettings(settings) };
  })
  .patch(
    '/',
    async ({ body, user, prisma, status }) => {
      if (!payerFitsIpsLimit(body.defaultPayerName, body.defaultPayerAddress)) {
        return status(400, {
          error: 'Uplatilac i adresa zajedno ne smeju preći 70 UTF-8 bajtova',
          code: 'IPS_FIELD_TOO_LONG',
        });
      }

      const settings = await prisma.userSettings.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          defaultPayerName: cleanOptional(body.defaultPayerName),
          defaultPayerAddress: cleanOptional(body.defaultPayerAddress),
        },
        update: {
          defaultPayerName: cleanOptional(body.defaultPayerName),
          defaultPayerAddress: cleanOptional(body.defaultPayerAddress),
        },
        select: {
          defaultPayerName: true,
          defaultPayerAddress: true,
        },
      });

      return { settings: serializeSettings(settings) };
    },
    { body: settingsBody }
  );
```

- [x] **Step 7: Mount the settings router**

Update `src/server/api/index.ts`:

```ts
import { settingsRouter } from './settings';
```

Then update the `/v1` group:

```ts
  .group('/v1', (group) =>
    group.use(recipientsRouter).use(uplatniceRouter).use(historyRouter).use(settingsRouter)
  )
```

- [x] **Step 8: Verify API types**

Run:

```bash
pnpm typecheck
```

Expected: pass for the new router and Eden Treaty type surface.

- [ ] **Step 9: Commit gate**

Stop here if the user wants commit checkpoints. Do not commit without explicit approval.

---

### Task 3: Add the Payer Settings Card

**Files:**

- Create: `src/modules/settings/components/payer-settings-card.tsx`
- Modify: `src/app/(app)/settings/page.tsx`

- [x] **Step 1: Create the settings card component**

Create `src/modules/settings/components/payer-settings-card.tsx`:

```tsx
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
      if (res.error) throw new Error(String(res.error.value));
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
      if (res.error) throw new Error(String(res.error.value));
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
```

- [x] **Step 2: Render the card on settings page**

Update `src/app/(app)/settings/page.tsx`:

```tsx
import { PayerSettingsCard } from '@/modules/settings/components/payer-settings-card';
```

Render it after the page header and before the `Nalog` card:

```tsx
<PayerSettingsCard />
```

- [x] **Step 3: Verify the settings UI compiles**

Run:

```bash
pnpm typecheck
pnpm lint
```

Expected: both pass. If formatting lint fails on long JSX props, run Prettier only on touched files:

```bash
pnpm exec prettier --write \
  src/modules/settings/components/payer-settings-card.tsx \
  src/app/'(app)'/settings/page.tsx
```

- [ ] **Step 4: Commit gate**

Stop here if the user wants commit checkpoints. Do not commit without explicit approval.

---

### Task 4: Add Recipient Address Persistence and Form Field

**Files:**

- Create or modify: `src/lib/ips-qr/__tests__/schema.test.ts`
- Modify: `src/lib/ips-qr/schema.ts`
- Modify: `src/server/api/recipients.ts`
- Modify: `src/modules/recipient/components/recipient-form.tsx`
- Modify: `src/modules/recipient/components/recipient-sheet.tsx`
- Modify: `src/modules/recipient/components/recipient-card.tsx`

- [x] **Step 1: Write failing recipient schema tests**

Create `src/lib/ips-qr/__tests__/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { recipientFormSchema } from '../schema';

const validRecipient = {
  label: 'Mama Ljubica',
  name: 'Ljubica Petrović',
  address: '',
  account: '265-1710320000001-66',
  purpose: '',
  paymentCode: '289',
  reference: '',
  defaultAmount: '',
  color: '#d73a31',
};

describe('recipientFormSchema', () => {
  it('accepts an optional recipient address', () => {
    expect(
      recipientFormSchema.parse({
        ...validRecipient,
        address: 'Bulevar kralja Aleksandra 1',
      }).address
    ).toBe('Bulevar kralja Aleksandra 1');
  });

  it('rejects recipient address over 70 characters', () => {
    expect(() =>
      recipientFormSchema.parse({
        ...validRecipient,
        address: 'a'.repeat(71),
      })
    ).toThrow();
  });

  it('rejects recipient name and address when combined IPS N exceeds 70 UTF-8 bytes', () => {
    expect(() =>
      recipientFormSchema.parse({
        ...validRecipient,
        name: 'a'.repeat(40),
        address: 'b'.repeat(30),
      })
    ).toThrow();
  });
});
```

Run:

```bash
pnpm test src/lib/ips-qr/__tests__/schema.test.ts
```

Expected: fails because `address` is not in `recipientFormSchema`.

- [x] **Step 2: Add address to recipient schema**

Update `src/lib/ips-qr/schema.ts` imports:

```ts
import { combineIpsLines, isWithinIpsNameFieldLimit } from './limits';
```

Then update `recipientFormSchema`:

```ts
export const recipientFormSchema = z
  .object({
    label: trimmed.min(1, 'Naziv šablona je obavezan').max(50),
    name: trimmed.min(1, 'Ime primaoca je obavezno').max(70),
    address: trimmed.max(70).optional().or(z.literal('')),
    account: accountInput,
    purpose: trimmed.max(35).optional().or(z.literal('')),
    paymentCode: paymentCodeInput,
    reference: referenceInput,
    defaultAmount: trimmed.optional().or(z.literal('')),
    color: trimmed
      .regex(/^#[0-9a-fA-F]{6}$/)
      .optional()
      .or(z.literal('')),
  })
  .refine((value) => isWithinIpsNameFieldLimit(combineIpsLines([value.name, value.address])), {
    path: ['address'],
    message: 'Naziv i adresa primaoca zajedno ne smeju preći 70 UTF-8 bajtova',
  });
```

- [x] **Step 3: Run recipient schema tests**

Run:

```bash
pnpm test src/lib/ips-qr/__tests__/schema.test.ts
```

Expected: pass.

- [x] **Step 4: Extend recipient API body handling**

Update `src/server/api/recipients.ts`.

Add an import:

```ts
import { combineIpsLines, isWithinIpsNameFieldLimit } from '@/lib/ips-qr/limits';
```

Add a local helper near the router:

```ts
function recipientFitsIpsLimit(name: string, address: string | undefined) {
  return isWithinIpsNameFieldLimit(combineIpsLines([name, address]));
}
```

In the create handler, include `status` and guard before `prisma.recipient.create`:

```ts
    async ({ body, user, prisma, status }) => {
      if (!recipientFitsIpsLimit(body.name, body.address)) {
        return status(400, {
          error: 'Naziv i adresa primaoca zajedno ne smeju preći 70 UTF-8 bajtova',
          code: 'IPS_FIELD_TOO_LONG',
        });
      }

      const recipient = await prisma.recipient.create({
```

In the update handler, guard before `prisma.recipient.update`:

```ts
if (!recipientFitsIpsLimit(body.name, body.address)) {
  return status(400, {
    error: 'Naziv i adresa primaoca zajedno ne smeju preći 70 UTF-8 bajtova',
    code: 'IPS_FIELD_TOO_LONG',
  });
}
```

In both create and update `data` objects, add:

```ts
          address: body.address ?? null,
```

In both Elysia body schemas, add:

```ts
        address: t.Optional(t.String({ maxLength: 70 })),
```

Place it next to `name`, because it belongs to recipient identity.

- [x] **Step 5: Extend recipient form submission**

Update default values in `src/modules/recipient/components/recipient-form.tsx`:

```ts
      address: '',
```

Update the mutation body:

```ts
        address: values.address || undefined,
```

Import `Textarea`:

```ts
import { Textarea } from '@/components/ui/textarea';
```

Render this field directly after `Naziv primaoca`:

```tsx
<FormField
  control={form.control}
  name="address"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Adresa primaoca</FormLabel>
      <FormControl>
        <Textarea rows={2} placeholder={'Bulevar kralja Aleksandra 1\n11000 Beograd'} {...field} />
      </FormControl>
      <FormDescription>Popunjava adresu primaoca u IPS QR polju N.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

- [x] **Step 6: Preload address while editing recipients**

Update `src/modules/recipient/components/recipient-sheet.tsx` default values:

```ts
                  address: recipient.address ?? '',
```

- [x] **Step 7: Add address to recipient item type**

Update `src/modules/recipient/components/recipient-card.tsx`:

```ts
export interface RecipientItem {
  id: string;
  label: string;
  name: string;
  address: string | null;
  account: string;
  reference: string | null;
  defaultAmount: string | null;
  paymentCode: string | null;
  purpose: string | null;
  color: string | null;
}
```

Do not add address to the card UI unless the final design needs it. The card is currently compact and already shows the recipient name.

- [x] **Step 8: Verify recipient address changes**

Run:

```bash
pnpm typecheck
pnpm lint
pnpm test src/lib/ips-qr/__tests__/schema.test.ts
```

Expected: all pass.

- [ ] **Step 9: Commit gate**

Stop here if the user wants commit checkpoints. Do not commit without explicit approval.

---

### Task 5: Prefill Generate Form from Settings and Recipient Address

**Files:**

- Modify: `src/modules/uplatnica/components/uplatnica-form.tsx`
- Modify: `src/app/(app)/scan/page.tsx`

- [x] **Step 1: Extend recipient option type**

Update `RecipientOption` in `src/modules/uplatnica/components/uplatnica-form.tsx`:

```ts
interface RecipientOption {
  id: string;
  label: string;
  name: string;
  address: string | null;
  account: string;
  reference: string | null;
  defaultAmount: string | null;
  paymentCode: string | null;
  purpose: string | null;
  color: string | null;
}
```

- [x] **Step 2: Add explicit payer-default prop**

Update `UplatnicaFormProps` in `src/modules/uplatnica/components/uplatnica-form.tsx`:

```ts
  /** Enable account-level payer defaults. Pass false for scan flows. */
  enablePayerDefaults?: boolean;
```

Update the function signature defaults:

```ts
  enablePayerDefaults = !anonymous,
}: UplatnicaFormProps) {
```

- [x] **Step 3: Add settings query without affecting scan**

Add this query after `recipientsQuery`:

```ts
const payerSettingsQuery = useQuery({
  queryKey: qk.settings.detail(),
  queryFn: async () => {
    const res = await api.api.v1.settings.get();
    if (res.error) throw new Error(String(res.error.value));
    return (
      res.data?.settings ?? {
        defaultPayerName: '',
        defaultPayerAddress: '',
      }
    );
  },
  enabled: enablePayerDefaults,
});
```

The explicit `enablePayerDefaults` prop keeps the scan boundary clear. It should not be coupled to `hideRecipientSelect`, which only controls template UI visibility.

- [x] **Step 4: Apply payer defaults once**

Declare this ref before the payer-default effect:

```ts
const payerDefaultsAppliedRef = useRef(false);
```

Add this effect after `useForm` and before the selected-recipient prefill effect:

```ts
useEffect(() => {
  if (payerDefaultsAppliedRef.current || !payerSettingsQuery.data) return;

  const { defaultPayerName, defaultPayerAddress } = payerSettingsQuery.data;
  if (!form.getValues('payerName') && defaultPayerName) {
    form.setValue('payerName', defaultPayerName);
  }
  if (!form.getValues('payerAddress') && defaultPayerAddress) {
    form.setValue('payerAddress', defaultPayerAddress);
  }

  payerDefaultsAppliedRef.current = true;
}, [form, payerSettingsQuery.data]);
```

This avoids overwriting a user's edits if the query refetches.

- [x] **Step 5: Apply recipient address from selected template**

Update the selected-recipient `form.reset` block:

```ts
form.reset({
  recipientId: r.id,
  payerName: form.getValues('payerName'),
  payerAddress: form.getValues('payerAddress'),
  recipientName: r.name,
  recipientAddress: r.address ?? '',
  account: r.account,
  purpose: r.purpose ?? '',
  paymentCode: r.paymentCode ?? '',
  reference: r.reference ?? '',
  amount: r.defaultAmount ?? '',
});
```

- [x] **Step 6: Render payer address as multiline in generate**

Update the existing `payerAddress` field in `src/modules/uplatnica/components/uplatnica-form.tsx` from `Input` to `Textarea`:

```tsx
<FormField
  control={form.control}
  name="payerAddress"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Adresa uplatioca</FormLabel>
      <FormControl>
        <Textarea rows={2} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

This matches the settings card and lets users inspect or edit multiline default addresses before generating.

- [x] **Step 7: Keep scan unchanged with an explicit prop**

Update `src/app/(app)/scan/page.tsx` so the scanned flow explicitly disables payer defaults:

```tsx
<UplatnicaForm
  defaultValues={scanned}
  qrPayload={qrPayload}
  onQrPayload={setQrPayload}
  hideRecipientSelect
  enablePayerDefaults={false}
/>
```

- [x] **Step 8: Verify generate prefill types**

Run:

```bash
pnpm typecheck
pnpm lint
```

Expected: both pass.

- [ ] **Step 9: Commit gate**

Stop here if the user wants commit checkpoints. Do not commit without explicit approval.

---

### Task 6: Final Verification

**Files:**

- Inspect all touched files.
- No new production files expected beyond the plan above.

- [x] **Step 1: Inspect working tree**

Run:

```bash
git status --short
git diff --stat
git diff
```

Expected:

- Only planned files are changed, plus existing user-owned dirty files that predated this work.
- Existing `.gitignore` and `.codex/` changes are not modified unless the user explicitly includes them.

- [x] **Step 2: Run focused tests**

Run:

```bash
pnpm test src/lib/validation/__tests__/settings.test.ts src/lib/ips-qr/__tests__/schema.test.ts
```

Expected: pass.

- [x] **Step 3: Run full existing unit tests**

Run:

```bash
pnpm test
```

Expected: pass.

- [x] **Step 4: Run TypeScript and lint**

Run:

```bash
pnpm typecheck
pnpm lint
```

Expected: pass.

- [x] **Step 5: Run React Doctor once**

Run:

```bash
npx -y react-doctor@latest . --verbose --diff
```

If diff mode fails because the project lacks the needed Git context, run:

```bash
npx -y react-doctor@latest . --verbose
```

Expected: report findings in the final response. Fix in-scope critical or important findings before finishing.

- [ ] **Step 6: Run manual browser acceptance**

Deferred until the database schema is applied. The current configured Neon database has no Prisma Migrate history, so settings save/load would fail at runtime until `UserSettings` and `Recipient.address` exist in the database.

Start the app:

```bash
pnpm dev
```

Manual checks:

- Log in.
- Open `/settings`.
- Save `Uplatilac` and `Adresa uplatioca`.
- Open `/generate`; payer fields are prefilled.
- Edit payer fields before generating; generated QR uses edited values.
- Return to `/settings`, clear both payer fields, save, reopen `/generate`, and confirm payer fields are no longer prefilled.
- Open `/recipients`.
- Add or edit a recipient with `Adresa primaoca`.
- Select that recipient on `/generate`; recipient address is prefilled.
- Open `/scan`; confirm scanned data is not overwritten by payer defaults.

- [x] **Step 7: Final implementation review fan-out**

After implementation is complete and local self-inspection is done, run one implementation-review fan-out per `AGENTS.md`:

- Best-practices research for Next.js, React, TanStack Query, Prisma, Better Auth.
- Architectural fit against this repo's feature-first module boundaries.
- Simplification and duplication.
- Code quality and correctness.
- Dedicated UI/TSX review for React and design-system usage.

Fix Critical and Important findings that are in scope before final reporting.

- [ ] **Step 8: Commit gate**

Ask the user whether to commit. If approved, inspect recent commit style with:

```bash
git log --oneline -8
```

Use a short conventional-style subject, likely:

```bash
feat(settings): add default payer details
```

Do not add AI co-author trailers.
