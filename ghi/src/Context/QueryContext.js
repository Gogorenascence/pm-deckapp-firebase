import { createContext, useState } from "react";


const QueryContext = createContext();

const QueryContextProvider = ({ children }) => {
    const [query, setQuery] = useState({
        cardName: "",
        cardText: "",
        cardNumber: "",
        heroID: "",
        series: "",
        startingNum: "",
        type: "",
        cardClass: "",
        extraEffect: "",
        reaction: "",
        tag: "",
    });
    const [sortState, setSortState] = useState("none");
    const [boosterSetId, setBoosterSetId] = useState("");
    const [boosterSet, setBoosterSet] = useState("");
    const [rarity, setRarity] = useState("");

    return (
        <QueryContext.Provider value={{
            query,
            setQuery,
            sortState,
            setSortState,
            boosterSet,
            setBoosterSet,
            boosterSetId,
            setBoosterSetId,
            rarity,
            setRarity
            }}>
            {children}
        </QueryContext.Provider>
    );
};

export { QueryContext, QueryContextProvider };
