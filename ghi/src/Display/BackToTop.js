import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function BackToTop() {
    const location = useLocation();
    const showOnPx = 300;
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const scrollContainer = () => {
            return document.documentElement || document.body;
        };

        const handleScroll = () => {
            if (scrollContainer().scrollTop > showOnPx){
                setShowButton(true);
            }else{
                setShowButton(false);
            }
        };

        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [showOnPx]);

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className={location.pathname === "/simulator"? "hidden2": null}>
            <img
                className={`back-to-top ${showButton ? null : "hidden"}`}
                src="https://i.imgur.com/8VVXzFI.png"
                alt="back to top button"
                onClick={goToTop}>
            </img>
        </div>
    );
}

export default BackToTop;
