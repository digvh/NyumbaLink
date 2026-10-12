// src/components/ServiceWorkerRegistration.tsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    // Only register in production (avoids dev headaches)
    if (process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.warn('SW registration failed:', err));
  }, []);

  return null;
}
