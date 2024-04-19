import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

function LightSwitch() {
    const {isDark, setIsDark} = useContext(AppContext)

    const location = useLocation();

    const handleDark = () => {
        setIsDark(!isDark);
        localStorage.setItem("darkMode", JSON.stringify(!isDark));
    };

    if (isDark) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    return (
        <div className={location.pathname === "/simulator"? "hidden2":null}>
            {!isDark ? (
                <img
                className="light-dark"
                src="https://i.imgur.com/aC79zoE.png"
                alt="dark"
                onClick={handleDark}
                />
            ) : (
                <img
                className="light-dark"
                src="https://i.imgur.com/bL1Lcll.png"
                alt="light"
                onClick={handleDark}
                />
            )}
        </div>
    );
}

export default LightSwitch;
