import Navbar from './Navbar'
import Footer from './Footer'

export default function GlobalLayout({ children }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <Navbar />
      
      {/* pt-20 pushes the page content down so it doesn't hide behind the fixed glass navbar */}
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}