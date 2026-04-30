import { RecipientList } from '@/modules/recipient/components/recipient-list';

export const metadata = {
  title: 'Primaoci',
};

export default function RecipientsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Primaoci</h1>
        <p className="text-muted-foreground text-sm">
          Šabloni za redovne uplatnice — kredit, struja, internet, kirija.
        </p>
      </header>
      <RecipientList />
    </div>
  );
}
