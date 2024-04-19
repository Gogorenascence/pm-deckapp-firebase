import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext.js";
import CardSetCreateSearch from "./CardSetCreateSearch.js";
import { CardSetQueryContext } from "../Context/CardSetQueryContext.js";
import ImageViewCardSetInput from "./ImageViewCardSetInput.js";
import BackButton from "../Display/BackButton.js";
import { getKeyByValue } from "../Helpers.js";


function CardSetCreate({
    action,
    copy
}) {

    const [cardSet, setCardSet ] = useState({
        name: "",
        description: "",
        ratio: {},
        mv: [],
        normals: [],
        rares: [],
        super_rares: [],
        ultra_rares: [],
        all_cards: [],
        cover_image: "",
    });

    const {card_set_id} = useParams()
    const [ratioType, setRatioType] = useState("")

    const getBoosterSet = async() =>{
        const cardResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const cardData = await cardResponse.json();
        if (cardData.cards.length == 0 ) {
            setNoCards(true)
        }
        const sortedCards = [...cardData.cards].sort(sortMethods[sortState].method);
        setCards(sortedCards);

        if (action === "edit") {
            const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/booster_sets/`);
            const data = await response.json();
            const booster = data.booster_sets.find(booster => booster.id === card_set_id)
            const type = getKeyByValue(ratioTypes, booster.ratio)
            setCardSet(booster);
            setMaxVariables(booster.mv.map(card_number => sortedCards.find(card => card.card_number === card_number)))
            setNormals(booster.normals.map(card_number => sortedCards.find(card => card.card_number === card_number)))
            setRares(booster.rares.map(card_number => sortedCards.find(card => card.card_number === card_number)))
            setSuperRares(booster.super_rares.map(card_number => sortedCards.find(card => card.card_number === card_number)))
            setUltraRares(booster.ultra_rares.map(card_number => sortedCards.find(card => card.card_number === card_number)))
            console.log(type)
            setRatioType(type)
        }
    };

    const ratioTypes = {
        "": { mv: 1, normals: 5, rares: 3, supers: 2 },
        standard: { mv: 1, normals: 5, rares: 3, supers: 2 },
        short: { mv: 0, normals: 3, rares: 2, supers: 1 },
        gold: { mv: 0, normals: 3, rares: 3, supers: 4 },
    }

    const handleRatio = (event) => {
        console.log(ratioType)
        setRatioType(event.target.value)
    }

    const { account } = useContext(AuthContext)

    const {query,
        sortState,
        boosterSet,
        rarity,
        listView,
        showMore,
        setShowMore} = useContext(CardSetQueryContext)


    const [maxVariables, setMaxVariables] = useState([]);
    const [normals, setNormals] = useState([]);
    const [rares, setRares] = useState([]);
    const [superRares, setSuperRares] = useState([]);
    const [ultraRares, setUltraRares] = useState([]);

    const [cards, setCards] = useState([]);

    const [modify, setModify] = useState({
        maxVariables: false,
        normals: true,
        rares: false,
        superRares: false,
        ultraRares: false
    })
    const [showPool, setShowPool] = useState(true);
    const [showMaxVariables, setShowMaxVariables] = useState(true);
    const [showNormals, setShowNormals] = useState(true);
    const [showRares, setShowRares] = useState(true);
    const [showSuperRares, setShowSuperRares] = useState(true);
    const [showUltraRares, setShowUltraRares] = useState(true);

    const selectedCards = maxVariables.concat(normals, rares, superRares, ultraRares)

    const [noCards, setNoCards] = useState(false);

    const [stayHere, setStayHere] = useState(false)

    const getTitle = () => {
        let title = "";
        if (action === "create") {
            title = "Create"
        } else if (action === "edit" && !copy){
            title = "Edit"
        } else {
            title = "Copy"
        }
        return title;
    }


    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getBoosterSet()
        document.title = action === "create"?
        "Card Set Create - PM CardBase":
        `Card Set ${getTitle()} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[boosterSet]);

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
        setCardSet({ ...cardSet, [event.target.name]: event.target.value });
    };

    const handleCheck = (event) => {
        setStayHere(!stayHere);
    };

    const handleClick = (card) => {
        if (modify.maxVariables) {
            setMaxVariables([...maxVariables, card])
        } else if (modify.normals){
            setNormals([...normals, card])
        } else if (modify.rares){
            setRares([...rares, card])
        } else if (modify.superRares){
            setSuperRares([...superRares, card])
        } else if (modify.ultraRares){
            setUltraRares([...ultraRares, card])
        }
    }

    const handleRemoveCard = (card, list) => {
        if (list === "maxVariables") {
            const listIndex = maxVariables.indexOf(card);
            const newList = [...maxVariables];
            newList.splice(listIndex, 1);
            setMaxVariables(newList)
        } else if (list === "normals"){
            const listIndex = normals.indexOf(card);
            const newList = [...normals];
            newList.splice(listIndex, 1)
            setNormals(newList)
        } else if (list === "rares"){
            const listIndex = rares.indexOf(card);
            const newList = [...rares];
            newList.splice(listIndex, 1)
            setRares(newList)
        } else if (list === "superRares"){
            const listIndex = superRares.indexOf(card);
            const newList = [...superRares];
            newList.splice(listIndex, 1)
            setSuperRares(newList)
        } else {
            const listIndex = ultraRares.indexOf(card);
            const newList = [...ultraRares];
            newList.splice(listIndex, 1)
            setUltraRares(newList)
        }
    }

    const clearList = async(list) => {
        if (list === "maxVariables") {
            setMaxVariables([])
        } else if (list === "normals"){
            setNormals([])
        } else if (list === "rares"){
            setRares([])
        } else if (list === "superRares"){
            setSuperRares([])
        } else {
            setUltraRares([])
        }
    }

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...cardSet};
        const maxVariablesList = []
        const normalsList = []
        const raresList = []
        const superRaresList = []
        const ultraRaresList = []
        const all_cards = []
        for (let card of maxVariables){
            if (!maxVariablesList.includes(card.card_number)) {
                maxVariablesList.push(card.card_number)
                all_cards.push(card.card_number)
            }
        }
        for (let card of normals){
            if (!normalsList.includes(card.card_number)) {
                normalsList.push(card.card_number)
                all_cards.push(card.card_number)
            }
        }
        for (let card of rares){
            if (!raresList.includes(card.card_number)) {
                raresList.push(card.card_number)
                all_cards.push(card.card_number)
            }
        }
        for (let card of superRares){
            if (!superRaresList.includes(card.card_number)) {
                superRaresList.push(card.card_number)
                all_cards.push(card.card_number)
            }
        }
        for (let card of ultraRares){
            if (!ultraRaresList.includes(card.card_number)) {
                ultraRaresList.push(card.card_number)
                all_cards.push(card.card_number)
            }
        }
        data["mv"] = maxVariablesList;
        data["normals"] = normalsList;
        data["rares"] = raresList;
        data["super_rares"] = superRaresList;
        data["ultra_rares"] = ultraRaresList;
        data["all_cards"] = all_cards;
        data["ratio"] = ratioTypes[ratioType];
        const cardSetUrl = action === "create" || copy?
            `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/booster_sets/` :
            `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/booster_sets/${card_set_id}`
        const fetchConfig = action === "create" || copy?
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        :
            {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }

        const response = await fetch(cardSetUrl, fetchConfig);
        if (response.ok) {
            const responseData = await response.json();
            const card_set_id = responseData.id;
            setCardSet({
                name: "",
                description: "",
                ratio: {},
                mv: [],
                normals: [],
                rares: [],
                super_rares: [],
                ultra_rares: [],
                all_cards: [],
                cover_image: "",
            });
            setMaxVariables([])
            setNormals([])
            setRares([])
            setSuperRares([])
            setUltraRares([])

            if (!stayHere) {navigate(`/cardsets/${card_set_id}`)}
            console.log("Success")
        } else {
            alert("Error in creating Card Set");
        }
    }

    const handleShowPool = (event) => {
        setShowPool(!showPool);
    };

    const handleModify = (list) => {
        if (list === "maxVariables") {
            setModify({
                maxVariables: true,
                normals: false,
                rares: false,
                superRares: false,
                ultraRares: false
            })
        } else if (list === "normals"){
            setModify({
                maxVariables: false,
                normals: true,
                rares: false,
                superRares: false,
                ultraRares: false
            })
        } else if (list === "rares"){
            setModify({
                maxVariables: false,
                normals: false,
                rares: true,
                superRares: false,
                ultraRares: false
            })
        } else if (list === "superRares"){
            setModify({
                maxVariables: false,
                normals: false,
                rares: false,
                superRares: true,
                ultraRares: false
            })
        } else {
            setModify({
                maxVariables: false,
                normals: false,
                rares: false,
                superRares: false,
                ultraRares: true
            })
        }
    };

    const handleShowMaxVariables = (event) => {
        setShowMaxVariables(!showMaxVariables);
    };

    const handleShowNormals = (event) => {
        setShowNormals(!showNormals);
    };

    const handleShowRares = (event) => {
        setShowRares(!showRares);
    };

    const handleShowSuperRares = (event) => {
        setShowSuperRares(!showSuperRares);
    };

    const handleShowUltraRares = (event) => {
        setShowUltraRares(!showUltraRares);
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
                    <h1 className="margin-top-40">{action === "create"? "Card Set Create" : `Card Set ${getTitle()}`}</h1>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                                <div
                                    id="create-cardSet-page">
                                    <h2 className="left">Card Set Details</h2>
                                    <h5 className="label"> Name </h5>
                                    <input
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Set Name"
                                        onChange={handleChange}
                                        name="name"
                                        value={cardSet.name}>
                                    </input>
                                    <br/>
                                    <h5 className="label"> Description </h5>
                                    <textarea
                                        className="builder-text"
                                        type="text"
                                        placeholder=" Set Description"
                                        onChange={handleChange}
                                        name="description"
                                        value={cardSet.description}>
                                    </textarea>
                                    <br/>
                                    <h5 className="label">Set Ratios </h5>
                                    <select
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Ratio Type"
                                        name="ratio"
                                        value={ratioType}
                                        onChange={handleRatio}>
                                        <option value="standard">Standard</option>
                                        <option value="short">Short</option>
                                        <option value="gold">Gold</option>
                                    </select>
                                    <br/>
                                    <input
                                        style={{margin: "20px 5px 9px 5px", height:"10px"}}
                                        id="stayHere"
                                        type="checkbox"
                                        onChange={handleCheck}
                                        name="stayHere"
                                        checked={stayHere}>
                                    </input>
                                    <label for="stayHere"
                                        className="bold"
                                    >
                                        Keep me here
                                    </label>

                                    <br/>
                                    {account?
                                        <button
                                            className={action === "create"? "left" : "left red"}
                                            onClick={handleSubmit}
                                        >
                                            {action === "create"? "Create Card Set" : "Save"}
                                        </button>:null
                                    }
                                    <BackButton/>
                                    <br/>
                                    { !account?
                                        <h6 className="error">You must be logged in to create a cardSet</h6>:
                                    null
                                    }
                                </div>
                            </div>
                            <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                                <CardSetCreateSearch/>
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
                                                        className={selectedCards.includes(card) ? "selected builder-card pointer glow3" : "builder-card pointer glow3"}
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
                        <ImageViewCardSetInput
                            rarityString={"Ultra Rares"}
                            rarityList={ultraRares}
                            showRarity={showUltraRares}
                            handleShowRarity={handleShowUltraRares}
                            modify={modify}
                            modifyName={"ultraRares"}
                            clearList={clearList}
                            handleModify={handleModify}
                            handleRemoveCard={handleRemoveCard}
                        />
                        <ImageViewCardSetInput
                            rarityString={"Super Rares"}
                            rarityList={superRares}
                            showRarity={showSuperRares}
                            handleShowRarity={handleShowSuperRares}
                            modify={modify}
                            modifyName={"superRares"}
                            clearList={clearList}
                            handleModify={handleModify}
                            handleRemoveCard={handleRemoveCard}
                        />
                        <ImageViewCardSetInput
                            rarityString={"Rares"}
                            rarityList={rares}
                            showRarity={showRares}
                            handleShowRarity={handleShowRares}
                            modify={modify}
                            modifyName={"rares"}
                            clearList={clearList}
                            handleModify={handleModify}
                            handleRemoveCard={handleRemoveCard}
                        />
                        <ImageViewCardSetInput
                            rarityString={"Normals"}
                            rarityList={normals}
                            showRarity={showNormals}
                            handleShowRarity={handleShowNormals}
                            modify={modify}
                            modifyName={"normals"}
                            clearList={clearList}
                            handleModify={handleModify}
                            handleRemoveCard={handleRemoveCard}
                        />
                        <ImageViewCardSetInput
                            rarityString={"Max Variables"}
                            rarityList={maxVariables}
                            showRarity={showMaxVariables}
                            handleShowRarity={handleShowMaxVariables}
                            modify={modify}
                            modifyName={"maxVariables"}
                            clearList={clearList}
                            handleModify={handleModify}
                            handleRemoveCard={handleRemoveCard}
                        />
                        {/* {listView?
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
                                                    <div style={{padding: "5px"}}>
                                                        <div className="card-container pointer">
                                                            <h5 onClick={() => handleRemoveCard(card)}>{card.name}</h5>
                                                            <img
                                                                className="card-image"
                                                                src={card.picture_url}
                                                                alt={card.name}
                                                            />
                                                        </div>
                                                    </div>
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
                    </>} */}
                </div>:
                    <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Admins Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    );
}

export default CardSetCreate;
