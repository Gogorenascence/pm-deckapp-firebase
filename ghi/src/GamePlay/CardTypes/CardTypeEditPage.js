import {
    Col
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import ImageWithoutRightClick from "../../Display/ImageWithoutRightClick.js";
import GamePlayCardSearch from "../GamePlayCardSearch";
import { GamePlayQueryContext } from "../../Context/GamePlayQueryContext.js";
import BackButton from "../../Display/BackButton.js";
import ImageViewSupportInput from "../ImageViewSupportInput";
import ImageViewAntiSupportInput from "../ImageViewAntiSupportInput";



function CardTypeEdit() {

    const [cardType, setCardType ] = useState({
        name: "",
        deck_type: "",
        description: "",
        rules: "",
        type_number: "",
        support: [],
        anti_support: [],
    });

    const {card_type_id} = useParams()
    const { account } = useContext(AuthContext)

    const {query,
        sortState,
        boosterSet,
        rarity,
        listView,
        showMore,
        setShowMore} = useContext(GamePlayQueryContext)

    const [support_list, setSupportList] = useState([]);
    const [anti_support_list, setAntiSupportList] = useState([]);

    const [cards, setCards] = useState([]);

    const [modifySupport, setModifySupport] = useState(true)
    const [showPool, setShowPool] = useState(true);
    const [showSupport, setShowSupport] = useState(true);
    const [showAntiSupport, setShowAntiSupport] = useState(true);

    const [noCards, setNoCards] = useState(false);

    const getCardType = async() =>{
        const typeResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/card_types/${card_type_id}/`);
        const type_data = await typeResponse.json();
        setCardType(type_data);

        const cardResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const cardData = await cardResponse.json();

        const support_card_list = type_data.support.map(supportItem =>
            cardData.cards.find(card => card.card_number === supportItem)).filter(card => card !== undefined)
        const anti_support_card_list = type_data.anti_support.map(antiSupportItem =>
            cardData.cards.find(card => card.card_number === antiSupportItem)).filter(card => card !== undefined)
        setSupportList(support_card_list)
        setAntiSupportList(anti_support_card_list)
    };

    const getCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const data = await response.json();
        if (data.cards.length == 0 ) {
            setNoCards(true)
        }
        const sortedCards = [...data.cards].sort(sortMethods[sortState].method);
        setCards(sortedCards);
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCards();
        getCardType();
    // eslint-disable-next-line
    },[]);

    useEffect(() => {
        document.title = `Editing ${cardType.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[cardType.id]);

    const sortMethods = {
        none: { method: (a,b) => a.card_number - b.card_number },
        newest: { method: (a,b) => b.id.localeCompare(a.id) },
        oldest: { method: (a,b) => a.id.localeCompare(b.id) },
        name: { method: (a,b) => a.name.localeCompare(b.name) },
        card_number: { method: (a,b) => a.card_number - b.card_number },
        enthusiasm_highest: { method: (a,b) => b.enthusiasm - a.enthusiasm },
        enthusiasm_lowest: { method: (a,b) => a.enthusiasm - b.enthusiasm },
    };

    const all_cards = cards.filter(card => card.name.toLowerCase().includes(query.cardName.toLowerCase()))
        .filter(card => (card.effect_text + card.second_effect_text).toLowerCase().includes(query.cardText.toLowerCase()))
        .filter(card => card.card_number.toString().includes(query.cardNumber))
        .filter(card => card.hero_id.toLowerCase().includes(query.heroID.toLowerCase()))
        .filter(card => card.series_name.toLowerCase().includes(query.series.toLowerCase()))
        .filter(card => card.card_number >= query.startingNum)
        .filter(card => query.type? card.card_type.some(type => type.toString() == query.type):card.card_type)
        .filter(card => card.card_class.includes(query.cardClass))
        .filter(card => query.extraEffect? card.extra_effects.some(effect => effect.toString() == query.extraEffect):card.extra_effects)
        .filter(card => query.reaction? card.reactions.some(reaction => reaction.toString() == query.reaction):card.reactions)
        .filter(card => query.tag? card.card_tags.some(tag => tag.toString() == query.tag):card.card_tags)
        .filter(card => boosterSet && !rarity ? boosterSet.all_cards.includes(card.card_number):card.card_number)
        .filter(card => boosterSet && rarity ? boosterSet[rarity].includes(card.card_number):card.card_number)
        .sort(sortMethods[sortState].method)

    const handleShowMore = (event) => {
        setShowMore(showMore + 20)
    };

    const handleChange = (event) => {
        setCardType({ ...cardType, [event.target.name]: event.target.value });
    };

    const handleClick = (card) => {
        modifySupport? setSupportList([...support_list, card]):
        setAntiSupportList([...anti_support_list, card]);
        }

    const handleRemoveCard = (card) => {
        if (modifySupport) {
            const supportIndex = support_list.indexOf(card);
            const newSupportList = [...support_list];
            newSupportList.splice(supportIndex, 1);
            setSupportList(newSupportList);
        }else{
            const anti_supportIndex = anti_support_list.indexOf(card);
            const newAntiSupportList = [...anti_support_list];
            newAntiSupportList.splice(anti_supportIndex, 1);
            setAntiSupportList(newAntiSupportList);
        }
    }

    const clearSupport = async() => {
        setSupportList([]);
    }

    const clearAntiSupport = async() => {
        setAntiSupportList([]);
    }

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...cardType};
        const support = []
        const anti_support = []
        for (let card of support_list){
            if (!support.includes(card.card_number)) {
                support.push(card.card_number)
            }
        }
        for (let card of anti_support_list){
            if (!anti_support.includes(card.card_number)) {
                anti_support.push(card.card_number)
            }
        }
        data["support"] = support;
        data["anti_support"] = anti_support;
        data["type_number"] = parseInt(cardType["type_number"], 10);
        const cardTypeUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/card_types/${card_type_id}`;
        const fetchConfig = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(cardTypeUrl, fetchConfig);
        if (response.ok) {
            const responseData = await response.json();
            // const card_tag_id = responseData.id;
            setCardType({
                cat_type: "",
                name: "",
                description: "",
                support: [],
                anti_support: [],
                created_on: {},
                updated_on: {},
            });
            navigate(`/cardtypes/`);
        } else {
            alert("Error in creating Card Type");
        }
    }

    const handleShowPool = (event) => {
        setShowPool(!showPool);
    };

    const handleModifySupport = (event) => {
        setModifySupport(!modifySupport);
    };

    const handleShowSupport = (event) => {
        setShowSupport(!showSupport);
    };

    const handleShowAntiSupport = (event) => {
        setShowAntiSupport(!showAntiSupport);
    };

    const preprocessText = (text) => {
        return text.split("//").join("\n");
    };

    const isQueryEmpty = Object.values(query).every((value) => value === "");

    if (!(account && account.roles.includes("admin"))) {
        setTimeout(function() {
            window.location.href = `${process.env.PUBLIC_URL}/`
        }, 3000);
    }

    return (
        <div>
            { account && account.roles.includes("admin")?
                <div className="white-space">
                    <h1 className="margin-top-40">Card Type Edit</h1>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                                <div
                                    id="create-cardType-page">
                                    <h2 className="left">Card Type Details</h2>
                                    <h5 className="label">Name </h5>
                                    <input
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Type Name"
                                        onChange={handleChange}
                                        name="name"
                                        value={cardType.name}>
                                    </input>
                                    <br/>
                                    <h5 className="label"> Description </h5>
                                    <textarea
                                        className="builder-text"
                                        type="text"
                                        placeholder=" Type Description"
                                        onChange={handleChange}
                                        name="description"
                                        value={cardType.description}>
                                    </textarea>
                                    <br/>
                                    <h5 className="label"> Rules </h5>
                                    <textarea
                                        className="builder-text"
                                        type="text"
                                        placeholder=" Type Rules"
                                        onChange={handleChange}
                                        name="rules"
                                        value={cardType.rules}>
                                    </textarea>
                                    <br/>
                                    <h5 className="label">Type Number </h5>
                                    <input
                                        className="builder-input"
                                        type="number"
                                        placeholder=" Type Number"
                                        onChange={handleChange}
                                        name="type_number"
                                        value={cardType.type_number}>
                                    </input>
                                    <br/>

                                    {account && account.roles.includes("admin")?
                                        <button
                                            className="left"
                                            style={{ marginTop: "9px"}}
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>:null
                                    }
                                    <BackButton/>
                                    <br/>
                                    { !account?
                                        <h6 className="error">You must be logged in to edit a tag</h6>:
                                    null
                                    }
                                </div>
                            </div>
                            <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                                <GamePlayCardSearch/>
                            </div>
                        </div>
                        <div className={showPool ? "rarities2" : "no-rarities"}>
                            <div style={{marginLeft: "0px"}}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <h2
                                        className="left"
                                        style={{margin: "1% 0px 1% 20px", fontWeight: "700"}}
                                    >Card Pool</h2>
                                    <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                                    {all_cards.length > 0 ?
                                        <h5
                                            className="left db-pool-count"
                                        >{all_cards.length}</h5>:
                                        null}
                                    { showPool ?
                                        <h5 className="left db-pool-count"
                                            onClick={() => handleShowPool()}>
                                                &nbsp;[Hide]
                                        </h5> :
                                        <h5 className="left db-pool-count"
                                            onClick={() => handleShowPool()}>
                                            &nbsp;[Show]
                                        </h5>}
                                </div>
                                <div className={showPool ? "scrollable" : "hidden2"}>
                                    <div style={{margin: "8px"}}>

                                    { all_cards.length == 0 && isQueryEmpty && !noCards?
                                        <div className="loading-container">
                                            <div className="loading-spinner"></div>
                                        </div> :
                                    null}

                                    <div className="card-pool-fill">
                                        {all_cards.slice(0, showMore).map((card) => {
                                            return (
                                                <div style={{display: "flex", justifyContent: "center"}}>
                                                    <img
                                                        onClick={() => handleClick(card)}
                                                        className="builder-card pointer glow3"
                                                        title={`${card.name}\n${preprocessText(card.effect_text)}\n${card.second_effect_text ? preprocessText(card.second_effect_text) : ""}`}
                                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                        alt={card.name}/>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    </div>
                                    {showMore < all_cards.length ?
                                        <button
                                            style={{ width: "97%", margin:".5% 0% .5% 1.5%"}}
                                            onClick={handleShowMore}>
                                            Show More Cards ({all_cards.length - showMore} Remaining)
                                        </button> : null }
                                </div>
                            </div>
                        </div>
                        {listView?
                            <div className="deck-list">
                                <div className="support">
                                <div style={{marginLeft: "20px"}}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <h2
                                            className="left"
                                            style={{margin: "2% 0% 1% 0%", fontWeight: "700"}}
                                        >Support</h2>
                                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                                        {support_list.length > 0 ?
                                        <h5
                                            className="left"
                                            style={{margin: "1% 0%", fontWeight: "700"}}
                                        >{support_list.length}</h5>:
                                        null}
                                    </div>
                                    {support_list.length > 0 ?<>
                                            {support_list.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                                return (
                                                    <Col style={{padding: "5px"}}>
                                                        <div className="card-container pointer">
                                                            <h5 onClick={() => handleRemoveCard(card)}>{card.name}</h5>
                                                            <img
                                                                className="card-image"
                                                                src={card.picture_url}
                                                                alt={card.name}
                                                            />
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        </>:
                                    <h4 className="left no-cards">No cards added</h4>}
                                </div>
                            </div>

                            <div className="anti_support">
                                <div style={{marginLeft: "20px"}}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                        <h2
                                            className="left"
                                            style={{margin: "2% 0% 1% 0%", fontWeight: "700"}}
                                        >Anti-Support</h2>
                                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                                        {anti_support_list.length > 0 ?
                                        <h5
                                            className="left"
                                            style={{margin: "1% 0%", fontWeight: "700"}}
                                        >{anti_support_list.length}</h5>:
                                        null}
                                    </div>
                                    {anti_support_list.length > 0 ?<>
                                            {anti_support_list.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                                return (
                                                    <Col style={{padding: "5px"}}>
                                                        <div className="card-container pointer">
                                                            <h5 onClick={() => handleRemoveCard(card)}>{card.name}</h5>
                                                            <img
                                                                className="card-image"
                                                                src={card.picture_url}
                                                                alt={card.name}
                                                            />
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        </>:
                                    <h4 className="left no-cards">No cards added</h4>}
                                </div>
                            </div>
                        </div>
                        :<>
                            <ImageViewSupportInput
                                support_list={support_list}
                                showSupport={showSupport}
                                handleShowSupport={handleShowSupport}
                                modifySupport={modifySupport}
                                clearSupport={clearSupport}
                                handleModifySupport={handleModifySupport}
                                handleRemoveCard={handleRemoveCard}
                            />
                            <ImageViewAntiSupportInput
                                anti_support_list={anti_support_list}
                                showAntiSupport={showAntiSupport}
                                handleShowAntiSupport={handleShowAntiSupport}
                                modifySupport={modifySupport}
                                clearAntiSupport={clearAntiSupport}
                                handleModifySupport={handleModifySupport}
                                handleRemoveCard={handleRemoveCard}
                            />
                    </>}
                </div>:
                    <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Admins Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    );
}

export default CardTypeEdit;
