import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

/**
 * node src/components/GeminiTest.mjs   - to run
 * 
 * 
 * REAL API REQUEST - DO NOT SPAM! 
 */

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined. Please set it in your .env file.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const testGoogleGenerativeAI = async () => {
  const prompt = "I have a cold";
  try {
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
          {
            text: `Please return recipe suggestions in two parts:
1. A comma-separated list of recipe names for this situation:  "${prompt}".
2. General advice or additional context for these recipes. Do not reference specific recipes.`,
          },
        ],
      },
    ];

    const result = await model.generateContentStream({ contents });
    let fullResponse = '';

    // Process the response stream to extract text content
    for await (let response of result.stream) {
      if (response.candidates && response.candidates.length > 0) {
        const candidateContent = response.candidates[0].content;
        if (typeof candidateContent === 'string') {
          fullResponse += candidateContent;
        } else if (candidateContent && typeof candidateContent === 'object') {
          // If content is an object, convert to a string representation
          fullResponse += JSON.stringify(candidateContent);
        }
      }
    }

    // Log the full response to check if it exists
    console.log('Full response:', fullResponse);

    // Check if the response has any content at all
    if (fullResponse) {
      console.log('SUCCESS SUCCESS SUCCESS SUCCESS SUCCESS.');
    } else {
      console.log('No response received.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testGoogleGenerativeAI();

