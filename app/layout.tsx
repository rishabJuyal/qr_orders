import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Nidhivan Restaurant | Digital Menu & Table Ordering',
    template: '%s · Nidhivan Restaurant',
  },
  description:
    'Scan the QR code at your table, explore the Nidhivan Restaurant menu, order in seconds and track your order live. Pure vegetarian kitchen in Sikar, Rajasthan.',
  keywords: ['Nidhivan Restaurant', 'QR menu', 'digital menu', 'Sikar restaurant', 'table ordering', 'pure veg restaurant'],
  openGraph: {
    title: 'Nidhivan Restaurant · Digital Menu',
    description: 'Scan. Choose. Enjoy. Order straight from your table.',
    type: 'website',
    siteName: 'Nidhivan Restaurant',
  },
};

export const viewport: Viewport = {
  themeColor: '#4a1019',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
