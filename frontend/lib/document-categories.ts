export type FilterKey = 'year' | 'sem' | 'lang' | 'type' | 'label';
export type CategoryKey = 'agenda_financier' | 'indicateur_financier' | 'informations_financieres' | 'publications_financieres' | 'rapports_activite' | 'documents_reference' | 'rapports_rse' | 'lettres_actionnaires';

export const CATEGORY_CONFIG: Record<CategoryKey, { labelFr: string; filters: FilterKey[] }> = {
  agenda_financier: { labelFr: 'Agenda Financier', filters: ['lang'] },
  indicateur_financier: { labelFr: 'Indicateur Financier', filters: ['year', 'sem'] },
  informations_financieres: { labelFr: 'Informations Financières', filters: ['year', 'type'] },
  publications_financieres: { labelFr: 'Publications Financières', filters: ['label'] },
  rapports_activite: { labelFr: "Rapports d'activité", filters: ['year', 'lang'] },
  documents_reference: { labelFr: 'Documents de référence', filters: ['year'] },
  rapports_rse: { labelFr: 'Rapports RSE', filters: [] },
  lettres_actionnaires: { labelFr: 'Lettres aux actionnaires', filters: [] },
};

export function buildCategoryString(base: CategoryKey, filters: Record<string, string>): string {
  const parts = Object.entries(filters).map(([k, v]) => `${k}:${v}`);
  return parts.length > 0 ? `${base}|${parts.join('|')}` : base;
}

export function parseCategoryString(raw: string): { base: CategoryKey; filters: Record<string, string> } {
  const [base, ...rest] = raw.split('|');
  const filters: Record<string, string> = {};
  rest.forEach(part => {
    const idx = part.indexOf(':');
    if (idx !== -1) filters[part.substring(0, idx)] = part.substring(idx + 1);
  });
  return { base: base as CategoryKey, filters };
}