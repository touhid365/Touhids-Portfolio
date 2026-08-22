import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Touhid Developer - Full Stack Developer',
  description: 'Turning ideas into scalable web apps.',
  openGraph: {
    url: 'https://touhids-portfolio.vercel.app'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
