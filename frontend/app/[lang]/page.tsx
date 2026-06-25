import { Hero, Products } from '@/components/Homepage';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export default async function Home({ params }: { params: Promise<{ lang: Language }> }) {
  await params;
  return (
    <>
      <Hero />
      <Products />
    </>
  );
}