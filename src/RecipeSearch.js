import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const healthLabels = [
  'alcohol-cocktail', 'alcohol-free', 'celery-free', 'crustacean-free', 'dairy-free', 'DASH', 'egg-free', 'fish-free',
  'fodmap-free', 'gluten-free', 'immuno-supportive', 'keto-friendly', 'kidney-friendly', 'kosher', 'low-fat-abs',
  'low-potassium', 'low-sugar', 'lupine-free', 'Mediterranean', 'mollusk-free', 'mustard-free', 'no-oil-added', 'paleo',
  'peanut-free', 'pescatarian', 'pork-free', 'red-meat-free', 'sesame-free', 'shellfish-free', 'soy-free', 'sugar-conscious',
  'sulfite-free', 'tree-nut-free', 'vegan', 'vegetarian', 'wheat-free'
];

const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedHealthLabels, setSelectedHealthLabels] = useState([]);

  const APP_ID = '56715edc';
  const APP_KEY = 'cd0690b7b5e5cd977228e98ec2237a47';

  const handleCheckboxChange = (label) => {
    setSelectedHealthLabels(prevState =>
      prevState.includes(label)
        ? prevState.filter(item => item !== label)
        : [...prevState, label]
    );
  };

  const searchRecipes = async () => {
    try {
      const healthQuery = selectedHealthLabels.map(label => `health=${label}`).join('&');
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&${healthQuery}`
      );
      console.log(response.data); // Log the response to the console
      setRecipes(response.data.hits);
    } catch (error) {
      console.error('Error fetching the recipes:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  return (
    <div className="relative flex flex-col items-center justify-start h-full w-full p-4">
      <h1 className="text-3xl font-bold mb-4">Recipe Search</h1>
      <form onSubmit={handleSubmit} className="mb-4 w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search for recipes..."
        />
        <label className="block text-gray-700 mt-4 mb-2">Filter based on allergy:</label>
        <div className="grid grid-cols-2 gap-2">
          {healthLabels.map(label => (
            <div key={label} className="flex items-center">
              <input
                type="checkbox"
                id={label}
                value={label}
                onChange={() => handleCheckboxChange(label)}
                className="mr-2"
              />
              <label htmlFor={label} className="text-gray-700">{label}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded mt-2 w-full">
          Search
        </button>
      </form>
      <div className="w-full flex flex-col items-center overflow-y-auto">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={index} className="border p-4 mb-4 w-full max-w-lg bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-2">{recipe.recipe.label}</h2>
              <img src={recipe.recipe.image} alt={recipe.recipe.label} className="w-full h-auto mb-2" />
              <p className="mb-2">{recipe.recipe.source}</p>
              <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Recipe
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No recipes found. Please try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;