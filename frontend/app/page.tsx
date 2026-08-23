// frontend/app/page.tsx
import Hero from '@/app/components/sections/Hero';
import About from '@/app/components/sections/About';
import Projects from '@/app/components/sections/Projects';
import Contact from '@/app/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}