import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { DeckQueryContext } from "../Context/DeckQueryContext";
import { AuthContext } from "../Context/AuthContext";
import FavoriteDeck from "../Accounts/FavoriteDeck";

function DecksPage() {

    const [decks, setDecks] = useState([]);

    const [deckShowMore, setDeckShowMore] = useState(20);
    const {
        deckQuery,
        setDeckQuery,
        deckSortState,
        setDeckSortState,
    } = useContext(DeckQueryContext)

    const {account, users} = useContext(AuthContext)

    const [loading, setLoading] = useState(false)

    const getDecks = async() =>{
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/full_decks/`);
        const data = await response.json();

        const sortedDecks = [...data.decks].sort(deckSortMethods[deckSortState].method);
        setLoading(false)
        setDecks(sortedDecks.reverse());
    };

    const navigate = useNavigate()

    const getRandomDeck = async() =>{
        const randomIndex = Math.floor(Math.random() * decks.length);
        const randomDeck = decks[randomIndex].id;
        navigate(`/decks/${randomDeck}`);
    }

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getDecks();
        document.title = "Decks - PM CardBase"
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
            user: "",
        });
        setDeckSortState("none")
    };

    const handleDeckSort = (event) => {
        setDeckSortState(event.target.value);
    };

    const handleDeckShowMore = (event) => {
        setDeckShowMore(deckShowMore + 20);
    };

    const all_decks = decks.filter(deck => deck.private ? deck.private === false || deck.account_id === account.id || account && account.roles.includes("admin"): true)
        .filter(deck => deck.name.toLowerCase().includes(deckQuery.deckName.toLowerCase()))
        .filter(deck => (deck.description).toLowerCase().includes(deckQuery.description.toLowerCase()))
        .filter(deck => deckQuery.cardName ? (deck.card_names && deck.card_names.length > 0 ? deck.card_names.some(name => name.toLowerCase().includes(deckQuery.cardName.toLowerCase())) : false) : true)
        .filter(deck => deckQuery.strategy? deck.strategies.some(strategy => strategy.includes(deckQuery.strategy)):deck.strategies)
        .filter(deck => deckQuery.seriesName ? (deck.series_names && deck.series_names.length > 0 ? deck.series_names.some(series => series.toLowerCase().includes(deckQuery.seriesName.toLowerCase())) : false) : true)
        .filter(deck => deckQuery.user? (deck.account_id? users.find(user => user.id === deck.account_id && user.username.toLowerCase().includes(deckQuery.user.toLowerCase())):false):true)
        .sort(deckSortMethods[deckSortState].method)

    const createdBy = (deck) => {
        const account = deck.account_id? users.find(user => user.id === deck.account_id): null
        return account? account.username : "TeamPlayMaker"
    };


    return (
        <div className="white-space">
            <div className="media-flex-center">
                <div className="wide400p">
                    <h1 className="left-h1-2">Deck Search</h1>
                    <h2 className="left">Search our collection of decks</h2>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Deck Name Contains..."
                        name="deckName"
                        value={deckQuery.deckName}
                        onChange={handleDeckQuery}
                        style={{width: "370px", height: "37px"}}>
                    </input>
                    <br/>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Creator's Name Contains..."
                        name="user"
                        value={deckQuery.user}
                        onChange={handleDeckQuery}
                        style={{width: "370px", height: "37px"}}>
                    </input>
                    <br/>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Description Contains..."
                        name="description"
                        value={deckQuery.description}
                        onChange={handleDeckQuery}
                        style={{width: "370px", height: "37px"}}>
                    </input>
                    <br/>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Contains Card Named..."
                        name="cardName"
                        value={deckQuery.cardName}
                        onChange={handleDeckQuery}
                        style={{width: "370px", height: "37px"}}>
                    </input>
                    <br/>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Contains Series Named..."
                        name="seriesName"
                        value={deckQuery.seriesName}
                        onChange={handleDeckQuery}
                        style={{width: "370px", height: "37px"}}>
                    </input>
                    <br/>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Strategy"
                        name="strategy"
                        value={deckQuery.strategy}
                        onChange={handleDeckQuery}
                        style={{width: "180px", height: "37px"}}>
                        <option value="">Strategy</option>
                        <option value="Aggro">Aggro</option>
                        <option value="Combo">Combo</option>
                        <option value="Control">Control</option>
                        <option value="Mid-range">Mid-range</option>
                        <option value="Ramp">Ramp</option>
                        <option value="Second Wind">Second Wind</option>
                        <option value="Stall">Stall</option>
                        <option value="Toolbox">Toolbox</option>
                        <option value="other">other</option>
                    </select>
                    <select
                        className="left"
                        type="text"
                        placeholder="  Sorted By"
                        value={deckSortState}
                        onChange={handleDeckSort}
                        style={{width: "180px", height: "37px"}}>
                        <option value="none">Sorted By</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="updated">Last Updated</option>
                        <option value="name">A-Z</option>
                    </select>
                    <br/>
                    <NavLink to="/deckbuilder">
                        <button className="left red">
                            Create
                        </button>
                    </NavLink>
                    <button
                        className="left"
                        onClick={handleDeckQueryReset}
                        >
                        Reset Filters
                    </button>
                    <button
                        className="left"
                        onClick={getRandomDeck}
                        >
                        Random Deck
                    </button>

                    { loading ?
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div> :
                        <h4 className="left-h3">Showing Results 1 - {all_decks.slice(0, deckShowMore).length} of {all_decks.length}</h4>}
                </div>
            </div>
            <div className="decks-page-card-list2">
                {all_decks.slice(0, deckShowMore).map((deck) => {
                    return (
                        <NavLink to={`/decks/${deck.id}`}  key={deck.id}>
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
                                        <h3 className="left margin-top-20 media-margin-top-10">{deck.name}</h3>
                                        { deck.private && deck.private === true ?
                                            <img className="logo4" src="https://i.imgur.com/V3uOVpD.png" alt="private" />:null
                                        }
                                        {account?
                                            <FavoriteDeck deck={deck}/>: null
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
                                            {deck.time_ago.created} &nbsp; &nbsp;
                                        </h6>
                                        <img className="logo3" src="https://i.imgur.com/QLa1ciW.png" alt="updated on"/>
                                        <h6
                                        className="left justify-content-end"
                                            style={{margin: '5px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                                        >
                                            {deck.time_ago.updated} &nbsp; &nbsp;
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
            {deckShowMore < all_decks.length ?
                <button
                    variant="dark"
                    style={{ width: "100%", marginTop:"2%"}}
                    onClick={handleDeckShowMore}>
                    Show More Decks ({all_decks.length - deckShowMore} Remaining)
                </button> : null }
        </div>
    );
}

export default DecksPage;
