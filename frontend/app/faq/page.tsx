import { FAQ } from '@/components/FAQ';

export const metadata = {
  title: 'FAQ - Amen Bank',
  description: 'Foire aux questions sur les services bancaires d\'Amen Bank',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQ />
    </div>
  );
}
