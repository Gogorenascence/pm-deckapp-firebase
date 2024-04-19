import { useEffect, useContext } from "react";
import { GameStateContext } from "../Context/GameStateContext";
import { SimulatorActionsContext } from "../Context/SimulatorActionsContext";
import { MainActionsContext } from "../Context/MainActionsContext";
import { PluckActionsContext } from "../Context/PluckActionsContext";
import { AuthContext } from "../Context/AuthContext";
import GameBoard from "./GameBoard";
import PositionSlider from "./PositionSlider";
import CardInfoPanel from "./CardInfoPanel";
import LogChatPanel from "./LogChatPanel";


function SimulatorPage() {
    document.body.classList.add("dark")
    const {
        game,
        player,
        setPlayer,
        playerMainDeck,
        playerPluckDeck,
        playArea,
        activePluck,
        handleChangeTransformRotateX,
        handleChangeScale,
        handleChangePosition,
        fieldStyle,
        showExtra,
        setShowExtra,
        volume,
        playingFaceDown,
        setPlayingFaceDown
    } = useContext(GameStateContext)

    const {
        decks,
        cards,
        setDecks,
        setCards,
        hand,
        ownership,
        discard,
        pluckDiscard,
        hoveredCard,
        selectedIndex,
        selectedPluckIndex,
        prompt,
        setPrompt,
        fromDeck,
        setFromDeck,
        fromDiscard,
        setFromDiscard,
        showCardMenu,
        showPluckMenu,
        setShowPluckMenu,
        loading,
        setLoading,
        cardsLoading,
        setCardsLoading,
        shuffling,
        shufflingPluck,
        handleChangeDeck,
        fillDecks,
        gameStart,
        checkPlayer,
        resetPlayer,
        handleHoveredCard
    } = useContext(SimulatorActionsContext)

    const {
        shuffleMainDeck,
        drawCard,
        addCardFromDeck,
        addCardFromDiscard,
        swapCardInPlay,
        swapping,
        discardFromDeck,
        handleShowCardMenu,
        selectCard,
        handleCardFromHand,
        handlePlaceCardFromHand,
        playCard,
        discardCard,
        discardCardFromHand,
        topDeckCard,
        bottomDeckCard,
        returnDiscardedCardToDeck
    } = useContext(MainActionsContext)

    const {
        shufflePluckDeck,
        drawPluck,
        addPluckFromDeck,
        addPluckFromDiscard,
        discardFromPluckDeck,
        selectPluck,
        playPluck,
        discardPluck,
        discardPluckFromOwnership,
        returnPluckToDeck,
        returnDiscardedPluckToDeck
    } = useContext(PluckActionsContext)

    const {account} = useContext(AuthContext)

    const getDecks = async() =>{
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/decks/`);
        const data = await response.json();
        setDecks(data.decks.sort((a,b) => a.name.localeCompare(b.name)));
        setLoading(false)
    };

    const getCards = async() =>{
        setCardsLoading(true)
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/full_cards/`);
        const cardData = await response.json();
        setCards(cardData.cards);
        setCardsLoading(false)
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCards();
        getDecks();
        document.title = "Simulator - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    useEffect(() => {
        if (selectedIndex === null && selectedPluckIndex === null) {
            setPrompt({message: "", action: ""})
        }
    }, [showCardMenu, showPluckMenu])

    useEffect(() => {
        setPlayer((prevPlayer) => ({
            ...prevPlayer,
            name: account.username ? account.username :"WindFall",
            mainDeck: playerMainDeck.cards,
            pluckDeck: playerPluckDeck.cards,
            hand: hand,
            ownership: ownership,
            playArea: playArea,
            activePluck: activePluck,
            mainDiscard: discard,
            pluckDiscard: pluckDiscard
        }));
    }, [playerMainDeck, playerPluckDeck, hand, ownership, playArea, activePluck, discard, pluckDiscard]);

    return (
        <div className="flex-content simulator">
            <CardInfoPanel hoveredCard={hoveredCard}/>
            <div className={prompt.message? "promptBar pointer": "noPromptBar"}
                onClick={() => setPrompt({message: "", action: ""})}
            >
                <h1 className={prompt.message? null: "hidden2"}>{prompt.message}</h1>
            </div>
            <div className="cd-inner">
                <div className="deckSelect">
                    <h5 className="label">Select a Deck </h5>
                    <select
                        className="builder-input"
                        type="text"
                        placeholder=" Deck"
                        onChange={handleChangeDeck}
                        name="Deck">
                        <option value="">Deck</option>
                        {decks.map((deck) => (
                            <option value={deck.id} key={deck.id + deck.name}>{deck.name}</option>
                            ))}
                    </select>
                    <button className="front-button" onClick={fillDecks}>Get Deck</button>

                    {player.mainDeck.length > 0 ?
                        <>
                            <button className="middle-button" onClick={!game? gameStart: resetPlayer}>{!game? "Game Start": "Reset Player"}</button>
                        </>:null
                    }

                    <button className="end-button" onClick={checkPlayer}>Player Info</button>
                </div>
                <div className="deckSelect3">
                    {cardsLoading && cards.length < 1? <p>Loading cards...</p>:null}
                    {loading && decks.length < 1? <p>Loading decks...</p>:null}
                </div>
                <div>
                    <GameBoard
                        playArea={player.playArea}
                        activePluck={player.activePluck}
                        drawCard={drawCard}
                        addCardFromDeck={addCardFromDeck}
                        addCardFromDiscard={addCardFromDiscard}
                        drawPluck={drawPluck}
                        addPluckFromDeck={addPluckFromDeck}
                        addPluckFromDiscard={addPluckFromDiscard}
                        returnPluckToDeck={returnPluckToDeck}
                        mainDeck={player.mainDeck}
                        pluckDeck={player.pluckDeck}
                        ownership={player.ownership}
                        showPluckMenu={showPluckMenu}
                        setShowPluckMenu={setShowPluckMenu}
                        fromDeck={fromDeck}
                        setFromDeck={setFromDeck}
                        fromDiscard={fromDiscard}
                        setFromDiscard={setFromDiscard}
                        playCard={playCard}
                        playPluck={playPluck}
                        fieldStyle={fieldStyle}
                        mainDiscard={player.mainDiscard}
                        discardCard={discardCard}
                        discardFromDeck={discardFromDeck}
                        returnDiscardedCardToDeck={returnDiscardedCardToDeck}
                        pluckDiscard={player.pluckDiscard}
                        discardPluck={discardPluck}
                        discardPluckFromOwnership={discardPluckFromOwnership}
                        discardFromPluckDeck={discardFromPluckDeck}
                        returnDiscardedPluckToDeck={returnDiscardedPluckToDeck}
                        handleHoveredCard={handleHoveredCard}
                        selectCard={selectCard}
                        selectedIndex={selectedIndex}
                        selectPluck={selectPluck}
                        selectedPluckIndex={selectedPluckIndex}
                        shuffleMainDeck={shuffleMainDeck}
                        shufflePluckDeck={shufflePluckDeck}
                        showExtra={showExtra}
                        setShowExtra={setShowExtra}
                        volume={volume}
                        shuffling={shuffling}
                        shufflingPluck={shufflingPluck}
                        />

                    {player.hand.length > 0 || player.ownership.length > 0?
                        <>
                            <div className="card-pool-fill-hand">
                                {player.hand.map((card, index) => {
                                    return (
                                        <div className="in-hand" style={{display: "flex", justifyContent: "center"}}>
                                            <div>
                                                <div className={showCardMenu === index? "card-menu": "hidden2"}>
                                                    <div className="card-menu-item"
                                                        onClick={() => {
                                                            setPlayingFaceDown(false)
                                                            handleCardFromHand(index)
                                                        }}
                                                    ><p>{selectedIndex === index && !playingFaceDown? "Cancel" : "Play Face-Up"}</p></div>
                                                    <div className="card-menu-item"
                                                        onClick={() => {
                                                            setPlayingFaceDown(true)
                                                            handleCardFromHand(index)
                                                        }}
                                                    ><p>{selectedIndex === index && playingFaceDown? "Cancel" : "Play Face-Down"}</p></div>
                                                    <div className="card-menu-item"
                                                        onClick={() => handlePlaceCardFromHand(index)}
                                                    ><p>Place</p></div>
                                                    <div className="card-menu-item"
                                                        onClick={() => discardCardFromHand(index)}
                                                    ><p>Discard</p></div>
                                                    <div className="card-menu-item"
                                                        onClick={() => topDeckCard(index)}
                                                    ><p>Decktop</p></div>
                                                    <div className="card-menu-item"
                                                        onClick={() => bottomDeckCard(index)}
                                                    ><p>Deckbottom</p></div>
                                                </div>
                                                <img
                                                    onClick={(event) => {!swapping.cardToSwap? handleShowCardMenu(index, event):swapCardInPlay(index)}}
                                                    onContextMenu={(event) => handleShowCardMenu(index, event)}
                                                    onMouseEnter={() => handleHoveredCard(card)}
                                                    onDoubleClick={() => {
                                                        setPlayingFaceDown(false)
                                                        handleCardFromHand(index)
                                                    }}
                                                    className={
                                                        showCardMenu === index || selectedIndex === index && !fromDeck && !fromDiscard?
                                                        "selected3 builder-card-hand pointer"
                                                    :
                                                        "builder-card-hand pointer"
                                                    }
                                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                    alt={card.name}/>
                                                </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>: null
                    }
                </div>
            </div>
            <div className="rightSimSide">
                <PositionSlider
                    handleChangePosition={handleChangePosition}
                    handleChangeScale={handleChangeScale}
                    handleChangeTransformRotateX={handleChangeTransformRotateX}
                    volume={volume}
                />
                <LogChatPanel/>
            </div>
        </div>
    );
}

export default SimulatorPage;
