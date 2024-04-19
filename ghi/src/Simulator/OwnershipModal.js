import React, { useState, useEffect, useRef, useContext } from 'react'
import { PluckActionsContext } from '../Context/PluckActionsContext';

function OwnershipModal({
    ownership,
    selectPluck,
    handleHoveredCard,
    selectedPluckIndex,
    showOwnershipModal,
    setShowOwnershipModal,
    discardPluckFromOwnership,
    returnPluckToDeck,
    showPluckMenu,
    setShowPluckMenu
}) {

    const full_ownership = ownership || [];

    const content = useRef(null)
    useOutsideAlerter(content)
    const {swapping, swapPluckInOwnership} = useContext(PluckActionsContext)

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current &&
                    !ref.current.contains(event.target)&&
                    !event.target.closest(".matCardOverlay")&&
                    !event.target.closest(".card-menu-item")
                    // !event.target.closest(".cd-related-modal-card")
                ) {
                    handleClose();
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }


    // useEffect(() => {

    // }, [showModal, main_list, pluck_list]); // Include showModal and card_list as dependencies

    useEffect(() => {
      // Check if filteredCards is empty
        if (ownership.length === 0) {
            handleClose(); // Call handleClose when filteredCards is empty
        }
    }, [ownership]);

    const handleShowCardMenu = (index) => {
        showPluckMenu === index?
        setShowPluckMenu(null):
            setShowPluckMenu(index)
    }

    const handleClose = () => {
        setShowOwnershipModal(false)
        setShowPluckMenu(null)
        document.body.style.overflow = 'auto';
    };

    const handlePluck = (index) => {
        selectPluck(index)
        handleClose()
    }

    return(
        <div>
            {showOwnershipModal ?
                <div className="sim-modal2 topbar"
                >
                    <div className={full_ownership.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">Ownership</h1>
                        <div>
                        <div className={full_ownership.length < 5 ? "card-pool-fill-hand" : "card-pool-fill"}>
                            {full_ownership.map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showPluckMenu === index ? "deck-menu5Items": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => handlePluck(index)}
                                                ><p>{selectedPluckIndex === index? "Cancel" : "Play"}</p></div>
                                                <div className="card-menu-item"><p>Place</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        discardPluckFromOwnership(index)
                                                        handleShowCardMenu(index)
                                                    }}
                                                ><p>Discard</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => returnPluckToDeck(index, "top")}
                                                ><p>Decktop</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => returnPluckToDeck(index, "bottom")}
                                                ><p>Deckbottom</p></div>
                                            </div>
                                            <img
                                                onClick={() => {!swapping.cardToSwap?
                                                                        handleShowCardMenu(index):
                                                                        swapPluckInOwnership(index)}}
                                                onMouseEnter={() => handleHoveredCard(card)}
                                                onDoubleClick={() => handlePluck(index)}
                                                className={
                                                    showPluckMenu === index || selectedPluckIndex === index?
                                                    "selected3 builder-card margin-10 pointer glow3"
                                                :
                                                    "builder-card margin-10 pointer glow3"
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
                            <button className={full_ownership.length > 4 ? "margin-bottom-20" :null} onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
        </div>
    )
}

export default OwnershipModal
