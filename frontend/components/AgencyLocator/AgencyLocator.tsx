'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Clock, Search } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

/* ════════════════════════════════════════════
   Types & Data
   ════════════════════════════════════════════ */

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
    hours_fr: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
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
    region: 'Tunis',
    address_fr: 'Avenue Bourguiba, La Marsa',
    address_ar: 'جادة بورقيبة، المرسى',
    address_en: 'Avenue Bourguiba, La Marsa',
    phone: '71 748 000',
    hours_fr: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
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
    hours_fr: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
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
    hours_fr: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
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
    hours_fr: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
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
    hours_fr: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
    hours_ar: 'الإثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
    hours_en: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
    latitude: 35.6713,
    longitude: 9.9176,
  },
];

/* ════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════ */

function getBranchContent(branch: Branch, lang: Language) {
  return {
    name: lang === 'fr' ? branch.name_fr : lang === 'ar' ? branch.name_ar : branch.name_en,
    city: lang === 'fr' ? branch.city_fr : lang === 'ar' ? branch.city_ar : branch.city_en,
    address: lang === 'fr' ? branch.address_fr : lang === 'ar' ? branch.address_ar : branch.address_en,
    hours: lang === 'fr' ? branch.hours_fr : lang === 'ar' ? branch.hours_ar : branch.hours_en,
  };
}

/* ════════════════════════════════════════════
   Map — all Leaflet code inside dynamic()
   to prevent SSR crashes. Marker/Popup
   inline styles MUST stay — they're raw HTML
   strings passed to Leaflet's API, not
   React-rendered elements.
   ════════════════════════════════════════════ */

const TUNISIA_CENTER: [number, number] = [35.2, 9.6];
const DEFAULT_ZOOM = 7;
const BRANCH_ZOOM = 14;

interface MapInnerProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  lang: Language;
}

const MapView = dynamic<MapInnerProps>(
  () =>
    Promise.all([import('react-leaflet'), import('leaflet')]).then(
      ([
        { MapContainer, TileLayer, Marker, Popup, useMap },
        L,
      ]) => {
        const markerDefault = L.divIcon({
          className: '',
          html: '<div style="width:14px;height:14px;border-radius:50%;background:#64748b;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.18)"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10],
        });

        const markerSelected = L.divIcon({
          className: '',
          html: '<div style="width:18px;height:18px;border-radius:50%;background:#006B3C;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.22)"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          popupAnchor: [0, -12],
        });

        function FlyController({ branch }: { branch: Branch | null }) {
          const map = useMap();
          useEffect(() => {
            if (branch) {
              map.flyTo([branch.latitude, branch.longitude], BRANCH_ZOOM, {
                duration: 0.8,
              });
            }
          }, [branch, map]);
          return null;
        }

        function MapInner({
          branches,
          selectedBranch,
          onSelectBranch,
          lang,
        }: MapInnerProps) {
          return (
            <MapContainer
              center={TUNISIA_CENTER}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={true}
              className="w-full h-full rounded-lg"
              style={{ minHeight: '380px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FlyController branch={selectedBranch} />

              {branches.map((branch) => {
                const c = getBranchContent(branch, lang);
                const isSelected = selectedBranch?.id === branch.id;
                return (
                  <Marker
                    key={branch.id}
                    position={[branch.latitude, branch.longitude]}
                    icon={isSelected ? markerSelected : markerDefault}
                    eventHandlers={{
                      click: () => onSelectBranch(branch),
                    }}
                  >
                    <Popup>
                      <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a', lineHeight: 1.4 }}>
                        {c.name}
                      </span>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {c.city}
                      </span>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          );
        }

        return MapInner;
      }
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-95 bg-surface-alt border border-border rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-small text-ink-muted">Loading map…</p>
        </div>
      </div>
    ),
  }
);

/* ════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════ */

export default function AgencyLocator() {
  const { lang: currentLang, isRTL } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const filteredBranches = branches.filter((branch) => {
    const q = searchQuery.toLowerCase();
    const c = getBranchContent(branch, currentLang);
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      branch.region.toLowerCase().includes(q)
    );
  });

  const ui = {
    fr: {
      sectionTitle: "Réseau d'Agences",
      sectionDescription: "Trouvez l'agence Amen Bank la plus proche de vous",
      searchPlaceholder: 'Rechercher par ville ou région…',
      selectPrompt: 'Sélectionnez une agence sur la carte pour voir les détails',
      address: 'Adresse',
      phone: 'Téléphone',
      hours: 'Horaires',
      infoBox: 'Amen Bank dispose de 164 agences réparties dans 14 régions tunisiennes',
      infoSub: 'Visitez-nous pour une consultation gratuite avec nos experts',
      branchCount: (n: number) => `${n} agence${n !== 1 ? 's' : ''} trouvée${n !== 1 ? 's' : ''}`,
      noResults: 'Aucune agence trouvée.',
    },
    ar: {
      sectionTitle: 'شبكة الفروع',
      sectionDescription: 'جد فرع أمين بنك الأقرب إليك',
      searchPlaceholder: 'ابحث حسب المدينة أو المنطقة…',
      selectPrompt: 'حدد فرعا على الخريطة لعرض التفاصيل',
      address: 'العنوان',
      phone: 'الهاتف',
      hours: 'الساعات',
      infoBox: 'يوجد لدى أمين بنك 164 فرعا موزعة على 14 منطقة تونسية',
      infoSub: 'قم بزيارتنا للحصول على استشارة مجانية من خبرائنا',
      branchCount: (n: number) => `${n} فرع موجود`,
      noResults: 'لم يتم العثور على أي فرع.',
    },
    en: {
      sectionTitle: 'Branch Network',
      sectionDescription: 'Find the nearest Amen Bank branch to you',
      searchPlaceholder: 'Search by city or region…',
      selectPrompt: 'Select a branch on the map to view details',
      address: 'Address',
      phone: 'Phone',
      hours: 'Hours',
      infoBox: 'Amen Bank has 164 branches distributed across 14 Tunisian regions',
      infoSub: 'Visit us for a free consultation with our experts',
      branchCount: (n: number) => `${n} branch${n !== 1 ? 'es' : ''} found`,
      noResults: 'No branches found.',
    },
  }[currentLang];

  return (
    <section className="bg-surface-alt py-24" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">

        {/* ── Header ── */}
        <div className="section-header mb-16">
          <h1>{ui.sectionTitle}</h1>
          <p>{ui.sectionDescription}</p>
        </div>

        {/* ── Search ── */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`input-field ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            />
            <div className={`absolute top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`}>
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ── Map + Info Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Map — no inline style, uses Tailwind min-h */}
          <div className="lg:col-span-2">
            <div className="bg-surface-alt border border-border rounded-lg overflow-hidden min-h-95">
              <MapView
                branches={filteredBranches}
                selectedBranch={selectedBranch}
                onSelectBranch={setSelectedBranch}
                lang={currentLang}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            {selectedBranch ? (
              <div className="card sticky top-24 border-primary!">
                <h3 className="text-h4 text-ink mb-5">
                  {getBranchContent(selectedBranch, currentLang).name}
                </h3>

                <div className={`flex items-start gap-3 mb-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-0.5">{ui.address}</p>
                    <p className="text-small text-ink">{getBranchContent(selectedBranch, currentLang).address}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 mb-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-0.5">{ui.phone}</p>
                    <a href={`tel:${selectedBranch.phone}`} className="text-small font-medium text-secondary hover:text-secondary-dark transition-colors">
                      {selectedBranch.phone}
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-0.5">{ui.hours}</p>
                    <p className="text-small text-ink-secondary">{getBranchContent(selectedBranch, currentLang).hours}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-secondary-50 border border-border rounded-lg p-8 text-center sticky top-24">
                <MapPin className="w-8 h-8 text-ink-muted mx-auto mb-3" />
                <p className="text-small text-ink-secondary leading-relaxed">{ui.selectPrompt}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Branch List ── */}
        <div className="mb-16">
          <h3 className="text-h3 text-ink mb-6">{ui.branchCount(filteredBranches.length)}</h3>

          {filteredBranches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBranches.map((branch) => {
                const c = getBranchContent(branch, currentLang);
                const isSelected = selectedBranch?.id === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    className={`text-left p-5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected ? 'border-primary bg-primary-50' : 'border-border bg-surface hover:border-primary'
                    } ${isRTL ? 'text-right' : ''}`}
                  >
                    <h4 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-primary' : 'text-ink'}`}>{c.name}</h4>
                    <p className="text-small text-ink-secondary mb-1.5">{c.city}</p>
                    <p className="text-xs text-ink-muted leading-relaxed">{c.address}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-ink-muted">{ui.noResults}</p>
            </div>
          )}
        </div>

        {/* ── Info Box ── */}
        <div className="bg-secondary-50 border border-border rounded-lg p-10 text-center">
          <p className="text-ink-secondary mb-2">{ui.infoBox}</p>
          <p className="text-small text-ink-muted">{ui.infoSub}</p>
        </div>
      </div>
    </section>
  );
}