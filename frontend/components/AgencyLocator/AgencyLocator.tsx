'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Phone, Clock, Search } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

interface Branch {
  id: number;
  name_fr: string;
  name_ar: string;
  name_en: string;
  city_fr: string;
  city_ar: string;
  city_en: string;
  region: string;
  address_fr: string;
  address_ar: string;
  address_en: string;
  phone: string;
  hours_fr: string;
  hours_ar: string;
  hours_en: string;
  latitude: number;
  longitude: number;
}

// Static data outside component — no re-creation on every render
const branches: Branch[] = [
  {
    id: 1,
    name_fr: 'Siege Social',
    name_ar: 'المقر الرئيسي',
    name_en: 'Head Office',
    city_fr: 'Tunis',
    city_ar: 'تونس',
    city_en: 'Tunis',
    region: 'Tunis',
    address_fr: 'Avenue Mohamed V, 1002 Tunis',
    address_ar: 'جادة محمد الخامس، 1002 تونس',
    address_en: 'Avenue Mohamed V, 1002 Tunis',
    phone: '71 833 517',
    hours_fr: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 36.8065,
    longitude: 10.1815,
  },
  {
    id: 2,
    name_fr: 'Agence Marsa',
    name_ar: 'فرع المرسى',
    name_en: 'Marsa Branch',
    city_fr: 'La Marsa',
    city_ar: 'المرسى',
    city_en: 'La Marsa',
    region: 'Ben Arous',
    address_fr: 'Avenue Bourguiba, La Marsa',
    address_ar: 'جادة بورقيبة، المرسى',
    address_en: 'Avenue Bourguiba, La Marsa',
    phone: '71 748 000',
    hours_fr: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 36.8626,
    longitude: 10.3256,
  },
  {
    id: 3,
    name_fr: 'Agence Sfax',
    name_ar: 'فرع صفاقس',
    name_en: 'Sfax Branch',
    city_fr: 'Sfax',
    city_ar: 'صفاقس',
    city_en: 'Sfax',
    region: 'Sfax',
    address_fr: 'Rue Ali Belhouane, Sfax',
    address_ar: 'شارع علي بلهوان، صفاقس',
    address_en: 'Rue Ali Belhouane, Sfax',
    phone: '74 298 555',
    hours_fr: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 34.7406,
    longitude: 10.7603,
  },
  {
    id: 4,
    name_fr: 'Agence Sousse',
    name_ar: 'فرع سوسة',
    name_en: 'Sousse Branch',
    city_fr: 'Sousse',
    city_ar: 'سوسة',
    city_en: 'Sousse',
    region: 'Sousse',
    address_fr: 'Avenue Bourguiba, Sousse',
    address_ar: 'جادة بورقيبة، سوسة',
    address_en: 'Avenue Bourguiba, Sousse',
    phone: '73 225 300',
    hours_fr: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 35.8356,
    longitude: 10.6348,
  },
  {
    id: 5,
    name_fr: 'Agence Gafsa',
    name_ar: 'فرع قفصة',
    name_en: 'Gafsa Branch',
    city_fr: 'Gafsa',
    city_ar: 'قفصة',
    city_en: 'Gafsa',
    region: 'Gafsa',
    address_fr: 'Avenue de la Victoire, Gafsa',
    address_ar: 'جادة النصر، قفصة',
    address_en: 'Avenue de la Victoire, Gafsa',
    phone: '76 224 455',
    hours_fr: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 34.4267,
    longitude: 8.7845,
  },
  {
    id: 6,
    name_fr: 'Agence Kairouan',
    name_ar: 'فرع القيروان',
    name_en: 'Kairouan Branch',
    city_fr: 'Kairouan',
    city_ar: 'القيروان',
    city_en: 'Kairouan',
    region: 'Kairouan',
    address_fr: 'Rue du Bey, Kairouan',
    address_ar: 'شارع الباي، القيروان',
    address_en: 'Rue du Bey, Kairouan',
    phone: '77 224 677',
    hours_fr: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 35.6713,
    longitude: 9.9176,
  },
];

function getBranchContent(branch: Branch, lang: Language) {
  return {
    name:    lang === 'fr' ? branch.name_fr    : lang === 'ar' ? branch.name_ar    : branch.name_en,
    city:    lang === 'fr' ? branch.city_fr    : lang === 'ar' ? branch.city_ar    : branch.city_en,
    address: lang === 'fr' ? branch.address_fr : lang === 'ar' ? branch.address_ar : branch.address_en,
    hours:   lang === 'fr' ? branch.hours_fr   : lang === 'ar' ? branch.hours_ar   : branch.hours_en,
  };
}

export default function AgencyLocator() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Extract current language
  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  // Filter branches — React Compiler handles memoization
  const filteredBranches = branches.filter((branch) => {
    const searchLower = searchQuery.toLowerCase();
    const content = getBranchContent(branch, currentLang);
    return (
      content.name.toLowerCase().includes(searchLower) ||
      content.city.toLowerCase().includes(searchLower) ||
      content.address.toLowerCase().includes(searchLower) ||
      branch.region.toLowerCase().includes(searchLower)
    );
  });

  const ui = {
    fr: {
      sectionTitle: "Réseau d'Agences",
      sectionDescription: 'Trouvez l\'agence Amen Bank la plus proche de vous',
      searchPlaceholder: 'Rechercher par ville ou région...',
      mapLabel: 'Carte Interactive',
      mapSub: 'Leaflet.js intégration',
      selectPrompt: 'Sélectionnez une agence pour voir les détails',
      address: 'Adresse',
      phone: 'Téléphone',
      hours: 'Horaires',
      infoBox: 'Amen Bank dispose de 164 agences réparties dans 14 régions tunisiennes',
      infoSub: 'Visitez-nous pour une consultation gratuite avec nos experts',
      branchCount: (n: number) => `${n} agence${n !== 1 ? 's' : ''} trouvée${n !== 1 ? 's' : ''}`,
    },
    ar: {
      sectionTitle: 'شبكة الفروع',
      sectionDescription: 'جد فرع أمين بنك الأقرب إليك',
      searchPlaceholder: 'ابحث حسب المدينة أو المنطقة...',
      mapLabel: 'خريطة تفاعلية',
      mapSub: 'تكامل Leaflet.js',
      selectPrompt: 'حدد فرعا لعرض التفاصيل',
      address: 'العنوان',
      phone: 'الهاتف',
      hours: 'الساعات',
      infoBox: 'يوجد لدى أمين بنك 164 فرعا موزعة على 14 منطقة تونسية',
      infoSub: 'قم بزيارتنا للحصول على استشارة مجانية من خبرائنا',
      branchCount: (n: number) => `${n} فرع موجود`,
    },
    en: {
      sectionTitle: 'Branch Network',
      sectionDescription: 'Find the nearest Amen Bank branch to you',
      searchPlaceholder: 'Search by city or region...',
      mapLabel: 'Interactive Map',
      mapSub: 'Leaflet.js integration',
      selectPrompt: 'Select a branch to view details',
      address: 'Address',
      phone: 'Phone',
      hours: 'Hours',
      infoBox: 'Amen Bank has 164 branches distributed across 14 Tunisian regions',
      infoSub: 'Visit us for a free consultation with our experts',
      branchCount: (n: number) => `${n} branch${n !== 1 ? 'es' : ''} found`,
    },
  }[currentLang];

  return (
    <section
      className="py-20 bg-linear-to-b from-white to-slate-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{ui.sectionTitle}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{ui.sectionDescription}</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-6 h-6 text-slate-400 pointer-events-none`}
            />
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-4 ${isRTL ? 'pr-6 pl-14' : 'pl-6 pr-14'} bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all outline-none`}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl h-96 lg:h-full min-h-96 flex items-center justify-center border border-slate-300 shadow-lg overflow-hidden">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">{ui.mapLabel}</p>
                <p className="text-sm text-slate-500 mt-2">{ui.mapSub}</p>
              </div>
            </div>
          </div>

          {/* Branch Info Panel */}
          <div className="lg:col-span-1">
            {selectedBranch ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg sticky top-24">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {getBranchContent(selectedBranch, currentLang).name}
                </h3>

                <div className={`flex items-start gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">{ui.address}</p>
                    <p className="text-slate-900">{getBranchContent(selectedBranch, currentLang).address}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className="w-5 h-5 text-blue-900 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">{ui.phone}</p>
                    <a
                      href={`tel:${selectedBranch.phone}`}
                      className="text-blue-900 hover:text-blue-700 font-medium transition-colors"
                    >
                      {selectedBranch.phone}
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock className="w-5 h-5 text-blue-900 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-2">{ui.hours}</p>
                    <p className="text-sm text-slate-700">{getBranchContent(selectedBranch, currentLang).hours}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 text-center">
                <p className="text-slate-600">{ui.selectPrompt}</p>
              </div>
            )}
          </div>
        </div>

        {/* Branches List */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            {ui.branchCount(filteredBranches.length)}
          </h3>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isRTL ? 'text-right' : ''}`}>
            {filteredBranches.map((branch) => {
              const content = getBranchContent(branch, currentLang);
              return (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'} ${
                    selectedBranch?.id === branch.id
                      ? 'border-blue-900 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <h4 className="font-bold text-slate-900 mb-1">{content.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{content.city}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{content.address}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-8 text-center">
          <p className="text-slate-700 mb-3">{ui.infoBox}</p>
          <p className="text-sm text-slate-600">{ui.infoSub}</p>
        </div>
      </div>
    </section>
  );
}