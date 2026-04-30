/**
 * Centralized TanStack Query key factory.
 * Each entry returns a tuple — never inline `queryKey: ['foo', id]` in components.
 */
export const qk = {
  recipients: {
    all: ['recipients'] as const,
    list: () => [...qk.recipients.all, 'list'] as const,
    detail: (id: string) => [...qk.recipients.all, 'detail', id] as const,
  },
  uplatnice: {
    all: ['uplatnice'] as const,
    list: (limit?: number) => [...qk.uplatnice.all, 'list', { limit }] as const,
    detail: (id: string) => [...qk.uplatnice.all, 'detail', id] as const,
  },
  history: {
    all: ['history'] as const,
    list: () => [...qk.history.all, 'list'] as const,
  },
} as const;
