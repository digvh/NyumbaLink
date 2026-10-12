// src/lib/voice-phrases.ts
import type { VoiceLang } from '@/lib/voice';

type PhraseKey =
  | 'voiceOn'
  | 'voiceOff'
  | 'arrived'
  | 'head'
  | 'turn'
  | 'continue'
  | 'merge'
  | 'keep'
  | 'roundabout'
  | 'newName'
  | 'endOfRoad'
  | 'depart'
  | 'arrive'
  | 'onto'
  | 'for'
  | 'meters'
  | 'kilometers'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'northwest'
  | 'southeast'
  | 'southwest'
  | 'left'
  | 'right'
  | 'slightLeft'
  | 'slightRight'
  | 'sharpLeft'
  | 'sharpRight'
  | 'straight'
  | 'uturn'
  | 'destination'
  | 'destinationNamed'
  | 'calculatingRoute'
  | 'routeRecalculated';

const EN: Record<PhraseKey, string> = {
  voiceOn: 'Voice guidance is on',
  voiceOff: 'Voice guidance is off',
  arrived: 'You have arrived at your destination',
  head: 'Head',
  turn: 'Turn',
  continue: 'Continue',
  merge: 'Merge',
  keep: 'Keep',
  roundabout: 'Take the roundabout',
  newName: 'Continue on',
  endOfRoad: 'Turn',
  depart: 'Start',
  arrive: 'You have arrived',
  onto: 'onto',
  for: 'for',
  meters: 'meters',
  kilometers: 'kilometers',
  north: 'north',
  south: 'south',
  east: 'east',
  west: 'west',
  northeast: 'northeast',
  northwest: 'northwest',
  southeast: 'southeast',
  southwest: 'southwest',
  left: 'left',
  right: 'right',
  slightLeft: 'slightly left',
  slightRight: 'slightly right',
  sharpLeft: 'sharp left',
  sharpRight: 'sharp right',
  straight: 'straight',
  uturn: 'U-turn',
  destination: 'destination',
  destinationNamed: 'destination',
  calculatingRoute: 'Calculating route',
  routeRecalculated: 'Route recalculated',
};

const SW: Record<PhraseKey, string> = {
  voiceOn: 'Mwongozo wa sauti umewashwa',
  voiceOff: 'Mwongozo wa sauti umezimwa',
  arrived: 'Umefika kwenye marudio yako',
  head: 'Elekea',
  turn: 'Geuka',
  continue: 'Endelea',
  merge: 'Ungana',
  keep: 'Endelea',
  roundabout: 'Pitia mzunguko',
  newName: 'Endelea kwenye',
  endOfRoad: 'Geuka',
  depart: 'Anza',
  arrive: 'Umefika',
  onto: 'kwenye',
  for: 'kwa',
  meters: 'mita',
  kilometers: 'kilomita',
  north: 'kaskazini',
  south: 'kusini',
  east: 'mashariki',
  west: 'magharibi',
  northeast: 'kaskazini-mashariki',
  northwest: 'kaskazini-magharibi',
  southeast: 'kusini-mashariki',
  southwest: 'kusini-magharibi',
  left: 'kushoto',
  right: 'kulia',
  slightLeft: 'kushoto kidogo',
  slightRight: 'kulia kidogo',
  sharpLeft: 'kushoto sana',
  sharpRight: 'kulia sana',
  straight: 'moja kwa moja',
  uturn: 'geuka nyuma',
  destination: 'marudio',
  destinationNamed: 'marudio',
  calculatingRoute: 'Tunahesabu njia',
  routeRecalculated: 'Njia imehesabiwa upya',
};

const DICT: Record<VoiceLang, Record<PhraseKey, string>> = {
  en: EN,
  sw: SW,
};

export function t(key: PhraseKey, lang: VoiceLang): string {
  return DICT[lang][key] ?? DICT.en[key] ?? key;
}

/** Translate an OSRM modifier (left, right, etc.) into the target language. */
export function tModifier(modifier: string | undefined, lang: VoiceLang): string {
  if (!modifier) return t('straight', lang);
  const map: Record<string, PhraseKey> = {
    left: 'left',
    right: 'right',
    'slight left': 'slightLeft',
    'slight right': 'slightRight',
    'sharp left': 'sharpLeft',
    'sharp right': 'sharpRight',
    straight: 'straight',
    uturn: 'uturn',
  };
  const key = map[modifier];
  return key ? t(key, lang) : modifier;
}

/** Translate compass direction into the target language. */
export function tCompass(dir: string, lang: VoiceLang): string {
  const map: Record<string, PhraseKey> = {
    north: 'north',
    south: 'south',
    east: 'east',
    west: 'west',
    northeast: 'northeast',
    northwest: 'northwest',
    southeast: 'southeast',
    southwest: 'southwest',
  };
  const key = map[dir.toLowerCase()];
  return key ? t(key, lang) : dir;
}

/** Format distance (m or km) in the target language. */
export function tDistance(meters: number, lang: VoiceLang): string {
  if (meters < 1000) {
    return `${Math.round(meters)} ${t('meters', lang)}`;
  }
  return `${(meters / 1000).toFixed(1)} ${t('kilometers', lang)}`;
}

export type { PhraseKey };