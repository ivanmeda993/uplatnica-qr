import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface SeedRecipient {
  label: string;
  name: string;
  account: string; // 18 cifara, bez crta
  reference: string;
  defaultAmount: string;
  paymentCode: string;
  purpose: string;
  color: string;
  sortOrder: number;
}

const recipients: SeedRecipient[] = [
  {
    label: 'Komercijalna kredit',
    name: 'Komercijalna Banka a.d. Beograd',
    account: '908000000020501070',
    reference: '0049032469980',
    defaultAmount: '30273,35',
    paymentCode: '289',
    purpose: 'Kredit',
    color: '#dc2626',
    sortOrder: 0,
  },
  {
    label: 'Raiffeisen kredit 1',
    name: 'Raiffeisen banka a.d. Beograd',
    account: '265171032000000166',
    reference: '265000000245182930',
    defaultAmount: '8612,80',
    paymentCode: '289',
    purpose: 'Kredit',
    color: '#facc15',
    sortOrder: 1,
  },
  {
    label: 'Raiffeisen kredit 2',
    name: 'Raiffeisen banka a.d. Beograd',
    account: '265171032000000166',
    reference: '265000000209647659',
    defaultAmount: '30619,46',
    paymentCode: '289',
    purpose: 'Kredit',
    color: '#facc15',
    sortOrder: 2,
  },
  {
    label: 'Raiffeisen kredit 3',
    name: 'Raiffeisen banka a.d. Beograd',
    account: '265171032000000166',
    reference: '265000000219388496',
    defaultAmount: '5217,53',
    paymentCode: '289',
    purpose: 'Kredit',
    color: '#facc15',
    sortOrder: 3,
  },
  {
    label: 'Raiffeisen kredit 4',
    name: 'Raiffeisen banka a.d. Beograd',
    account: '265171032000000166',
    reference: '265000000229458842',
    defaultAmount: '8369,25',
    paymentCode: '289',
    purpose: 'Kredit',
    color: '#facc15',
    sortOrder: 4,
  },
];

async function main() {
  const targetEmail = process.argv[2] ?? process.env.SEED_EMAIL;
  if (!targetEmail) {
    console.error('Koristi: pnpm db:seed <email>');
    console.error('       ili postavi SEED_EMAIL u .env.local');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (!user) {
    console.error(`Korisnik "${targetEmail}" ne postoji. Prvo se registruj u app-u.`);
    process.exit(1);
  }

  console.info(`Seed za korisnika ${user.email} (${user.id})...`);

  for (const r of recipients) {
    const existing = await prisma.recipient.findFirst({
      where: { userId: user.id, account: r.account, reference: r.reference },
    });
    if (existing) {
      console.info(`  - skip ${r.label} (već postoji)`);
      continue;
    }
    await prisma.recipient.create({
      data: { userId: user.id, ...r },
    });
    console.info(`  + ${r.label}`);
  }

  console.info('Gotovo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
