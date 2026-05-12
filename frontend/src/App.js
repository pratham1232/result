import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import ResultDetails from './pages/ResultDetails';
import UploadResults from './pages/UploadResults';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
          <div className="min-h-screen bg-bgi-darker">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<Results />} />
                <Route path="/results/:regId" element={<ResultDetails />} />
                <Route path="/secure-result-upload" element={<UploadResults />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0F1628',
                color: '#E2E8F0',
                border: '1px solid #1E2D4A',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '15px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#00FF88', secondary: '#0F1628' },
              },
              error: {
                iconTheme: { primary: '#FF3B5C', secondary: '#0F1628' },
              },
            }}
          />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
