import React from "react";
import { Routes, Route } from 'react-router-dom';
import './App.css';







import Navbar from "./components/layout/Navbar.jsx";
import Hero from "./components/Home/heroSection";
import About from "./components/pages/About";
import CategoriesSection from './components/Home/categoriesSection';
import BrandSection from "./components/Home/brandsSection";
import Contacts from "./components/pages/contact";
import ClientSection from "./components/Home/ClientsSection";
import Product from './components/data/product';
import Footer from "./components/layout/Footer.jsx";
import AIChatBox from './components/Ui/AiChatbox';
import { allProducts, categories } from './components/data/product';
import WhatsAppButton from './components/Ui/WhatsAppButton';
import CallButton from './components/Ui/CallButton';
import Music from './components/Ui/MusicPlayer.jsx'
import playmusic from '../public/Pufino.mp3'

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <CategoriesSection />
      <BrandSection />
      <ClientSection />
      <Contacts />
      

      <Footer />
    </>
  );
}

function ProductsPage() {
  return <Product />;
}

function App() {
  const phoneNumber = "+971 52 708 7748";

  return (
    <div className="App">
      <Navbar />
      <div className="relative z-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
      <AIChatBox products={allProducts} categoriesList={categories} />
   <div className="fixed bottom-3 right-5.5 z-50">
  <Music audioUrl={playmusic} size="w-12 h-12" />
</div>
      {/* WhatsApp button - using valid Tailwind spacing */}
      <WhatsAppButton 
        phoneNumber={phoneNumber}
        message="Hello, I'm interested in your products!"
        position="bottom-33 right-7"   // changed bottom-22 → bottom-20
      />

      {/* Call button */}
      <CallButton 
        phoneNumber={phoneNumber}
        position="bottom-47 right-7"   // changed bottom-40 → bottom-36
      />
    </div>
  );
}

export default App;