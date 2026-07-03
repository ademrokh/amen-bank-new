export type City = {
  id: string;
  fr: string;
  ar: string;
  en: string;
  lat: number;
  lng: number;
  zoom: number;
};

export const AGENCY_MAP_BASE_URL =
  'https://www.google.com/maps/d/u/0/embed?mid=1AhxlBmBN4Z7Gwo_V09BwVmDk_At2KhRm';

export const AGENCY_MAP_DEFAULT_VIEW = {
  lat: 36.13510056307994,
  lng: 11.015413355445013,
  zoom: 7,
};

export const CITIES: City[] = [
  { id: 'tunis', fr: 'Tunis', ar: 'تونس', en: 'Tunis', lat: 36.8065, lng: 10.1815, zoom: 12 },
  { id: 'ariana', fr: 'Ariana', ar: 'أريانة', en: 'Ariana', lat: 36.8623, lng: 10.1934, zoom: 12 },
  { id: 'ben_arous', fr: 'Ben Arous', ar: 'بن عروس', en: 'Ben Arous', lat: 36.7530, lng: 10.2278, zoom: 12 },
  { id: 'manouba', fr: 'Manouba', ar: 'منوبة', en: 'Manouba', lat: 36.8088, lng: 10.1010, zoom: 12 },
  { id: 'nabeul', fr: 'Nabeul', ar: 'نابل', en: 'Nabeul', lat: 36.4557, lng: 10.7360, zoom: 12 },
  { id: 'zaghouan', fr: 'Zaghouan', ar: 'زغوان', en: 'Zaghouan', lat: 36.4029, lng: 10.1430, zoom: 12 },
  { id: 'bizerte', fr: 'Bizerte', ar: 'بنزرت', en: 'Bizerte', lat: 37.2744, lng: 9.8737, zoom: 12 },
  { id: 'beja', fr: 'Béja', ar: 'باجة', en: 'Béja', lat: 36.7256, lng: 9.1817, zoom: 12 },
  { id: 'jendouba', fr: 'Jendouba', ar: 'جندوبة', en: 'Jendouba', lat: 36.5011, lng: 8.7803, zoom: 12 },
  { id: 'kef', fr: 'Le Kef', ar: 'الكاف', en: 'Le Kef', lat: 36.1742, lng: 8.7045, zoom: 12 },
  { id: 'siliana', fr: 'Siliana', ar: 'سليانة', en: 'Siliana', lat: 36.0849, lng: 9.3712, zoom: 12 },
  { id: 'sousse', fr: 'Sousse', ar: 'سوسة', en: 'Sousse', lat: 35.8245, lng: 10.6346, zoom: 12 },
  { id: 'monastir', fr: 'Monastir', ar: 'المنستير', en: 'Monastir', lat: 35.7643, lng: 10.8113, zoom: 12 },
  { id: 'mahdia', fr: 'Mahdia', ar: 'المهدية', en: 'Mahdia', lat: 35.5047, lng: 11.0622, zoom: 12 },
  { id: 'sfax', fr: 'Sfax', ar: 'صفاقس', en: 'Sfax', lat: 34.7406, lng: 10.7602, zoom: 12 },
  { id: 'kairouan', fr: 'Kairouan', ar: 'القيروان', en: 'Kairouan', lat: 35.6759, lng: 10.0913, zoom: 12 },
  { id: 'kasserine', fr: 'Kasserine', ar: 'القصرين', en: 'Kasserine', lat: 35.1676, lng: 8.8347, zoom: 12 },
  { id: 'sidi_bouzid', fr: 'Sidi Bouzid', ar: 'سيدي بوزيد', en: 'Sidi Bouzid', lat: 35.0382, lng: 9.4846, zoom: 12 },
  { id: 'gabes', fr: 'Gabès', ar: 'قابس', en: 'Gabès', lat: 33.8434, lng: 10.0982, zoom: 12 },
  { id: 'medenine', fr: 'Médenine', ar: 'مدنين', en: 'Médenine', lat: 33.3400, lng: 10.4980, zoom: 12 },
  { id: 'tataouine', fr: 'Tataouine', ar: 'تطاوين', en: 'Tataouine', lat: 32.9297, lng: 10.4526, zoom: 12 },
  { id: 'gafsa', fr: 'Gafsa', ar: 'قفصة', en: 'Gafsa', lat: 34.4250, lng: 8.7842, zoom: 12 },
  { id: 'tozeur', fr: 'Tozeur', ar: 'توزر', en: 'Tozeur', lat: 33.9197, lng: 8.1335, zoom: 12 },
  { id: 'kebili', fr: 'Kébili', ar: 'قبلي', en: 'Kébili', lat: 33.7050, lng: 8.9645, zoom: 12 },
];

export function getAgencyMapUrl(selectedCity: string = 'all') {
  if (selectedCity === 'all') {
    return `${AGENCY_MAP_BASE_URL}&ll=${AGENCY_MAP_DEFAULT_VIEW.lat}%2C${AGENCY_MAP_DEFAULT_VIEW.lng}&z=${AGENCY_MAP_DEFAULT_VIEW.zoom}`;
  }

  const city = CITIES.find((c) => c.id === selectedCity);
  if (city) {
    return `${AGENCY_MAP_BASE_URL}&ll=${city.lat}%2C${city.lng}&z=${city.zoom}`;
  }

  return `${AGENCY_MAP_BASE_URL}&ll=${AGENCY_MAP_DEFAULT_VIEW.lat}%2C${AGENCY_MAP_DEFAULT_VIEW.lng}&z=${AGENCY_MAP_DEFAULT_VIEW.zoom}`;
}
