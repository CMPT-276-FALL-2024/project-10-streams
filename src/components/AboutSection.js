import React from 'react';

function AboutSection() {
    return (
        <section className="about-section p-6  mx-auto"> 
            <h2 className="text-left text-3xl font-bold text-customPurple">
                What is <em>PlanYourPlate</em>?
            </h2>
            
            <div className="flex flex-row mt-4">

                <p className="text-left text-customPurple border p-5 w-2/3">
                    At PlanYourPlate, we are passionate about connecting individuals with recipes that match their needs.
                    We understand the struggle of striving for a healthier lifestyle despite a busy schedule, which is the inspiration behind our feature: 
                    <span className="text-customRed animate-bounce"> PlanYourRecipes</span>.
                    <br /><br />
                    PlanYourRecipes is about finding recipes that match your needs as quickly as possible, to keep you focused
                    on your busy life. PlanYourPlate was made with various users in mind... You as well!
                </p>
                
                <div className="w-1/3 flex justify-center items-center p-5  ml-4 bg-slate-200">
                    <img src="img/Searching For Recipes.png" alt="Searching for recipes illustration" />
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
