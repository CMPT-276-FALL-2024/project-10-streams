import React from 'react';

function Header() {
  return (
    <header className="bg-customRed text-white p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center"> 
          <h1 className="text-4xl font-bold">PlanYourPlate</h1>
          <img src="/img/PlanYourPlate-logo.png" alt="Logo" className="w-25 h-20 ml-2" />
        </div>
      </div>
      
      <div className="container mx-auto mt-5">
        <nav className="flex space-x-4 border-b-2 border-purple-300 py-2">
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:bg-orange-200 text-purple-700 font-semibold px-4 py-1 rounded-full">
                Home
              </a>
            </li>
            <li>
              <a href="/plan-your-recipes" className="hover:bg-orange-200 text-purple-700 font-semibold hover:text-purple-500 transition-colors px-4 py-1 rounded-full">
                PlanYourRecipes
              </a>
            </li>
            <li>
              <a href="/gemini" className="hover:bg-orange-200 text-purple-700 font-semibold hover:text-purple-500 transition-colors px-4 py-1 rounded-full">
                AI
              </a>
            </li>
            <li>
              <a href="/about" className="hover:bg-orange-200 text-purple-700 font-semibold hover:text-purple-500 transition-colors px-4 py-1  rounded-full">
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
