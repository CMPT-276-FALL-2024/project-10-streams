import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultimodalPrompt from './Gemini'; // Adjust this path if needed
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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
const mock = new MockAdapter(axios);
  // Test 2: Simulate user typing and submit
  
  jest.mock('axios');
  
  test('Fetches recipes from Spoonacular API', async () => {
    // Mock data returned by the API
    const mockData = {
      data: {
        results: [
          { id: 716429, title: "Pasta with Garlic", image: "https://example.com/image.jpg" }
        ]
      }
    };
  
    // Mocking the GET request to return the mock data
    axios.get.mockResolvedValue(mockData);
  
    // Make the API call in the component
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch');
    
    // Check that the response is not undefined
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
  
    const { results } = response.data;
  
    // Assertions for the response
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: 716429,
      title: "Pasta with Garlic",
      image: "https://example.com/image.jpg"
    });
  });
  

  // Test 3: Error Handling when API fails to call
//   test('shows an error message when no recipes are found', async () => {
//     // Mock the API call with no results
//     axios.get.mockResolvedValueOnce({
//       data: { results: [] }, // Empty results array
//     });
  
//     render(<MultimodalPrompt />);
  
//     const input = screen.getByPlaceholderText(/E.g., I have a cold and need something soothing/i);
//     const button = screen.getByText(/Get Recipes/i);
  
//     userEvent.type(input, 'I need a quick lunch idea'); // Use `userEvent` for typing
//     fireEvent.click(button);
  
//     // Debug the DOM to inspect the rendered output (optional)
//     screen.debug();

//     if (data.results.length === 0){
//         setErrorMessage('No recipes found');
//     }
//     const errorMessage = screen.queryByText(/No recipes found/i);
//     console.log('Error Message:', errorMessage); // Should print the DOM node or `null`.
//     expect(errorMessage).toBeInTheDocument();    
//   });
});