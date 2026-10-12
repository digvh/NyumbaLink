// src/components/ui/LanguageToggle.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { useLangStore, type Lang } from '@/store/langStore';

const LOCALES: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' },
];

export default function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLangStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LOCALES.find((l) => l.code === lang) ?? LOCALES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition flex items-center gap-2"
        aria-label="Change language"
      >
        <Languages className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {current.flag} {current.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-white/10 py-2 z-50">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => {
                setLang(loc.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-white/60 dark:hover:bg-white/10 transition flex items-center gap-2 ${
                lang === loc.code ? 'text-indigo-600 font-medium' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{loc.flag}</span>
              <span>{loc.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}