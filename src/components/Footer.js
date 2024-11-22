import React from 'react';

function Footer() {
    return (
        <footer className="bg-customRed text-white py-2">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="text-lg font-bold mb-4 md:mb-0">
                    PlanYourPlate
                </div>
                <div className="text-center text-xs md:text-sm mt-4 md:mt-0">
                    © {new Date().getFullYear()} PlanYourPlate. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
