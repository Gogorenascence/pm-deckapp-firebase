import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { DeckQueryContext } from "../Context/DeckQueryContext";
import { AuthContext } from "../Context/AuthContext";

function AccountDecks(props) {

    const [decks, setDecks] = useState([]);
    const {
        account,
        users,
        getAccountData,
    } = useContext(AuthContext)
    const [deckShowMore, setDeckShowMore] = useState(20);
    const {
        deckQuery,
        setDeckQuery,
        deckSortState,
        setDeckSortState,
    } = useContext(DeckQueryContext)

    const [loading, setLoading] = useState(false)

    const {option} = props;
    const navigate = useNavigate()

    const getDecks = async() =>{
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/full_decks/`);
        const data = await response.json();

        const sortedDecks = [...data.decks].sort(deckSortMethods[deckSortState].method);

        for (let deck of sortedDecks){
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
            deck["created_on"]["ago"] = `${days} day${days > 1 ? 's' : ''} ${hours > 1 ? ' and ' + hours + ' hours ago' : ' ago'}`;
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
            deck["updated_on"]["ago"] = `${updateDays} day${updateDays > 1 ? 's' : ''} ${updateHours > 1 ? ' and ' + updateHours + ' hours ago' : ' ago'}`;
            } else if (updateHours > 0) {
            deck["updated_on"]["ago"] = `${updateHours} hour${updateHours > 1 ? 's' : ''} ${updateMinutes > 1 ? ' and ' + updateMinutes + ' minutes ago' : ' ago'}`;
            } else if (updateMinutes > 0) {
            deck["updated_on"]["ago"] = `${updateMinutes} minute${updateMinutes > 1 ? 's' : ''} ago`;
            } else {
            deck["updated_on"]["ago"] = "a few seconds ago";
            }
        }
        setLoading(false)
        setDecks(sortedDecks.reverse());
    };

    const getRandomDeck = async() =>{
        const randomIndex = Math.floor(Math.random() * decks.length);
        const randomDeck = decks[randomIndex].id;
        navigate(`/decks/${randomDeck}`);
    }

    useEffect(() => {
        getDecks();
        getAccountData();
        document.title = "Account Info - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    }, []);

    const deckSortMethods = {
        none: { method: (a,b) => b.id.localeCompare(a.id) },
        newest: { method: (a,b) => b.id.localeCompare(a.id) },
        oldest: { method: (a,b) => a.id.localeCompare(b.id) },
        name: { method: (a,b) => a.name.localeCompare(b.name) },
        updated: { method: (a,b) => new Date(b.updated_on.full_time) - new Date(a.updated_on.full_time) },
    };

    const handleDeckQuery = (event) => {
        setDeckQuery({ ...deckQuery, [event.target.name]: event.target.value });
    };

    const handleDeckQueryReset = (event) => {
        setDeckQuery({
            deckName: "",
            description: "",
            cardName: "",
            strategy: "",
            seriesName: "",
        });
        setDeckSortState("none")
    };

    const handleDeckSort = (event) => {
        setDeckSortState(event.target.value);
    };

    const handleDeckShowMore = (event) => {
        setDeckShowMore(deckShowMore + 20);
    };

    const all_decks = decks.filter(deck => deck.name.toLowerCase().includes(deckQuery.deckName.toLowerCase()))
        .filter(deck => (deck.description).toLowerCase().includes(deckQuery.description.toLowerCase()))
        .filter(deck => deckQuery.cardName ? (deck.card_names && deck.card_names.length > 0 ? deck.card_names.some(name => name.toLowerCase().includes(deckQuery.cardName.toLowerCase())) : false) : true)
        .filter(deck => deckQuery.strategy? deck.strategies.some(strategy => strategy.includes(deckQuery.strategy)):deck.strategies)
        .filter(deck => deckQuery.seriesName ? (deck.series_names && deck.series_names.length > 0 ? deck.series_names.some(series => series.toLowerCase().includes(deckQuery.seriesName.toLowerCase())) : false) : true)
        .sort(deckSortMethods[deckSortState].method)

    const my_decks = all_decks.filter(deck => account && deck.account_id && deck.account_id === account.id)

    const createdBy = (deck) => {
        const account = deck.account_id? users.find(user => user.id === deck.account_id): null
        return account? account.username : "TeamPlayMaker"
    };

    return (
        <div>
            {option === "myDecks"?
                <div className="account-options-container">
                    <span className="flex">
                        <h1 className="left-h1">My Uploaded Decks</h1>
                        <h4 className="left-h3">&nbsp; &nbsp; Showing 1 - {my_decks.slice(0, deckShowMore).length} of {my_decks.length}</h4>
                    </span>
                    { loading ?
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div> :
                    null}
                    {!loading ?
                        <div className="account-option-items account-scrollable">
                            {my_decks.slice(0, deckShowMore).map((deck, index) => {
                                const marginBottom = index < my_decks.length - 1 ? '15px' : '0';
                                return (
                                    <NavLink to={`/decks/${deck.id}`}>
                                        <Card className="text-white text-center card-list-card3 glow"
                                            style={{marginBottom}}>
                                            <div className="card-image-wrapper">
                                                <div className="card-image-clip3">
                                                    <Card.Img
                                                        src={deck.cover_card ? deck.cover_card : "https://i.imgur.com/8wqd1sD.png"}
                                                        alt="Card image"
                                                        className="card-image2"
                                                        variant="bottom"/>
                                                </div>
                                            </div>
                                            <Card.ImgOverlay className="blackfooter2 mt-auto">
                                            <div className="flex">
                                                <h3 className="left cd-container-child">{deck.name}</h3>
                                                { deck.private && deck.private === true ?
                                                    <img className="logo4" src="https://i.imgur.com/V3uOVpD.png" alt="private" />:null
                                                }
                                            </div>
                                            {/* <h6 style={{margin: '0px 0px 5px 0px', fontWeight: "600"}}
                                            >
                                                User:
                                            </h6> */}
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
                        {deckShowMore < my_decks.length ?
                            <button
                            variant="dark"
                            style={{ width: "100%", marginTop:"2%"}}
                            onClick={handleDeckShowMore}>
                                Show More Decks ({my_decks.length - deckShowMore} Remaining)
                            </button> : null }
                        </div>:null
                    }
                </div>: null
            }
        </div>
    );
}

export default AccountDecks;
