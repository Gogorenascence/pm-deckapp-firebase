import { useState, useEffect } from "react";



function GameCards() {

    const [cards, setCards] = useState([]);

    const getCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/game_cards/`);
        const data = await response.json();

        setCards(data);
    };

    useEffect(() => {
        getCards();
    }, []);


    return(
        <div className="white-space">
            <div>
                {cards.map((card) => {
                    return (
                        <>
                            <p>{card}</p>
                            <br/>
                        </>
                    );
                })}
            </div>
        </div>
    );
}

export default GameCards;
