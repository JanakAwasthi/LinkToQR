import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LinkToQR.me - Advanced AI-Powered Web Utilities",
  description:
    "Privacy-first web toolkit for image processing, document handling, QR codes, and smart text storage. Zero server uploads, 100% secure.",
  keywords: "image compressor, PDF merger, QR generator, document scanner, AI tools, privacy secure",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and Social Preview */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:image" content="/favicon.png" />
        <meta name="twitter:image" content="/favicon.png" />
        <meta name="theme-color" content="#232b4d" />

        {/* Google AdSense - Main Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6126558809611102"
          crossOrigin="anonymous"
        />

        {/* AdSense Account Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-6126558809611102" />

        {/* AMP Auto Ads Script */}
        <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js" />

        {/* AMP Ad Script */}
        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js" />
      </head>
      <body className={inter.className}>
        {/* AMP Auto Ads - Right after body tag */}
        <amp-auto-ads type="adsense" data-ad-client="ca-pub-6126558809611102" />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
