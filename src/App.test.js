describe('Basic Jest Test', () => {
  it('should confirm true is true', () => {
    expect(true).toBe(true);
  });
});
//*************************************************the Test test */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeSearch from './RecipeSearch';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
/*
  RecipeSearch Component:
    tested:
      1. Rendering of RecipeSearch
      2. Simulates user input 'pasta'
      3. Simulates user interaction with 'Search' button
      4. API call to test searchRecipes
      5. Recipe data display
*/
describe('RecipeSearch Component', () => {
  test('should call searchRecipes and display recipes on form submit', async () => {
    const mockData = { //mock data
      data: {
        hits: [
          {
            recipe: {
              label: 'Pasta with Tomato',
              image: 'test-image.jpg',
              source: 'Test Source',
              url: 'http://example.com/test-recipe'
            }
          }
        ]
      }
    };
    axios.get.mockResolvedValueOnce(mockData);

    // Recipe search must render inside of a memoryRouter>
    render(
      <MemoryRouter>
        <RecipeSearch />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search for recipes/i), { target: { value: 'pasta' } }); //user inputs
    fireEvent.click(screen.getByRole('button', { name: /search/i }));  //user submits/clicks button

    await waitFor(() => expect(screen.getByText(/pasta with tomato/i)).toBeInTheDocument()); //recieve results

    // Verify 
    expect(screen.getByText(/test source/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByRole('link', { name: /view recipe/i })).toHaveAttribute('href', 'http://example.com/test-recipe');
  });
  /*
    Test for API call failure, say the API were to go offline*
  */
  test('displaying error message if api fail calls', async ()=> {
    axios.get.mockRejectedValueOnce(new Error('API call failed'));

    render(
      <MemoryRouter>
        <RecipeSearch />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/search for recipes/i), { target: {value: 'pasta'}});
    fireEvent.click(screen.getByRole('button', { name: /search/i}));

    await waitFor(() => expect(screen.getByText(/error fetching recipes/i)).toBeInTheDocument());
  })
});


