import React, { useState, useRef, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from "../Display/BackButton";
import { AuthContext } from "../Context/AuthContext";
import { BuilderQueryContext } from "../Context/BuilderQueryContext";
import { PullsContext } from "../Context/PullsContext";
import BuilderCardSearch from "./BuilderCardSearch";
import ImageViewListInput from "./ImageViewListInput";
import ListViewListInput from "./ListViewListInput";
import CardPool from "./CardPool";
import DeckImport from './DeckImport';
import StatsPanel from "./StatsPanel";


function DeckCopyPage() {
    const [deck, setDeck] = useState({
        name: "",
        account_id: "",
        description: "",
        strategies: [],
        cards: [],
        pluck: [],
        side: [],
        views: 0,
        cover_card: null,
        parent_id: "",
        private: true,
    });

    const {deck_id} = useParams();
    const {account} = useContext(AuthContext)
    const {query,
        sortState,
        boosterSet,
        rarity,
        listView,
        showMore,
        setShowMore} = useContext(BuilderQueryContext)

    const fileInput = useRef(null);
    const [importedDecks, setImportedDecks] = useState([]);
    const [showDecks, setShowDecks] = useState(false);

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const importedDecksArray = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const importedDeck = JSON.parse(e.target.result);
                        importedDecksArray.push(importedDeck);
                        // If all files have been read, update the state
                        if (importedDecksArray.length === files.length) {
                        setImportedDecks((prevDecks) => [...prevDecks, ...importedDecksArray]);
                        }
                    } catch (error) {
                        console.error('Error parsing imported deck JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
            setShowDecks(true)
        }
    };

    const importDeck = (importedDeck) => {
        const cardIDList = importedDeck.ObjectStates[0].DeckIDs.map(num => num/100)
        const cardList = cardIDList.map(cardID => cards.find(card => card.card_number === cardID))
        const main = cardList.filter(card => card.card_type[0] === 1001||
            card.card_type[0] === 1002||
            card.card_type[0] === 1003||
            card.card_type[0] === 1004||
            card.card_type[0] === 1005)
        setMainList([...main_list, ...main])
        const pluck = cardList.filter(card => card.card_type[0] === 1006||
            card.card_type[0] === 1007||
            card.card_type[0] === 1008)
        setPluckList([...pluck_list, ...pluck])
    };

    const clearDecks = () => {
        setImportedDecks([])
    }

    const handleShowDecks = (event) => {
        setShowDecks(!showDecks);
    };

    const [deck_list, setDeckList] = useState([]);
    const [main_list, setMainList] = useState([]);
    const [pluck_list, setPluckList] = useState([]);
    const combinedList = main_list.concat(pluck_list);
    const [uniqueList, setUniqueList] = useState([]);

    const [selectedList, setSelectedList] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    const [cards, setCards] = useState([]);

    const [showPool, setShowPool] = useState(true);
    const [showMain, setShowMain] = useState(true);
    const [showPluck, setShowPluck] = useState(true);

    const [noCards, setNoCards] = useState(false);

    const getCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const data = await response.json();
        if (data.cards.length == 0 ) {
            setNoCards(true)
        }
        const sortedCards = [...data.cards].sort(sortMethods[sortState].method);
        setCards(sortedCards);
    };

    const getDeck = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/decks/${deck_id}/`);
        const deckData = await response.json();
        if (deckData["pluck"] === null){
            deckData["pluck"] = []
        }
        if (deckData["side"] === null){
            deckData["side"] = []
        }
        deckData["private"] = true
        setDeck(deckData);
    };

    const getDeckList = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/decks/${deck_id}/list/`);
        const deckListData = await response.json();
        setDeckList(deckListData)
        setMainList(deckListData[0])
        setPluckList(deckListData[1])
    };

    const getExtraData = async() =>{
        setSelectedList(deck.strategies)
        setSelectedCard(deck.cover_card)
        const id_list = []
        const newList = []
        for (let card of combinedList){
            if (!id_list.includes(card.id)){
                id_list.push(card.id)
                newList.push(card)
            }
        }
        setUniqueList(newList);
    }

    useEffect(() => {
        getDeck();
        getDeckList();
        getCards();
        getPulledCards();
    // eslint-disable-next-line
    },[]);

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getExtraData();
        document.title = `Copying ${deck.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    }, [deck_id]);

    const sortMethods = {
        none: { method: (a,b) => a.card_number - b.card_number },
        newest: { method: (a,b) => b.id.localeCompare(a.id) },
        oldest: { method: (a,b) => a.id.localeCompare(b.id) },
        name: { method: (a,b) => a.name.localeCompare(b.name) },
        card_number: { method: (a,b) => a.card_number - b.card_number },
        enthusiasm_highest: { method: (a,b) => b.enthusiasm - a.enthusiasm },
        enthusiasm_lowest: { method: (a,b) => a.enthusiasm - b.enthusiasm },
    };

    const {
        pulls,
        usePool,
        setUsePool
    } = useContext(PullsContext);

    const [pulledCards, setPulledCards] = useState([]);
    const [noPulledCards, setNoPulledCards] = useState(false);

    const getPulledCards = async() =>{
        if (pulls.length == 0 ) {
            setNoPulledCards(true)
        }
        const pulledCardsList = [];
        for (let pull of pulls) {
            pulledCardsList.push(...pull);
        }
        const sortedPulledCards = [...pulledCardsList].sort(sortMethods[sortState].method);
        setPulledCards(sortedPulledCards);
    };
    const selectedPool = usePool? cards : pulledCards
    const handleUsePool = (event) => {
        setUsePool(!usePool);
    };

    const all_cards = selectedPool.filter(card => card.name.toLowerCase().includes(query.cardName.toLowerCase()))
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
        {usePool? setShowMore(showMore + 20): setShowMore(showMore + 50)}
    };

    const handleChange = (event) => {
        setDeck({ ...deck, [event.target.name]: event.target.value });
    };

    const handleCheck = (event) => {
        setDeck({ ...deck, [event.target.name]: event.target.checked });
        console.log(deck.private)
    };

    const handleCoverCardChange = (event) => {
        setSelectedCard( event.target.value );
        setDeck({ ...deck, [event.target.name]: event.target.value });
        console.log(selectedCard)
    };

    const handleStrategyChange = e => {
        let { options } = e.target;
        options = Array.apply(null, options)
        const selectedValues = options.filter(function(x){return x.selected}).map(x => x.value);
        setSelectedList(selectedValues);
        console.log(selectedValues)
    }

    const handleClick = (card) => {
        if (card.card_type[0] === 1006 ||
            card.card_type[0] === 1007 ||
            card.card_type[0] === 1008){
            setPluckList([...pluck_list, card]);
        }else{
            setMainList([...main_list, card]);
        }
        getExtraData();
    }

    const handleRemoveCard = (card) => {
        if (card.card_type[0] === 1006 ||
            card.card_type[0] === 1007 ||
            card.card_type[0] === 1008){
                const pluckIndex = pluck_list.indexOf(card);
                const newPluckList = [...pluck_list];
                newPluckList.splice(pluckIndex, 1);
                setPluckList(newPluckList);
                if (card.picture_url === selectedCard){
                    setSelectedCard(null)
                }
        }else{
            const mainIndex = main_list.indexOf(card);
            const newMainList = [...main_list];
            newMainList.splice(mainIndex, 1);
            setMainList(newMainList);
            if (card.picture_url === selectedCard){
                setSelectedCard(null)
            }
        }
        getExtraData();
    }

    const clearMain = async() => {
        setMainList([]);
        const picture_urls = []
        for (let card of main_list){
            picture_urls.push(card.picture_url)
        }
        if (picture_urls.includes(selectedCard)){
            setSelectedCard(null);
        }
    }

    const clearPluck = async() => {
        setPluckList([]);
        const picture_urls = []
        for (let card of pluck_list){
            picture_urls.push(card.picture_url)
        }
        if (picture_urls.includes(selectedCard)){
            setSelectedCard(null);
        }
    }

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...deck};
        const main = []
        const pluck = []
        const card_names = []
        const series_names = []

        for (let card of main_list){
            main.push(card.card_number)
            card_names.push(card.name)
            series_names.push(card.series_name)
        }
        for (let card of pluck_list){
            if (card.hero_id === "GEN"
                || main_list?.filter(cardItem => cardItem.hero_id === card.hero_id)
                .length > 3) {
                pluck.push(card.card_number)
                card_names.push(card.name)
                series_names.push(card.series_name)
            }
        }
        data["cards"] = main;
        data["pluck"] = pluck;
        data["strategies"] = selectedList
        data["card_names"] = card_names
        data["series_names"] = series_names
        data["parent_id"] = deck_id
        account ? data["account_id"] = account.id : data["account_id"] = deck.account_id
        delete data["id"]

        const cardUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/decks/`;
        const fetchConfig = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(cardUrl, fetchConfig);
        if (response.ok) {
            const responseData = await response.json();
            const child_deck_id = responseData.id;
            setDeck({
                name: "",
                account_id: "",
                description: "",
                strategies: [],
                cards: [],
                pluck: [],
                side: [],
                views: 0,
                cover_card: "",
                parent_id: "",
            });
            navigate(`/decks/${child_deck_id}`)
        } else {
            alert("Error in copying deck");
        }
    }

    const handleShowPool = (event) => {
        setShowPool(!showPool);
    };

    const handleShowMain = (event) => {
        setShowMain(!showMain);
    };

    const handleShowPluck = (event) => {
        setShowPluck(!showPluck);
    };

    const isQueryEmpty = Object.values(query).every((value) => value === "");

    return (
        <div className="white-space">
            <div className="between-space media-display">
                <span className="media-flex-center">
                    <div>
                        <h1 className="left-h1-2">Deck Copy</h1>
                        <h2 className="left">Deck Details</h2>
                        <h5 className="label">Name </h5>
                        <input
                            className="builder-input"
                            type="text"
                            placeholder=" Deck Name"
                            onChange={handleChange}
                            name="name"
                            value={deck.name}>
                        </input>
                        <br/>
                        <h5 className="label">Cover Card</h5>
                        <select
                            className="builder-input"
                            type="text"
                            placeholder=" Cover Card"
                            onChange={handleCoverCardChange}
                            name="cover_card"
                            value={deck.cover_card}>
                            <option value="">Cover Card</option>
                            {uniqueList.sort((a,b) => a.card_number - b.card_number).map((card) => (
                                <option value={card.picture_url}>{card.name}</option>
                                ))}
                        </select>
                        <br/>
                        <h5 className="label"> Description </h5>
                        <textarea
                            className="builder-text"
                            type="text"
                            placeholder=" Deck Description"
                            onChange={handleChange}
                            name="description"
                            value={deck.description}>
                        </textarea>
                        <h5 className="label">Strategies</h5>
                        <h7 className="label"><em>hold ctrl/cmd to select more than one</em></h7>
                        <br/>
                        <select
                            className="builder-text"
                            multiple
                            name="strategies"
                            onChange={handleStrategyChange}
                            >
                            <option value="">Strategy</option>
                            <option value="Aggro" selected={deck.strategies.includes("Aggro")}>Aggro</option>
                            <option value="Combo" selected={deck.strategies.includes("Combo")}>Combo</option>
                            <option value="Control" selected={deck.strategies.includes("Control")}>Control</option>
                            <option value="Mid-range" selected={deck.strategies.includes("Mid-range")}>Mid-range</option>
                            <option value="Ramp" selected={deck.strategies.includes("Ramp")}>Ramp</option>
                            <option value="Second Wind" selected={deck.strategies.includes("Second Wind")}>Second Wind</option>
                            <option value="Stall" selected={deck.strategies.includes("Stall")}>Stall</option>
                            <option value="Toolbox" selected={deck.strategies.includes("Toolbox")}>Toolbox</option>
                            <option value="other" selected={deck.strategies.includes("other")}>other</option>
                        </select>
                        <br/>
                        <input
                            style={{margin: "20px 5px 9px 5px", height: "10px"}}
                            id="private"
                            type="checkbox"
                            onChange={handleCheck}
                            name="private"
                            checked={deck.private}>
                        </input>
                        <label for="private"
                            className="bold"
                        >
                            Make my decks private
                        </label>
                        <br/>
                        {account?
                            <button
                                style={{width: "67px", margin: "5px"}}
                                variant="dark"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>:
                            <button
                            style={{width: "67px", margin: "5px"}}
                            variant="dark"
                            >
                                Save
                            </button>
                        }
                        <BackButton/>
                        <button
                            className="left red"
                            variant="danger"
                            onClick={clearMain}
                        >
                            Clear Main
                        </button>
                        <button
                            className="left red"
                            variant="danger"
                            onClick={clearPluck}
                        >
                            Clear Pluck
                        </button>
                        <br/>
                        { !account?
                            <h6 className="error">You must be logged in to copy a deck</h6>:
                        null
                        }
                    </div>
                </span>
                <div className="none margin-top-63">
                    <h2 className="left">Cover Card</h2>
                    {selectedCard ? (
                        <img
                            className="cover-card"
                            src={selectedCard}
                            alt={selectedCard.name}/>
                            ):(
                        <img
                            className="cover-card"
                            src={"https://i.imgur.com/krY25iI.png"}
                            alt="card"/>)}
                </div>
                <span className="media-flex-center margin-top-63">
                    <BuilderCardSearch/>
                </span>
            </div>
            <DeckImport
                fileInput={fileInput}
                importDeck={importDeck}
                importedDecks={importedDecks}
                showDecks={showDecks}
                handleFileChange={handleFileChange}
                handleShowDecks={handleShowDecks}
                clearDecks={clearDecks}
            />
            <CardPool
                all_cards={all_cards}
                noCards={noCards}
                noPulledCards={noPulledCards}
                combinedList={combinedList}
                isQueryEmpty={isQueryEmpty}
                usePool={usePool}
                showPool={showPool}
                showMore={showMore}
                handleClick={handleClick}
                handleUsePool={handleUsePool}
                handleShowPool={handleShowPool}
                handleShowMore={handleShowMore}
                main_list={main_list}
                pluck_list={pluck_list}
            />
            <StatsPanel
                main_list={main_list}
                pluck_list={pluck_list}
                handleRemoveCard={handleRemoveCard}
            />
            {listView?
                <div className="deck-list media-display">
                    <div className="maindeck3">
                        <ListViewListInput
                            title={"Main Deck"}
                            list={main_list}
                            handleRemoveCard={handleRemoveCard}
                        />
                    </div>

                    <div className="pluckdeck3 media-margin-top-10">
                        <ListViewListInput
                            title={"Pluck Deck"}
                            list={pluck_list}
                            main_list={main_list}
                            handleRemoveCard={handleRemoveCard}
                        />
                    </div>
                </div>
            :<>
                <div className="maindeck">
                    <ImageViewListInput
                        title={"Main Deck"}
                        list={main_list}
                        showList={showMain}
                        handleShowList={handleShowMain}
                        handleRemoveCard={handleRemoveCard}
                    />
                </div>
                <div className="pluckdeck">
                    <ImageViewListInput
                        title={"Pluck Deck"}
                        list={pluck_list}
                        main_list={main_list}
                        showList={showPluck}
                        handleShowList={handleShowPluck}
                        handleRemoveCard={handleRemoveCard}
                    />
                </div>
            </>}
        </div>
    );
}


export default DeckCopyPage;
