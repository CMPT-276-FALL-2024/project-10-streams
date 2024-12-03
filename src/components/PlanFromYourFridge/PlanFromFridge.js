import React, { useState } from "react";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../Utilities/CustomArrows";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

const MultimodalPrompt = () => {
  const [file, setFile] = useState(null); // Uploaded image file
  const [, setIngredients] = useState([]); // Extracted ingredients from the image
  const [recipes, setRecipes] = useState([]); // Recipes based on the ingredients
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Selected recipe details
  const [done, setDone] = useState(false); // Flag to indicate if the analysis is done

  const handleFileChange = (e) => { // Handle file change
    setFile(e.target.files[0]);
    setDone(false);
    setSelectedRecipe(null);
  };

  /*
  * Function to handle form submission
  * This function uses the Google Generative AI to analyze the image and extract the ingredients.
  * It then uses the Spoonacular API to fetch recipes based on the extracted ingredients.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);
    setSelectedRecipe(null);

    try { // Try to analyze the image and fetch recipes
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

      const imageBase64 = await new Promise((resolve, reject) => { // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });

      const contents = [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
            { text: "List only the ingredients in this photo, separated by commas. Do not add any bullet points, asterisks, titles, or newlines; just list the ingredients." },
          ],
        },
      ];

      const result = await model.generateContentStream({ contents });
      let buffer = [];
      for await (let response of result.stream) {
        buffer.push(response.text());
      }
      // Extract ingredients from the response
      const analyzedIngredients = buffer
        .join("")
        .toLowerCase()
        .replace(/[*\n]/g, "") 
        .split(", ")           
        .map(ingredient => ingredient.trim());

      setIngredients(analyzedIngredients);
      console.log(analyzedIngredients);
      
      // Fetch recipes based on the extracted ingredients
      const sanitizedIngredients = analyzedIngredients.map(ingredient => ingredient.trim());
      console.log(sanitizedIngredients);

      // Fetch recipes based on the extracted ingredients
      const queryString = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
      sanitizedIngredients.join(",")
      )}&number=50&apiKey=${SPOONACULAR_API_KEY}&addRecipeInformation=true`;
    
      const spoonacularResponse = await axios.get(queryString);
      
      // Filter recipes based on the number of missed ingredients
      const filteredRecipes = spoonacularResponse.data
        .filter((recipe) => recipe.missedIngredients.length < 7)
        .slice(0, 5);
    
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setDone(true);
    }
  };
  // Function to fetch recipe details
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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: () => setSelectedRecipe(null), // Reset selected recipe when slider changes
  };

  return (
    <div className="bg-gray-50 py-12 px-6">
      {/* How It Works Section */}
      <div className="bg-purple-50 py-10 px-6 mb-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/take-photo.png"
                alt=""
                className="w-36 h-40"
              />
            </div>
            <p className="text-lg text-purple-900 font-medium">Take a photo of your ingredients</p>
          </div>
          <div className="hidden md:block text-purple-700 text-3xl">→</div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/upload-photo.png"
                alt=""
                className="w-36 h-40"
              />
            </div>
            <p className="text-lg text-purple-900 font-medium">Upload the photo</p>
          </div>
          <div className="hidden md:block text-purple-700 text-3xl">→</div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/img/get-right-recipe.png"
                alt="Get recipes"
                className="w-36 h-40"
              />
            </div>
            <p className="text-lg text-purple-900 font-medium">Get recipes tailored to your photo!</p>
          </div>
        </div>
      </div>

      {/* Recipe Results Section */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Recipes from Ingredients in Your Fridge
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-center text-purple-900 font-medium mb-2">Upload your photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <label className="block text-center text-purple-900 text-sm mb-2">Accepted formats: .png, .jpg</label>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 font-bold text-white rounded-lg transition ${loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
            >
              {loading ? "Analyzing..." : "Analyze and Get Recipes"}
            </button>
          </div>
        </form>

        {/* Recipe Slider */}
        {recipes.length === 0 && done && loading === false && (
            <div className="mt-8">
              <p className="text-center text-lg text-purple-900">
                No recipes found. Please try again with a different photo.
              </p>
            </div>)}
        {recipes.length === 1
          && (
            <div className="text-center mt-8">
              <h3 className="text-xl font-bold mb-4 text-purple-900">One Recipe Found:</h3>
              <div
                key={recipes[0].id}
                className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow"
              >
                <h4 className="text-lg text-purple-900 font-semibold text-center">{recipes[0].title}</h4>
                <img
                  src={`https://spoonacular.com/recipeImages/${recipes[0].id}-312x231.${recipes[0].imageType}`}
                  alt={recipes[0].title}
                  className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
                />
                <p className="text-center mt-2 text-sm text-purple-900">
                  <strong>Used Ingredients:</strong>{" "}
                  {recipes[0].usedIngredients.map((ing) => ing.name).join(", ")}
                </p>
                <p className="text-center mt-1 text-sm text-purple-900">
                  <strong>Missed Ingredients:</strong>{" "}
                  {recipes[0].missedIngredients.map((ing) => ing.name).join(", ")}
                </p>
                <button
                  onClick={() => fetchRecipeDetails(recipes[0].id)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  View Details
                </button>
              </div>
            </div>)}
        {recipes.length > 1 && (
          <div className="text-center mt-8">
            <h3 className="text-xl font-bold mb-4 text-purple-900">Recipes:</h3>
            <Slider {...sliderSettings}>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow"
                >
                  <h4 className="text-lg text-purple-900 font-semibold text-center">{recipe.title}</h4>
                  <img
                    src={`https://spoonacular.com/recipeImages/${recipe.id}-312x231.${recipe.imageType}`}
                    alt={recipe.title}
                    className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
                  />
                  <p className="mt-2 text-sm text-purple-900">
                    <strong>Used Ingredients:</strong>{" "}
                    {recipe.usedIngredients.map((ing) => ing.name).join(", ")}
                  </p>
                  <p className="mt-1 text-sm text-purple-900">
                    <strong>Missed Ingredients:</strong>{" "}
                    {recipe.missedIngredients.map((ing) => ing.name).join(", ")}
                  </p>
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