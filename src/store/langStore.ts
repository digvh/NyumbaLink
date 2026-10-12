// src/store/langStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'sw';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      toggle: () => set((s) => ({ lang: s.lang === 'en' ? 'sw' : 'en' })),
    }),
    { name: 'nyumbalink-lang' }
  )
);