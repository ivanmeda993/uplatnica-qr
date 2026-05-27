'use client';

import { Check, ChevronsUpDown, Pencil, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PAYMENT_CODES, type PaymentCode, POPULAR_CODES } from '@/lib/payment-codes/data';
import { cn } from '@/lib/utils';

const GROUP_LABELS: Record<PaymentCode['group'], string> = {
  roba: 'Roba i usluge',
  zarade: 'Zarade i naknade',
  porezi: 'Porezi i javni prihodi',
  transferi: 'Transferi i osiguranje',
  krediti: 'Krediti i depoziti',
  ostalo: 'Kartice, devize i ostalo',
};

const GROUP_ORDER: PaymentCode['group'][] = [
  'ostalo',
  'roba',
  'porezi',
  'krediti',
  'transferi',
  'zarade',
];

interface PaymentCodeFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Searchable picker for NBS payment codes (šifre plaćanja).
 * Combobox with code + name search, grouped by category. If the user wants a
 * code we don't have in our curated list, the bottom action toggles a manual
 * 3-digit Input (any code 100-999 is technically allowed by NBS).
 */
export function PaymentCodeField({ value, onChange, disabled }: PaymentCodeFieldProps) {
  const listId = useId();
  const knownCode = useMemo(
    () => (value ? PAYMENT_CODES.find((c) => c.code === value) : undefined),
    [value]
  );
  const startsManual = Boolean(value) && !knownCode;
  const [manualMode, setManualMode] = useState(false);
  const [open, setOpen] = useState(false);
  const manual = manualMode || startsManual;

  if (manual) {
    return (
      <div className="flex items-stretch gap-2">
        <Input
          inputMode="numeric"
          maxLength={3}
          placeholder="npr. 289"
          className="font-mono"
          value={value ?? ''}
          onChange={(e) => {
            const nextValue = e.target.value.replace(/\D/g, '').slice(0, 3);
            onChange(nextValue);
            if (PAYMENT_CODES.some((c) => c.code === nextValue)) {
              setManualMode(false);
            }
          }}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => {
            setManualMode(false);
            onChange('');
          }}
          aria-label="Vrati na listu šifara"
          disabled={disabled}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-between px-3 font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {value && knownCode ? (
            <span className="truncate text-left">
              <span className="font-mono">{value}</span>
              <span className="text-muted-foreground"> · {knownCode.name}</span>
            </span>
          ) : (
            <span>Izaberi ili pretraži šifru…</span>
          )}
          <ChevronsUpDown className="text-muted-foreground ml-2 size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[320px] p-0" align="start">
        <Command
          filter={(itemValue, search) => {
            // itemValue is composed below as `${code} ${name} ${example}` for matching.
            return itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Pretraži po šifri ili nazivu…" />
          <CommandList id={listId}>
            <CommandEmpty>
              <div className="space-y-2 px-3 py-4">
                <p className="text-muted-foreground text-sm">Nema rezultata.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setManualMode(true);
                    setOpen(false);
                    onChange('');
                  }}
                  className="w-full"
                >
                  <Pencil className="size-3.5" />
                  Unesi šifru ručno
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup heading="Najčešće">
              {POPULAR_CODES.map((c) => (
                <CommandItem
                  key={`popular-${c.code}`}
                  value={`${c.code} ${c.name} ${c.example ?? ''} popular najcesce`}
                  onSelect={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                >
                  <span className="font-mono text-sm">{c.code}</span>
                  <span className="text-foreground/90 truncate text-sm">{c.name}</span>
                  <Check
                    className={cn(
                      'ml-auto size-4 shrink-0',
                      value === c.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            {GROUP_ORDER.map((group) => {
              const items = PAYMENT_CODES.filter((c) => c.group === group);
              if (!items.length) return null;
              return (
                <CommandGroup key={group} heading={GROUP_LABELS[group]}>
                  {items.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={`${c.code} ${c.name} ${c.example ?? ''}`}
                      onSelect={() => {
                        onChange(c.code);
                        setOpen(false);
                      }}
                    >
                      <span className="font-mono text-sm">{c.code}</span>
                      <span className="text-foreground/90 truncate text-sm">{c.name}</span>
                      <Check
                        className={cn(
                          'ml-auto size-4 shrink-0',
                          value === c.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="__manual__ unesi rucno custom šifra"
                onSelect={() => {
                  setManualMode(true);
                  setOpen(false);
                  onChange('');
                }}
              >
                <Pencil className="size-3.5" />
                <span>Drugi kod (unesi ručno)</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
