// src/hooks/useVoiceNavigation.ts
'use client';

import { useEffect, useRef } from 'react';
import type { Route } from '@/lib/routing';
import { voice, type VoiceLang } from '@/lib/voice';
import { haversineMeters } from '@/hooks/useArrivalDetection';

interface Args {
  route: Route | null;
  userLocation: { lat: number; lng: number } | null;
  enabled: boolean;
  lang: VoiceLang;
}

export function useVoiceNavigation({ route, userLocation, enabled, lang }: Args) {
  const lastStepIndex = useRef<number>(-1);
  const lastBeepedIndex = useRef<number>(-1);

  useEffect(() => {
    if (!enabled || !route || !userLocation) return;

    const steps = route.steps;
    if (steps.length === 0) return;

    let nearestIdx = -1;
    let nearestDist = Infinity;

    for (let i = 0; i < steps.length; i++) {
      const loc = steps[i].maneuver.location;
      const d = haversineMeters(
        { lat: userLocation.lat, lng: userLocation.lng },
        { lat: loc[0], lng: loc[1] }
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }

    // Announce when within 80m
    if (nearestIdx >= 0 && nearestDist < 80 && lastStepIndex.current !== nearestIdx) {
      lastStepIndex.current = nearestIdx;
      const step = steps[nearestIdx];
      const text = lang === 'sw' ? step.instructionSw : step.instruction;
      voice.speak(text, { lang });
    }

    // Soft beep within 150m
    if (nearestIdx >= 0 && nearestDist < 150 && lastBeepedIndex.current !== nearestIdx) {
      lastBeepedIndex.current = nearestIdx;
      voice.playTurnSound();
    }
  }, [route, userLocation?.lat, userLocation?.lng, enabled, lang]);
}