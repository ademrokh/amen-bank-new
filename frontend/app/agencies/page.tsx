import { AgencyLocator } from '@/components/AgencyLocator';

export const metadata = {
  title: 'Réseau d\'Agences - Amen Bank',
  description: 'Trouvez l\'agence Amen Bank la plus proche de vous avec notre localisateur interactif',
};

export default function AgencyLocatorPage() {
  return (
    <div className="min-h-screen bg-white">
      <AgencyLocator />
    </div>
  );
}
