import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Random rants from fraser',
  description: 'Random rants',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        />
      </head>
      <body className={`${inter.className} bg-vercel-bg text-vercel-fg min-h-screen`}>
        {children}
      </body>
    </html>
  );
}