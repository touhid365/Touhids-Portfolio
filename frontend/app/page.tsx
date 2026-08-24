import Navbar from '@/app/components/navbar/Navbar'
import Footer from '@/app/components/sections/Footer'
import Hero from '@/app/components/sections/Hero'
import About from '@/app/components/sections/About'
import Projects from '@/app/components/sections/Projects'
import Contact from '@/app/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  )
}
