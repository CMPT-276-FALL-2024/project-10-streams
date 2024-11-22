import React, { useState } from "react";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../CustomArrows";

const GEMINI_API_KEY = "AIzaSyBGgNYaSBT5XJ28ynVGF4YDacQ-M7pZhj8";
const SPOONACULAR_API_KEY = "edeac442622d478eb949264ef3e83be2";

const MultimodalPrompt = () => {
  const [file, setFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
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

      const imageBase64 = await new Promise((resolve, reject) => {
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
            { text: "What ingredients are in this photo?" },
          ],
        },
      ];

      const result = await model.generateContentStream({ contents });
      let buffer = [];
      for await (let response of result.stream) {
        buffer.push(response.text());
      }

      const analyzedIngredients = buffer.join("").toLowerCase().split(", ");
      setIngredients(analyzedIngredients);

      const spoonacularResponse = await axios.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        {
          params: {
            ingredients: analyzedIngredients.join(","),
            number: 50,
            apiKey: SPOONACULAR_API_KEY,
          },
        }
      );
      const filteredRecipes = spoonacularResponse.data.filter(
        (recipe) => recipe.missedIngredients.length < 3
      );
      setRecipes(filteredRecipes);
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
                src="/img/take-photo.png"
                alt="Take a photo"
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
                alt="Upload photo"
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
            <label className="block text-purple-900 font-medium mb-2">Upload your photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-purple-900 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
              {loading ? "Analyzing..." : "Analyze and Get Recipes"}
            </button>
          </div>
        </form>

        {/* Recipe Slider */}
        {recipes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Recipes:</h3>
            <Slider {...sliderSettings}>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow"
                >
                  <h4 className="text-lg font-semibold text-center">{recipe.title}</h4>
                  <img
                    src={`https://spoonacular.com/recipeImages/${recipe.id}-312x231.${recipe.imageType}`}
                    alt={recipe.title}
                    className="w-full h-auto max-h-64 object-contain rounded-md mt-2"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Used Ingredients:</strong>{" "}
                    {recipe.usedIngredients.map((ing) => ing.name).join(", ")}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <strong>Missed Ingredients:</strong>{" "}
                    {recipe.missedIngredients.map((ing) => ing.name).join(", ")}
                  </p>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultimodalPrompt;