import { createContext, useState, useContext } from "react";
import { GameStateContext } from "./GameStateContext";
import { SimulatorActionsContext } from "./SimulatorActionsContext";
import {
    specialSound,
    destroySound,
    shuffleSound,
    summonSound,
    drawSound,
    gainSound,
    activateSound,
    discardSound,
    menuSound,
    startSound,
    equipSound,
    flipSound
} from "../Sounds/Sounds";

const MainActionsContext = createContext();

const MainActionsContextProvider = ({ children }) => {
    const {
        player,
        playerMainDeck,
        setPlayerMainDeck,
        setPlayArea,
        activePluck,
        setActivePluck,
        addToLog,
        volume,
        faceDown,
        setFaceDown,
        setPlayingFaceDown,
    } = useContext(GameStateContext)

    const {
        selectedMainDeck,
        hand,
        setHand,
        discard,
        setDiscard,
        setPluckDiscard,
        selectedIndex,
        setSelectedIndex,
        setPrompt,
        fromDeck,
        setFromDeck,
        fromDiscard,
        setFromDiscard,
        showCardMenu,
        setShowCardMenu,
        setShuffling,
    } = useContext(SimulatorActionsContext)

    const [swapping, setSwapping] = useState({
        cardToSwap: "",
        zone: "",
        index: null
    })

    const [moving, setMoving] = useState({
        cardToMove: "",
        zone: "",
        index: null,
        zoneFaceDown: false
    })

    const isShuffling = () => {
        setShuffling(true)
        setTimeout(() => setShuffling(false), 1000)
    }

    const shuffleMainDeck = () => {
        isShuffling()
        const shuffledDeck = [...playerMainDeck.cards]
        let currentMainIndex = shuffledDeck.length, randomMainIndex;
        // While there remain elements to shuffle.
        while (currentMainIndex !== 0) {
            // Pick a remaining element.
            randomMainIndex = Math.floor(Math.random() * currentMainIndex);
            currentMainIndex--;
            // And swap it with the current element.
            [shuffledDeck[currentMainIndex], shuffledDeck[randomMainIndex]] = [
            shuffledDeck[randomMainIndex], shuffledDeck[currentMainIndex]];
        }
        setPlayerMainDeck({name: selectedMainDeck.name, cards: shuffledDeck});
        shuffleSound(volume)
        addToLog("System", "system", "Shuffling Main deck")
    }

    const drawCard = () => {
        if (hand.length < 8) {
            const newHand = [...hand]
            const newMainDeck = [...playerMainDeck.cards]
            newHand.push(newMainDeck[0])
            drawSound(volume)
            setHand(newHand)
            setPlayerMainDeck({
                name: selectedMainDeck.name,
                cards: newMainDeck.slice(1)
            });
        } else {
            addToLog("System", "system", "You can have more than 8 cards in your hand.")
        }
    }

    const addCardFromDeck = (index, unfurling) => {
        if (hand.length < 8) {
            const newHand = [...hand]
            const newMainDeck = [...playerMainDeck.cards]
            const cardToAdd = newMainDeck[index]
            newHand.push(cardToAdd)
            drawSound(volume)
            setHand(newHand)
            const newShuffledMainDeck = newMainDeck.filter((_, i) => i !== index)
            if (unfurling === false) {
                let currentMainIndex = newShuffledMainDeck.length, randomMainIndex;
                while (currentMainIndex !== 0) {
                    randomMainIndex = Math.floor(Math.random() * currentMainIndex);
                    currentMainIndex--;
                    [newShuffledMainDeck[currentMainIndex], newShuffledMainDeck[randomMainIndex]] = [
                        newShuffledMainDeck[randomMainIndex], newShuffledMainDeck[currentMainIndex]];
                    }
                isShuffling()
                shuffleSound(volume)
            }
            setPlayerMainDeck({
                name: selectedMainDeck.name,
                cards: newShuffledMainDeck
            });
            !unfurling?
                addToLog(
                    "System",
                    "system",
                    `"${cardToAdd.name}" was added from the deck to ${player.name}'s hand`,
                    cardToAdd
                ):
                addToLog(
                    "System",
                    "system",
                    `"${cardToAdd.name}" was added from the unfurled cards to ${player.name}'s hand`,
                    cardToAdd
                )
        } else {
            addToLog("System", "system", "You can have more than 8 cards in your hand.")
        }
    }

    const addCardFromDiscard = (index) => {
        if (hand.length < 8) {
            const newHand = [...hand]
            const newDiscardPile = [...discard]
            const cardToAdd = newDiscardPile[index]
            newHand.push(cardToAdd)
            setHand(newHand)
            setDiscard(newDiscardPile.filter((_, i) => i !== index))
            drawSound(volume);
            addToLog(
                "System",
                "system",
                `"${cardToAdd.name}" was added from discard pile to ${player.name}'s hand`,
                cardToAdd
            )
        } else {
            addToLog("System", "system", "You can have more than 8 cards in your hand.")
        }
    }

    const addCardFromPlay = (card, index, zone) => {
        if (hand.length < 8) {
            const newPlayArea = {...player.playArea}
            const selectZone = newPlayArea[zone]
            const newHand = [...hand]

            newHand.push(card)
            setHand(newHand)
            const newSelectZone = selectZone.filter((_, i) => i !== index)
            newPlayArea[zone] = newSelectZone
            drawSound(volume);

            setPlayArea(newPlayArea)
            addToLog(
                "System",
                "system",
                `"${player.name} returned "${card.name}" from their String to their hand.`,
                card
            )
        } else {
            addToLog("System", "system", "You can have more than 8 cards in your hand.")
        }
    }

    const swapCardInPlay = (handIndex) => {
        const cardInPlay = swapping.cardToSwap
        const zone = swapping.zone
        const zoneIndex = swapping.index
        const newPlayArea = {...player.playArea}
        const selectZone = newPlayArea[zone]
        const cardInHand = hand[handIndex]

        const newHand = hand.filter((_, i) => i !== handIndex)
        newHand.push(cardInPlay)
        setHand(newHand)
        const newSelectZone = selectZone.filter((_, i) => i !== zoneIndex)
        newSelectZone.push(cardInHand)
        newPlayArea[zone] = newSelectZone
        drawSound(volume);

        setPlayArea(newPlayArea)
        setSwapping({
            cardToSwap: "",
            zone: "",
            index: null
        })
        addToLog(
            "System",
            "system",
            `"${player.name} swapped "${cardInPlay.name}"
            from their play with "${cardInHand.name}" from their hand.`,
            cardInPlay
        )
    }

    const discardFromDeck = (index) => {
        const newDiscardPile = [...discard]
        const newMainDeck = [...playerMainDeck.cards]
        const cardToDiscard = newMainDeck[index]
        newDiscardPile.push(cardToDiscard)
        setDiscard(newDiscardPile)
        setPlayerMainDeck({
            name: selectedMainDeck.name,
            cards: newMainDeck.filter((_, i) => i !== index)
        });
        discardSound(volume)
        addToLog(
            "System",
            "system",
            `${player.name} discarded "${cardToDiscard.name}" from their deck`,
            cardToDiscard
        )
    }

    const handleShowCardMenu = (index, event) => {
        event.preventDefault()
        showCardMenu === index?
            setShowCardMenu(null):
            setShowCardMenu(index)
        menuSound(volume)
    }

    const selectCard = (index) => {
        setShowCardMenu(null)
        if (selectedIndex === index) {
            setSelectedIndex(null)
            setPrompt({message: "", action: ""})
            setFromDeck(false)
            setFromDiscard(false)
        } else {
            setSelectedIndex(index)
            // !placing?
            setPrompt({
                message: "Select a Zone to Play Your Card!",
                action: "playArea"
            })
            // :
            // setPrompt({
            //     message: "Select a Zone to Place Your Card!",
            //     action: "playArea"
            // })
        }
    }

    const handleCardFromHand = (index) => {
        setFromDeck(false)
        setFromDiscard(false)
        // setPlacing(false)
        selectCard(index)
    }

    const handlePlaceCardFromHand = (index) => {
        setFromDeck(false)
        setFromDiscard(false)
        // setPlacing(true)
        selectCard(index)
    }

    const playCard = (zone, zoneFaceDown) => {
        if (selectedIndex !== null) {
            if (fromDeck) {
                const playedCard = playerMainDeck.cards[selectedIndex]
                const newMainDeck = [...playerMainDeck.cards]
                const playZones = {...player.playArea}
                const selectZone = playZones[zone]
                setPrompt({message: "", action: ""})
                selectZone.push(playedCard)
                if (selectZone.length > 1) {
                    equipSound(volume*1.5)
                } else {
                    specialSound(volume)
                }
                setPlayerMainDeck({
                    name: selectedMainDeck.name,
                    cards: newMainDeck.filter((_, i) => i !== selectedIndex)
                });
                setSelectedIndex(null)
                setFromDeck(false)
                setPlayArea(playZones)
                addToLog(
                    "System",
                    "system",
                    `${player.name} played "${playedCard.name}" from the deck`,
                    playedCard
                )
            } else if (fromDiscard) {
                const playedCard = player.mainDiscard[selectedIndex]
                const playZones = {...player.playArea}
                const selectZone = playZones[zone]
                const newDiscardPile = [...player.mainDiscard]
                setPrompt({message: "", action: ""})
                selectZone.push(playedCard)
                if (selectZone.length > 1) {
                    equipSound(volume*1.5)
                } else {
                    specialSound(volume)
                }
                setDiscard(newDiscardPile.filter((_, i) => i !== selectedIndex))
                setSelectedIndex(null)
                setFromDiscard(false)
                setPlayArea(playZones)
                addToLog(
                    "System",
                    "system",
                    `${player.name} played "${playedCard.name}" from the discard pile`,
                    playedCard
                )
            } else {
                const playedCard = player.hand[selectedIndex]
                const playZones = {...player.playArea}
                const selectZone = playZones[zone]
                const newHand = [...player.hand]
                setPrompt({message: "", action: ""})
                selectZone.push(playedCard)
                if (selectZone.length > 1) {
                    equipSound(volume*1.5)
                } else {
                    {zoneFaceDown? specialSound(volume):summonSound(volume)}
                }
                if (zoneFaceDown){
                    setFaceDown({...faceDown, [zoneFaceDown]: true})
                    console.log(zoneFaceDown)
                } else {
                    setFaceDown({...faceDown, [zone]: false})
                    console.log("here")
                }
                setHand(newHand.filter((_, i) => i !== selectedIndex))
                setSelectedIndex(null)
                setFromDeck(false)
                setPlayArea(playZones)
                setShowCardMenu(null)
                zoneFaceDown? addToLog("System", "system", `${player.name} played a card face-down`):
                    addToLog(
                        "System",
                        "system",
                        `${player.name} played "${playedCard.name}"`,
                        playedCard
                    )
            }
            setPlayingFaceDown(false)
            setShowCardMenu(null)
        }
    }

    const moveCard = (nextZone, pluck) => {
        if (moving.cardToMove) {
            const newPlayArea = {...player.playArea}
            const newActivePluck = pluck? {...activePluck}: null
            const selectZone = newPlayArea[moving.zone]
            const nextSelectZone = !pluck?
                newPlayArea[nextZone]:
                newActivePluck[nextZone]
            if (moving.zoneFaceDown && !pluck){
                setFaceDown({
                    ...faceDown,
                    [nextZone]: true,
                    [moving.zone]: false
                })
            } else {
                setFaceDown({
                    ...faceDown,
                    [nextZone]: false,
                    [moving.zone]: false
                })
            }

            nextSelectZone.push(moving.cardToMove)
            const newSelectZone = selectZone.filter((_, i) => i !== moving.index)
            if (!pluck) {
                newPlayArea[moving.zone] = newSelectZone
                newPlayArea[nextZone] = nextSelectZone
                setPlayArea(newPlayArea)
            } else {
                newPlayArea[moving.zone] = newSelectZone
                newActivePluck[nextZone] = nextSelectZone
                setPlayArea(newPlayArea)
                setActivePluck(newActivePluck)
            }
            {nextSelectZone.length > 1?
                equipSound(volume*1.5):
                specialSound(volume)};

            setMoving({
                cardToMove: "",
                zone: "",
                index: null,
                zoneFaceDown: false
            })
        }
    }

    // const placeCard = (zone) => {
    //     if (selectedIndex !== null) {
    //         if (fromDeck) {
    //             const playedCard = playerMainDeck.cards[selectedIndex]
    //             const newMainDeck = [...playerMainDeck.cards]
    //             const playZones = {...player.playArea}
    //             const selectZone = playZones[zone]
    //             setPrompt({message: "", action: ""})
    //             !placing? selectZone.push(playedCard): selectZone.unshift(playedCard)
    //             if (selectZone.length > 1) {
    //                 equipSound(volume*1.5)
    //             } else {
    //                 specialSound(volume)
    //             }
    //             setPlayerMainDeck({
    //                 name: selectedMainDeck.name,
    //                 cards: newMainDeck.filter((_, i) => i !== selectedIndex)
    //             });
    //             setSelectedIndex(null)
    //             setFromDeck(false)
    //             setPlayArea(playZones)
    //             addToLog(
    //                 "System",
    //                 "system",
    //                 `${player.name} played "${playedCard.name}" from the deck`,
    //                 playedCard
    //             )
    //         } else if (fromDiscard) {
    //             const playedCard = player.mainDiscard[selectedIndex]
    //             const playZones = {...player.playArea}
    //             const selectZone = playZones[zone]
    //             const newDiscardPile = [...player.mainDiscard]
    //             setPrompt({message: "", action: ""})
    //             !placing? selectZone.push(playedCard): selectZone.unshift(playedCard)
    //             if (selectZone.length > 1) {
    //                 equipSound(volume*1.5)
    //             } else {
    //                 specialSound(volume)
    //             }
    //             setDiscard(newDiscardPile.filter((_, i) => i !== selectedIndex))
    //             setSelectedIndex(null)
    //             setFromDiscard(false)
    //             setPlayArea(playZones)
    //             addToLog(
    //                 "System",
    //                 "system",
    //                 `${player.name} played "${playedCard.name}" from the discard pile`,
    //                 playedCard
    //             )
    //         } else {
    //             const playedCard = player.hand[selectedIndex]
    //             const playZones = {...player.playArea}
    //             const selectZone = playZones[zone]
    //             const newHand = [...player.hand]
    //             setPrompt({message: "", action: ""})
    //             !placing? selectZone.push(playedCard): selectZone.unshift(playedCard)
    //             if (selectZone.length > 1) {
    //                 equipSound(volume*1.5)
    //             } else {
    //                 {zoneFaceDown? specialSound(volume):summonSound(volume)}
    //             }
    //             if (zoneFaceDown){
    //                 setFaceDown({...faceDown, [zoneFaceDown]: true})
    //                 console.log(zoneFaceDown)
    //             } else {
    //                 setFaceDown({...faceDown, [zone]: false})
    //                 console.log("here")
    //             }
    //             setHand(newHand.filter((_, i) => i !== selectedIndex))
    //             setSelectedIndex(null)
    //             setFromDeck(false)
    //             setPlayArea(playZones)
    //             setShowCardMenu(null)
    //             zoneFaceDown? addToLog("System", "system", `${player.name} played a card face-down`):
    //                 addToLog(
    //                     "System",
    //                     "system",
    //                     `${player.name} played "${playedCard.name}"`,
    //                     playedCard
    //                 )
    //         }
    //         setPlayingFaceDown(false)
    //         setShowCardMenu(null)
    //     }
    // }

    const discardCard = (card, index, zone) => {
        const newPlayArea = {...player.playArea}
        const selectZone = newPlayArea[zone]
        const newDiscardPile = [...player.mainDiscard]
        const newPluckDiscardPile = [...player.pluckDiscard]
        if (card.card_type[0].type_number < 1006) {
            newDiscardPile.push(card)
            const newSelectZone = selectZone.filter((_, i) => i !== index)
            destroySound(volume)
            newPlayArea[zone] = newSelectZone
            setDiscard(newDiscardPile)
            setPlayArea(newPlayArea)
            addToLog(
                "System",
                "system",
                `${player.name} discarded "${card.name}" from their String`,
                card
            )
        } else {
            newPluckDiscardPile.push(card)
            const newSelectZone = selectZone.filter((_, i) => i !== index)
            destroySound(volume)
            newPlayArea[zone] = newSelectZone
            setPluckDiscard(newPluckDiscardPile)
            setPlayArea(newPlayArea)
            addToLog(
                "System",
                "system",
                `${player.name} discarded "${card.name}" from their String`,
                card
            )
        }
    }

    const discardCardFromHand = (index) => {
        const discardedCard = player.hand[index]
        const newDiscardPile = [...player.mainDiscard]
        const newHand = [...player.hand]
        newDiscardPile.push(discardedCard)
        setHand(newHand.filter((_, i) => i !== index))
        setDiscard(newDiscardPile)
        discardSound(volume)
        setShowCardMenu(null)
        addToLog(
            "System",
            "system",
            `${player.name} discarded "${discardedCard.name}" from their hand`,
            discardedCard
        )
    }

    const topDeckCard = (index) => {
        const toppedCard = player.hand[index]
        const newCards = [...player.mainDeck]
        const newHand = [...player.hand]
        newCards.unshift(toppedCard)
        setHand(newHand.filter((_, i) => i !== index))
        setPlayerMainDeck({...playerMainDeck, cards: newCards})
        flipSound(volume)
        setShowCardMenu(null)
        addToLog(
            "System",
            "system",
            `${player.name} returned "${toppedCard.name}" to the top of their deck`,
            toppedCard
        )
    }

    const bottomDeckCard = (index) => {
        const bottomCard = player.hand[index]
        const newCards = [...player.mainDeck]
        const newHand = [...player.hand]
        newCards.push(bottomCard)
        setHand(newHand.filter((_, i) => i !== index))
        setPlayerMainDeck({...playerMainDeck, cards: newCards})
        flipSound(volume)
        setShowCardMenu(null)
        addToLog(
            "System",
            "system",
            `${player.name} returned "${bottomCard.name}" to the bottom of their deck`,
            bottomCard
        )
    }

    const returnDiscardedCardToDeck = (index, position) => {
        const returnedCard = player.mainDiscard[index]
        const newCards = [...player.mainDeck]
        const newDiscard = [...player.mainDiscard]
        if (position === "top") {
            newCards.unshift(returnedCard)
            addToLog(
                "System",
                "system",
                `${player.name} returned "${returnedCard.name}" to the top of their deck`,
                returnedCard
            )
        } else {
            newCards.push(returnedCard)
            addToLog(
                "System",
                "system",
                `${player.name} returned "${returnedCard.name}" to the bottom of their deck`,
                returnedCard
            )
        }
        setDiscard(newDiscard.filter((_, i) => i !== index))
        setPlayerMainDeck({...playerMainDeck, cards: newCards})
        flipSound(volume)
        setShowCardMenu(null)
    }

    return (
        <MainActionsContext.Provider value={{
            isShuffling,
            shuffleMainDeck,
            drawCard,
            addCardFromDeck,
            addCardFromDiscard,
            addCardFromPlay,
            swapCardInPlay,
            swapping,
            setSwapping,
            discardFromDeck,
            handleShowCardMenu,
            selectCard,
            handleCardFromHand,
            handlePlaceCardFromHand,
            playCard,
            moving,
            setMoving,
            moveCard,
            discardCard,
            discardCardFromHand,
            topDeckCard,
            bottomDeckCard,
            returnDiscardedCardToDeck
        }}>
            {children}
        </MainActionsContext.Provider>
    );
};

export { MainActionsContext, MainActionsContextProvider };
