import React, {useContext, useState} from "react";
import {
    menuSound,
    activateSound,
    flipSound
} from "../Sounds/Sounds";
import { GameStateContext } from "../Context/GameStateContext";
import { MainActionsContext } from "../Context/MainActionsContext";
import {PluckActionsContext} from "../Context/PluckActionsContext";


function PlayAreaZone({
objectName,
stringName,
zoneArray,
selectedIndex,
playingFaceDown,
playCard,
setShowPlayAreaModal,
handleHoveredCard,
setFaceDown,
faceDown,
discardCard
}){

    const {
        player,
        volume,
        addToLog,
        activating,
        handleActivating,
        defendingCard,
    } = useContext(GameStateContext)

    const {
        addCardFromPlay,
        swapping,
        setSwapping,
        moving,
        setMoving,
        moveCard
    } = useContext(MainActionsContext)

    const {movePluck, movingPluck} = useContext(PluckActionsContext)

    const [showPlayAreaMenu, setShowPlayAreaMenu] = useState({
        fighter_slot: false,
        aura_slot: false,
        move_slot: false,
        ending_slot: false
    })

    const handleMenu = (event) => {
        event.preventDefault()
        setShowPlayAreaMenu({
            ...showPlayAreaMenu,
            [objectName]: !showPlayAreaMenu[objectName]
        })
        menuSound(volume)
    }

    const handleMenuClose = () => {
        setShowPlayAreaMenu({
            ...showPlayAreaMenu,
            [objectName]: false
        })
    }

    return(
        <div>
            <div className={showPlayAreaMenu[objectName] && zoneArray.length > 0? "zone-menu": "hidden2"}>
                <div className="card-menu-item"
                    onClick={() => {
                        activateSound(volume)
                        handleActivating(objectName)
                        setFaceDown({...faceDown, [objectName]: false})
                        addToLog("System", "system", `${player.name} is resolving "${zoneArray[0].name}"`, zoneArray[0])
                    }}
                ><p>Resolve</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        if (faceDown[objectName] === true){
                            addToLog("System", "system", `${player.name} revealed "${zoneArray[0].name}"`, zoneArray[0])
                        }
                        setFaceDown({...faceDown, [objectName]: !faceDown[objectName]})
                        flipSound(volume)
                        }
                    }
                ><p>Flip</p></div>
                <div className="card-menu-item"
                    onClick={() => {swapping.cardToSwap && swapping.zone === objectName?
                        setSwapping({cardToSwap: "", zone: "", index: null, zoneFaceDown: false}):
                        setSwapping({
                            cardToSwap: zoneArray[0],
                            zone: objectName,
                            index: 0,
                            zoneFaceDown: faceDown[objectName]? true: false
                        })}
                    }
                ><p>{swapping.cardToSwap && swapping.zone === objectName? "Cancel": "Swap from Hand"}</p></div>
                <div className="card-menu-item"
                    onClick={() => {moving.cardToMove && moving.zone === objectName?
                        setMoving({cardToMove: "", zone: "", index: null}):
                        setMoving({
                            cardToMove: zoneArray[0],
                            zone: objectName,
                            index: 0,
                            zoneFaceDown: faceDown[objectName]? true: false
                        })}
                    }
                ><p>{moving.cardToMove && moving.zone === objectName? "Cancel": "Move"}</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        addCardFromPlay(zoneArray[0], 0, objectName)
                        handleMenuClose()
                    }}
                ><p>Return to Hand</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        discardCard(zoneArray[0], 0, objectName)
                        handleMenuClose()
                    }}
                ><p>Discard</p></div>
            </div>
            <div className={activating[objectName]? "maskContainer": "hidden2"}>
                <img
                    className="mask"
                    src="mask0.png"/>
            </div>
            <div className={selectedIndex === null? "matCard" : "matCardSelect"}
                onClick={() => {
                        if (!moving.cardToMove && !movingPluck.pluckToMove) {
                            if (!playingFaceDown && selectedIndex !== null) {
                                playCard(objectName)
                                setFaceDown({...faceDown, [objectName]: false})
                            } else {
                                playCard(objectName, objectName)
                            }
                        } else if (moving.cardToMove && moving.zone !== objectName) {
                            moveCard(objectName)
                        } else if (movingPluck.pluckToMove && movingPluck.zone !== objectName) {
                            movePluck(objectName, true)
                        }
                    }
                }
            >
                {zoneArray.length > 0 ?
                    <>
                        {zoneArray.length > 1 ?
                            <div className="matCardOverlay"
                                onClick={() => {
                                    if (selectedIndex === null && !moving.cardToMove && !movingPluck.pluckToMove) {
                                        setShowPlayAreaModal({
                                            name: stringName,
                                            objectName: objectName
                                        })
                                    }
                                }}
                                onMouseEnter={() => handleHoveredCard(zoneArray[0])}
                            >
                                <h1 className="fontSize60">{zoneArray.length}</h1>
                            </div> :null
                        }
                        <img
                            onDoubleClick={() => {
                                discardCard(zoneArray[0], 0, objectName)
                                setFaceDown({...faceDown, [objectName]: false})
                                handleMenuClose()
                            }}
                            onContextMenu={(event) => handleMenu(event)}
                            onClick={() => {
                                setFaceDown({...faceDown, [objectName]: !faceDown[objectName]})
                                flipSound(volume)
                                handleMenuClose()
                            }}
                            onMouseEnter={() => handleHoveredCard(zoneArray[0])}
                            className={swapping.zone === objectName || moving.zone === objectName?
                                "selected3 builder-card5 pointer glow3":
                                "builder-card5 pointer glow3"}
                            src={!faceDown[objectName]?
                                    (zoneArray[0].picture_url?
                                        zoneArray[0].picture_url :
                                        "https://i.imgur.com/krY25iI.png"
                                    ):
                                    zoneArray.length > 1?
                                        zoneArray[0].picture_url:
                                        "https://i.imgur.com/krY25iI.png"
                                }
                            alt={zoneArray[0].name}
                            title={
                                defendingCard.slot === objectName?
                                    `HP: ${defendingCard.hp}`+
                                    `${defendingCard.block?`\nBlock: ${defendingCard.block}`:""}`+
                                    `${defendingCard.block?`\nCounter: ${defendingCard.counter}`:""}`+
                                    `${defendingCard.endure?`\nEndure: ${defendingCard.endure}`:""}`+
                                    `${defendingCard.redirect?`\nRedirect: ${defendingCard.redirect}`:""}`
                                :
                                    ""
                            }
                        />
                    </>
                :null}
            </div>
        </div>
    )
}


function ActivePluckZone({
    objectName,
    stringName,
    zoneArray,
    selectedPluckIndex,
    playPluck,
    discardPluck,
    handleHoveredCard,
    showOwnershipModal,
    setShowActivePluckModal,
    setShowOwnershipModal
}){

    const {
        player,
        volume,
        addToLog,
        activating,
        handleActivating,
        defendingCard,
    } = useContext(GameStateContext)

    const {
        addPluckFromActivePluck,
        swapping,
        setSwapping,
        movingPluck,
        setMovingPluck,
        movePluck
    } = useContext(PluckActionsContext)

    const {moveCard, moving} = useContext(MainActionsContext)

    const [showActivePluckMenu, setShowActivePluckMenu] = useState({
        slot_1: false,
        slot_2: false,
        slot_3: false,
        slot_4: false
    })

    const handleMenu = (event) => {
        event.preventDefault()
        setShowActivePluckMenu({
            ...showActivePluckMenu,
            [objectName]: !showActivePluckMenu[objectName]
        })
        menuSound(volume)
    }

    const handleMenuClose = () => {
        setShowActivePluckMenu({
            ...showActivePluckMenu,
            [objectName]: false
        })
    }

    // const handleOpenOwnership = (event) => {
    //     event.preventDefault()
    //     setShowOwnershipModal(true)
    //     menuSound(volume)
    //     document.body.style.overflow = 'hidden';
    // };

    return(
        <div>
            <div className={showActivePluckMenu[objectName] && zoneArray.length === 1 ? "zone-menu2": "hidden2"}>
                <div className="card-menu-item"
                    onClick={() => {
                        handleActivating(objectName)
                        activateSound(volume)
                        console.log(zoneArray[0].card_type)
                        addToLog("System", "system", `${player.name} is resolving "${zoneArray[0].name}"`, zoneArray[0])
                    }}
                ><p>Resolve</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        swapping.cardToSwap && swapping.zone === objectName?
                        setSwapping({cardToSwap: "", zone: "", index: null}):
                        setSwapping({
                            cardToSwap: zoneArray[0],
                            zone: objectName,
                            index: 0
                        })
                        setShowOwnershipModal(swapping.cardToSwap? false: true)}
                    }
                ><p>{swapping.cardToSwap && swapping.zone === objectName? "Cancel": "Swap from Ownership"}</p></div>
                <div className="card-menu-item"
                    onClick={() => {movingPluck.pluckToMove && movingPluck.zone === objectName?
                        setMovingPluck({pluckToMove: "", zone: "", index: null}):
                        setMovingPluck({
                            pluckToMove: zoneArray[0],
                            zone: objectName,
                            index: 0,
                        })}
                    }
                ><p>
                    {movingPluck.pluckToMove && movingPluck.zone === objectName? "Cancel": "Move"}
                    </p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        addPluckFromActivePluck(zoneArray[0], 0, objectName)
                        handleMenuClose()
                    }}
                ><p>Return to Ownership</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        discardPluck(zoneArray[0], 0, objectName)
                        handleMenuClose()
                    }}
                ><p>Discard</p></div>
            </div>
            <div className={activating[objectName]? "maskContainer": "hidden2"}>
                <img
                    className="mask"
                    src="mask0.png"/>
            </div>
            <div className={selectedPluckIndex === null? "matCard":"matCardSelect"}
                onClick={() => {
                        if (!movingPluck.pluckToMove && !moving.cardToMove) {
                            playPluck(objectName)
                        } else if (movingPluck.pluckToMove && movingPluck.zone !== objectName) {
                            movePluck(objectName)
                        } else if (moving.cardToMove && moving.zone !== objectName) {
                            moveCard(objectName, true)
                        }
                    }
                }
            >
                {zoneArray.length > 0 ?
                    <>
                        {zoneArray.length > 1 ?
                            <div className="matCardOverlay"
                                onClick={() => {
                                    if (selectedPluckIndex === null && !movingPluck.pluckToMove && !moving.cardToMove) {
                                        setShowActivePluckModal({
                                            name: stringName,
                                            objectName: objectName
                                        })
                                    }
                                }}
                                onMouseEnter={() => handleHoveredCard(zoneArray[0])}
                            >
                                <h1 className="fontSize60">{zoneArray.length}</h1>
                            </div> :null
                        }
                        <img
                            onDoubleClick={() => discardPluck(zoneArray[0], 0, objectName)}
                            onContextMenu={(event) => handleMenu(event)}
                            onClick={(event) => handleMenu(event)}
                            onMouseEnter={() => {handleHoveredCard(zoneArray[0])}}
                            className="builder-card5 pointer glow3"
                            src={zoneArray[0].picture_url ?
                                    zoneArray[0].picture_url :
                                    "https://playmakercards.s3.us-west-1.amazonaws.com/plucks4-1.png"}
                            alt={zoneArray[0].name}
                        />
                    </>
                :null}
            </div>
        </div>
    )
}


function ExtraZone({
    objectName,
    stringName,
    zoneArray,
    selectedIndex,
    playCard,
    setShowPlayAreaModal,
    handleHoveredCard,
    discardCard,
    playingFaceDown
}){

    const {
        player,
        volume,
        addToLog,
        activating,
        handleActivating,
        defendingCard,
    } = useContext(GameStateContext)

    const {
        addCardFromPlay,
        swapping,
        setSwapping,
        moving,
        setMoving,
        moveCard
    } = useContext(MainActionsContext)

    const {movePluck, movingPluck} = useContext(PluckActionsContext)

    const [showPlayAreaMenu, setShowPlayAreaMenu] = useState({
        slot_5: false,
        slot_6: false,
        slot_7: false,
        slot_8: false
    })

    const handleMenu = (event) => {
        event.preventDefault()
        setShowPlayAreaMenu({
            ...showPlayAreaMenu,
            [objectName]: !showPlayAreaMenu[objectName]
        })
        menuSound(volume)
    }

    const handleMenuClose = () => {
        setShowPlayAreaMenu({
            ...showPlayAreaMenu,
            [objectName]: false
        })
    }
    return(
        <div>
            <div className={showPlayAreaMenu[objectName] && zoneArray.length === 1 ? "zone-menu2": "hidden2"}>
                <div className="card-menu-item"
                    onClick={() => {
                        handleActivating(objectName)
                        activateSound(volume)
                        addToLog("System", "system", `${player.name} is resolving "${zoneArray[0].name}"`, zoneArray[0])
                    }}
                ><p>Resolve</p></div>
                <div className="card-menu-item"
                    onClick={() => {swapping.cardToSwap && swapping.zone === objectName?
                        setSwapping({cardToSwap: "", zone: "", index: null}):
                        setSwapping({
                            cardToSwap: zoneArray[0],
                            zone: objectName,
                            index: 0
                        })}
                    }
                ><p>{swapping.cardToSwap && swapping.zone === objectName? "Cancel": "Swap from Hand"}</p></div>
                <div className="card-menu-item"
                    onClick={() => {moving.cardToMove && moving.zone === objectName?
                        setMoving({cardToMove: "", zone: "", index: null}):
                        setMoving({
                            cardToMove: zoneArray[0],
                            zone: objectName,
                            index: 0
                        })}
                    }
                ><p>{moving.cardToMove && moving.zone === objectName? "Cancel": "Move"}</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        addCardFromPlay(zoneArray[0], 0, objectName)
                        handleMenuClose()
                    }}
                ><p>Return to Hand</p></div>
                <div className="card-menu-item"
                    onClick={() => {
                        discardCard(zoneArray[0], 0, objectName)
                        handleMenuClose()
                    }}
                ><p>Discard</p></div>
            </div>
            <div className={activating[objectName]? "maskContainer": "hidden2"}>
                <img
                    className="mask"
                    src="mask0.png"/>
            </div>
            <div className={selectedIndex === null? "matCard" : "matCardSelect"}
                onClick={() => { if (!moving.cardToMove && !movingPluck.pluckToMove) {
                                    playingFaceDown === false ?
                                        playCard(objectName):
                                        playCard(objectName, objectName)
                                } else if (moving.cardToMove && moving.zone !== objectName){
                                    moveCard(objectName)
                                } else if (movingPluck.pluckToMove && movingPluck.zone !== objectName) {
                                    movePluck(objectName, true)
                                }
                            }
                        }
            >
                {zoneArray.length > 0 ?
                    <>
                        {zoneArray.length > 1 ?
                            <div className={moving.zone === objectName?
                                    "matCardOverlay selected3" :
                                    "matCardOverlay"}
                                    onClick={() => {
                                        if (selectedIndex === null && !moving.cardToMove && !movingPluck.pluckToMove) {
                                            setShowPlayAreaModal({
                                                name: stringName,
                                                objectName: objectName
                                            })
                                        }
                                    }}
                                onMouseEnter={() => handleHoveredCard(zoneArray[0])}
                            >
                                <h1 className="fontSize60">{zoneArray.length}</h1>
                            </div> :null
                        }
                        <img
                            onDoubleClick={() => {
                                discardCard(zoneArray[0], 0, objectName)
                                handleMenuClose()
                            }}
                            onContextMenu={(event) => handleMenu(event)}
                            onClick={(event) => handleMenu(event)}
                            onMouseEnter={() => handleHoveredCard(zoneArray[0])}
                            className={swapping.zone === objectName || moving.zone === objectName?
                                "selected3 builder-card5 pointer glow3":
                                "builder-card5 pointer glow3"}
                            src={zoneArray[0].picture_url ?
                                zoneArray[0].picture_url :
                                "https://i.imgur.com/krY25iI.png"}
                            alt={zoneArray[0].name}
                            title={
                                defendingCard.slot === objectName?
                                    `HP: ${defendingCard.hp}`+
                                    `${defendingCard.block?`\nBlock: ${defendingCard.block}`:""}`+
                                    `${defendingCard.block?`\nCounter: ${defendingCard.counter}`:""}`+
                                    `${defendingCard.endure?`\nEndure: ${defendingCard.endure}`:""}`+
                                    `${defendingCard.redirect?`\nRedirect: ${defendingCard.redirect}`:""}`
                                :
                                    ""
                            }
                        />
                    </>
                :null}
            </div>
        </div>
    )
}


export {PlayAreaZone, ActivePluckZone, ExtraZone};
