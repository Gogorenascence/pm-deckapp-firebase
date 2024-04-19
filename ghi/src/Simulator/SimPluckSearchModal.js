import React, { useState, useEffect, useRef } from 'react'
import {
    menuSound,
} from "../Sounds/Sounds";


function SimPluckSearchModal({
    pluckDeck,
    handleHoveredCard,
    showPluckSearchModal,
    setShowPluckSearchModal,
    addPluckFromDeck,
    addPluckFromDiscard,
    returnDiscardedPluckToDeck,
    pluckDiscard,
    showPluckDiscardModal,
    setShowPluckDiscardModal,
    volume
}) {

    const content = useRef(null)
    useOutsideAlerter(content)
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
        if (pluckDeck.length === 0) {
            handleClose(); // Call handleClose when filteredCards is empty
        }
        if (pluckDiscard.length === 0) {
            handleCloseDiscard(); // Call handleClose when filteredCards is empty
        }
    }, [pluckDeck, pluckDiscard]);

    const handleClose = () => {
        setShowPluckSearchModal(false)
        setShowDeckMenu(null)
        document.body.style.overflow = 'auto';
    };

    const handleCloseDiscard = () => {
        setShowPluckDiscardModal(false)
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

    const handleAddPluck = (index, unfurling) => {
        addPluckFromDeck(index, unfurling)
        handleClose()
        setShowDeckMenu(null)
    }

    const handleAddPluckFromDiscard = (index) => {
        const originalIndex = pluckDiscard.length - 1 - index;
        addPluckFromDiscard(originalIndex)
        setShowDiscardMenu(null)
    }

    const handleReturnPluckFromDiscard = (index, position) => {
        const originalIndex = pluckDiscard.length - 1 - index;
        returnDiscardedPluckToDeck(originalIndex, position)
        setShowDiscardMenu(null)
    }

    return(
        <div>
            {showPluckDiscardModal ?
                <div className="sim-modal topbar"
                >
                    <div className={pluckDiscard.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">Discard Pile</h1>
                        <div>
                        <div className={pluckDiscard.length < 5 ? "card-pool-fill-hand" : "card-pool-fill"}>
                            {pluckDiscard.slice().reverse().map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showDiscardMenu === index ? "deck-menu3": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => handleAddPluckFromDiscard(index)}
                                                ><p>Add to Ownership</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleReturnPluckFromDiscard(index, "top")}
                                                ><p>Decktop</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleReturnPluckFromDiscard(index, "bottom")}
                                                ><p>Deckbottom</p></div>
                                            </div>
                                            <img
                                                onClick={() => handleShowDiscardMenu(index)}
                                                onMouseEnter={() => handleHoveredCard(card)}
                                                className={
                                                    showDiscardMenu === index?
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
                            <button className={pluckDiscard.length > 4 ? "margin-bottom-20" :null}
                                onClick={handleCloseDiscard}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
            {showPluckSearchModal ?
                <div className="sim-modal topbar"
                >
                    <div className={pluckDeck.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">Pluck Deck</h1>
                        <div>
                        <div className={pluckDeck.length < 5 ? "card-pool-fill-hand" : "card-pool-fill"}>
                            {pluckDeck.map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showDeckMenu === index ? "deck-menu2": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => handleAddPluck(index, false)}
                                                ><p>Add to Ownership</p></div>
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
                            <button className={pluckDeck.length > 4 ? "margin-bottom-20" :null} onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
        </div>
    )
}

export default SimPluckSearchModal
