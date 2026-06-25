import { Contact } from '@/components/Contact';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Contact - Amen Bank',
  description: "Contactez Amen Bank pour toute question ou demande d'information",
};

export default function ContactPage() {
  return <Contact />;
}