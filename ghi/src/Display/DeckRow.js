import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import FavoriteDeck from "../Accounts/FavoriteDeck";
import deckQueries from "../QueryObjects/DeckQueries";


function DeckRow() {

    const [decks, setDecks] = useState([]);

    const {account, users} = useContext(AuthContext)

    const getDecks = async() =>{
        const data = await deckQueries.getdecksData()
        const deckData = data.filter(deck => deck.private ? deck.private === false || deck.account_id === account.id || account && account.roles.includes("admin"): true)
        .sort((a,b) => b.updated_on.full_time.localeCompare(a.updated_on.full_time)).slice(0, 4)

        setDecks(deckData);
    };

    const createdBy = (deck) => {
        const account = deck.account_id? users.find(user => user.id === deck.account_id): null
        return account? account.username : "TeamPlayMaker"
    };

    useEffect(() => {
        getDecks();
    }, [account]);



    return(
        <div className="white-space">
            <div className="deck-row-card-list2">
                {decks.map((deck) => {
                    return (
                        <NavLink to={`/decks/${deck.id}`} key={deck.id}>
                            <Card className="text-white text-center card-list-card3 glow">
                                <div className="card-image-wrapper media-card-image-wrapper">
                                    <div className="card-image-clip">
                                        <Card.Img
                                            src={deck.cover_card ? deck.cover_card : "https://i.imgur.com/8wqd1sD.png"}
                                            alt="Card image"
                                            className="card-image2"
                                            variant="bottom"/>
                                    </div>
                                </div>
                                <Card.ImgOverlay className="blackfooter2 mt-auto">
                                    <div className="flex">
                                        <h3 className="left margin-top-20 media-margin-top-10"
                                        >{deck.name}</h3>
                                        { deck.private && deck.private === true ?
                                            <img className="logo4"
                                                src="https://i.imgur.com/V3uOVpD.png"
                                                alt="private" />:null
                                        }
                                        {account?
                                            <FavoriteDeck deck={deck}/>: null
                                        }
                                    </div>
                                    <h6 className="left"
                                        style={{margin: '0px 0px 5px 10px', fontWeight: "600"}}
                                    >
                                        Strategies: {deck.strategies.length > 0 ? deck.strategies.join(', ') : "n/a"}
                                    </h6>
                                    <h6 className="left"
                                        style={{margin: '0px 0px 10px 10px', fontWeight: "600"}}
                                    >
                                        Main Deck: {deck.cards.length} &nbsp; Pluck Deck: {deck.pluck.length}
                                    </h6>
                                    <div style={{ display: "flex" }}>
                                        <img className="logo2" src="https://i.imgur.com/nIY2qSx.png" alt="created on"/>
                                        <h6
                                        className="left justify-content-end"
                                            style={{margin: '5px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                                        >
                                            {deck.created_on.ago} &nbsp; &nbsp;
                                        </h6>
                                        <img className="logo3" src="https://i.imgur.com/QLa1ciW.png" alt="updated on"/>
                                        <h6
                                        className="left justify-content-end"
                                            style={{margin: '5px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                                        >
                                            {deck.updated_on.ago} &nbsp; &nbsp;
                                        </h6>
                                        <img className="logo2" src="https://i.imgur.com/eMGZ7ON.png" alt="created by"/>
                                        <h6
                                        className="left justify-content-end"
                                            style={{margin: '5px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                                        >
                                            {createdBy(deck)}
                                        </h6>
                                    </div>
                                </Card.ImgOverlay>
                            </Card>
                        </NavLink>
                    );
                })}
            </div>
            <br/>
            <div className="d-grid gap-2">
                <NavLink to="/decks">
                    <button variant="dark" size="lg" style={{ width: "100%" }}>
                        Browse All Decks
                    </button>
                </NavLink>
            </div>
        </div>
    );
}

export default DeckRow;
