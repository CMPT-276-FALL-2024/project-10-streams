import React from 'react';

function AboutUs() {
    return (
        <section className="aboutUs-section p-10 mx-auto">
            <h2 className="text-customPurple text-left text-3xl font-bold">
                Behind <em>PlanYourPlate</em>
            </h2>
            <p className="text-customPurple text-center font-bold text-2xl mt-4">
                The Team
            </p>
            <div className="flex flex-col lg:flex-row mt-4 lg:space-x-8 space-y-8 lg:space-y-0">
                <div className="flex flex-col items-center">
                    <img
                        src="img/sara-photo.png"
                        alt="Sara"
                        className="rounded-sm w-64 h-64 object-cover"
                    />
                    <p className="text-2xl text-customPurple mt-4">Sara Magdalinski</p>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="img/wonchan-photo.png"
                        alt="Wonchan"
                        className="rounded-sm w-64 h-64 object-cover"
                    />
                    <p className="text-2xl text-customPurple mt-4">Wonchan Kim</p>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="img/ines-photo.png"
                        alt="Ines"
                        className="rounded-sm w-64 h-64 object-cover"
                    />
                    <p className="text-2xl text-customPurple mt-4">Ines Machinho Rodrigues</p>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="img/owen-photo.png"
                        alt="Owen"
                        className="rounded-sm w-64 h-64 object-cover"
                    />
                    <p className="text-2xl text-customPurple mt-4">Owen Smith</p>
                </div>
            </div>

<div className="flex flex-col items-center  p-8 mt-8 rounded-md">
                <p className="text-center text-lg text-customPurple">
                    We are a group of 4 passionate students from Simon Fraser University in hopes of promoting healthy eating habits through PlanYourPlate. We acknowledge the struggles of maintaining a healthy lifestyle while balancing a busy schedule, which is why we created PlanYourPlate. Our goal is to provide a platform where users can easily find recipes that match their dietary needs and preferences. 
                </p>
            </div>
            <div className="text-center text text-customPurple text-2xl font-bold">
                APIs Used
            </div>
            <div className="flex flex-col lg:flex-row mt-4 lg:space-x-8 space-y-8 lg:space-y-0">
            </div>
        </section>
    );
}

export default AboutUs;
