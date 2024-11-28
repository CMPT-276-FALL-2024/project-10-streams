import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import Tutorial from './components/RecipeSection';
import Footer from './components/Footer';
import RecipeSearch from './components/RecipeSearch';
import AboutUs from './components/AboutUs';
import Gemini from './components/Gemini';
import PlanFromFridge from './components/PlanFromFridge';
import Navigate from './components/Navigate';
import './App.css';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const isRecipeSearchPage = location.pathname === '/recipe-search';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {!isRecipeSearchPage && <Header />}
      
      {/* Main Content */}
      <main className={`container mx-auto px-4 flex flex-col items-center mt-10 flex-grow ${isRecipeSearchPage ? 'overflow-y-auto' : ''}`}>
        <Routes>
          <Route path="/" element={
            <>
              <AboutSection />
              <Tutorial />
            </>
          } />
          <Route path="/plan-your-meals" element={<Gemini />} />
          <Route path="/plan-your-recipes" element={<RecipeSearch />} />
          <Route path="/plan-from-your-fridge" element={<PlanFromFridge />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      
      {/* Footer */}
      {!isRecipeSearchPage && <Footer />}
      <Navigate />
    </div>
  );
}


export default App;