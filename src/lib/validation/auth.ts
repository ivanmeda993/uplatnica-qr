import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Neispravna email adresa'),
  password: z.string().min(1, 'Lozinka je obavezna'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Ime je obavezno').max(70),
  email: z.string().trim().email('Neispravna email adresa'),
  password: z.string().min(8, 'Lozinka mora imati najmanje 8 karaktera').max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
