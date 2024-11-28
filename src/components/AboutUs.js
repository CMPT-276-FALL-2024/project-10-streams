import React from 'react';

function AboutUs() {
    return (
        <section className="aboutUs-section p-4 sm:p-6 md:p-8 lg:p-10 mx-auto max-w-screen-xl">
            <h2 className="text-purple-900 text-left text-2xl sm:text-3xl lg:text-4xl font-bold">
                Behind <em>PlanYourPlate</em>
            </h2>
            <p className="text-purple-900 text-center font-bold text-xl sm:text-2xl mt-4">
                The Team
            </p>

            {/* Team Member Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
                <div className="flex flex-col items-center">
                    <img
                        src="img/sara-photo.png"
                        alt="Sara"
                        className="rounded-sm w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover"
                    />
                    <p className="text-lg sm:text-xl lg:text-2xl text-purple-900 mt-4">
                        Sara Magdalinski
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="img/wonchan-photo.png"
                        alt="Wonchan"
                        className="rounded-sm w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover"
                    />
                    <p className="text-lg sm:text-xl lg:text-2xl text-purple-900 mt-4">
                        Wonchan Kim
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="img/ines-photo.png"
                        alt="Ines"
                        className="rounded-sm w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover"
                    />
                    <p className="text-lg sm:text-xl lg:text-2xl text-purple-900 mt-4">
                        Ines Machinho Rodrigues
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="img/owen-photo.png"
                        alt="Owen"
                        className="rounded-sm w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover"
                    />
                    <p className="text-lg sm:text-xl lg:text-2xl text-purple-900 mt-4">
                        Owen Smith
                    </p>
                </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 mt-8 rounded-md">
                <p className="text-center text-base sm:text-lg md:text-xl text-purple-900 leading-relaxed">
                    We are a group of 4 passionate students from Simon Fraser University in hopes of promoting healthy eating habits through PlanYourPlate. 
                    We acknowledge the struggles of maintaining a healthy lifestyle while balancing a busy schedule, which is why we created PlanYourPlate. 
                    Our goal is to provide a platform where users can easily find recipes that match their dietary needs and preferences.
                </p>
            </div>

            {/* APIs Used Section */}
            <div className="text-center text-purple-900 text-xl sm:text-2xl font-bold mt-8">
                APIs Used
            </div>
            <div className="flex justify-center items-center mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center text-center">
                    <div className="flex flex-col items-center">
                        <img
                            src="img/spoonacular-logo-b.svg"
                            alt="Spoonacular API"
                            className="w-24 h-24 object-contain"
                        />
                        <p className="mt-2 text-purple-900 text-center text-lg">
                            Spoonacular API
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img
                            src="img/Google_Gemini_logo.svg.png"
                            alt="Gemini API"
                            className="w-24 h-24 object-contain"
                        />
                        <p className="mt-2 text-purple-900 text-center text-lg">
                            Gemini API
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
