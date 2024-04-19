import React, { useEffect, useRef, useState } from 'react'
import {
    menuSound,
    gainSound
} from "../Sounds/Sounds";


function UnfurlPluckModal({
    pluckDeck,
    handleHoveredCard,
    showUnfurlPluckModal,
    setShowUnfurlPluckModal,
    unfurlPluckCount,
    setUnfurlPluckCount,
    addPluckFromDeck,
    discardFromPluckDeck,
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
                    setUnfurlPluckCount(1);
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }

    useEffect(() => {
      // Check if filteredCards is empty
        if (pluckDeck.length === 0 || unfurlPluckCount === 0) {
            handleClose(); // Call handleClose when filteredCards is empty
        }
    }, [pluckDeck, unfurlPluckCount]);

    const handleUnfurl = () => {
        setUnfurlPluckCount(unfurlPluckCount + 1)
        gainSound(volume)
        document.body.style.overflow = 'hidden';
    };

    const handleClose = () => {
        setShowUnfurlPluckModal(false)
        setShowDeckMenu(null)
        document.body.style.overflow = 'auto';
    };

    const handleShowDeckMenu = (index) => {
        showDeckMenu === index ?
            setShowDeckMenu(null) :
            setShowDeckMenu(index)
        menuSound(volume)
    }

    const handleAddPluck = (index, unfurling) => {
        addPluckFromDeck(index, unfurling)
        setUnfurlPluckCount(unfurlPluckCount - 1)
        setShowDeckMenu(null)
    }

    const handleDiscardPluck = (index) => {
        discardFromPluckDeck(index)
        setUnfurlPluckCount(unfurlPluckCount - 1)
        setShowDeckMenu(null)
    }

    return(
        <div>
            {showUnfurlPluckModal ?
                <div className="sim-modal topbar"
                >
                    <div className="outScrollableSim" ref={content}>
                        <h1 className="centered-h1">Unfurled Pluck</h1>
                        <div>
                        <div className="card-pool-fill-hand">
                            {pluckDeck.slice(0, unfurlPluckCount).map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showDeckMenu === index ? "deck-menu2Items": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => handleAddPluck(index, true)}
                                                ><p>Add to Ownership</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => handleDiscardPluck(index)}
                                                ><p>Discard</p></div>
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
                            <button className="margin-bottom-20 front-button" onClick={handleUnfurl}>
                                Unfurl
                            </button>
                            <button className="margin-bottom-20 middle-button" onClick={() =>(setUnfurlPluckCount(1))}>
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

export default UnfurlPluckModal
