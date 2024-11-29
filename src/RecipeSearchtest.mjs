// RecipeSearchTest.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
/**
 * TO RUN:
 * node src/RecipeSearchtest.mjs      -into terminal
 * 
 * DO NOT SPAM this is an actual API call****
 * 
 * need a .env file with REACT_APP_SPOONACULAR_API_KEY=theapikeyhere
 * 
 * Basic search that pulls all information PlanYourPlate uses.
 * 
 */


const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

export const testApiCall = async () => {
  console.log('TESTING SPOONACULAR API CALL');
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: 'pasta',
        apiKey: SPOONACULAR_API_KEY,
        addRecipeInformation: true,
      },
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      console.log('Recipe found:', response.data.results);
    } else {
      console.log('No recipes found.');
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }

  console.log('SUCCESS SUCCESS SUCCESS SUCCESS SUCCESS');
};

testApiCall();
