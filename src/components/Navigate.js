import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navigate = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;

      if (window.scrollY > headerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-1/2 right-4 transform -translate-y-1/2 bg-purple-900 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <nav className="flex flex-col items-center gap-4">
        <Link to="/" className="hover:text-purple-300">
          Home
        </Link>
        <Link to="/plan-your-recipes" className="hover:text-purple-300">
            PlanYourRecipes
        </Link>
        <Link to="/plan-your-meals" className="hover:text-purple-300">
            PlanYourMeals
        </Link>
        <Link to="/plan-from-your-fridge" className="hover:text-purple-300">
            PlanFromYourFridge        
        </Link>
        <Link to="/about" className="hover:text-purple-300">
          About Us
        </Link>
      </nav>
    </div>
  );
};

export default Navigate;
