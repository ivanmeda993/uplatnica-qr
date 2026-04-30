import { HistoryList } from '@/modules/history/components/history-list';

export const metadata = {
  title: 'Istorija',
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Istorija</h1>
        <p className="text-muted-foreground text-sm">
          Sve generisane uplatnice. Označi kao plaćeno kad je i stvarno potvrđeno u banci.
        </p>
      </header>
      <HistoryList />
    </div>
  );
}
