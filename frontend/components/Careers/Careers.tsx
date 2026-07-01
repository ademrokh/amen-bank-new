'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, TrendingUp, Users, Heart, MapPin } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

export function Careers() {
  const { lang, isRTL } = useLang();

  const content = {
    fr: {
      badge: 'Recrutement',
      title: 'Construisez votre avenir chez Amen Bank',
      subtitle: 'Rejoignez une équipe dynamique dans une institution financière en constante évolution.',
      valuesTitle: 'Pourquoi travailler chez nous ?',
      values: [
        { icon: TrendingUp, title: 'Évolution de carrière', desc: 'Des parcours clairs avec des opportunités de formation continue.' },
        { icon: Heart, title: 'Bien-être au travail', desc: 'Un environnement bienveillant qui valorise l\'équilibre vie pro / perso.' },
        { icon: Users, title: 'Équipe diversifiée', desc: 'Plus de 2 000 collaborateurs engagés aux côtés de 164 agences.' },
        { icon: Briefcase, title: 'Projets stimulants', desc: 'Participez à des projets innovants au cœur de la transformation digitale.' },
      ],
      openingsTitle: 'Nos offres d\'emploi',
      openings: [
        { title: 'Conseiller Clientèle', dept: 'Réseau' },
        { title: 'Développeur Full Stack', dept: 'Direction des Systèmes' },
        { title: 'Chargé d\'Affaires', dept: 'Commercial' },
        { title: 'Analyste Risque', dept: 'Gestion des Risques' },
        { title: 'Chef de Projet Digital', dept: 'Transformation Digitale' },
        { title: 'Agent d\'Accueil', dept: 'Réseau' },
      ],
      ctaTitle: 'Prêt à postuler ?',
      ctaDesc: 'Consultez nos offres et postulez en ligne en quelques minutes.',
      ctaBtn: 'Voir les offres',
      faqTitle: 'Questions fréquentes',
      faq: [
        { q: 'Quels profils recherchez-vous ?', a: 'Nous recrutons des profils bancaires, IT, commerciaux, marketing, risk management, et plus.' },
        { q: 'Comment se déroule le processus ?', a: 'Candidature en ligne, entretien RH, tests techniques selon le poste, puis offre.' },
        { q: 'Proposez-vous des stages ?', a: 'Oui, des stages sont disponibles chaque été dans nos agences et services centraux.' },
      ],
    },
    en: {
      badge: 'Recruitment',
      title: 'Build your future at Amen Bank',
      subtitle: 'Join a dynamic team in a constantly evolving financial institution.',
      valuesTitle: 'Why work with us?',
      values: [
        { icon: TrendingUp, title: 'Career growth', desc: 'Clear career paths with continuous training opportunities.' },
        { icon: Heart, title: 'Work-life balance', desc: 'A caring environment that values work-life balance.' },
        { icon: Users, title: 'Diverse team', desc: 'Over 2,000 engaged employees across 164 branches.' },
        { icon: Briefcase, title: 'Exciting projects', desc: 'Participate in innovative projects at the heart of digital transformation.' },
      ],
      openingsTitle: 'Open positions',
      openings: [
        { title: 'Client Advisor', dept: 'Network' },
        { title: 'Full Stack Developer', dept: 'IT Systems' },
        { title: 'Account Manager', dept: 'Commercial' },
        { title: 'Risk Analyst', dept: 'Risk Management' },
        { title: 'Digital Project Manager', dept: 'Digital Transformation' },
        { title: 'Welcome Agent', dept: 'Network' },
      ],
      ctaTitle: 'Ready to apply?',
      ctaDesc: 'Browse our openings and apply online in minutes.',
      ctaBtn: 'View openings',
      faqTitle: 'Frequently asked questions',
      faq: [
        { q: 'What profiles are you looking for?', a: 'We recruit for banking, IT, marketing, risk management, and more.' },
        { q: 'How does the process work?', a: 'Online application, HR interview, technical tests depending on the role, then offer.' },
        { q: 'Do you offer internships?', a: 'Yes, internships are available each summer in our branches and central services.' },
      ],
    },
    ar: {
      badge: 'توظيف',
      title: 'ابنِ مستقبلك المهني في بنك آمن',
      subtitle: 'انضم إلى فريق ديناميكي في مؤسسة مالية في تطور مستمر.',
      valuesTitle: 'لماذا تعمل معنا؟',
      values: [
        { icon: TrendingUp, title: 'تطور مهني', desc: 'مسارات واضحة مع فرص تدريب مستمر.' },
        { icon: Heart, title: 'توازن العمل والحياة', desc: 'بيئة عمل تقدر التوازن بين الحياة المهنية والشخصية.' },
        { icon: Users, title: 'فريق متنوع', desc: 'أكثر من 2000 موظف يعملون في 164 فرعًا.' },
        { icon: Briefcase, title: 'مشاريع محفزة', desc: 'شارك في مشاريع مبتكرة في قلب التحول الرقمي.' },
      ],
      openingsTitle: 'الوظائف الشاغرة',
      openings: [
        { title: 'مستشار زبون', dept: 'الشبكة' },
        { title: 'مطور Full Stack', dept: 'أنظمة المعلومات' },
        { title: 'مدير حسابات', dept: 'التجاري' },
        { title: 'محلل مخاطر', dept: 'إدارة المخاطر' },
        { title: 'مدير مشروع رقمي', dept: 'التحول الرقمي' },
        { title: 'موظف استقبال', dept: 'الشبكة' },
      ],
      ctaTitle: 'مستعد للتقديم؟',
      ctaDesc: 'تصفح الوظائف المتاحة وقدّم عبر الإنترنت في دقائق.',
      ctaBtn: 'عرض الوظائف',
      faqTitle: 'أسئلة شائعة',
      faq: [
        { q: 'ما الملفات التي تبحثون عنها؟', a: 'نبحث عن ملفات مصرفية وتقنية وتسويق وإدارة مخاطر والمزيد.' },
        { q: 'كيف تسير العملية؟', a: 'تقديم عبر الإنترنت، مقابلة مع الموارد البشرية، اختبارات تقنية حسب المنصب، ثم عرض وظيفة.' },
        { q: 'هل توفرون تدريباً؟', a: 'نعم، تدريب متاح كل صيف في فروعنا وخدماتنا المركزية.' },
      ],
    },
  };

  const d = content[lang as keyof typeof content];

  const handleFaqToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const answer = e.currentTarget.nextElementSibling;
    if (answer) {
      const content = answer as HTMLElement;
      const isOpen = content.style.maxHeight !== '0px';
      content.style.maxHeight = isOpen ? '0px' : content.scrollHeight + 'px';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Header Section */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.badge}</span>
            <h1 className="text-h1" style={{ color: '#0f172a' }}>{d.title}</h1>
            <p style={{ color: '#64748b' }}>{d.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-sm" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.valuesTitle}</span>
            <h2 className="text-h2" style={{ color: '#0f172a' }}>{d.valuesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="card text-center">
                  <div className="feature-icon mx-auto">
                    <Icon className="w-7 h-7" style={{ color: '#006B3C' }} />
                  </div>
                  <h3 className="text-h4 mt-5 mb-2" style={{ color: '#0f172a' }}>{value.title}</h3>
                  <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.openingsTitle}</span>
            <h2 className="text-h2" style={{ color: '#0f172a' }}>{d.openingsTitle}</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {d.openings.map((job) => (
                <div 
                  key={job.title} 
                  className="rounded-lg transition-colors cursor-pointer"
                  style={{ 
                    padding: '1.5rem', 
                    border: '1px solid #e2e8f0', 
                    background: '#ffffff',
                    textAlign: isRTL ? 'right' : 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#006B3C'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <h4 className="font-semibold text-sm mb-1" style={{ color: '#0f172a' }}>{job.title}</h4>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>{job.dept}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-sm" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="section-header">
              <span className="section-badge">{d.faqTitle}</span>
              <h2 className="text-h2" style={{ color: '#0f172a' }}>{d.faqTitle}</h2>
            </div>
            
            {/* Switched to explicit flex column with a 2rem (32px) gap to force spacing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {d.faq.map((item, idx) => (
                <div key={idx} className="faq-item">
                  <button
                    className={`w-full flex items-start gap-4 bg-transparent border-none cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ padding: '1.5rem 1.75rem' }}
                    onClick={handleFaqToggle}
                  >
                    <span className="text-base font-semibold flex-1" style={{ color: '#0f172a' }}>{item.q}</span>
                    <svg className="w-5 h-5 shrink-0 faq-chevron faq-chevron-open mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#94a3b8' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    className="faq-answer text-small leading-relaxed overflow-hidden transition-all duration-300" 
                    style={{ maxHeight: '0px', color: '#475569', padding: '0 1.75rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
                  >
                    <div style={{ padding: '1.5rem 0' }}>
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder Section */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div 
            className="max-w-xl mx-auto text-center rounded-xl p-10"
            style={{ border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center" 
                style={{ background: '#eff6ff' }}
              >
                <MapPin className="w-7 h-7" style={{ color: '#003DA5' }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: '#0f172a' }}>
                {lang === 'fr' ? 'Nos agences sur la carte' : lang === 'ar' ? 'فروعنا على الخريطة' : 'Our branches on the map'}
              </p>
              <Link 
                href={`/${lang}/agencies`} 
                className={`btn btn-primary inline-flex ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ color: '#ffffff', textDecoration: 'none', marginTop: '0.5rem' }}
              >
                {lang === 'fr' ? 'Voir la carte' : lang === 'ar' ? 'عرض الخريطة' : 'View map'}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="text-h2 mb-4" style={{ color: '#ffffff' }}>{d.ctaTitle}</h2>
          <p className="mb-8 max-w-lg mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>{d.ctaDesc}</p>
          <Link 
            href={`/${lang}/devenir-client`} 
            className="btn btn-white btn-lg inline-flex"
            style={{ color: '#0f172a', textDecoration: 'none' }}
          >
            {d.ctaBtn}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}