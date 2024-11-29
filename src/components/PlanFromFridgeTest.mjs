import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * node src/components/PlanFromFridgeTest.mjs
 * 
 * 
 */

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined. Please set it in your .env file.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const testGoogleGenerativeAI = async () => {
  try {
    const imagePath = path.join(__dirname, '../../public/img/REFRIGERATOR-test.jpg');
    const imageBase64 = await fs.promises.readFile(imagePath, { encoding: 'base64' });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
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

    const analyzedIngredients = buffer
      .join("")
      .toLowerCase()
      .replace(/[*\n]/g, "") 
      .split(", ")           
      .map(ingredient => ingredient.trim());

    console.log("Analyzed Ingredients:", analyzedIngredients);
    console.log("SUCCESS SUCCESS SUCCESS SUCCESS")
  } catch (error) {
    console.error('Error during test execution:', error);
  }
};

testGoogleGenerativeAI();
