import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import FavoriteDeck from "../Accounts/FavoriteDeck";


function DeckRow() {

    const [decks, setDecks] = useState([]);

    const {account, users} = useContext(AuthContext)

    const getDecks = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/decks/`);
        const data = await response.json();

        const deckData = data.decks.filter(deck => deck.private ? deck.private === false || deck.account_id === account.id || account && account.roles.includes("admin"): true)
        .slice(-4).reverse()
        for (let deck of deckData){
            const date = new Date(deck["created_on"]["full_time"])

            const time_now = new Date();
            time_now.setHours(time_now.getHours() + 5);

            // Calculate years, months, days, hours, minutes, and seconds
            let ago = Math.abs(time_now - date);
            const years = Math.floor(ago / 31557600000);
            ago -= years * 31557600000;
            const months = Math.floor(ago / 2630016000);
            ago -= months * 2630016000;
            const days = Math.floor(ago / 86400000);
            ago -= days * 86400000;
            const hours = Math.floor(ago / 3600000);
            ago -= hours * 3600000;
            const minutes = Math.floor(ago / 60000);
            ago -= minutes * 60000;
            // Format the time difference
            if (years > 0) {
            deck["created_on"]["ago"] = `${years} year ago`;
            } else if (months > 0) {
            deck["created_on"]["ago"] = `${months} month${months > 1 ? 's' : ''} ago`;
            } else if (days > 0) {
                deck["created_on"]["ago"] = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
            deck["created_on"]["ago"] = `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 1 ? ' and ' + minutes + ' minutes ago' : ' ago'}`;
            } else if (minutes > 0) {
            deck["created_on"]["ago"] = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else {
            deck["created_on"]["ago"] = "a few seconds ago";
            }

            const updateDate = new Date(deck["updated_on"]["full_time"])
            // Calculate years, months, days, hours, minutes, and seconds
            let updateAgo = Math.abs(time_now - updateDate);
            const updateYears = Math.floor(updateAgo / 31557600000);
            updateAgo -= updateYears * 31557600000;
            const updateMonths = Math.floor(updateAgo / 2630016000);
            updateAgo -= updateMonths * 2630016000;
            const updateDays = Math.floor(updateAgo / 86400000);
            updateAgo -= updateDays * 86400000;
            const updateHours = Math.floor(updateAgo / 3600000);
            updateAgo -= updateHours * 3600000;
            const updateMinutes = Math.floor(updateAgo / 60000);
            updateAgo -= updateMinutes * 60000;
            // Format the time difference
            if (updateYears > 0) {
            deck["updated_on"]["ago"] = `${updateYears} year ago`;
            } else if (updateMonths > 0) {
            deck["updated_on"]["ago"] = `${updateMonths} month${updateMonths > 1 ? 's' : ''} ago`;
            } else if (updateDays > 0) {
                deck["updated_on"]["ago"] = `${updateDays} day${updateDays > 1 ? 's' : ''} ago`;
            } else if (updateHours > 0) {
            deck["updated_on"]["ago"] = `${updateHours} hour${updateHours > 1 ? 's' : ''} ${updateMinutes > 1 ? ' and ' + updateMinutes + ' minutes ago' : ' ago'}`;
            } else if (updateMinutes > 0) {
            deck["updated_on"]["ago"] = `${updateMinutes} minute${updateMinutes > 1 ? 's' : ''} ago`;
            } else {
            deck["updated_on"]["ago"] = "a few seconds ago";
            }
        }
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
