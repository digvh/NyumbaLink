// src/app/navigate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Navigation, Mic, MicOff, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { findMockListing } from '@/data/mockListings';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import { useRoute } from '@/hooks/useRoute';
import { useArrivalDetection } from '@/hooks/useArrivalDetection';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { voice } from '@/lib/voice';
import { shareETA } from '@/lib/share';
import { t } from '@/lib/voice-phrases';
import { useLangStore } from '@/store/langStore';
import type { TravelMode } from '@/lib/routing';
import Loading from '@/components/ui/Loading';
import RoutePanel from '@/components/map/RoutePanel';

const NavigationMap = dynamic(() => import('@/components/map/NavigationMap'), {
  ssr: false,
  loading: () => <Loading text="Loading map..." />,
});

export default function NavigatePage() {
  const searchParams = useSearchParams();
  const toId = searchParams.get('to');
  const listing = toId ? findMockListing(toId) : undefined;

  const { lang, toggle: toggleLang } = useLangStore();

  const [mode, setMode] = useState<TravelMode>('driving');
  const [panelOpen, setPanelOpen] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [voiceOn, setVoiceOn] = useState(false);
  const [arrivedShown, setArrivedShown] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const { location: userLoc, error: locError, isTracking } = useLiveLocation({
    enabled: true,
    highAccuracy: true,
  });

  const from = userLoc ? { lat: userLoc.lat, lng: userLoc.lng } : null;
  const to =
    listing && listing.latitude != null && listing.longitude != null
      ? { lat: listing.latitude, lng: listing.longitude }
      : null;

  const { route, isLoading, error } = useRoute({
    from,
    to,
    mode,
    enabled: !!from && !!to,
    refreshKey,
  });

  const { arrived, distanceMeters } = useArrivalDetection({
    userLocation: from,
    destination: to,
    thresholdMeters: 50,
  });

  // Keep the voice engine in sync with the language store
  useEffect(() => {
    voice.setLang(lang);
  }, [lang]);

  // 🎙️ Auto-voice navigation (bilingual)
  useVoiceNavigation({
    route,
    userLocation: from,
    enabled: voiceOn && !!route,
    lang,
  });

  // 🔔 Arrival sound + voice (once)
  if (arrived && !arrivedShown) {
    setArrivedShown(true);
    voice.playArrivalSound();
    voice.speak(t('arrived', lang), { lang });
    toast.success(`🎉 ${listing?.title ?? t('destination', lang)} — ${t('arrived', lang)}`);
  }

  // 🔊 Voice toggle
  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    voice.setEnabled(next);
    voice.setLang(lang);
    if (next) {
      voice.speak(t('voiceOn', lang), { lang });
      toast.success('🔊 ' + t('voiceOn', lang));
    } else {
      voice.stop();
      toast.success('🔇 ' + t('voiceOff', lang));
    }
  };

  // 📱 Share ETA
  const handleShareETA = async () => {
    if (!route || !listing) return;
    setIsSharing(true);
    try {
      const result = await shareETA({
        route,
        destinationName: listing.title,
        destinationLat: listing.latitude,
        destinationLng: listing.longitude,
      });
      if (result === 'clipboard') toast.success('📋 ETA copied to clipboard!');
      else if (result !== 'cancelled') toast.success('✅ ETA shared!');
    } catch {
      toast.error('Failed to share ETA');
    } finally {
      setIsSharing(false);
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Destination not found</p>
          <Link href="/search" className="text-indigo-600 hover:underline">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <NavigationMap
          userLocation={from}
          destination={to}
          route={route}
          destinationTitle={listing.title}
          followUser
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-[1001] flex items-center justify-between gap-3 pointer-events-none">
        <Link
          href={`/listing/${listing.id}`}
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/40 shadow-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 border border-white/40 font-semibold shadow-lg"
            aria-label="Toggle language"
          >
            {lang === 'en' ? '🇬🇧 EN' : '🇹🇿 SW'}
          </button>

          {/* Voice toggle */}
          <button
            onClick={toggleVoice}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold shadow-lg transition ${
              voiceOn
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 border border-white/40'
            }`}
          >
            {voiceOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{voiceOn ? 'Voice On' : 'Voice Off'}</span>
          </button>

          {/* Share ETA */}
          {route && (
            <button
              onClick={handleShareETA}
              disabled={isSharing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share ETA</span>
            </button>
          )}

          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 border border-white/40 font-semibold shadow-lg"
            >
              <Navigation className="w-4 h-4" /> Directions
            </button>
          )}
        </div>
      </div>

      <RoutePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        route={route}
        isLoading={isLoading}
        error={error || (locError ? `Location error: ${locError}` : null)}
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setRefreshKey((k) => k + 1);
          voice.resetSpokenKey();
        }}
        onRecalculate={() => {
          setRefreshKey((k) => k + 1);
          voice.resetSpokenKey();
        }}
        destinationName={listing.title}
        isTracking={isTracking}
        lang={lang}
      />

      {arrived && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-2xl animate-pulse">
          🎉 {t('arrived', lang)}
        </div>
      )}

      {distanceMeters != null && !arrived && (
        <div className="absolute bottom-4 right-4 z-[1001] px-4 py-3 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/40 shadow-xl">
          <p className="text-xs text-gray-500">{lang === 'sw' ? 'Umbali uliobaki' : 'Remaining'}</p>
          <p className="font-bold text-gray-900 dark:text-white">
            {distanceMeters < 1000
              ? `${Math.round(distanceMeters)} m`
              : `${(distanceMeters / 1000).toFixed(2)} km`}
          </p>
        </div>
      )}
    </div>
  );
}