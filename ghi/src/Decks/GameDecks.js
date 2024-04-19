import { useState, useEffect } from "react";



function GameDecks() {

    const [decks, setDecks] = useState([]);
    const [deckList, setDeckList] = useState([])

    const getDecks = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/game_decks/`);
        const data = await response.json();

        setDecks(data[0]);
        setDeckList(data[1]);
    };

    useEffect(() => {
        getDecks();
    }, []);


    return(
        <div className="white-space">
            <div>
                {deckList.map((deck) => {
                    return (
                        <p>{deck},</p>
                    );
                })}
            </div>
            <div>
                {decks.map((deck) => {
                    return (
                        <>
                            <p>{deck}</p>
                            <br/>
                        </>
                    );
                })}
            </div>
        </div>
    );
}

export default GameDecks;
