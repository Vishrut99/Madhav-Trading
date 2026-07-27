import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://newmadhavtrading.com'),
  title: 'New Madhav Trading — Wholesale Grocery Supplier, Surat',
  description:
    'Order pulses, dry fruits, groceries and spices wholesale from New Madhav Trading, Surat. Easy online ordering. Trusted wholesale supplier in Nana Varachha.',
  keywords: [
    'New Madhav Trading',
    'wholesale grocery Surat',
    'dry fruits Surat',
    'pulses wholesale',
    'spices Surat',
    'kathol Surat',
    'Gandhi Kiryana',
  ],
  authors: [{ name: 'New Madhav Trading' }],
  openGraph: {
    title: 'New Madhav Trading — Wholesale Grocery Supplier, Surat',
    description:
      'Order pulses, dry fruits, groceries and spices wholesale from New Madhav Trading, Surat. Easy online ordering.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'New Madhav Trading',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Madhav Trading — Wholesale Grocery Supplier, Surat',
    description:
      'Order pulses, dry fruits, groceries and spices wholesale from New Madhav Trading, Surat.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="font-body min-h-screen bg-beige-200 text-brown-900 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
