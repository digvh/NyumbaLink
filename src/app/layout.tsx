// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import CookieConsent from '@/components/legal/CookieConsent';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NyumbaLink - Find Your Perfect Home in Tanzania',
  description: 'Find rooms, apartments, lodges, and land for sale near you in Tanzania',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col relative">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  borderRadius: '16px',
                  color: '#1f2937',
                },
              }}
            />
            <ServiceWorkerRegistration />
                      <CookieConsent />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}