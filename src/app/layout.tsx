import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "APW Labs — Open Source Engineering & Systems R&D",
  description:
    "An open-source research collective focused on AOSP systems, low-level reverse engineering, embedded systems, and scalable cross-platform software.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "APW Labs",
    "Open Source",
    "Android Development",
    "AOSP",
    "Systems Engineering",
    "Embedded Systems",
    "Software Architecture",
  ],
  authors: [{ name: "APW Labs Team" }],
  openGraph: {
    title: "APW Labs — Open Source Engineering & Systems R&D",
    description:
      "An open-source research collective focused on AOSP systems, low-level reverse engineering, embedded systems, and scalable cross-platform software.",
    url: SITE_URL,
    siteName: "APW Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APW Labs — Open Source Engineering & Systems R&D",
    description:
      "An open-source research collective focused on AOSP systems, low-level reverse engineering, and multi-platform software.",
  },
};

export const viewport: Viewport = { themeColor: '#0a0a0f', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

const themeInit = `(function(){var t;try{t=localStorage.getItem('apw-theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='light'?'#f4f4f0':'#0a0a0f'})()`

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
