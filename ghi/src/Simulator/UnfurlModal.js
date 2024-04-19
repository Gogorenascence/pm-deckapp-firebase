import React, { useEffect, useRef, useState } from 'react'
import {
    menuSound,
    drawSound
} from "../Sounds/Sounds";


function UnfurlModal({
    mainDeck,
    handleHoveredCard,
    showUnfurlModal,
    setShowUnfurlModal,
    unfurlCount,
    setUnfurlCount,
    addCardFromDeck,
    selectCard,
    selectedIndex,
    fromDeck,
    setFromDeck,
    discardFromDeck,
    setFromDiscard,
    volume
}) {

    const content = useRef(null)
    useOutsideAlerter(content)

    const [showDeckMenu, setShowDeckMenu] = useState(null)

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current &&
                    !ref.current.contains(event.target)&&
                    !event.target.closest(".card-menu-item")&&
                    !event.target.closest(".deck-menu-item")
                ) {
                    handleClose();
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }

    useEffect(() => {
      // Check if filteredCards is empty
        if (mainDeck.length === 0 || unfurlCount === 0) {
            handleClose();
        }
    }, [mainDeck, unfurlCount]);

    const handleUnfurl = () => {
        setUnfurlCount(unfurlCount + 1)
        drawSound(volume)
        document.body.style.overflow = 'hidden';
    };

    const handleClose = () => {
        setShowUnfurlModal(false)
        setShowDeckMenu(null)
        document.body.style.overflow = 'auto';
    };

    const handleShowDeckMenu = (index) => {
        showDeckMenu === index ?
            setShowDeckMenu(null) :
            setShowDeckMenu(index)
        menuSound(volume)
    }

    const handleAddCard = (index, unfurling) => {
        addCardFromDeck(index, unfurling)
        setUnfurlCount(unfurlCount - 1)
        setShowDeckMenu(null)
    }

    const handleCardFromDeck = (index) => {
        setFromDeck(true)
        setFromDiscard(false)
        selectCard(index)
        setShowDeckMenu(null)
        handleClose()
        setUnfurlCount(unfurlCount - 1)
    }

    const handleDiscardCard = (index) => {
        discardFromDeck(index)
        setUnfurlCount(unfurlCount - 1)
        setShowDeckMenu(null)
    }

    return(
        <div>
            {showUnfurlModal ?
                <div className="sim-modal topbar"
                >
                    <div className="outScrollableSim" ref={content}>
                        <h1 className="centered-h1">Unfurled Cards</h1>
                        <div>
                        <div className="card-pool-fill-hand">
                            {mainDeck.slice(0, unfurlCount).map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showDeckMenu === index ? "deck-menu3": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => handleAddCard(index, true)}
                                                ><p>Add to Hand</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleCardFromDeck(index)}
                                                ><p>{selectedIndex === index? "Cancel" : "Add to Play"}</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleDiscardCard(index)}
                                                ><p>Discard</p></div>
                                            </div>
                                            <img
                                                onClick={() => handleShowDeckMenu(index)}
                                                onDoubleClick={() => handleCardFromDeck(index)}
                                                onMouseEnter={() => handleHoveredCard(card)}
                                                className={
                                                    showDeckMenu === index || (selectedIndex === index && fromDeck)?
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
                            <button className="margin-bottom-20 front-button" onClick={handleUnfurl}>
                                Unfurl
                            </button>
                            <button className="margin-bottom-20 middle-button" onClick={() =>(setUnfurlCount(1))}>
                                Clear
                            </button>
                            <button className="margin-bottom-20 end-button" onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
        </div>
    )
}

export default UnfurlModal
