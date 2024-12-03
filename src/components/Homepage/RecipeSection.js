import React from 'react';
import { Link } from 'react-router-dom';

function RecipeSection() {
    return (
        <section className="p-10">
            <div className="flex flex-col items-center justify-center mb-10 py-10">
                <h3 className="text-center text-purple-900 text-2xl font-semibold">Explore our features based on your needs</h3>
                <p className="text-center mt-4 text-purple-800 max-w-2xl">
                    Here’s a quick guide on how to navigate PlanYourPlate based on your situation. <br></br> 
                    Simply click on which one suits you best!
                </p>
            </div>

            <div className="bg-purple-50 py-20 px-52 mb-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-8">Which one best describes your situation?</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center text-center">
          <p className="text-lg text-purple-900 font-medium">Know what you want when you see it?</p>
          <br></br>
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/right-recipe.png"
                alt=""
                className="w-48 h-48"
              />
            </div>
            <br></br>
            <Link to="/plan-your-recipes" className="bg-purple-900 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-200">
                Navigate to PlanYourRecipes
            </Link>
          </div>
          <br></br>
          <div className="flex flex-col items-center text-center">
          <p className="text-lg text-purple-900 font-medium">Have a picky eater in your home?</p>
          <br></br>
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/picky-eater.png"
                alt=""
                className="w-48 h-48"
              />
            </div>
            <br></br>
            <Link to="/plan-your-meals" className="bg-purple-900 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-200">
                Navigate to PlanYourMeals
            </Link>
          </div>
          <br></br>
          <div className="flex flex-col items-center text-center">
          <p className="text-lg text-purple-900 font-medium">Fridge full, but not sure where to start?</p>
          <br></br>
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/fridge.png"
                alt="Get recipes"
                className="w-48 h-48"
              />
            </div>
            <br></br>
            <Link to="/plan-from-your-fridge" className="bg-purple-900 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-200">
                Navigate to PlanFromYourFridge
            </Link>
          </div>
        </div>
      </div>
        </section>
    );
}

export default RecipeSection;
