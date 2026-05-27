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
