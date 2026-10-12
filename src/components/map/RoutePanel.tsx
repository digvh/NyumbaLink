// src/components/map/RoutePanel.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Navigation, Clock, MapPin, Volume2, VolumeX,
  RefreshCw, Car, Footprints, Bike,
} from 'lucide-react';
import { useState } from 'react';
import type { Route, TravelMode } from '@/lib/routing';
import { formatMeters, formatDuration } from '@/lib/routing';
import { voice, type VoiceLang } from '@/lib/voice';

interface RoutePanelProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  isLoading: boolean;
  error: string | null;
  mode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
  onRecalculate: () => void;
  destinationName?: string;
  isTracking?: boolean;
  lang: VoiceLang;
}

const MODES: { value: TravelMode; icon: typeof Car; labelEn: string; labelSw: string }[] = [
  { value: 'driving', icon: Car, labelEn: 'Drive', labelSw: 'Endesha' },
  { value: 'walking', icon: Footprints, labelEn: 'Walk', labelSw: 'Tembea' },
  { value: 'cycling', icon: Bike, labelEn: 'Bike', labelSw: 'Baiskeli' },
];

export default function RoutePanel({
  isOpen,
  onClose,
  route,
  isLoading,
  error,
  mode,
  onModeChange,
  onRecalculate,
  destinationName,
  isTracking = false,
  lang,
}: RoutePanelProps) {
  const [voiceOn, setVoiceOn] = useState(false);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  const L = lang === 'sw';
  const tr = {
    directions: L ? 'Maelekezo' : 'Directions',
    to: L ? 'Kwa' : 'To',
    distance: L ? 'Umbali' : 'Distance',
    time: L ? 'Muda' : 'Time',
    liveTracking: L ? 'Ufuatiliaji wa moja kwa moja' : 'Live tracking',
    calculating: L ? 'Tunahesabu njia...' : 'Calculating route...',
    voiceOn: L ? 'Sauti imewashwa' : 'Voice on',
    voiceOff: L ? 'Sauti imezimwa' : 'Voice off',
    recalculate: L ? 'Hesabu upya' : 'Recalculate route',
  };

  const speak = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = () => setSpeakingStep(null);
    setSpeakingStep(index);
    window.speechSynthesis.speak(u);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="absolute top-0 left-0 bottom-0 z-[1000] w-full sm:w-[380px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-r border-white/30 dark:border-white/10 shadow-2xl flex flex-col"
        >
          <div className="p-4 border-b border-white/20 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{tr.directions}</h2>
                {isTracking && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    {tr.liveTracking}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close directions"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {destinationName && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs text-gray-500">{tr.to}</p>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{destinationName}</p>
            </div>
          )}

          <div className="px-4 py-3 flex gap-2">
            {MODES.map((m) => {
              const Icon = m.icon;
              const active = m.value === mode;
              return (
                <button
                  key={m.value}
                  onClick={() => onModeChange(m.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {L ? m.labelSw : m.labelEn}
                </button>
              );
            })}
          </div>

          {route && (
            <div className="px-4 py-3 border-y border-white/20 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500">{tr.distance}</p>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    {formatMeters(route.distance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{tr.time}</p>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {formatDuration(route.duration)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onRecalculate}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                  title={tr.recalculate}
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => {
                    const next = !voiceOn;
                    setVoiceOn(next);
                    if (!next && typeof window !== 'undefined') window.speechSynthesis?.cancel();
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    voiceOn ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
                  }`}
                  title={voiceOn ? tr.voiceOn : tr.voiceOff}
                >
                  {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="p-6 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                {tr.calculating}
              </div>
            )}

            {error && !isLoading && (
              <div className="p-4 text-center text-red-500 text-sm">{error}</div>
            )}

            {!isLoading && !error && route && (
              <ol className="py-2">
                {route.steps.map((step, i) => {
                  const text = L ? step.instructionSw : step.instruction;
                  return (
                    <li
                      key={i}
                      className={`px-4 py-3 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                        speakingStep === i ? 'bg-indigo-50 dark:bg-indigo-950/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{text}</p>
                        {step.distance > 10 && (
                          <p className="text-xs text-gray-500 mt-0.5">{formatMeters(step.distance)}</p>
                        )}
                      </div>
                      {voiceOn && (
                        <button
                          onClick={() => speak(text, i)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                          aria-label="Speak"
                        >
                          <Volume2 className="w-4 h-4 text-indigo-500" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            {!isLoading && !error && !route && (
              <div className="p-6 text-center text-gray-500 text-sm">
                {L ? 'Chagua njia ya usafiri hapo juu ili kuona maelekezo.' : 'Pick a mode above to see directions.'}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}