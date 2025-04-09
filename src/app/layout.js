// "use client";
import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Certcy - Career Evolution Platform',
    template: '%s | Certcy'
  },
  description: 'Guiding professionals through career transitions with data-driven insights',
  keywords: ['career development', 'professional growth', 'career guidance', 'job transition', 'career pivot'],
  authors: [{ name: 'Certcy Team' }],
  creator: 'Certcy',
  publisher: 'Certcy',
  openGraph: {
    title: 'Certcy - Career Evolution Platform',
    description: 'Guiding professionals through career transitions with data-driven insights',
    url: 'https://certcy.space',
    siteName: 'Certcy',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.certcy.space/backfull.JPG', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'Certcy - Career Evolution Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certcy - Career Evolution Platform',
    description: 'Guiding professionals through career transitions with data-driven insights',
    images: ['https://www.certcy.space/backfull.JPG'], // Replace with your actual Twitter image
    creator: '@certcy'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
