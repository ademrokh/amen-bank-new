import { FAQ } from '@/components/FAQ';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'FAQ - Amen Bank',
  description: "Foire aux questions sur les services bancaires d'Amen Bank",
};

export default function FAQPage() {
  return <FAQ />;
}