import { Contact } from '@/components/Contact';

export const metadata = {
  title: 'Contact - Amen Bank',
  description: 'Contactez Amen Bank pour toute question ou demande d\'information',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Contact />
    </div>
  );
}
