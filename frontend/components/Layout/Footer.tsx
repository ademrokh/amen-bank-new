'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, MessageSquare, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function Footer() {
  const { lang: currentLang, isRTL } = useLang();

  const footerContent = {
    fr: {
      products: 'Produits & Services',
      retail: 'Particuliers',
      business: 'Entreprises',
      digital: 'Amen First Bank',
      company: 'Entreprise',
      about: 'À propos',
      careers: 'Carrières',
      press: 'Presse',
      sustainability: 'Développement durable',
      support: 'Support',
      amenGpt: 'AmenGPT',
      contact: 'Contact',
      branches: 'Agences',
      email: 'amenbank@amenbank.com.tn',
      phone: '71 833 517 | 71 148 000',
      address: 'Av. Mohamed V, 1002 Tunis, Tunisie',
      follow: 'Nous suivre',
      newsletterLabel: 'Newsletter',
      newsletterTitle: 'Restez informé',
      newsletterDesc: 'Recevez les dernières actualités et offres directement dans votre boîte mail.',
      emailPlaceholder: 'Votre email',
      subscribe: "S'abonner",
      desc: 'Votre partenaire financier de confiance depuis plus de 40 ans.',
      copyright: '© 2025 Amen Bank. Tous droits réservés.',
    },
    ar: {
      products: 'المنتجات والخدمات',
      retail: 'للأفراد',
      business: 'للشركات',
      digital: 'بنك آمن فيرست',
      company: 'المؤسسة',
      about: 'عن بنك آمن',
      careers: 'الوظائف',
      press: 'الصحافة',
      sustainability: 'التنمية المستدامة',
      support: 'الدعم',
      amenGpt: 'AmenGPT',
      contact: 'اتصل بنا',
      branches: 'الفروع',
      email: 'amenbank@amenbank.com.tn',
      phone: '71 833 517 | 71 148 000',
      address: 'الطريق السريع محمد الخامس، 1002 تونس، تونس',
      follow: 'متابعتنا',
      newsletterLabel: 'النشرة الإخبارية',
      newsletterTitle: 'ابقَ على اطلاع',
      newsletterDesc: 'احصل على أحدث الأخبار والعروض مباشرة في صندوق بريدك.',
      emailPlaceholder: 'بريدك الإلكتروني',
      subscribe: 'اشتراك',
      desc: 'شريكك المالي الموثوق منذ أكثر من 40 سنة.',
      copyright: '© 2025 بنك آمن. جميع الحقوق محفوظة.',
    },
    en: {
      products: 'Products & Services',
      retail: 'Retail',
      business: 'Business',
      digital: 'Amen First Bank',
      company: 'Company',
      about: 'About Us',
      careers: 'Careers',
      press: 'Press',
      sustainability: 'Sustainability',
      support: 'Support',
      amenGpt: 'AmenGPT',
      contact: 'Contact',
      branches: 'Branches',
      email: 'amenbank@amenbank.com.tn',
      phone: '71 833 517 | 71 148 000',
      address: 'Av. Mohamed V, 1002 Tunis, Tunisia',
      follow: 'Follow Us',
      newsletterLabel: 'Newsletter',
      newsletterTitle: 'Stay Updated',
      newsletterDesc: 'Get the latest news and offers delivered to your inbox.',
      emailPlaceholder: 'Your email',
      subscribe: 'Subscribe',
      desc: 'Your trusted financial partner for over 40 years.',
      copyright: '© 2025 Amen Bank. All rights reserved.',
    },
  };

  const content = footerContent[currentLang as Language];

  return (
    <footer className="footer-fintech" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Newsletter */}
      <div className="container">
        <div className="footer-newsletter">
          <div>
            <p className="footer-newsletter-label">{content.newsletterLabel}</p>
            <h3 className="footer-newsletter-title">{content.newsletterTitle}</h3>
            <p className="footer-newsletter-desc">{content.newsletterDesc}</p>
          </div>
          <div className="footer-newsletter-form">
            <input
              type="email"
              placeholder={content.emailPlaceholder}
              className="footer-newsletter-input"
            />
            <button className="footer-newsletter-submit">
              {content.subscribe}
              <ArrowRight className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container">
        <div className="footer-main">
          <div className="footer-grid">

            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/favicon.ico" 
                  alt="Amen Bank Logo" 
                  className="w-8 h-8 object-contain" 
                />
                <div>
                  <span className="footer-brand-name">Amen Bank</span>
                  <span className="footer-brand-est">
                    {currentLang === 'fr' ? 'Depuis 1980' : currentLang === 'ar' ? 'منذ 1980' : 'Est. 1980'}
                  </span>
                </div>
              </div>
              <p className="footer-brand-desc mb-7">{content.desc}</p>
              <div className="space-y-3">
                <div className="footer-contact-row">
                  <Mail />
                  <a href="mailto:amenbank@amenbank.com.tn">{content.email}</a>
                </div>
                <div className="footer-contact-row">
                  <Phone />
                  <a href="tel:+21671833517">{content.phone}</a>
                </div>
                <div className="footer-contact-row items-start">
                  <MapPin />
                  <p>{content.address}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Products */}
            <div>
              <h3 className="footer-col-title">{content.products}</h3>
              <div className="footer-col-links">
                <Link href={`/${currentLang}/particuliers`} className="footer-col-link">{content.retail}</Link>
                <Link href={`/${currentLang}/entreprises`} className="footer-col-link">{content.business}</Link>
                <Link href={`/${currentLang}/amen-first-bank`} className="footer-col-link">{content.digital}</Link>
              </div>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="footer-col-title">{content.company}</h3>
              <div className="footer-col-links">
                <Link href={`/${currentLang}/notre-identite`} className="footer-col-link">{content.about}</Link>
                <Link href={`/${currentLang}/careers`} className="footer-col-link">{content.careers}</Link>
                <Link href={`/${currentLang}/actualites`} className="footer-col-link">{content.press}</Link>
                <Link href={`/${currentLang}/sustainability`} className="footer-col-link">{content.sustainability}</Link>
              </div>
            </div>

            {/* Column 4: Support */}
            <div>
              <h3 className="footer-col-title">{content.support}</h3>
              <div className="footer-col-links">
                <Link href={`/${currentLang}/amengpt`} className="footer-col-link">{content.amenGpt}</Link>
                <Link href={`/${currentLang}/contact`} className="footer-col-link">{content.contact}</Link>
                <Link href={`/${currentLang}/agencies`} className="footer-col-link">{content.branches}</Link>
              </div>
            </div>

            {/* Column 5: Social */}
            <div>
              <h3 className="footer-col-title">{content.follow}</h3>
              <div className="footer-social">
                <a href="https://www.facebook.com/AMENBANK.page.officielle" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
                  <Share2 />
                </a>
                <a href="https://www.linkedin.com/company/amen-bank/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
                  <MessageSquare />
                </a>
                <a href="https://www.instagram.com/amen_bank_officielle/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
                  <MessageCircle />
                </a>
                <a href="https://x.com/AMENBANKTN" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="X (Twitter)">
                  <Heart />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container">
        <div className="footer-bottom">
          <p>{content.copyright}</p>
          <div className="footer-bottom-links">
            <a href={`/${currentLang}/privacy`} className="footer-bottom-link">
              {currentLang === 'fr' ? 'Confidentialité' : currentLang === 'ar' ? 'الخصوصية' : 'Privacy'}
            </a>
            <a href={`/${currentLang}/terms`} className="footer-bottom-link">
              {currentLang === 'fr' ? 'Conditions' : currentLang === 'ar' ? 'الشروط' : 'Terms'}
            </a>
            <a href={`/${currentLang}/security`} className="footer-bottom-link">
              {currentLang === 'fr' ? 'Sécurité' : currentLang === 'ar' ? 'الأمان' : 'Security'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}