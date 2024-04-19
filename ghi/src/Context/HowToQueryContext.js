import { createContext, useState } from "react";


const HowToQueryContext = createContext();

const HowToQueryContextProvider = ({ children }) => {
    const [howToQuery, setHowToQuery] = useState({
        title: "",
        game_format: "",
        skill_level: "",
        content: "",
    });
    const [howToSortState, setHowToSortState] = useState("none");
    // const [someMoreNews, setSomeMoreNews] = useState(20)

    const handleResetHowToQuery = () => {
        setHowToQuery({
            title: "",
            game_format: "",
            skill_level: "",
            content: "",
        })
        // setSomeMoreNews(20)
    }

    // const handleSomeMoreNews = () => {
    //     setSomeMoreNews(someMoreNews + 20)
    // }

    return (
        <HowToQueryContext.Provider value={{
            howToQuery,
            setHowToQuery,
            howToSortState,
            setHowToSortState,
            handleResetHowToQuery,
            // someMoreNews,
            // handleSomeMoreNews,
            }}>
            {children}
        </HowToQueryContext.Provider>
    );
};

export { HowToQueryContext, HowToQueryContextProvider };
