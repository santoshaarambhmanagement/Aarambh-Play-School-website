// src/pages/Home.jsx
import Hero from '../components/sections/Hero'
import Philosophy from '../components/sections/Philosophy'
import Programs from '../components/sections/Programs'
import Gallery from '../components/sections/Gallery'
import UniformShowcase from '../components/uniform/UniformShowcase'
import ContactSection from '../components/contact/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Programs />
      <UniformShowcase />
      <Gallery />
      <ContactSection />
    </>
  )
}