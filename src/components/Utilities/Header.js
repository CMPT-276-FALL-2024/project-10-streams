import React from 'react';

function Header() {
  return (
    <header className="bg-customRed text-white p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center"> 
          <h1 className="text-5xl font-bold">PlanYourPlate</h1>
          <img src="/img/PlanYourPlate-logo.png" alt="Logo" className="w-25 h-20 ml-2" />
        </div>
      </div>
      
      <div className="container mx-auto mt-5">
        <nav className="flex space-x-4 border-b-2 border-slate-200 py-2">
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:bg-orange-200 text-purple-800 font-semibold px-4 py-1 rounded-full">
                Home
              </a>
            </li>
            <li>
              <a href="/plan-your-recipes" className="hover:bg-orange-200 text-purple-800 font-semibold hover:text-purple-500 transition-colors px-4 py-1 rounded-full">
                PlanYourRecipes
              </a>
            </li>
            <li>
              <a href="/plan-your-meals" className="hover:bg-orange-200 text-purple-800 font-semibold hover:text-purple-500 transition-colors px-4 py-1 rounded-full">
                PlanYourMeals
              </a>
            </li>
            <li>
              <a href="/plan-from-your-fridge" className="hover:bg-orange-200 text-purple-800 font-semibold hover:text-purple-500 transition-colors px-4 py-1 rounded-full">
                PlanFromYourFridge
              </a>
            </li>
            <li>
              <a href="/about" className="hover:bg-orange-200 text-purple-800 font-semibold hover:text-purple-500 transition-colors px-4 py-1  rounded-full">
                About us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;