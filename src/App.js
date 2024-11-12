import logo from './logo.svg';
import './App.css';
import React from 'react';
import Header from './components/Header';
import AboutSection from './components/AboutSection'
import Tutorial from './components/RecipeSection'
import Footer from './components/Footer'
function App() {
  return (
    <div className="App">
      <Header />

      <main className="container mx-auto px-4 flex flex-col items-center mt-10">
        <AboutSection />
        <Tutorial />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
