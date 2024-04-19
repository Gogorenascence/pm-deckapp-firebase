import { createContext, useState } from "react";


const NewsQueryContext = createContext();

const NewsQueryContextProvider = ({ children }) => {
    const [newsQuery, setNewsQuery] = useState({
        section: "",
        startingDate: "",
        content: "",
        headline: "",
        news: false
    });
    const [newsSortState, setNewsSortState] = useState("none");
    const [someMoreNews, setSomeMoreNews] = useState(20)

    const handleResetNewsQuery = () => {
        setNewsQuery({
            section: "",
            startingDate: "",
            content: "",
            headline: "",
            news: false
        })
        setSomeMoreNews(20)
    }

    const handleSomeMoreNews = () => {
        setSomeMoreNews(someMoreNews + 20)
    }

    return (
        <NewsQueryContext.Provider value={{
            newsQuery,
            setNewsQuery,
            newsSortState,
            setNewsSortState,
            handleResetNewsQuery,
            someMoreNews,
            setSomeMoreNews,
            handleSomeMoreNews,
            }}>
            {children}
        </NewsQueryContext.Provider>
    );
};

export { NewsQueryContext, NewsQueryContextProvider };
