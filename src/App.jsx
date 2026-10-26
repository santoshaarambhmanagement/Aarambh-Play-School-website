// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalLayout from './components/layout/GlobalLayout'
import SmoothScrollLayout from './components/layout/SmoothScrollLayout'
import Home from './pages/Home'
import Gallery from './pages/GalleryPage'
import PrivacyPage from './pages/PrivacyPage'
import { InquiryProvider } from './context/InquiryContext'
import InquiryModal from './components/contact/InquiryModal'

function App() {
  return (
    <BrowserRouter>
      <InquiryProvider>
        {/* The modal is mounted here so it can sit on top of everything */}
        <InquiryModal />
        
        <GlobalLayout>
          <SmoothScrollLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* You can add your hidden Sanity CMS admin route here later */}
              {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            </Routes>
          </SmoothScrollLayout>
        </GlobalLayout>
      </InquiryProvider>
    </BrowserRouter>
  );
}

export default App;