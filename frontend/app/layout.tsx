import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Touhid Developer - Full Stack Developer',
  description: 'Turning ideas into scalable web apps. Full Stack Developer specializing in Next.js, React, and Node.js.',
  keywords: 'Full Stack Developer, Next.js, React, Node.js, Portfolio',
  authors: [{ name: 'Touhid Developer' }],
  openGraph: {
    title: 'Touhid Developer - Full Stack Developer',
    description: 'Turning ideas into scalable web apps',
    url: 'https://your-portfolio.com',
    siteName: 'Touhid Developer', 
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Touhid Developer - Full Stack Developer',
    description: 'Turning ideas into scalable web apps',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}