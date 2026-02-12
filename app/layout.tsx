import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gipevillemandeur.com'),
  title: 'GIPE Villemandeur | Groupement Indépendant de Parents d\'Élèves',
  description: 'GIPE Villemandeur - Groupement Indépendant de Parents d\'Élèves du Collège Lucie Aubrac. Actualités, événements, agenda et ressources pour les familles.',
  keywords: 'GIPE, parents d\'élèves, Collège Lucie Aubrac, Villemandeur, éducation',
  authors: [{ name: 'GIPE Villemandeur' }],
  openGraph: {
    title: 'GIPE Villemandeur - Groupement de parents d\'élèves',
    description: 'Agir ensemble pour nos enfants. Actualités, événements et agenda du GIPE.',
    url: 'https://gipevillemandeur.com',
    type: 'website',
    siteName: 'GIPE Villemandeur',
    images: [
      {
        url: '/siteV2/images/logogipe.png',
        width: 400,
        height: 300,
        alt: 'Logo GIPE Villemandeur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIPE Villemandeur',
    description: 'Agir ensemble pour nos enfants',
    images: ['/siteV2/images/logo.svg'],
  },
  robots: 'index, follow',
  applicationName: 'GIPE Villemandeur',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/siteV2/images/logo.svg" />
        <meta name="theme-color" content="#7d201a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body className={`${inter.className} bg-amber-50`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
