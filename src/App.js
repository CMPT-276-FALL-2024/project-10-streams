import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Utilities/Header';
import AboutSection from './components/Homepage/AboutSection';
import Tutorial from './components/Homepage/RecipeSection';
import Footer from './components/Utilities/Footer';
import RecipeSearch from './components/PlanYourRecipes/RecipeSearch';
import AboutUs from './components/About Us/AboutUs';
import Gemini from './components/PlanYourMeals/Gemini';
import PlanFromFridge from './components/PlanFromYourFridge/PlanFromFridge';
import Navigate from './components/Utilities/Navigate';
import './App.css';

// App component
function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
{/* MainContent component */}
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