import React, { useState, useEffect, useRef, useContext } from 'react'
import { GameStateContext } from "../Context/GameStateContext";
import { PluckActionsContext } from '../Context/PluckActionsContext';
import {
    menuSound,
    activateSound,
    flipSound
} from "../Sounds/Sounds";


function ActivePluckModal({
    activePluck,
    handleHoveredCard,
    showActivePluckModal,
    setShowActivePluckModal,
    setShowOwnershipModal
}) {

    const content = useRef(null)
    useOutsideAlerter(content)

    const {
        player,
        volume,
        addToLog
    } = useContext(GameStateContext)

    const {
        addPluckFromActivePluck,
        discardPluck,
        swapping,
        setSwapping,
        movingPluck,
        setMovingPluck,
    } = useContext(PluckActionsContext)

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current &&
                    !ref.current.contains(event.target)&&
                    !event.target.closest(".matCardOverlay")
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
        if (activePluck[showActivePluckModal.objectName]?.length === 0) {
            handleClose(); // Call handleClose when filteredCards is empty
        }
    }, [activePluck[showActivePluckModal.objectName]]);

    const handleShowCardMenu = (index) => {
        showCardMenu === index?
        setShowCardMenu(null):
            setShowCardMenu(index)
    }

    const handleClose = () => {
        setShowActivePluckModal({name: "", objectName: ""})
        document.body.style.overflow = 'auto';
    };

    const zoneArray = activePluck[showActivePluckModal.objectName]

    const [showCardMenu, setShowCardMenu] = useState(null)

    return(
        <div>
            {zoneArray?
                <div className="sim-modal2 topbar"
                >
                    <div className={zoneArray.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">{showActivePluckModal.name}</h1>
                        <div>
                        <div className={zoneArray.length < 5 ? "card-pool-fill-hand" : "card-pool-fill"}>
                            {zoneArray.map((card, index) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <div>
                                            <div className={showCardMenu === index ? "deck-menu5Items": "hidden2"}>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        activateSound(volume)
                                                        addToLog(
                                                            "System",
                                                            "system",
                                                            `${player.name} is resolving "${zoneArray[index].name}"`,
                                                            zoneArray[index]
                                                        )
                                                    }}
                                                ><p>Resolve</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {swapping.cardToSwap && swapping.zone === showActivePluckModal.objectName?
                                                        setSwapping({cardToSwap: "", zone: "", index: null, zoneFaceDown: false}):
                                                        setSwapping({
                                                            cardToSwap: zoneArray[index],
                                                            zone: showActivePluckModal.objectName,
                                                            index: index,
                                                        })
                                                        handleClose()
                                                        setShowOwnershipModal(swapping.cardToSwap? false: true)}
                                                    }
                                                ><p>Swap from Ownership</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {movingPluck.pluckToMove && movingPluck.zone === showActivePluckModal.objectName?
                                                        setMovingPluck({pluckToMove: "", zone: "", index: null}):
                                                        setMovingPluck({
                                                            pluckToMove: zoneArray[index],
                                                            zone: showActivePluckModal.objectName,
                                                            index: index,
                                                        })
                                                        handleClose()}
                                                    }
                                                ><p>{movingPluck.pluckToMove && movingPluck.zone === showActivePluckModal.objectName?
                                                    "Cancel": "Move"}</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        addPluckFromActivePluck(
                                                            zoneArray[index],
                                                            index,
                                                            showActivePluckModal.objectName)
                                                        // handleClose()
                                                        setShowCardMenu(null)
                                                    }}
                                                ><p>Return to Ownership</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        discardPluck(
                                                            zoneArray[index],
                                                            index,
                                                            showActivePluckModal.objectName)
                                                        setShowCardMenu(null)
                                                    }}
                                                ><p>Discard</p></div>
                                            </div>

                                            <img
                                                onClick={() => handleShowCardMenu(index)}
                                                onMouseEnter={() => handleHoveredCard(card)}
                                                // onDoubleClick={() => handlePluck(index)}
                                                className={
                                                    showCardMenu === index?
                                                    "selected3 builder-card margin-10 pointer glow3":"builder-card margin-10 pointer glow3"
                                                // :
                                                    // "builder-card margin-10 pointer glow3"
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
                            <button
                                className={zoneArray.length > 4 ? "margin-bottom-20" :null}
                                onClick={handleClose}
                                >Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
        </div>
    )
}

export default ActivePluckModal
