import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import Tutorial from './components/RecipeSection';
import Footer from './components/Footer';
import RecipeSearch from './RecipeSearch';
import AboutUs from './components/AboutUs';
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
    <div className="App">
      {!isRecipeSearchPage && <Header />}
      
      <main className={`container mx-auto px-4 flex flex-col items-center mt-10 ${isRecipeSearchPage ? 'overflow-y-auto' : ''}`}>
        <Routes>
          <Route path="/" element={
            <>
              <AboutSection />
              <Tutorial />
            </>
          } />
          <Route path="/plan-your-recipes" element={<RecipeSearch />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      
      {!isRecipeSearchPage && <Footer />}
    </div>
  );
}

export default App;