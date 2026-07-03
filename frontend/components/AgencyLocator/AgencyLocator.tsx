'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import { CITIES, getAgencyMapUrl } from './map';

type Language = 'fr' | 'ar' | 'en';

export default function AgencyLocator() {
  const { lang: currentLang, isRTL } = useLang();
  const [selectedCity, setSelectedCity] = useState('all');

  const ui = {
    fr: {
      sectionTitle: "Réseau d'Agences",
      sectionDescription: "Trouvez l'agence Amen Bank la plus proche de vous",
      selectLabel: 'Sélectionner un gouvernorat',
      allOption: 'Toute la Tunisie',
      infoBox: "Localisation exacte fournie par Google Maps. Sélectionnez une région pour zoomer sur ses agences.",
    },
    ar: {
      sectionTitle: 'شبكة الفروع',
      sectionDescription: 'جد فرع أمين بنك الأقرب إليك',
      selectLabel: 'اختر ولاية',
      allOption: 'كامل تونس',
      infoBox: 'موقع دقيق مقدمة من خرائط جوجل. حدد منطقة للتكبير على فروعها.',
    },
    en: {
      sectionTitle: 'Branch Network',
      sectionDescription: 'Find the nearest Amen Bank branch to you',
      selectLabel: 'Select a Governorate',
      allOption: 'All of Tunisia',
      infoBox: 'Exact location provided by Google Maps. Select a region to zoom in on its branches.',
    },
  }[currentLang];

  const getMapUrl = () => getAgencyMapUrl(selectedCity);

  return (
    <section className="section" style={{ background: '#f8fafc' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">{ui.sectionTitle}</span>
          <h1 className="text-h1 text-ink">{ui.sectionTitle}</h1>
          <p className="text-lg leading-relaxed" style={{ color: '#64748b' }}>{ui.sectionDescription}</p>
        </div>

        <div className="mx-auto mb-10 max-w-md">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="form-input-base appearance-none cursor-pointer"
              style={{ paddingRight: isRTL ? '1rem' : '2.5rem', paddingLeft: isRTL ? '2.5rem' : '1rem' }}
            >
              <option value="all">{ui.allOption}</option>
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>{city[currentLang]}</option>
              ))}
            </select>
            <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}`}>
              <ChevronDown className="h-5 w-5" style={{ color: '#94a3b8' }} />
            </div>
          </div>
        </div>

        <div className="mb-10 overflow-hidden rounded-2xl border border-border shadow-sm" style={{ height: '600px' }}>
          <iframe
            key={selectedCity}
            src={getMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Amen Bank Agency Locator"
          ></iframe>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>{ui.infoBox}</p>
        </div>
      </div>
    </section>
  );
}