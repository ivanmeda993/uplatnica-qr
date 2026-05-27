# Default payer settings and recipient address design

## Goal

Let a signed-in user save their own payer details once, then automatically prefill those details when generating a new uplatnica. Keep the generated form editable so the user can override the payer for a single QR.

Also let a recipient template store an optional recipient address. The generate form already supports `recipientAddress`, so the template should be able to prefill it.

## Scope

- Add account-level default payer data:
  - payer name
  - payer address
- Add optional recipient address to saved recipient templates.
- Prefill `/generate` from saved settings and selected recipient templates.
- Keep all generated uplatnica fields editable before preview/save.

## Non-goals

- Do not change `/scan` behavior in this iteration.
- Do not add per-recipient payer overrides.
- Do not change IPS QR encoding rules.
- Do not change existing uplatnica history snapshots except by saving the concrete values already present in the form.

## Current context

`Uplatnica` already stores `payerName`, `payerAddress`, `recipientName`, and `recipientAddress` as snapshots. `UplatnicaForm` already renders payer and recipient address fields and `encodeUplatnica` already encodes:

- recipient name plus address into IPS `N`
- payer name plus address into IPS `P`

The missing pieces are persistence and prefill:

- `Recipient` has no address field.
- There is no app-owned user settings model or API.
- `/settings` only shows account and theme data.

## Data model

Add a new app-owned `UserSettings` Prisma model with a one-to-one relation to `User`:

- `id`
- `userId`
- `defaultPayerName`
- `defaultPayerAddress`
- `createdAt`
- `updatedAt`

Keep the fields nullable or optional strings so users can save only one value or clear both.

Extend `Recipient` with:

- `address String?`

Do not put default payer fields on `User`, because Better Auth owns the user table shape. Keeping app-specific settings separate reduces coupling to auth internals.

## API design

Add `src/server/api/settings.ts` mounted under `/api/v1/settings`.

Endpoints:

- `GET /api/v1/settings`
  - Returns the current user's settings.
  - If no row exists, returns empty string values.
- `PATCH /api/v1/settings`
  - Upserts the current user's settings.
  - Accepts `defaultPayerName` and `defaultPayerAddress`.

Extend existing recipient routes:

- `GET /api/v1/recipients` includes `address`.
- `POST /api/v1/recipients` accepts optional `address`.
- `PATCH /api/v1/recipients/:id` accepts optional `address`.

All routes remain protected by `authContext`.

## UI behavior

### Settings

Add a `Moji podaci` card on `/settings`.

Fields:

- `Uplatilac`
- `Adresa uplatioca`

Use the existing project form conventions:

- React Hook Form
- Zod resolver
- shadcn `Form`, `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormMessage`
- `noValidate`
- TanStack Query `useQuery` and `useMutation`
- query keys from `qk`

The card saves with a `Sačuvaj` button and shows success/error toasts.

### Recipient templates

Add optional `Adresa primaoca` to `RecipientForm`, directly after `Naziv primaoca`.

When editing an existing recipient, preload the address. When saving, send it through the recipient API. Recipient cards can stay compact; showing the address in the card is optional and not required for this iteration.

### Generate form

Load settings in `UplatnicaForm` when not in anonymous mode.

Initial prefill rules:

- If `payerName` is empty and `defaultPayerName` exists, set `payerName`.
- If `payerAddress` is empty and `defaultPayerAddress` exists, set `payerAddress`.
- If a selected recipient has `address`, set `recipientAddress` when applying the template.

The payer fields remain normal editable inputs. If the user changes them, preview/save uses the edited values.

When switching recipient templates, keep the current payer fields, matching the existing pattern where selected recipients update recipient/payment fields but preserve payer fields.

## Validation

Use Zod-compatible constraints aligned with IPS limits:

- `defaultPayerName`: optional, max 70 characters
- `defaultPayerAddress`: optional, max 70 characters
- `recipient.address`: optional, max 70 characters

Keep server validation in Elysia route schemas and client validation in Zod schemas.

## Error handling

Follow existing app patterns:

- API validation failures return the existing `{ error, code }` shape through Elysia.
- Settings load errors surface in the settings card.
- Save failures show toast errors.
- Missing settings are not an error; the app treats them as empty defaults.

## Testing and verification

Implementation should verify:

- Prisma schema changes generate successfully.
- TypeScript typecheck passes.
- ESLint passes.
- Existing IPS QR tests pass.
- React Doctor runs once after React changes, per project instructions.

Manual acceptance checks:

- Save payer name and address in `/settings`.
- Open `/generate`; payer fields are prefilled.
- Edit payer fields before generating; generated QR uses edited values.
- Add a recipient with address.
- Select that recipient on `/generate`; recipient address is prefilled.
- Existing `/scan` behavior is unchanged.

## Migration note

This requires a database schema update for `UserSettings` and `Recipient.address`. Existing recipients should keep working because the new address is optional.
