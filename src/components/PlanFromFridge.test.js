import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MultimodalPrompt from "./PlanFromFridge";

require('dotenv').config();
/**
 * npm install axios-mock-adapter --save-dev
 * npm install dotenv
 * 
 * uses spoonacular after, RecipeSearch.test.js applied
 */

describe('PlanFromFridge Component Tests', ()=> {
    let mock;
    beforeAll(()=> {
        mock = new MockAdapter(axios);
    });
    afterEach(()=>{
        mock.reset();
    });
    afterAll(()=>{
        mock.restore();
    });

test('Multimodal Prompt renders?', () => {
  render(<MultimodalPrompt />);
  expect(screen.getByText(/Upload your photo/i)).toBeInTheDocument();
  expect(screen.getByText(/Analyze and Get Recipes/i)).toBeInTheDocument();
});
it("No File Uploaded Alert?", async () => {
    render(<MultimodalPrompt />);
    
    const submitButton = screen.getByRole('button', { name: /Analyze and Get Recipes/i });

    window.alert = jest.fn(); //mock

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please upload an image."); //asks user for image
    });
});
});
