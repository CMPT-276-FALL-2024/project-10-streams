import React from 'react';

function AboutSection() {
    return (
        <section className="about-section p-6  mx-auto"> 
            <h2 className="text-left text-3xl font-bold text-purple-900">
                What is <em>PlanYourPlate</em>?
            </h2>
            
            <div className="flex flex-row mt-4">
                <p className="text-left text-purple-900 border p-5 w-2/3">
                    At PlanYourPlate, we are passionate about connecting individuals with recipes that match their needs.
                    We understand the struggle of striving for a healthier lifestyle despite a busy schedule, which is the inspiration behind our feature: 
                    <span className="text-customRed animate-bounce"> PlanYourMeals</span>, <span className="text-orange-600 animate-bounce"> PlanYourRecipes</span>, 
                    and<span className="text-orange-600 animate-bounce"> PlanFromYourFridge</span>.
                    <br/><br/>
                    <p class="font-bold">Having trouble deciding what to make, but have an idea in mind?</p> 
                    Search for recipes with ease with <span className="text-orange-600 animate-bounce"> PlanYourRecipes</span>! 
                    PlanYourRecipes is about finding recipes that match your needs as quickly as possible, to keep you focused on your busy life. 
                    <br></br>
                    <br></br>
                    <p class="font-bold">Struggling with finding recipes for your picky little one? Or perhaps trying to find recipes that are suitable for when you have
                    a cold?</p> 
                    Give our feature <span className="text-orange-600 animate-bounce"> PlanYourMeals</span> a try! You will receive general advice on how to handle meal planning for those difficult 
                    situations, along with some sample recipes to give a try.
                    <br></br>
                    <br></br>
                    <p class="font-bold">Is your fridge or pantry full of food, but you’re not sure where to start?</p>
                    Try our feature <span className="text-orange-600 animate-bounce"> PlanFromYourFridge</span>–just 
                    like the name implies, you receive recipes from ingredients in your fridge! Simply upload an image, and let us do the work.
                </p>
                
                <div className="w-1/3 flex justify-center items-center p-5  ml-4 bg-slate-200">
                    <img src="img/Searching For Recipes.gif" alt="Searching for recipes illustration" />
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
