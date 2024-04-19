import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { QueryContext } from "../Context/QueryContext";
import { AuthContext } from "../Context/AuthContext";
import ImageWithoutRightClick from "../Display/ImageWithoutRightClick";
import cardQueries from "../QueryObjects/CardQueries";
import boosterSetQueries from "../QueryObjects/BoosterSetQueries";

function CardsPage() {
    const [cards, setCards] = useState([]);
    const [boosterSets, setBoosterSets] = useState([]);

    const getBoosterSets = async() =>{
        const data = await boosterSetQueries.getboosterSetsData()
        setBoosterSets(data);
    };

    const handleBoosterSetChange = (event) => {
        setBoosterSetId(event.target.value)
        const selectedBoosterSet = boosterSets.find(set => set.id === event.target.value);
        setBoosterSet(selectedBoosterSet)
        console.log(boosterSet[rarity])
    };

    const handleRarityChange = (event) => {
        setRarity(event.target.value);
        console.log(rarity)
    };

    const { account } = useContext(AuthContext)

    const {
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
    } = useContext(QueryContext);

    const [listView, setListView] = useState(false);
    const [showMore, setShowMore] = useState(20);

    const [noCards, setNoCards] = useState(false);

    const getCards = async() =>{
        const data = await cardQueries.getCardsData()

        if (data.length == 0 ) {
            setNoCards(true)
        }

        const sortedCards = [...data].sort(sortMethods[sortState].method)

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
        console.log(typedCards)
        setCards(typedCards.map(card => ({
            ...card,
            picture_url: card.picture_url.replace("https://playmakercards","https://compressedplaymakercards")
                .replace("png", "jpg")
        })));
    };

    const navigate = useNavigate()

    const getRandomCard = async() =>{
        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex].card_number;
        console.log(randomCard.card_number)
        navigate(`/cards/${randomCard}`)
    }

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCards();
        getBoosterSets();
        document.title = "Cards - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);


    const sortMethods = {
        none: { method: (a,b) => new Date(b.updated_on.full_time) - new Date(a.updated_on.full_time) },
        newest: { method: (a,b) => b.created_on.full_time.localeCompare(a.created_on.full_time) },
        oldest: { method: (a,b) => a.created_on.full_time.localeCompare(b.created_on.full_time) },
        name: { method: (a,b) => a.name.localeCompare(b.name) },
        card_number: { method: (a,b) => a.card_number - b.card_number },
        enthusiasm_highest: { method: (a,b) => b.enthusiasm - a.enthusiasm },
        enthusiasm_lowest: { method: (a,b) => a.enthusiasm - b.enthusiasm },
    };

    const handleQuery = (event) => {
        setQuery({ ...query, [event.target.name]: event.target.value });
        setShowMore(20)
    };

    const handleQueryReset = (event) => {
        setQuery({
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
        setShowMore(20)
        setSortState("none")
        setBoosterSetId("")
        setBoosterSet("");
        setRarity("")
    };

    const handleSort = (event) => {
        setSortState(event.target.value);
    };

    const handleShowMore = (event) => {
        setShowMore(showMore + 20);
    };

    const handleListView = (event) => {
        setListView(!listView);
        setShowMore(20)
    };

    const all_cards = cards.filter(card => card.name.toLowerCase().includes(query.cardName.toLowerCase()))
        .filter((card, index, arr) => (card.effect_text + card.second_effect_text).toLowerCase().includes(query.cardText.toLowerCase()))
        .filter(card => card.card_number.toString().includes(query.cardNumber))
        .filter(card => card.hero_id.toLowerCase().includes(query.heroID.toLowerCase()))
        .filter((card, index, arr) => card.series_name.toLowerCase().includes(query.series.toLowerCase()))
        .filter(card => card.card_number >= query.startingNum)
        .filter(card => query.type? card.card_type.some(type => type.toString() == query.type):card.card_type)
        .filter(card => card.card_class.includes(query.cardClass))
        .filter(card => query.extraEffect? card.extra_effects.some(effect => effect.toString() == query.extraEffect):card.extra_effects)
        .filter(card => query.reaction? card.reactions.some(reaction => reaction.toString() == query.reaction):card.reactions)
        .filter(card => query.tag? card.card_tags.some(tag => tag.toString() == query.tag):card.card_tags)
        .filter(card => boosterSet && !rarity ? boosterSet.all_cards.includes(card.card_number):card.card_number)
        .filter(card => boosterSet && rarity ? boosterSet[rarity].includes(card.card_number):card.card_number)
        .sort(sortMethods[sortState].method)

    const isQueryEmpty = Object.values(query).every((value) => value === "");

    return (
        <div className="white-space">
            {/* <div className="flex-items">
            </div> */}
            <span className="media-flex-center">
                <div className="wide400p">
                    <h1 className="left-h1-2">Card Search</h1>
                    <h2 className="left">Search our collection of cards</h2>
                    <input
                        className="left dcbsearch-x-x-large"
                        type="text"
                        placeholder=" Card Name Contains..."
                        name="cardName"
                        value={query.cardName}
                        onChange={handleQuery}>
                    </input>
                    <br/>
                    <input
                        className="left dcbsearch-x-x-large"
                        type="text"
                        placeholder=" Card Text Contains..."
                        name="cardText"
                        value={query.cardText}
                        onChange={handleQuery}>
                    </input>
                    <br/>
                    <select
                        className="left dcbsearch-x-large dcbsearch-switch"
                        type="text"
                        placeholder=" Card Set"
                        onChange={handleBoosterSetChange}
                        name="boosterSet"
                        value={boosterSetId}>
                        <option value="">Card Set</option>
                        {boosterSets.map(function(boosterSet)
                        {return( <option value={boosterSet.id}>{boosterSet.name}</option>)}
                            )}
                    </select>
                    <select
                        className="left dcbsearch-medium"
                        type="text"
                        placeholder=" Rarity"
                        onChange={handleRarityChange}
                        name="rarity"
                        value={rarity}>
                        <option value="">Rarity</option>
                        <option value="mv">Max Variables</option>
                        <option value="normals">Normals</option>
                        <option value="rares">Rares</option>
                        <option value="super_rares">Super Rares</option>
                        <option value="ultra_rares">Ultra Rares</option>
                    </select>
                    <br/>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Card Number"
                        style={{width: "177px", height: "37px"}}
                        name="cardNumber"
                        value={query.cardNumber}
                        onChange={handleQuery}>
                    </input>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Starting Number"
                        style={{width: "177px", height: "37px"}}
                        name="startingNum"
                        value={query.startingNum}
                        onChange={handleQuery}>
                    </input>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Hero ID"
                        style={{width: "177px", height: "37px"}}
                        name="heroID"
                        value={query.heroID}
                        onChange={handleQuery}>
                    </input>
                    <input
                        className="left"
                        type="text"
                        placeholder=" Series"
                        style={{width: "177px", height: "37px"}}
                        name="series"
                        value={query.series}
                        onChange={handleQuery}>
                    </input>
                    <br/>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Type"
                        style={{width: "115px", height: "37px"}}
                        name="type"
                        value={query.type}
                        onChange={handleQuery}>
                        <option value="">Type</option>
                        <option value="1001">Fighter</option>
                        <option value="1002">Aura</option>
                        <option value="1003">Move</option>
                        <option value="1004">Ending</option>
                        <option value="1005">Any Type</option>
                        <option value="1006">Item</option>
                        <option value="1007">Event</option>
                        <option value="1008">Comeback</option>
                    </select>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Class"
                        style={{width: "115px", height: "37px"}}
                        name="cardClass"
                        value={query.cardClass}
                        onChange={handleQuery}>
                        <option value="">Class</option>
                        <option value="Staunch">Staunch</option>
                        <option value="Power">Power</option>
                        <option value="Unity">Unity</option>
                        <option value="Canny">Canny</option>
                    </select>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Extra Effect"
                        style={{width: "115px", height: "37px"}}
                        name="extraEffect"
                        value={query.extraEffect}
                        onChange={handleQuery}>
                        <option value="">Extra Effect</option>
                        <option value="1001">Trigger</option>
                        <option value="1003">Limited</option>
                        <option value="1002">Critical</option>
                    </select>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Reaction"
                        style={{width: "115px", height: "37px"}}
                        name="reaction"
                        value={query.reaction}
                        onChange={handleQuery}>
                        <option value="">Reaction</option>
                        <option value="1001">Block</option>
                        <option value="1002">Counter</option>
                        <option value="1003">Endure</option>
                        <option value="1004">Redirect</option>
                    </select>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Tag"
                        style={{width: "115px", height: "37px"}}
                        name="tag"
                        value={query.tag}
                        onChange={handleQuery}>
                        <option value="">Tag</option>
                        <option value="1001">5 HP</option>
                        <option value="1002">Focus</option>
                        <option value="1003">Auto</option>
                        <option value="1004">Stay</option>
                        <option value="1005">Max</option>
                        <option value="1006">Cycle</option>
                        <option value="1007">Hit 1</option>
                    </select>
                    <select
                        className="left"
                        type="text"
                        placeholder=" Sorted By"
                        style={{width: "115px", height: "37px"}}
                        value={sortState}
                        onChange={handleSort}>
                        <option value="none">Sorted By</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name">A-Z</option>
                        <option value="card_number">Card Number</option>
                        <option value="enthusiasm_highest">Enth (High)</option>
                        <option value="enthusiasm_lowest">Enth (Low)</option>
                    </select>
                    <br/>

                    { account && account.roles.includes("admin")?
                        <NavLink to="/cardcreate">
                            <button
                                className="left red">
                                Create
                            </button>
                        </NavLink>:
                    null}
                    <button
                        className="left"
                        variant="dark"
                        onClick={handleQueryReset}
                        >
                        Reset Filters
                    </button>
                    <button
                        className="left"
                        variant="dark"
                        onClick={getRandomCard}
                        >
                        Random Card
                    </button>
                    {listView?
                        <button
                            className="left"
                            variant="dark"
                            onClick={handleListView}
                        >
                            Image View
                        </button>:
                        <button
                            className="left"
                            variant="dark"
                            onClick={handleListView}
                        >
                            List View
                        </button>}
                    <h4 className="left-h3">Showing Results 1 - {all_cards.slice(0, showMore).length} of {all_cards.length}</h4>

                    { all_cards.length == 0 && isQueryEmpty && !noCards?
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div> :
                    null}

                </div>
            </span>
            {listView?
                <div className="card-list2">
                    {all_cards.slice(0, showMore).map(function(card, index, arr) {
                        return (
                            <NavLink to={`/cards/${card.card_number}`} className="nav-link glow2" key={card.name}>
                                    <div className={card.card_class ? `big${card.card_class}2` : "bigNoClass2"}>
                                        <h3 style={{fontWeight: "600", margin: "12px"}}>{card.name}</h3>
                                        <h5 style={{fontWeight: "600", margin: "12px"}}>{card.card_class} {card.cardType}</h5>
                                        {card.effectText.map((line) =>
                                        <h6 style={{fontWeight: "400", margin: "3px 12px"}}>
                                            {line}</h6>)}
                                        {card.secondEffectText?
                                        <>{card.secondEffectText.map((line) =>
                                        <h6 style={{fontWeight: "400", margin: "12px 12px 3px 12px"}}>
                                            {line}</h6>)}</>
                                        :null}

                                    </div>
                            </NavLink>
                        );
                    })}
                </div>
            :
            <div className="cards-page-card-list">
                {all_cards.slice(0, showMore).map(card => {
                    return (
                        <NavLink to={`/cards/${card.card_number}`}>
                                <img className="card-list-card glow3"
                                    title={card.name}
                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                    alt={card.name}
                                    loading="lazy"/>
                        </NavLink>
                    );
                })}
            </div>
            }
            {showMore < all_cards.length ?
                <button
                    variant="dark"
                    style={{ width: "100%", marginTop:"2%"}}
                    onClick={handleShowMore}>
                    Show More Cards ({all_cards.length - showMore} Remaining)
                </button> : null }
    </div>
    );
}

export default CardsPage;
