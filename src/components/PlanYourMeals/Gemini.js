import React, { useState } from "react";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import axios from "axios";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../Utilities/CustomArrows.js";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

const MultimodalPrompt = () => {
  const [prompt, setPrompt] = useState(""); // User's situation or prompt
  const [recipes, setRecipes] = useState([]); // List of recipe suggestions
  const [generalAdvice, setGeneralAdvice] = useState(""); // General advice or suggestions
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Selected recipe details
  const [done, setDone] = useState(false); // Done state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please describe your situation.");
      return;
    }
    setLoading(true);
    setDone(true);
    // Fetch recipes and general advice
    try {
      // Step 1: Ask Gemini for recipes and general advice
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });
      // Define the content stream
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Please return recipe suggestions in two parts:
                    1. A comma-separated list of recipe names for this situation: "${prompt}".
                    2. General advice or additional context for these recipes. Do not reference specific recipes.`,
            },
          ],
        },
      ];
      // Generate the content stream
      const result = await model.generateContentStream({ contents });
      let buffer = [];
      for await (let response of result.stream) {
        buffer.push(response.text());
      }

      const geminiResponse = buffer.join("");
      const [recipeList, advice] = geminiResponse.split("\n\n"); // Separate recipes and advice

      // Format the advice with bullet points
      const formattedAdvice = advice
        .replace("2.", "")
        .split("\n")
        .map((line) => ` ${line.trim()}`)
        .join("\n");

      setGeneralAdvice(formattedAdvice || ""); // Store formatted general advice

      // Parse and clean the recipe list
      const recipeNames = recipeList.split(",").map((name) => name.trim()).filter(Boolean);
      console.log(recipeNames);

      // Step 2: Fetch detailed recipe data from Spoonacular
      const spoonacularResults = await Promise.all(
        recipeNames.map(async (recipeName) => {
          try {
            const response = await axios.get(
              `https://api.spoonacular.com/recipes/complexSearch`,
              {
                params: {
                  query: recipeName,
                  number: 1,
                  apiKey: SPOONACULAR_API_KEY,
                  addRecipeInformation: true,
                },
              }
            );
            return response.data.results[0] || null; // Return the first recipe or null if none
          } catch (error) {
            console.error(`Error fetching recipe: ${recipeName}`, error);
            return null;
          }
        })
      );

      // Filter out invalid or null responses
      setRecipes(spoonacularResults.filter(Boolean));
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
          setDone(true);
      }
  };
  // Fetch detailed recipe data from Spoonacular
  const fetchRecipeDetails = async (id) => {
    setSelectedRecipe(null); // Reset selected recipe
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true, // Include nutrition data
        },
      });
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: () => setSelectedRecipe(null), // Reset selected recipe when slider changes
  };

  return (
    <div className=" bg-gray-50 py-12 px-6">
      {/* How It Works Section */}
      <div className="bg-purple-50 py-10 px-6 mb-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/picky-eater.png"
                alt="Describe your situation"
                className="w-36 h-36"
              />
            </div>
            <p className="text-lg text-purple-900 font-medium">Describe your situation</p>
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

      {/* Recipe Results Section */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Recipe Suggestions Based on Your Situation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-center text-purple-900 font-medium mb-2">Describe Your Situation</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="E.g., I have a cold and need something soothing"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 font-bold text-white rounded-lg transition ${
                loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Analyzing..." : "Get Recipes"}
            </button>
          </div>
        </form>

        {/* General Advice */}
        {generalAdvice && (
          <div className="mt-8">
            <h3 className="text-center text-xl font-bold mb-4 text-purple-900">General Advice:</h3>
            <p className="text-gray-600">{generalAdvice}</p>
          </div>
        )}

        {/* Recipe Slider */}
        {recipes.length === 0 && done && loading === false && (
            <div className="mt-8">
              <p className="text-center text-lg text-purple-900">
                No recipes found. Please try a new prompt.
              </p>
            </div>)}
        {recipes.length === 1
          && (
            <div className="mt-8">
              <h3 className="text-center text-xl font-bold mb-4 text-purple-900">One Recipe Found:</h3>
              <div
                key={recipes[0].id}
                className="text-center p-4 bg-gray-100 border border-gray-300 rounded-lg shadow"
              >
                <h4 className="text-center text-lg text-purple-900 font-semibold text-center">{recipes[0].title}</h4>
                <img
                  src={`https://spoonacular.com/recipeImages/${recipes[0].id}-312x231.${recipes[0].imageType}`}
                  alt={recipes[0].title}
                  className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
                />
                <button
                  onClick={() => fetchRecipeDetails(recipes[0].id)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  View Details
                </button>
              </div>
            </div>)}
        {recipes.length > 1 && (
            <div className="mt-8">
              <h3 className="text-center text-xl font-bold mb-4 text-purple-900">Recipes:</h3>
              <Slider {...sliderSettings}>
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="text-center p-4 bg-gray-100 border border-gray-300 rounded-lg shadow">
                    <h4 className="text-lg text-purple-900 font-semibold text-center">{recipe.title}</h4>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
                    />
                    <button
                      onClick={() => fetchRecipeDetails(recipe.id)}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </Slider>
            </div>
          )}


        {/* Selected Recipe Details */}
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

export default MultimodalPrompt;