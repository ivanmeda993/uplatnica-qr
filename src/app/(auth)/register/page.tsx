'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
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
import { signUp } from '@/lib/auth-client';
import { type RegisterInput,registerSchema } from '@/lib/validation/auth';

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterInput) => {
      const res = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard',
      });
      if (res.error) throw new Error(res.error.message ?? 'Greška pri registraciji');
      return res.data;
    },
    onSuccess: () => {
      router.push('/dashboard');
      router.refresh();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <main className="bg-mesh-soft relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-[60%] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, oklch(0.78 0.22 145 / 0.18) 0%, transparent 70%)',
        }}
      />

      <header className="safe-top">
        <div className="mx-auto flex max-w-md items-center p-5">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" />
            Nazad
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <span
              aria-hidden
              className="bg-brand/25 absolute inset-[-14px] -z-10 rounded-3xl blur-xl"
            />
            <div className="border-border-strong bg-card shadow-card-lg flex size-20 items-center justify-center rounded-2xl border">
              <Logo size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Napravi nalog</h1>
          <p className="text-muted-foreground mt-2 max-w-xs text-sm">
            Sinhronizacija na svim uređajima — ista uplatnica i na laptopu i na telefonu.
          </p>
        </div>

        <div className="border-border bg-card shadow-card-lg relative overflow-hidden rounded-3xl border p-6 sm:p-8">
          <span
            aria-hidden
            className="from-brand/60 via-brand/30 absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent"
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => registerMutation.mutate(values))}
              noValidate
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Ime</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" placeholder="Ivan Ivanović" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="ti@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Lozinka</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Najmanje 8 znakova"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Bilo koja kombinacija — preporučujemo najmanje 12 znakova.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={registerMutation.isPending}
                className="w-full"
              >
                {registerMutation.isPending ? 'Registrujem…' : 'Registruj se'}
              </Button>
            </form>
          </Form>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Već imaš nalog?{' '}
            <Link href="/login" className="text-foreground hover:text-brand font-medium">
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
