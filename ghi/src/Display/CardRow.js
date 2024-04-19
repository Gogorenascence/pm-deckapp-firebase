import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import ImageWithoutRightClick from "./ImageWithoutRightClick";


function CardRow() {

    const [cards, setCards] = useState([]);

    const getCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const data = await response.json();

        setCards(data.cards.sort((a,b) => new Date(b.updated_on.full_time) - new Date(a.updated_on.full_time)));
    };

    useEffect(() => {
        getCards();
    }, []);


    return(
        <div className="white-space">
            <div className="cards-page-card-list5 none">
                {cards.slice(0, 5).map((card) => {
                    return (
                        <div className="card-row" key={card.name}>
                            <NavLink to={`/cards/${card.card_number}`}>
                                    <img
                                        className="card-row glow3"
                                        title={card.name}
                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                        alt={card.name}/>
                            </NavLink>
                        </div>
                    );
                })}
            </div>
            <div className="hidden2 media-display">
                <div className="cards-page-card-list">
                    {cards.slice(0, 6).map(card => {
                        return (
                            <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                    <img className="card-list-card4 glow3"
                                        title={card.name}
                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                        alt={card.name}
                                        loading="lazy"/>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
            <br/>
            <NavLink to="/cards">
                <button style={{ width: "100%" }}>
                    Browse All Cards
                </button>
            </NavLink>
        </div>
    );
}

export default CardRow;
