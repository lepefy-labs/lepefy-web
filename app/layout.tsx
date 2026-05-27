import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const LOGO_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M 4 4 L 4 44 L 44 44' stroke='%231E1B4B' stroke-width='5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M 4 32 A 12 12 0 0 1 16 44' stroke='%236366F1' stroke-width='1.5' fill='none'/%3E%3Cpath d='M 4 22 A 22 22 0 0 1 26 44' stroke='%236366F1' stroke-width='1.5' fill='none' opacity='0.55'/%3E%3Cpath d='M 4 12 A 32 32 0 0 1 36 44' stroke='%236366F1' stroke-width='1.5' fill='none' opacity='0.25'/%3E%3C/svg%3E`;

export const metadata: Metadata = {
  title: 'Lepefy — Trova le occasioni prima degli altri',
  description: "Lepefy scansiona Subito.it e Vinted in tempo reale. L'AI analizza ogni annuncio e segnala solo i prezzi davvero sottostimati.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" type="image/svg+xml" href={LOGO_SVG} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        {children}
        <Analytics />   {/* ← aggiungi qui */}
      </body>
    </html>
  );
}
}
