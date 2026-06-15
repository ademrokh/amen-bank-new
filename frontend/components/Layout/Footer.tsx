'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, MessageSquare, MessageCircle, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

type Language = 'fr' | 'ar' | 'en';

export default function Footer() {
  const pathname = usePathname();
  let currentLang: Language = 'fr';
  
  // Extract current language from pathname
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }
  
  const isRTL = currentLang === 'ar';

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
      faq: 'FAQ',
      contact: 'Contact',
      branches: 'Agences',
      legal: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      contact_us: 'Nous contacter',
      email: 'amenbank@amenbank.com.tn',
      phone: '71 833 517 | 71 148 000',
      address: 'Av. Mohamed V, 1002 Tunis, Tunisie',
      follow: 'Nous suivre',
      hours: 'Lun-Ven: 8h00-17h00 | Sam: 9h00-12h00',
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
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا',
      branches: 'الفروع',
      legal: 'الإشعارات القانونية',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      contact_us: 'اتصل بنا',
      email: 'amenbank@amenbank.com.tn',
      phone: '71 833 517 | 71 148 000',
      address: 'الطريق السريع محمد الخامس، 1002 تونس، تونس',
      follow: 'متابعتنا',
      hours: 'الاثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
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
      faq: 'FAQ',
      contact: 'Contact',
      branches: 'Branches',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      contact_us: 'Contact Us',
      email: 'amenbank@amenbank.com.tn',
      phone: '71 833 517 | 71 148 000',
      address: 'Av. Mohamed V, 1002 Tunis, Tunisia',
      follow: 'Follow Us',
      hours: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
      copyright: '© 2025 Amen Bank. All rights reserved.',
    },
  };

  const content = footerContent[currentLang];

  return (
    <footer className={`bg-gradient-to-b from-slate-50 to-slate-100 text-slate-700 ${isRTL ? 'dir-rtl' : ''}`}>
      {/* Top Section with Newsletter */}
      <div className="border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {currentLang === 'fr'
                  ? 'Restez informé'
                  : currentLang === 'ar'
                  ? 'ابقَ على اطلاع'
                  : 'Stay Updated'}
              </h3>
              <p className="text-slate-600">
                {currentLang === 'fr'
                  ? 'Recevez les dernières actualités et offres directement dans votre boîte mail.'
                  : currentLang === 'ar'
                  ? 'احصل على أحدث الأخبار والعروض مباشرة في صندوق بريدك.'
                  : 'Get the latest news and offers delivered to your inbox.'}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                type="email"
                placeholder={currentLang === 'fr' ? 'Votre email' : currentLang === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg">
                {currentLang === 'fr' ? 'S\'abonner' : currentLang === 'ar' ? 'اشتراك' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 ${isRTL ? 'text-right' : ''}`}>
          {/* Column 1: Amen Bank Info */}
          <div className={isRTL ? 'lg:col-start-5' : ''}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                A
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg block">Amen Bank</span>
                <span className="text-xs text-slate-500">Est. 1980</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-8 text-slate-600">
              {currentLang === 'fr'
                ? 'Votre partenaire financier de confiance depuis plus de 40 ans.'
                : currentLang === 'ar'
                ? 'شريكك المالي الموثوق منذ أكثر من 40 سنة.'
                : 'Your trusted financial partner for over 40 years.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-4 text-sm">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-5 h-5 flex-shrink-0 text-blue-700" />
                <a href="mailto:amenbank@amenbank.com.tn" className="text-slate-700 hover:text-blue-700 transition-colors font-medium">
                  {content.email}
                </a>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-5 h-5 flex-shrink-0 text-blue-700" />
                <a href="tel:+21671833517" className="text-slate-700 hover:text-blue-700 transition-colors font-medium">
                  {content.phone}
                </a>
              </div>
              <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-700" />
                <p className="text-slate-700">{content.address}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{content.products}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={`/${currentLang}/particuliers`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.retail}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/entreprises`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.business}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/amen-first-bank`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.digital}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{content.company}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={`/${currentLang}/#about`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.about}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/#careers`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.careers}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/#press`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.press}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/#sustainability`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.sustainability}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{content.support}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={`/${currentLang}/faq`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.faq}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/contact`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.contact}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/reseau-agences`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
                  {content.branches}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Social Media */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{content.follow}</h3>
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <a
                href="https://facebook.com/amenbank"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-slate-200 hover:bg-blue-600 text-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 font-medium"
                aria-label="Facebook"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/amenbank"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-slate-200 hover:bg-blue-700 text-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 font-medium"
                aria-label="LinkedIn"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/amenbank"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-slate-200 hover:bg-sky-500 text-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 font-medium"
                aria-label="Twitter"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/amenbank"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-slate-200 hover:bg-pink-600 text-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 font-medium"
                aria-label="Instagram"
              >
                <Heart className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-12"></div>

        {/* Bottom Section: Legal */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-600 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <p>&copy; 2025 Amen Bank. {currentLang === 'fr' ? 'Tous droits réservés.' : currentLang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className={`flex gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href={`/${currentLang}/privacy`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
              {currentLang === 'fr' ? 'Confidentialité' : currentLang === 'ar' ? 'الخصوصية' : 'Privacy'}
            </a>
            <a href={`/${currentLang}/terms`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
              {currentLang === 'fr' ? 'Conditions' : currentLang === 'ar' ? 'الشروط' : 'Terms'}
            </a>
            <a href={`/${currentLang}/security`} className="text-slate-600 hover:text-blue-700 font-medium transition-colors">
              {currentLang === 'fr' ? 'Sécurité' : currentLang === 'ar' ? 'الأمان' : 'Security'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
