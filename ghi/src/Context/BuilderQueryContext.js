import { createContext, useState } from "react";


const BuilderQueryContext = createContext();

const BuilderQueryContextProvider = ({ children }) => {
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
    const [boosterSets, setBoosterSets] = useState([]);
    const [boosterSetId, setBoosterSetId] = useState("");
    const [boosterSet, setBoosterSet] = useState("");
    const [rarity, setRarity] = useState("");

    const [listView, setListView] = useState(false);
    const [showMore, setShowMore] = useState(20);

    return (
        <BuilderQueryContext.Provider value={{
            query,
            setQuery,
            sortState,
            setSortState,
            boosterSet,
            setBoosterSet,
            boosterSets,
            setBoosterSets,
            boosterSetId,
            setBoosterSetId,
            rarity,
            setRarity,
            listView,
            setListView,
            showMore,
            setShowMore
            }}>
            {children}
        </BuilderQueryContext.Provider>
    );
};

export { BuilderQueryContext, BuilderQueryContextProvider };
