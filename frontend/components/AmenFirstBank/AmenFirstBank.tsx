'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

export function AmenFirstBank() {
  const { lang, isRTL } = useLang();

  const openChatbot = () => {
    window.dispatchEvent(new CustomEvent('open-chatbot'));
  };

  const content = {
    fr: {
      badge: 'Néo-banque digitale',
      title: '5 bonnes raisons de choisir Amen First Bank',
      reasons: [
        { title: 'Ouverture 100 % en ligne', desc: 'Ouvrez votre compte bancaire intégralement en ligne, en quelques clics, sans vous déplacer.' },
        { title: 'Disponible 24h/24, 7j/7', desc: 'Opérez toutes vos opérations en ligne et en toute sécurité, à tout moment.' },
        { title: 'Une institution solide et performante', desc: 'Vous profitez d\'une institution financière de référence, en constante recherche d\'innovation.' },
        { title: 'Accessible partout', desc: 'Sur votre PC, tablette ou mobile — la banque s\'adapte au rythme de votre vie.' },
        { title: 'Une tarification attractive', desc: 'Une gamme complète de produits bancaires à des prix très compétitifs, gérables en toute autonomie.' },
        { title: 'Un conseiller joignable', desc: 'Votre conseiller clientèle est disponible par téléphone ou visioconférence du lundi au vendredi.' },
      ],
      ctaTitle: 'Prêt à ouvrir votre compte ?',
      ctaDesc: 'Rejoignez Amen First Bank et profitez d\'une banque 100% en ligne, accessible partout, à tout moment.',
      ctaPrimary: 'Devenir client',
      ctaSecondary: 'Vous avez des questions ?',
    },
    en: {
      badge: 'Digital Banking',
      title: '5 reasons to choose Amen First Bank',
      reasons: [
        { title: '100% online account opening', desc: 'Open your bank account entirely online, in just a few clicks, without moving.' },
        { title: 'Available 24/7, 365 days', desc: 'Carry out all your operations online and securely, at any time.' },
        { title: 'A solid, high-performing institution', desc: 'Benefit from a leading financial institution that constantly pursues innovation.' },
        { title: 'Accessible everywhere', desc: 'On your PC, tablet or phone — banking adapts to your lifestyle.' },
        { title: 'Attractive pricing', desc: 'A full range of banking products at very competitive prices, managed with full autonomy.' },
        { title: 'Reachable advisor', desc: 'Your client advisor is available by phone or video conference, Monday to Friday.' },
      ],
      ctaTitle: 'Ready to open your account?',
      ctaDesc: 'Join Amen First Bank and enjoy a 100% online bank, accessible everywhere, at any time.',
      ctaPrimary: 'Become a client',
      ctaSecondary: 'Have any questions?',
    },
    ar: {
      badge: 'بنك رقمي',
      title: '5 أسباب لاختيار بنك آمن فيرست',
      reasons: [
        { title: 'فتح حساب بنسبة 100 % عبر الإنترنت', desc: 'افتح حسابك المصرفي بالكامل عبر الإنترنت في نقرات قليلة دون تنقل.' },
        { title: 'متاح 24/7، 7 أيام في الأسبوع', desc: 'قم بجميع عملياتك عبر الإنترنت بأمان تام في أي وقت.' },
        { title: 'مؤسسة مالية راسخة وأداء عالٍ', desc: 'استفد من مؤسسة مالية رائدة تسعى دائمًا للابتكار.' },
        { title: 'متاح في كل مكان', desc: 'على حاسوبك أو جهازك اللوحي — البنك يتكيف مع وتيرة حياتك.' },
        { title: 'أسعار تنافسية', desc: 'مجموعة كاملة من المنتجات المصرفية بأسعار تنافسية للغاية، تُدار بشكل مستقل.' },
        { title: 'مستشار متوفر', desc: 'مستشاركك متاح عبر الهاتف أو مكالمة فيديو من الاثنين إلى الجمعة.' },
      ],
      ctaTitle: 'هل أنت مستعد لفتح حسابك؟',
      ctaDesc: 'انضم إلى بنك آمن فيرست واستمتع ببنك رقمي 100٪، متاح في كل مكان وفي أي وقت.',
      ctaPrimary: 'كن عميلاً',
      ctaSecondary: 'لديك أسئلة؟',
    },
  };

  const d = content[lang as keyof typeof content];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Reasons Section */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.badge}</span>
            <h1 className="text-h1" style={{ color: '#0f172a' }}>{d.title}</h1>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {d.reasons.map((reason, idx) => (
                <div key={idx} className="card card-stripe-blue">
                  <span className="text-label mb-4 block" style={{ color: '#003DA5', fontWeight: 700 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-h4 mb-2" style={{ color: '#0f172a' }}>{reason.title}</h3>
                  <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container max-w-3xl">
          {/* Wrapped in flex-col to force vertical stacking and centering */}
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            <h2 className="text-h2" style={{ color: '#ffffff' }}>{d.ctaTitle}</h2>
            <p className="max-w-lg leading-relaxed" style={{ color: '#94a3b8' }}>{d.ctaDesc}</p>
          </div>
          <br></br>
          <div className={`flex flex-wrap justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link 
              href={`/${lang}/devenir-client`} 
              className="btn btn-lg inline-flex"
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                background: '#006B3C', 
                border: '1px solid #006B3C',
                padding: '1rem 2.5rem'
              }}
            >
              {d.ctaPrimary}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
            </Link>
            <button 
              onClick={openChatbot} 
              className="btn btn-lg inline-flex"
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                background: 'transparent', 
                border: '1px solid rgba(255,255,255,0.5)',
                padding: '1rem 2.5rem'
              }}
            >
              {d.ctaSecondary}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}