import { AgencyLocator } from '@/components/AgencyLocator';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: "Réseau d'Agences - Amen Bank",
  description: "Trouvez l'agence Amen Bank la plus proche de vous avec notre localisateur interactif",
};

export default function AgencyLocatorPage() {
  return <AgencyLocator />;
}