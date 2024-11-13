import React from 'react';
import { Link } from 'react-router-dom';

function RecipeSection() {
    const recipes = [
        { preference: 'No Nuts', name: 'Recipe with no nuts', link: '/' },
        { preference: 'International', name: 'International Recipe', link: '/' },
        { preference: 'Nutritional Value', name: 'Recipe from nutritional value', link: '/' },
    ];

    return (
        <section className="p-10">
            <div className="flex flex-col items-center justify-center mb-10">
                <h3 className="text-center text-2xl font-semibold">How to Use</h3>
                <p className="text-center mt-4 text-gray-700 max-w-2xl">
                    Here’s a quick guide on how to navigate and find recipes tailored to your preferences.
                    Simply select your preferred category below to explore various recipes that match your dietary needs.
                </p>
            </div>

            <h3 className="text-center text-2xl font-bold text-purple-700 mb-8">
                What types of recipes can you expect from PlanYourRecipes?
            </h3>
            
            <div className="flex justify-center space-x-6 mb-8">
                {recipes.map((recipe, index) => (
                    <div key={index} className="w-64 border rounded-lg p-5 shadow-lg text-center">
                        <p className="text-sm text-gray-600 font-semibold">Preference: "{recipe.preference}"</p>
                        <h4 className="text-xl font-bold text-purple-800 mt-2">{recipe.name}</h4>
                        <div className="bg-gray-300 h-32 flex items-center justify-center mt-4 rounded">
                            <p className="text-gray-700">{recipe.name.toLowerCase()}</p>
                        </div>
                        <a href={recipe.link} className="text-purple-700 mt-4 inline-block hover:underline">
                            link to recipe
                        </a>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center">
            <Link to="/plan-your-recipes">
        <button className="bg-purple-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-purple-600">
          Navigate to PlanYourRecipes
        </button>
      </Link>
            </div>
        </section>
    );
}

export default RecipeSection;
