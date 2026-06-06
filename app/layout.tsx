import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Titan_One } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import JsonLd from '@/components/seo/JsonLd';
import {
  DEFAULT_DESCRIPTION,
  KEYWORDS,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

// Chunky rounded display face for the "ÁGAPE" wordmark (Gliker-style)
const titan = Titan_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Pulseras Católicas de Cristal y Oro | Colombia`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  category: 'shopping',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Pulseras Católicas de Cristal y Oro | Colombia`,
    description: DEFAULT_DESCRIPTION,
    // og:image comes from app/opengraph-image.tsx (branded generated card)
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Pulseras Católicas de Cristal y Oro`,
    description: DEFAULT_DESCRIPTION,
    images: ['/brand/pulseras.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      'gWuKX4PsNu7RpFF6BpIgR5bIoyscl5v_uUIgqEK4oUs',
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  other: {
    'geo.region': 'CO',
    'geo.placename': 'Colombia',
  },
};

export const viewport: Viewport = {
  themeColor: '#E0F2FE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable} ${titan.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
