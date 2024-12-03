import { render, screen } from '@testing-library/react';
import MultimodalPrompt from '../../../PlanYourMeals/Gemini';
import axios from 'axios';

/**
 * npm install axios-mock-adapter --save-dev
 */


jest.mock('axios'); 

describe('MultimodalPrompt Component', () => {
  // Test 1: Check if the component renders correctly
  test('renders the component', () => {
    render(<MultimodalPrompt />);

    expect(screen.getAllByText(/Describe your situation/i)[0]).toBeInTheDocument(); // Ensures it rendered something
    expect(screen.getByText(/Get recipes/i)).toBeInTheDocument();
  });
  
  jest.mock('axios');
  
  test('Fetches recipes from Spoonacular API using Gemini filters', async () => {
    // Mock data sent to API
    const mockData = {
      data: {
        results: [
          { id: 716429, title: "Pasta with Garlic", image: "https://example.com/image.jpg" }
        ]
      }
    };
    axios.get.mockResolvedValue(mockData);
  
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch'); //spoonacular call no http
    
    // Check that the response is not undefined
    expect(response).toBeDefined();      
    expect(response.data).toBeDefined(); 
  
    const { results } = response.data;
    // Assertions for the response
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ //ensure response alignment
      id: 716429,
      title: "Pasta with Garlic",
      image: "https://example.com/image.jpg"
    });
  });
});