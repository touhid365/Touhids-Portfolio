import Hero from '@/app/components/sections/Hero'
import About from '@/app/components/sections/About'
import Projects from '@/app/components/sections/Projects'
import Contact from '@/app/components/sections/Contact'

export default function Home() {
  return (
    <>
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
    </>
  )
}
