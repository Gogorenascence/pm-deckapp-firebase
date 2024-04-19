import React, { useState, useEffect, useRef, useContext } from 'react'
import {
    menuSound,
    activateSound,
} from "../Sounds/Sounds";
import { GameStateContext } from '../Context/GameStateContext';


function SimDeckSearchModal({
    mainDeck,
    handleHoveredCard,
    showDeckSearchModal,
    setShowDeckSearchModal,
    selectCard,
    selectedIndex,
    fromDiscard,
    setFromDiscard,
    addCardFromDeck,
    addCardFromDiscard,
    returnDiscardedCardToDeck,
    mainDiscard,
    showDiscardModal,
    setShowDiscardModal,
    setFromDeck,
    volume
}) {

    const content = useRef(null)
    useOutsideAlerter(content)
    const {faceDown, player, addToLog} = useContext(GameStateContext)
    const [showDeckMenu, setShowDeckMenu] = useState(null)
    const [showDiscardMenu, setShowDiscardMenu] = useState(null)

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current &&
                    !ref.current.contains(event.target)&&
                    !event.target.closest(".card-menu-item")&&
                    !event.target.closest(".deck-menu-item")&&
                    !event.target.closest(".matCard")&&
                    !event.target.closest(".matCardSelected")
                ) {
                    handleClose();
                    handleCloseDiscard();
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }

    useEffect(() => {
      // Check if filteredCards is empty
        if (mainDeck.length === 0) {
            handleClose(); // Call handleClose when filteredCards is empty
        }
        if (mainDiscard.length === 0) {
            handleCloseDiscard(); // Call handleClose when filteredCards is empty
        }
    }, [mainDeck, mainDiscard]);

    const handleClose = () => {
        setShowDeckSearchModal(false)
        setShowDeckMenu(null)
        document.body.style.overflow = 'auto';
    };

    const handleCloseDiscard = () => {
        setShowDiscardModal(false)
        setShowDiscardMenu(null)
        document.body.style.overflow = 'auto';
    };

    const handleShowDeckMenu = (index) => {
        showDeckMenu === index ?
            setShowDeckMenu(null) :
            setShowDeckMenu(index)
        menuSound(volume)
    }

    const handleShowDiscardMenu = (index) => {
        showDiscardMenu === index ?
            setShowDiscardMenu(null) :
            setShowDiscardMenu(index)
        menuSound(volume)
    }

    const handleAddCard = (index, unfurling) => {
        addCardFromDeck(index, unfurling)
        handleClose()
        setShowDeckMenu(null)
    }

    const handleAddCardFromDiscard = (index) => {
        const originalIndex = mainDiscard.length - 1 - index;
        addCardFromDiscard(originalIndex)
        setShowDiscardMenu(null)
    }

    const handleCardFromDiscard = (index) => {
        const originalIndex = mainDiscard.length - 1 - index;
        setFromDiscard(true)
        setFromDeck(false)
        selectCard(originalIndex)
        setShowDeckMenu(null)
        handleCloseDiscard()
    }

    const handleReturnCardFromDiscard = (index, position) => {
        const originalIndex = mainDiscard.length - 1 - index;
        returnDiscardedCardToDeck(originalIndex, position)
        setShowDiscardMenu(null)
    }

    return(
        <div>
            {showDiscardModal ?
                <div className="sim-modal topbar"
                >
                    <div className={mainDiscard.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">Discard Pile</h1>
                        <div>
                        <div className={mainDiscard.length < 5 ? "card-pool-fill-hand" : "card-pool-fill"}>
                            {mainDiscard.slice().reverse().map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showDiscardMenu === index ? "deck-menu5Items": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        activateSound(volume)
                                                        addToLog(
                                                            "System",
                                                            "system",
                                                            `${player.name} is resolving "${mainDiscard[index].name}" from the Discard pile`,
                                                            mainDiscard[index]
                                                        )
                                                    }}
                                                ><p>Resolve</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleAddCardFromDiscard(index)}
                                                ><p>Add to Hand</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleCardFromDiscard(index)}
                                                ><p>{selectedIndex === mainDiscard.length - 1 - index? "Cancel" : "Add to Play"}</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleReturnCardFromDiscard(index, "top")}
                                                ><p>Decktop</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleReturnCardFromDiscard(index, "bottom")}
                                                ><p>Deckbottom</p></div>
                                            </div>
                                            <img
                                                onClick={() => handleShowDiscardMenu(index)}
                                                onDoubleClick={() => handleCardFromDiscard(index)}
                                                onMouseEnter={() => handleHoveredCard(card)}
                                                className={
                                                    showDiscardMenu === index ||
                                                    (selectedIndex === (mainDiscard.length - 1 - index) && fromDiscard)?
                                                    "selected3 builder-card margin-10 pointer glow3"
                                                :
                                                    "builder-card margin-10 pointer"
                                                }
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}/>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        </div>
                        <div className="cd-inner margin-top-20">
                            <button className={mainDiscard.length > 4 ? "margin-bottom-20" :null}
                                onClick={handleCloseDiscard}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
            {showDeckSearchModal ?
                <div className="sim-modal topbar"
                >
                    <div className={mainDeck.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">Main Deck</h1>
                        <div>
                        <div className={mainDeck.length < 5 ? "card-pool-fill-hand" : "card-pool-fill"}>
                            {mainDeck.map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showDeckMenu === index ? "deck-menu2": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => handleAddCard(index, false)}
                                                ><p>Add to Hand</p></div>
                                            </div>
                                            <img
                                                onClick={() => handleShowDeckMenu(index)}
                                                onMouseEnter={() => handleHoveredCard(card)}
                                                className={
                                                    showDeckMenu === index?
                                                    "selected3 builder-card margin-10 pointer glow3"
                                                :
                                                    "builder-card margin-10 pointer"
                                                }
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}/>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        </div>
                        <div className="cd-inner margin-top-20">
                            <button className={mainDeck.length > 4 ? "margin-bottom-20" :null} onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
        </div>
    )
}

export default SimDeckSearchModal
