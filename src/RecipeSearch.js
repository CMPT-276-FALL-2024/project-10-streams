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

  const handleSearch = async (e) => {
    e.preventDefault();
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
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-purple-700">
        Search Recipes
      </h1>
      <form onSubmit={handleSearch} className="mb-5">
        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for recipes..."
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
            <h3 className="text-lg font-semibold mb-2">Select Intolerances:</h3>
            <div className="grid grid-cols-2 gap-2">
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
        <button type="submit" className="p-2 mb-2 border border-gray-300 rounded bg-purple-700 text-white">
          Search
        </button>
      </form>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <Slider {...settings}>
            {data.results.map((recipe) => (
              <div key={recipe.id} className="text-center">
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
      ) : (
        <p> Results will appear after completing a search!</p>
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
  );
};

export default RecipeSearch;