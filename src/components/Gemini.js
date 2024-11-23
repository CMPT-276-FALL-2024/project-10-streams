import React, { useState } from "react";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Slider from "react-slick";
import axios from "axios";
import { NextArrow, PrevArrow } from "../CustomArrows";

const GEMINI_API_KEY = "AIzaSyBGgNYaSBT5XJ28ynVGF4YDacQ-M7pZhj8";
 const SPOONACULAR_API_KEY = "edeac442622d478eb949264ef3e83be2";

const Gemini = () => {
  const [prompt, setPrompt] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [generalAdvice, setGeneralAdvice] = useState(""); // General advice or suggestions
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please describe your situation.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Ask Gemini for a comma-separated list of recipe names
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

      const recipeQuery = [
        {
          role: "user",
          parts: [
            {
              text: `Please return a comma-separated list of recipe names suitable for this situation: "${prompt}". Only return the list, nothing else.`,
            },
          ],
        },
      ];

      let recipeBuffer = [];
      const recipeResult = await model.generateContentStream({ contents: recipeQuery });
      for await (let response of recipeResult.stream) {
        recipeBuffer.push(response.text());
      }

      const recipeList = recipeBuffer.join("").trim();
      console.log("Gemini Recipe Response:", recipeList); // Log the raw Gemini response

      const recipeNames = recipeList.split(",").map((name) => name.trim()).filter(Boolean);

      // Step 2: Ask Gemini for general advice
      const adviceQuery = [
        {
          role: "user",
          parts: [
            {
              text: `Please provide general advice or context for recipes suitable for this situation: "${prompt}".`,
            },
          ],
        },
      ];

      let adviceBuffer = [];
      const adviceResult = await model.generateContentStream({ contents: adviceQuery });
      for await (let response of adviceResult.stream) {
        adviceBuffer.push(response.text());
      }

      const advice = adviceBuffer.join("").trim();
      setGeneralAdvice(advice);

      // Step 3: Fetch detailed recipe data from Spoonacular (Commented out for now)
      
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
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* How It Works Section */}
      <div className="bg-purple-50 py-10 px-6 mb-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/path/to/your/text-icon.png"
                alt="Describe your situation"
                className="w-16 h-16"
              />
            </div>
            <p className="text-lg text-gray-700 font-medium">Describe your situation</p>
          </div>
          <div className="hidden md:block text-purple-700 text-3xl">→</div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <img
                src="/path/to/your/recipe-icon.png"
                alt="Get recipes"
                className="w-16 h-16"
              />
            </div>
            <p className="text-lg text-gray-700 font-medium">Receive tailored recipes!</p>
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
            <label className="block text-gray-700 font-medium mb-2">Describe Your Situation</label>
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
            <h3 className="text-xl font-bold mb-4 text-gray-700">General Advice:</h3>
            <p className="text-gray-600">{generalAdvice}</p>
          </div>
        )}

        {/* Recipe Slider */}
        {recipes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Recipes:</h3>
            <Slider {...sliderSettings}>
              {recipes.map((recipe) => (
                <div key={recipe.id} className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-center">{recipe.title}</h4>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gemini;
