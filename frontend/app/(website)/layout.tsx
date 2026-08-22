import Navbar from '@/app/components/navbar/Navbar'
import Footer from '@/app/components/sections/Footer'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}