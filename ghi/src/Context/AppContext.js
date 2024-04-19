import { createContext, useState } from "react";


const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedDarkMode = localStorage.getItem("darkMode");
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });

    return (
        <AppContext.Provider value={{
            isDark,
            setIsDark
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
