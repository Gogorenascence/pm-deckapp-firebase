import React, { useState, useEffect, useRef, useContext } from 'react'
import { GameStateContext } from "../Context/GameStateContext";
import { MainActionsContext } from "../Context/MainActionsContext";
import {
    menuSound,
    activateSound,
    flipSound
} from "../Sounds/Sounds";

function PlayAreaModal({
    playArea,
    handleHoveredCard,
    showPlayAreaModal,
    setShowPlayAreaModal,
}) {

    const content = useRef(null)
    useOutsideAlerter(content)

    const {
        faceDown,
        player,
        volume,
        addToLog
    } = useContext(GameStateContext)

    const {
        addCardFromPlay,
        discardCard,
        swapping,
        setSwapping,
        moving,
        setMoving,
    } = useContext(MainActionsContext)

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

    useEffect(() => {
      // Check if filteredCards is empty
        if (playArea[showPlayAreaModal.objectName]?.length === 0) {
            handleClose(); // Call handleClose when filteredCards is empty
        }
    }, [playArea[showPlayAreaModal.objectName]]);

    const handleShowCardMenu = (event, index) => {
        event.preventDefault()
        showCardMenu === index?
        setShowCardMenu(null):
            setShowCardMenu(index)
    }

    const handleClose = () => {
        setShowPlayAreaModal({name: "", objectName: ""})
        document.body.style.overflow = 'auto';
    };

    const zoneArray = playArea[showPlayAreaModal.objectName]

    const [showCardMenu, setShowCardMenu] = useState(null)

    return(
        <div>
            {zoneArray?
                <div className="sim-modal2 topbar"
                >
                    <div className={zoneArray.length < 5 ? "outScrollableSim" : "outScrollableSim2"} ref={content}>
                        <h1 className="centered-h1">{showPlayAreaModal.name}</h1>
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
                                                        addToLog("System", "system", `${player.name} is resolving "${zoneArray[index].name}"`, zoneArray[index])
                                                    }}
                                                ><p>Resolve</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {swapping.cardToSwap && swapping.zone === showPlayAreaModal.objectName?
                                                        setSwapping({cardToSwap: "", zone: "", index: null, zoneFaceDown: false}):
                                                        setSwapping({
                                                            cardToSwap: zoneArray[index],
                                                            zone: showPlayAreaModal.objectName,
                                                            index: index,
                                                            zoneFaceDown: faceDown[showPlayAreaModal.objectName]? true: false
                                                        })
                                                        handleClose()}
                                                    }
                                                ><p>Swap from Hand</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {moving.cardToMove && moving.zone === showPlayAreaModal.objectName?
                                                        setMoving({cardToMove: "", zone: "", index: null}):
                                                        setMoving({
                                                            cardToMove: zoneArray[index],
                                                            zone: showPlayAreaModal.objectName,
                                                            index: index,
                                                            zoneFaceDown: faceDown[showPlayAreaModal.objectName]? true: false
                                                        })
                                                        handleClose()}
                                                    }
                                                ><p>{moving.cardToMove && moving.zone === showPlayAreaModal.objectName?
                                                    "Cancel": "Move"}</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        addCardFromPlay(
                                                            zoneArray[index],
                                                            index,
                                                            showPlayAreaModal.objectName)
                                                        // handleClose()
                                                        setShowCardMenu(null)
                                                    }}
                                                ><p>Return to Hand</p></div>
                                                <div className="card-menu-item"
                                                    onClick={() => {
                                                        discardCard(
                                                            zoneArray[index],
                                                            index,
                                                            showPlayAreaModal.objectName)
                                                        setShowCardMenu(null)
                                                    }}
                                                ><p>Discard</p></div>
                                            </div>

                                            <img
                                                onContextMenu={(event) => handleShowCardMenu(event, index)}
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

export default PlayAreaModal
