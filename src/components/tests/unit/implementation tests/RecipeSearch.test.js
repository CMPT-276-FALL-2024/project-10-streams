import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeSearch from '../../../PlanYourRecipes/RecipeSearch';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

describe('Basic Jest Test', () => {
    it('Confirm True is True?', () => {
      expect(true).toBe(true);
    });
  });
  //*************************************************ensure jest library test */

  //const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
  
  jest.mock('axios'); //******mock API call 
  jest.setTimeout(10000);
  /**
   * npm install i
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
    it('Search recipes & display results?', async () => {
        // Mock the API response
        const mockResponse = {
          data: {
            results: [
              {
                id: 1,
                title: 'Test Recipe',
                imageType: 'jpg',
                image: "https://spoonacular.com/recipeImages/1-312x231.jpg"
            },
            ],
          },
        };
        
        axios.get.mockResolvedValue(mockResponse);
        
        render(<RecipeSearch />);
        
        const searchInput = screen.getByPlaceholderText('Eg., Recipes from Japan');
        const searchButton = screen.getByText('Search');      
        fireEvent.change(searchInput, { target: { value: 'Japanese' } });
        fireEvent.click(searchButton);
        
        await screen.findByText('Test Recipe');       
        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByAltText('Test Recipe')).toHaveAttribute('src', 'https://spoonacular.com/recipeImages/1-312x231.jpg');
      });
  
      it('should handle errors and display an error message', async () => {
        // Mock API to return an error
        axios.get.mockRejectedValue(new Error('Network error'));
        
        render(<RecipeSearch />);
        
        const searchInput = screen.getByPlaceholderText('Eg., Recipes from Japan');
        const searchButton = screen.getByText('Search');
    
        fireEvent.change(searchInput, { target: { value: 'Japanese' } });
        fireEvent.click(searchButton);
        await screen.findByText('Error: Network error');
        
        expect(screen.getByText('Error: Network error')).toBeInTheDocument();
      });
  
    it('Display image for recipe?', async ()=>{
        const mockResponse = {
            data: {
              results: [
                {
                  id: 1,
                  title: 'Test Recipe',
                  imageType: 'jpg',
                  image: 'https://spoonacular.com/recipeImages/1-312x231.jpg',
                },
              ],
            },
          };
        axios.get.mockResolvedValue(mockResponse);
        render(<RecipeSearch/>);
        await screen.findByPlaceholderText('Eg., Recipes from Japan');

        const searchInput = screen.getByPlaceholderText('Eg., Recipes from Japan'); 
        const searchButton = screen.getByText('Search');
        fireEvent.change(searchInput, { target: { value: 'Japanese' } });
        fireEvent.click(searchButton);

        await screen.findByText('Test Recipe'); //wait for image render
        const recipeImage = screen.getByAltText('Test Recipe');//alt case
        expect(recipeImage).toBeInTheDocument(); //check in doc
        expect(recipeImage).toHaveAttribute('src', 'https://spoonacular.com/recipeImages/1-312x231.jpg');

    })
  
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


  describe('API call test:', () => {
    it('Fill-text query correct?', async () => {
      render(
        <MemoryRouter>
          <RecipeSearch />
        </MemoryRouter>
      );
    
      const searchInput = screen.getByPlaceholderText('Eg., Recipes from Japan');
      const searchButton = screen.getByText('Search');
    
      fireEvent.change(searchInput, { target: { value: 'Japanese' } });
      fireEvent.click(searchButton);
    
      // Wait for any element related to the recipe results to be in the document
      const searchResults = await screen.findAllByText(/recipe/i, { timeout: 5000 });    
      expect(searchResults.length).toBeGreaterThan(0);
    });
  
    jest.mock('axios');
//CI/CD pipeline mock environment
    test('Mock test for Spoonacular API', async () => {
      const mockData = {
        data: {
          results: [
            { id: 716429, title: "Pasta with Garlic", image: "https://example.com/image.jpg" }
          ]
        }
      };
      axios.get.mockResolvedValue(mockData);
    
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch');
      const { results } = response.data;
    
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        id: 716429,
        title: "Pasta with Garlic",
        image: "https://example.com/image.jpg"
      });
    }); 
  });