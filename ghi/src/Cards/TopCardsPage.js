import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import ImageWithoutRightClick from "../Display/ImageWithoutRightClick";

function TopCardsPage() {

    const [cards, setCards] = useState([]);
    const [nonSetCards, setNonSetCards] = useState([]);
    const [decks, setDecks] = useState([]);
    const [showSetCards, setShowSetCards] = useState(true);
    const [totalCards, setTotalCards] = useState(0)
    const [noCards, setNoCards] = useState(false);

    const [showMore, setShowMore] = useState(20);
    const [listView, setListView] = useState(false);

    const limit = 100

    const getCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/get_popular_cards/`);
        const data = await response.json();

        if (data[0].length == 0 && data[1].length == 0) {
            setNoCards(true)
        }

        const sortedCards = data[0].sort((a,b) => b.count - a.count);
        const setSortedCards = data[1].sort((a,b) => b.count - a.count);
        setTotalCards(data[2])

        const typedCards = []
        for (let card of sortedCards){
            if (card.card_type[0] === 1001) {
                card["cardType"] = "Fighter"
            }
            else if (card.card_type[0] === 1002) {
                card["cardType"] = "Aura"
            }
            else if (card.card_type[0] === 1003) {
                card["cardType"] = "Move"
            }
            else if (card.card_type[0] === 1004) {
                card["cardType"] = "Ending"
            }
            else if (card.card_type[0] === 1005) {
                card["cardType"] = "Any Type"
            }
            else if (card.card_type[0] === 1006) {
                card["cardType"] = "Item"
            }
            else if (card.card_type[0] === 1007) {
                card["cardType"] = "Event"
            }
            else if (card.card_type[0] === 1008) {
                card["cardType"] = "Comeback"
            }

            card["effectText"] = card.effect_text.split("//")

            if (card.second_effect_text){
                card["secondEffectText"] = card.second_effect_text.split("//")
            }
            typedCards.push(card)
        }
        setNonSetCards(typedCards);

        const settypedCards = []
        for (let card of setSortedCards){
            if (card.card_type[0] === 1001) {
                card["cardType"] = "Fighter"
            }
            else if (card.card_type[0] === 1002) {
                card["cardType"] = "Aura"
            }
            else if (card.card_type[0] === 1003) {
                card["cardType"] = "Move"
            }
            else if (card.card_type[0] === 1004) {
                card["cardType"] = "Ending"
            }
            else if (card.card_type[0] === 1005) {
                card["cardType"] = "Any Type"
            }
            else if (card.card_type[0] === 1006) {
                card["cardType"] = "Item"
            }
            else if (card.card_type[0] === 1007) {
                card["cardType"] = "Event"
            }
            else if (card.card_type[0] === 1008) {
                card["cardType"] = "Comeback"
            }

            card["effectText"] = card.effect_text.split("//")

            if (card.second_effect_text){
                card["secondEffectText"] = card.second_effect_text.split("//")
            }
            settypedCards.push(card)
        }
        setCards(settypedCards);
    };

    const getDecks = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/decks/`);
        const data = await response.json();
        setDecks(data.decks);
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCards();
        getDecks();
        document.title = "Top Cards - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const handleShowMore = (event) => {
        setShowMore(showMore + 20);
    };

    const handleListView = (event) => {
        setListView(!listView);
        setShowMore(20)
    };

    const handleShowSetCards = (event) => {
        setShowSetCards(!showSetCards);
    };

    const all_cards = showSetCards? cards : nonSetCards


    return (
        <div className="white-space">
            <h1 className="left-h1">Top Cards</h1>
            <h2 className="left">Most Commonly Used Cards Across All Decks</h2>
            {listView?
                <button
                    className="left-top-card"
                    onClick={handleListView}
                >
                    Image View
                </button>:
                <button
                    className="left-top-card"
                    onClick={handleListView}
                >
                    List View
                </button>}

                {showSetCards?
                <button
                    className="left-top-card2"
                    onClick={handleShowSetCards}
                >
                    Total Copies
                </button>:
                <button
                className="left-top-card2"
                onClick={handleShowSetCards}
                >
                    Deck Count
                </button>}

                { all_cards.length == 0 && !noCards?
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div> :
                null}

            {listView?
                <div className="card-list3">
                    {all_cards.slice(0, limit).slice(0, showMore).map(card => {
                        return (
                            <NavLink to={`/cards/${card.card_number}`} className="nav-link glow2">
                                    <div className={card.card_class ? `big${card.card_class}2` : "bigNoClass2"}>
                                        <h3 style={{fontWeight: "600", margin: "12px"}}>{card.name}</h3>
                                        <h5 style={{fontWeight: "600", margin: "12px"}}>{card.card_class} {card.cardType}</h5>
                                        { showSetCards?
                                            <h4 style={{fontWeight: "600", margin: "12px 12px 0px 12px"}}>
                                                {card.count} Decks - {((card.count)*100 / decks.length).toFixed(2)}%
                                            </h4>
                                        :
                                            <h4 style={{fontWeight: "600", margin: "12px 12px 0px 12px"}}>
                                                {card.count} Copies out of {totalCards} Cards
                                            </h4>
                                        }
                                    </div>
                            </NavLink>
                        );
                    })}
                </div>
            :
            <div className="card-list5">
                {all_cards.slice(0, limit).slice(0, showMore).map(card => {
                    return (
                            <div className="aligned">
                                <NavLink to={`/cards/${card.card_number}`} className="nav-link glow3">
                                    <img className="card-list-card2"
                                        title={card.name}
                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                        alt={card.name}/>
                                </NavLink>
                                <h5 className="centered-h5"> {card.name} </h5>
                                { showSetCards?
                                    <h6 className="centered-h5-2">
                                        {card.count} Decks - {((card.count)*100 / decks.length).toFixed(2)}%
                                    </h6>
                                :
                                    <h6 className="centered-h5-2">
                                        {card.count} Copies out of {totalCards} Cards
                                    </h6>
                                }

                            </div>
                    );
                })}
            </div>
            }
            {showMore < limit ?
                <button
                    variant="dark"
                    style={{ width: "100%", marginTop:"3%"}}
                    onClick={handleShowMore}>
                    Show More Cards ({limit - showMore} Remaining)
                </button> : null }
    </div>
    );
}

export default TopCardsPage;
