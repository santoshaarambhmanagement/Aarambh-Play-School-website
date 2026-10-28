// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalLayout from './components/layout/GlobalLayout'
import SmoothScrollLayout from './components/layout/SmoothScrollLayout'
import Home from './pages/Home'
import Gallery from './pages/GalleryPage'
import PrivacyPage from './pages/PrivacyPage'
import { InquiryProvider } from './context/InquiryContext'
import InquiryModal from './components/contact/InquiryModal'
import ScrollToTop from './components/layout/ScrollToTop' 

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <InquiryProvider>
        <InquiryModal />
        <GlobalLayout>
          <SmoothScrollLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </SmoothScrollLayout>
        </GlobalLayout>
      </InquiryProvider>
    </BrowserRouter>
  );
}

export default App;