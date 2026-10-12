// src/utils/constants.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const CATEGORIES = [
  { value: 'HOTEL', label: 'Hotel', color: 'blue' },
  { value: 'LODGE', label: 'Lodge', color: 'green' },
  { value: 'SELF_CONTAINED_ROOM', label: 'Self-Contained Room', color: 'purple' },
  { value: 'RESTAURANT', label: 'Restaurant', color: 'orange' },
  { value: 'BAR', label: 'Bar', color: 'pink' },
  { value: 'LAND', label: 'Land for Sale', color: 'amber' },
] as const;

export const TANZANIA_REGIONS = [
  'Arusha',
  'Dar es Salaam',
  'Dodoma',
  'Geita',
  'Iringa',
  'Kagera',
  'Katavi',
  'Kigoma',
  'Kilimanjaro',
  'Lindi',
  'Manyara',
  'Mara',
  'Mbeya',
  'Morogoro',
  'Mtwara',
  'Mwanza',
  'Njombe',
  'Pwani',
  'Rukwa',
  'Ruvuma',
  'Shinyanga',
  'Simiyu',
  'Singida',
  'Songwe',
  'Tabora',
  'Tanga',
  'Zanzibar',
] as const;

export const DEFAULT_LOCATION = {
  lat: -6.7924,
  lng: 39.2083,
} as const;

export const MAP_ZOOM = 12;
export const SEARCH_RADIUS = 5000;