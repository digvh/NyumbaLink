// src/utils/cities.ts

export interface CityInfo {
  name: string;
  region: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const TANZANIA_CITIES: CityInfo[] = [
  {
    name: 'Dar es Salaam',
    region: 'Dar es Salaam',
    lat: -6.7924,
    lng: 39.2083,
    zoom: 12,
  },
  {
    name: 'Arusha',
    region: 'Arusha',
    lat: -3.3869,
    lng: 36.6830,
    zoom: 12,
  },
  {
    name: 'Mwanza',
    region: 'Mwanza',
    lat: -2.5164,
    lng: 32.9175,
    zoom: 12,
  },
  {
    name: 'Dodoma',
    region: 'Dodoma',
    lat: -6.1630,
    lng: 35.7516,
    zoom: 12,
  },
  {
    name: 'Zanzibar',
    region: 'Zanzibar',
    lat: -6.1659,
    lng: 39.2026,
    zoom: 12,
  },
  {
    name: 'Mbeya',
    region: 'Mbeya',
    lat: -8.9094,
    lng: 33.4608,
    zoom: 12,
  },
  {
    name: 'Moshi',
    region: 'Kilimanjaro',
    lat: -3.3349,
    lng: 37.3404,
    zoom: 12,
  },
  {
    name: 'Tanga',
    region: 'Tanga',
    lat: -5.0689,
    lng: 39.0988,
    zoom: 12,
  },
];

// Find the closest city to a given coordinate
export function findNearestCity(lat: number, lng: number): CityInfo {
  let nearest = TANZANIA_CITIES[0];
  let minDistance = Infinity;

  for (const city of TANZANIA_CITIES) {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}

// Get city by name
export function getCityByName(name: string): CityInfo | undefined {
  return TANZANIA_CITIES.find(
    (city) => city.name.toLowerCase() === name.toLowerCase()
  );
}