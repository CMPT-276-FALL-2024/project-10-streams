import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NextArrow, PrevArrow } from './CustomArrows'; // Import the custom arrow components

const APP_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: query,
          apiKey: APP_KEY,
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Search Recipes</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for recipes..."
          style={{
            padding: '10px',
            width: 'calc(100% - 120px)',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
          }}
        />
        <button type="submit" style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px' }}>
          Search
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
      {data ? (
        <div>
          <h2>Results</h2>
          <Slider {...settings}>
            {data.results.map((recipe) => (
              <div key={recipe.id} style={{ textAlign: 'center' }}>
                <img
                  src={`https://img.spoonacular.com/recipes/${recipe.id}-312x231.${recipe.imageType}`}
                  alt={recipe.title}
                  style={{ width: '100%', height: 'auto', maxWidth: '500px', margin: '0 auto' }}
                />
                <h3>{recipe.title}</h3>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecipeSearch;