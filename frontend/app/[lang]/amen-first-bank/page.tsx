import { AmenFirstBank } from '@/components/AmenFirstBank';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Amen First Bank - Amen Bank',
  description: "Ouvrez votre compte bancaire en ligne en quelques clics avec Amen First Bank.",
};

export default function AmenFirstBankPage() {
  return <AmenFirstBank />;
}