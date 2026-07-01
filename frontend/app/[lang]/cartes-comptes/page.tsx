'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, Wallet, GraduationCap, Check } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

const content: Record<Language, {
  hero: { badge: string; title: string; sub: string };
  sections: {
    accounts: { badge: string; title: string; sub: string };
    cards: { badge: string; title: string; sub: string };
    packs: { badge: string; title: string; sub: string };
  };
  cta: { label: string; href: string };
}> = {
  fr: {
    hero: {
      badge: 'Particuliers',
      title: 'Comptes & Cartes',
      sub: 'Choisissez le compte et la carte adaptés à votre profil — dépôt, épargne ou digital.',
    },
    sections: {
      accounts: { badge: 'Types de comptes', title: 'Quel compte vous convient ?', sub: 'Deux formules, deux cartes, un accès en ligne gratuit.' },
      cards:    { badge: 'Nos cartes', title: 'Toutes nos cartes bancaires', sub: 'De la carte locale à l\'internationale, chaque usage a sa carte.' },
      packs:    { badge: 'Offre jeunes', title: 'First Free — Pack Étudiant', sub: 'Exclusif aux étudiants de moins de 30 ans. Gratuit, sans conditions.' },
    },
    cta: { label: 'Ouvrir un compte en ligne', href: 'amen-first-bank' },
  },
  ar: {
    hero: {
      badge: 'الأفراد',
      title: 'الحسابات والبطاقات',
      sub: 'اختر الحساب والبطاقة المناسبين لملفك — جاري، توفير أو رقمي.',
    },
    sections: {
      accounts: { badge: 'أنواع الحسابات', title: 'أي حساب يناسبك؟', sub: 'صيغتان، بطاقتان، اشتراك إلكتروني مجاني.' },
      cards:    { badge: 'بطاقاتنا', title: 'جميع بطاقاتنا البنكية', sub: 'من البطاقة المحلية إلى الدولية، لكل استخدام بطاقته.' },
      packs:    { badge: 'عرض الشباب', title: 'First Free — حزمة الطلاب', sub: 'حصري للطلاب دون 30 سنة. مجاني بدون شروط.' },
    },
    cta: { label: 'فتح حساب أونلاين', href: 'amen-first-bank' },
  },
  en: {
    hero: {
      badge: 'Personal Banking',
      title: 'Accounts & Cards',
      sub: 'Pick the account and card that fits your profile — deposit, savings, or digital.',
    },
    sections: {
      accounts: { badge: 'Account types', title: 'Which account suits you?', sub: 'Two plans, two cards, free online access.' },
      cards:    { badge: 'Our cards', title: 'All our bank cards', sub: 'From local to international — a card for every need.' },
      packs:    { badge: 'Youth offer', title: 'First Free — Student Pack', sub: 'Exclusive for students under 30. Free, no conditions.' },
    },
    cta: { label: 'Open an account online', href: 'amen-first-bank' },
  },
};

/* ── Account types ── */
const accounts: Record<Language, Array<{
  name: string; tag: string; card: string; desc: string; points: string[];
}>> = {
  fr: [
    {
      name: 'Compte Dépôt',
      tag: 'Carte Sésame VISA Electron',
      card: 'Sésame',
      desc: 'Le compte courant complet pour vos opérations du quotidien.',
      points: [
        'Retraits sur tous les DAB + paiements TPE en Tunisie',
        'Remise de 50 % sur la cotisation annuelle — seulement 35 dt/an',
        'Abonnement en ligne gratuit pour la gestion de compte',
        'Remise de 50 % sur les frais de tenue de compte (9 dt/trimestre)',
        'Carte valable 3 ans',
      ],
    },
    {
      name: 'Compte Épargne',
      tag: 'Carte El Amen Mastercard',
      card: 'El Amen',
      desc: 'Faites fructifier votre argent tout en gardant accès à vos fonds.',
      points: [
        'Retraits sur les DAB Amen Bank uniquement',
        'Consultation du solde et des derniers mouvements',
        'Abonnement en ligne gratuit pour la gestion de compte',
        'Carte valable 3 ans',
      ],
    },
  ],
  ar: [
    {
      name: 'الحساب الجاري',
      tag: 'بطاقة سيزام VISA Electron',
      card: 'سيزام',
      desc: 'الحساب الجاري الكامل لعملياتك اليومية.',
      points: [
        'سحب من جميع DAB + دفع TPE في تونس',
        'خصم 50% على الاشتراك السنوي — فقط 35 د/سنة',
        'اشتراك إلكتروني مجاني لإدارة الحساب',
        'خصم 50% على رسوم التسيير (9 د/ربع سنة)',
        'صلاحية البطاقة 3 سنوات',
      ],
    },
    {
      name: 'حساب التوفير',
      tag: 'بطاقة الأمان Mastercard',
      card: 'الأمان',
      desc: 'أنمِّ أموالك مع الإبقاء على إمكانية الوصول إليها.',
      points: [
        'سحب من DAB أمين بنك فقط',
        'الاطلاع على الرصيد وآخر الحركات',
        'اشتراك إلكتروني مجاني لإدارة الحساب',
        'صلاحية البطاقة 3 سنوات',
      ],
    },
  ],
  en: [
    {
      name: 'Deposit Account',
      tag: 'Sésame VISA Electron Card',
      card: 'Sésame',
      desc: 'The complete current account for your everyday transactions.',
      points: [
        'Withdrawals at all ATMs + POS payments across Tunisia',
        '50% discount on annual fee — only 35 dt/yr',
        'Free online subscription for account management',
        '50% off account maintenance fees (9 dt/quarter)',
        'Card valid for 3 years',
      ],
    },
    {
      name: 'Savings Account',
      tag: 'El Amen Mastercard',
      card: 'El Amen',
      desc: 'Grow your money while keeping access to your funds.',
      points: [
        'Withdrawals at Amen Bank ATMs only',
        'Balance & recent transaction consultation',
        'Free online subscription for account management',
        'Card valid for 3 years',
      ],
    },
  ],
};

/* ── Bank cards ── */
const cards: Record<Language, Array<{
  name: string; network: string; scope: string; points: string[];
}>> = {
  fr: [
    {
      name: 'Carte Sésame',
      network: 'VISA Electron',
      scope: 'Compte Dépôt',
      points: [
        'Retraits sur tous les DAB bancaires en Tunisie',
        'Paiements chez les commerçants dotés de TPE',
        'Cotisation annuelle : 35 dt (remise 50 %)',
        'Validité : 3 ans',
      ],
    },
    {
      name: 'Carte El Amen',
      network: 'Mastercard',
      scope: 'Compte Épargne',
      points: [
        'Retraits sur les DAB Amen Bank uniquement',
        'Consultation du solde et des derniers mouvements',
        'Validité : 3 ans',
      ],
    },
    {
      name: 'Carte Technologique',
      network: 'Internationale',
      scope: 'Usage numérique',
      points: [
        'Achats sur les sites web internationaux dédiés',
        'Formations en ligne et licences de logiciels',
        'Développement d\'applications',
        'Conformément à la réglementation en vigueur',
      ],
    },
  ],
  ar: [
    {
      name: 'بطاقة سيزام',
      network: 'VISA Electron',
      scope: 'الحساب الجاري',
      points: [
        'سحب من جميع DAB في تونس',
        'دفع لدى نقاط البيع TPE',
        'اشتراك سنوي: 35 د (خصم 50%)',
        'صلاحية: 3 سنوات',
      ],
    },
    {
      name: 'بطاقة الأمان',
      network: 'Mastercard',
      scope: 'حساب التوفير',
      points: [
        'سحب من DAB أمين بنك فقط',
        'الاطلاع على الرصيد وآخر الحركات',
        'صلاحية: 3 سنوات',
      ],
    },
    {
      name: 'البطاقة التكنولوجية',
      network: 'دولية',
      scope: 'الاستخدام الرقمي',
      points: [
        'شراء من المواقع الإلكترونية الدولية',
        'تدريبات ورخص البرمجيات',
        'تطوير التطبيقات',
        'وفق الأنظمة المعمول بها',
      ],
    },
  ],
  en: [
    {
      name: 'Sésame Card',
      network: 'VISA Electron',
      scope: 'Deposit Account',
      points: [
        'Withdrawals at all bank ATMs in Tunisia',
        'Payments at POS-equipped merchants',
        'Annual fee: 35 dt (50% discount)',
        'Validity: 3 years',
      ],
    },
    {
      name: 'El Amen Card',
      network: 'Mastercard',
      scope: 'Savings Account',
      points: [
        'Withdrawals at Amen Bank ATMs only',
        'Balance & recent transaction consultation',
        'Validity: 3 years',
      ],
    },
    {
      name: 'Tech Card',
      network: 'International',
      scope: 'Digital use',
      points: [
        'Purchases on dedicated international websites',
        'Online training & software licenses',
        'App development tools',
        'Per applicable regulations',
      ],
    },
  ],
};

/* ── Student packs ── */
const packs: Record<Language, Array<{
  name: string; tag: string; points: string[];
}>> = {
  fr: [
    {
      name: 'First Free Dépôt',
      tag: 'Compte chèque AFB',
      points: [
        'Compte chèque AFB sans frais',
        'Carte Sésame gratuite — DAB + TPE partout en Tunisie',
        'Gestion en ligne gratuite (site & application Amen Mobile)',
        'Virements reçus gratuits, sans plafond',
        'Réduction de 50 % sur les virements émis, sans plafond',
      ],
    },
    {
      name: 'First Free Épargne',
      tag: 'Compte épargne AFB',
      points: [
        'Compte épargne AFB sans frais',
        'Carte El Amen gratuite — DAB Amen Bank',
        'Gestion en ligne gratuite (site & application Amen Mobile)',
        'Virements reçus gratuits, sans plafond',
        'Réduction de 50 % sur les virements émis, sans plafond',
        'Rémunération trimestrielle conforme à la réglementation',
      ],
    },
  ],
  ar: [
    {
      name: 'First Free Dépôt',
      tag: 'حساب شيكات AFB',
      points: [
        'حساب شيكات AFB بدون رسوم',
        'بطاقة سيزام مجانية — DAB + TPE في كل تونس',
        'إدارة إلكترونية مجانية (موقع وتطبيق Amen Mobile)',
        'تحويلات واردة مجانية بلا سقف',
        'خصم 50% على التحويلات الصادرة بلا سقف',
      ],
    },
    {
      name: 'First Free Épargne',
      tag: 'حساب توفير AFB',
      points: [
        'حساب توفير AFB بدون رسوم',
        'بطاقة الأمان مجانية — DAB أمين بنك',
        'إدارة إلكترونية مجانية (موقع وتطبيق Amen Mobile)',
        'تحويلات واردة مجانية بلا سقف',
        'خصم 50% على التحويلات الصادرة بلا سقف',
        'عائد ربع سنوي وفق الأنظمة المعمول بها',
      ],
    },
  ],
  en: [
    {
      name: 'First Free Deposit',
      tag: 'AFB Checking Account',
      points: [
        'Free AFB checking account',
        'Free Sésame card — all ATMs + POS across Tunisia',
        'Free online management (website & Amen Mobile app)',
        'Free incoming transfers, no limit',
        '50% off outgoing transfers, no limit',
      ],
    },
    {
      name: 'First Free Savings',
      tag: 'AFB Savings Account',
      points: [
        'Free AFB savings account',
        'Free El Amen card — Amen Bank ATMs',
        'Free online management (website & Amen Mobile app)',
        'Free incoming transfers, no limit',
        '50% off outgoing transfers, no limit',
        'Quarterly returns per applicable regulations',
      ],
    },
  ],
};

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */

export default function CartesComptesPage() {
  const { lang, isRTL } = useLang();
  const l = lang as Language;
  const t = content[l];
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <main className="min-h-screen" dir={dir} style={{ background: '#f8fafc' }}>

      {/* ── Hero ── */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container">
          {/* Explicit margin override to fix global CSS bloated spacing */}
          <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {t.hero.badge}
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              {t.hero.title}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>
              {t.hero.sub}
            </p>
          </div>
        </div>
      </section>

      {/* ── Account Types ── */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 4rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#006B3C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Wallet size={14} /> {t.sections.accounts.badge}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.sections.accounts.title}</h2>
            <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{t.sections.accounts.sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accounts[l].map((acc) => (
              <div key={acc.name} className="card flex flex-col h-full" style={{ borderTop: '4px solid #003DA5' }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: '#006B3C', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', textAlign: isRTL ? 'right' : 'left' }}>
                    {acc.tag}
                  </p>
                  <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: isRTL ? 'right' : 'left' }}>{acc.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.65, textAlign: isRTL ? 'right' : 'left' }}>{acc.desc}</p>
                </div>

                {/* Divider */}
                <hr style={{ borderColor: '#e2e8f0', margin: '1.5rem 0' }} />

                {/* Points */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
                  {acc.points.map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      <Check size={16} style={{ color: '#006B3C', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: 1.5 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bank Cards ── */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 4rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#006B3C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <CreditCard size={14} /> {t.sections.cards.badge}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.sections.cards.title}</h2>
            <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{t.sections.cards.sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards[l].map((card) => (
              <div key={card.name} className="card flex flex-col h-full" style={{ borderTop: '4px solid #006B3C' }}>
                {/* Network + scope pills */}
                <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : ''}`} style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '9999px', background: '#006B3C', color: '#ffffff' }}>
                    {card.network}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.625rem', borderRadius: '9999px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b' }}>
                    {card.scope}
                  </span>
                </div>

                <h3 style={{ color: '#0f172a', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: isRTL ? 'right' : 'left' }}>{card.name}</h3>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
                  {card.points.map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-start gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', background: '#006B3C', flexShrink: 0, marginTop: '0.5rem' }} />
                      <span style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.5 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Student Packs ── */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 4rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#006B3C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <GraduationCap size={14} /> {t.sections.packs.badge}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.sections.packs.title}</h2>
            <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{t.sections.packs.sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packs[l].map((pack) => (
              <div key={pack.name} className="card flex flex-col h-full" style={{ borderTop: '4px solid #E8A000' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: '#006B3C', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', textAlign: isRTL ? 'right' : 'left' }}>
                    {pack.tag}
                  </p>
                  <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 700, textAlign: isRTL ? 'right' : 'left' }}>{pack.name}</h3>
                </div>

                <hr style={{ borderColor: '#e2e8f0', margin: '1.5rem 0' }} />

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
                  {pack.points.map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      <Check size={16} style={{ color: '#006B3C', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: 1.5 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <Link
              href={`/${lang}/${t.cta.href}`}
              className={`btn btn-primary btn-lg inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ color: '#ffffff', textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1.0625rem' }}
            >
              {t.cta.label}
              <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}