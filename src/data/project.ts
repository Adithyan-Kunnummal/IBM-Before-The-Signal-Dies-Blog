// Project figures, taken from PROJECT_CONTEXT.md (repository, metadata files and
// the runs on IBM LinuxONE). Keep numbers here so the landing page and charts agree.

export const scenarios = [
  {
    name: 'Perth Hills bushfire',
    area: '20 km, 100% of sites fail',
    sitesFailed: 46,
    localitiesLost: 19,
    affected: 28133,
    bandsRaised: '25 (13 to High)',
    restored: 28113,
    restoredLocalities: 18,
    note: 'Stoneville 28,059; Bailup 54',
  },
  {
    name: 'Kimberley cyclone',
    area: '150 km, 100% of sites fail',
    sitesFailed: 3,
    localitiesLost: 5,
    affected: 14434,
    bandsRaised: '5 (5 to High; Broome Low → High)',
    restored: 14434,
    restoredLocalities: 5,
    note: 'one unit at Minyirr',
  },
  {
    name: 'South West storm',
    area: '60 km, 60% of sites fail',
    sitesFailed: 25,
    localitiesLost: 19,
    affected: 4986,
    bandsRaised: '23 (8 to High)',
    restored: 4517,
    restoredLocalities: 14,
    note: 'Ludlow 3,885; Karridale 632',
  },
  {
    name: 'Wheatbelt grassfire',
    area: '60 km, 100% of sites fail',
    sitesFailed: 5,
    localitiesLost: 5,
    affected: 2715,
    bandsRaised: '17 (1 to High)',
    restored: 2675,
    restoredLocalities: 3,
    note: 'Merredin 2,604; Hines Hill 71',
  },
];

export const models = [
  { name: 'XGBoost (final)', storm: '0.765 / 61.6%', loio: '0.770 / 60.8%', all: '0.766 / 61.4%', final: true },
  { name: 'XGBoost (original)', storm: '0.725 / 58.0%', loio: '0.742 / 54.2%', all: '0.729 / 57.2%' },
  { name: 'Logistic regression', storm: '0.743 / 66.4%', loio: '0.801 / 66.7%', all: '0.755 / 66.5%' },
  { name: 'Population only', storm: '0.671 / 39.3%', loio: '0.625 / 30.0%', all: '0.661 / 37.4%' },
  { name: 'Transparent index', storm: '0.397 / 2.9%', loio: '0.570 / 16.7%', all: '0.433 / 5.8%' },
];

export const benchmark = [
  { rows: 1699, snapCpu: 1.0, xgb: 2.2, telum: 9.2 },
  { rows: 16990, snapCpu: 9.9, xgb: 20.3, telum: 66.8 },
  { rows: 169900, snapCpu: 106.7, xgb: 203.3, telum: 668.3 },
  { rows: 509700, snapCpu: 329.5, xgb: 626.7, telum: 1988.4 },
];

export const sources = [
  {
    name: 'Optus mobile sites',
    detail: 'ACCC Mobile Coverages and Sites, snapshot 31 Jan 2025',
    url: 'https://spatial.infrastructure.gov.au/server/rest/services/Mobile_Coverages_and_Sites_ACCC/MapServer',
  },
  {
    name: 'Localities and population',
    detail: 'ABS 2021 Census GeoPackages',
    url: 'https://www.abs.gov.au/census/find-census-data/geopackages',
  },
  {
    name: 'Bushfire-prone areas',
    detail: 'WA OBRM-026',
    url: 'https://catalogue.data.wa.gov.au/dataset/bushfire-prone-areas-obrm-026',
  },
  { name: 'Fire history', detail: 'DBCA-060', url: 'https://catalogue.data.wa.gov.au/dataset/dbca-fire-history' },
  {
    name: 'Floodplain mapping',
    detail: 'DWER-020',
    url: 'https://catalogue.data.wa.gov.au/dataset/fpm-floodplain-area',
  },
  {
    name: 'Tropical cyclone tracks',
    detail: 'Bureau of Meteorology',
    url: 'https://www.bom.gov.au/cyclone/tropical-cyclone-knowledge-centre/databases/',
  },
  {
    name: 'Significant outages',
    detail: 'Optus outage register, downloaded 17 Oct 2026',
    url: 'https://www.optus.com.au/living-network/service-status/national-outage-register' as string | null,
  },
];

const nf = new Intl.NumberFormat('en-AU');
export const n = (v: number) => nf.format(v);
