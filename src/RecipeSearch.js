import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NextArrow, PrevArrow } from './CustomArrows.js'; // Import the custom arrow components

const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

const intolerancesList = [
  'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
];

const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [intolerances, setIntolerances] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showIntolerances, setShowIntolerances] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true)
    setSelectedRecipe(null);
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: query,
          intolerances: intolerances.join(','),
          apiKey: SPOONACULAR_API_KEY,
          addRecipeInformation: true,
        },
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false)
    }
  };

  const handleIntoleranceChange = (e) => {
    const { value, checked } = e.target;
    setIntolerances((prev) =>
      checked ? [...prev, value] : prev.filter((intolerance) => intolerance !== value)
    );
  };

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true, // Include nutrition data
        },
      });
      setSelectedRecipe(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      setSelectedRecipe(null);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: () => {
      setSelectedRecipe(null);
    }, // Reset selectedRecipe on slide change
  };

  return (
    <div className="py-12 px-6 max-w-3xl mx-auto bg-gray-50">
      <div className="bg-purple-50 py-10 px-6 mb-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/preferences.png"
                alt="Describe your situation"
                className="w-36 h-36"
              />
            </div>
            <p className="text-lg text-purple-900 font-medium">Enter your recipe preferences</p>
          </div>
          <div className="hidden md:block text-purple-700 text-3xl">→</div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/right-recipe.png"
                alt="Get recipes"
                className="w-36 h-36"
              />
            </div>
            <p className="text-lg text-purple-900 font-medium">Receive tailored recipes!</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Search for Recipes Based on Your Preferences
        </h2>
        <form onSubmit={handleSearch} className="mb-5">
          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Eg., Recipes from Japan"
              className="bg-white p-2 w-full mb-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowIntolerances(!showIntolerances)}
            className="p-2 mb-2 border border-gray-300 rounded bg-purple-700 text-white"
          >
            Allergies?
          </button>
          {showIntolerances && (
            <div className="mb-4">
              <h3 className="text-lg text-purple-900 font-semibold mb-2">Select Intolerances:</h3>
              <div className="grid grid-cols-2 gap-2 text-purple-900">
                {intolerancesList.map((intolerance) => (
                  <label key={intolerance} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={intolerance}
                      onChange={handleIntoleranceChange}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span>{intolerance}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 font-bold text-white rounded-lg transition ${loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && data.results.length === 0 && (
          <div>
            <p>No recipes found. Please try again with different preferences.</p>
          </div>
        )}
        {data && data.results.length === 1 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-purple-900">One Recipe Found:</h3>
            <div
              key={data.results[0].id}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow"
            >
              <h4 className="text-lg text-purple-900 font-semibold text-center">{data.results[0].title}</h4>
              <img
                src={`https://spoonacular.com/recipeImages/${data.results[0].id}-312x231.${data.results[0].imageType}`}
                alt={data.results[0].title}
                className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
              />
              <button
                onClick={() => fetchRecipeDetails(data.results[0].id)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                View Details
              </button>
            </div>
          </div>
        )}
        {data && data.results.length > 1 && (
          <div>
            <h2 className="text-xl text-purple-900 font-semibold mb-4">Results</h2>
            <Slider {...settings}>
              {data.results.map((recipe) => (
                <div key={recipe.id} className="text-center text-purple-900">
                  <img
                    src={`https://img.spoonacular.com/recipes/${recipe.id}-312x231.${recipe.imageType}`}
                    alt={recipe.title}
                    className="w-full h-auto max-w-lg mx-auto rounded"
                  />
                  <h3 className="mt-2">{recipe.title}</h3>
                  <button
                    onClick={() => fetchRecipeDetails(recipe.id)}
                    className="mt-2 p-2 bg-purple-700 text-white rounded"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </Slider>
          </div>
        )}
        {selectedRecipe && (
          <div className="mt-5 p-5 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-4">{selectedRecipe.title}</h2>
            <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
            <p><strong>Ready in:</strong> {selectedRecipe.readyInMinutes} minutes</p>
            <h3 className="text-lg font-semibold mt-4">Ingredients:</h3>
            <ul className="list-disc list-inside">
              {selectedRecipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-4">Instructions:</h3>
            <ol className="list-decimal list-inside">
              {selectedRecipe.analyzedInstructions.length > 0 ? (
                selectedRecipe.analyzedInstructions[0].steps.map((step) => (
                  <li key={step.number}>{step.step}</li>
                ))
              ) : (
                <li>{selectedRecipe.instructions}</li>
              )}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;