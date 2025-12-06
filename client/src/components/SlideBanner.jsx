import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SlideBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 250) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`
                fixed top-0 left-0 w-full 
                z-[9999] 
                transition-transform duration-300 
                ${isVisible ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <div className="bg-purple-500 text-white font-semibold px-6 py-3 flex justify-between items-center shadow-lg">
                <span className="text-sm">Enjoy unlimited music anytime</span>

                <Link to="/signup">
                    <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
                        Try for free
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SlideBanner;
