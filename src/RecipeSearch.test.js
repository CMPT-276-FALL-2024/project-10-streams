describe('Basic Jest Test', () => {
  it('Confirm True is True?', () => {
    expect(true).toBe(true);
  });
});
//*************************************************the Test test */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeSearch from './RecipeSearch';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';


jest.mock('axios');
/**
npm uninstall axios
npm install axios@0.27.2 //import axios only works here
npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
npm install matchmedia-polyfill --save-dev
npm install react-router-dom
 * npm test to run
 * 
 */
describe('RecipeSearch Component Tests:', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('Call RecipeSearch and return value?', async () => {
    const mockData = {
      results: [
        {
          id: 1,
          title: 'Pasta with Tomato',
          image: 'https://img.spoonacular.com/recipes/1-312x231.jpg',
          sourceUrl: 'http://example.com/test-recipe'
        }
      ]
    };
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(
      <MemoryRouter>
        <RecipeSearch />
      </MemoryRouter>
    );

    // Simulate user input for recipe search
    fireEvent.change(screen.getByPlaceholderText(/search for recipes/i), { target: { value: 'pasta' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i })); // Simulate search button click

    await waitFor(() => {
      const images = screen.queryAllByAltText(/Pasta with Tomato/i);
      expect(images.length).toBeGreaterThan(0); //check existance
    });
  });

  test('API failure to call?', async () => {
    axios.get.mockRejectedValueOnce(new Error('API call failed'));

    render(
      <MemoryRouter>
        <RecipeSearch />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search for recipes/i), { target: { value: 'Pasta' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(screen.getByText(/API call failed/i)).toBeInTheDocument()); // Error message display
  });

  test('Does image display?', async() => {
    const mockData = {
      results: [
        {
          id: 1,
          title: 'Pasta with Tomato',
          imageType: 'jpg', //component logic
          sourceUrl: 'http://example.com/test-recipe',
        },
      ],
    };
    axios.get.mockResolvedValueOnce({data: mockData}); 

    render(
      <MemoryRouter>
        <RecipeSearch />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search for recipes/i),{
      target: {value: 'pasta'},
    });
    fireEvent.click(screen.getByRole('button', {name: /search/i}));

    await waitFor(()=>{
      const image = screen.getByRole('img', {name : /pasta with tomato/i});
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('1-312x231')); // expect an image/
      });
  });

  it('Repeated Search keeps functionality?', async () => {
    // Mock API response
    const mockRecipes = {
      data: {
        results: [
          { id: 1, title: 'Mock Pasta', image: 'mock-image1.jpg' },
          { id: 2, title: 'Mock Pasta', image: 'mock-image2.jpg' },
          { id: 3, title: 'Mock Pasta', image: 'mock-image3.jpg' },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockRecipes);
    render(
      <MemoryRouter>
        <RecipeSearch />
      </MemoryRouter>
    );
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
  
    const recipeTitles = await screen.findAllByText('Mock Pasta');
    expect(recipeTitles).toHaveLength(7);
    expect(recipeTitles[0]).toBeInTheDocument();
  });

  it('Allergy checkboxes changing search guidelines?',()=> {
    render(<RecipeSearch/>);
    fireEvent.click(screen.getByText(/Allergies?/i));
    const dairyCheckbox = screen.getByLabelText(/Dairy/i);
    fireEvent.click(dairyCheckbox);
    expect(screen.getByLabelText(/Dairy/i).checked).toBe(true);
  })
});
