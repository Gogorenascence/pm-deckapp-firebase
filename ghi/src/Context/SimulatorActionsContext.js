import { createContext, useState, useContext } from "react";
import { GameStateContext } from "../Context/GameStateContext";
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

const SimulatorActionsContext = createContext();

const SimulatorActionsContextProvider = ({ children }) => {
    const {
        setGame,
        player,
        playerMainDeck,
        setPlayerMainDeck,
        playerPluckDeck,
        setPlayerPluckDeck,
        setPlayArea,
        setActivePluck,
        volume,
        setVolume,
        addToLog,
        defendingCard
    } = useContext(GameStateContext)

    const [selectedMainDeck, setSelectedMainDeck] = useState({
        name: "",
        cards: []
    })
    const [selectedPluckDeck, setSelectedPluckDeck] = useState({
        name: "",
        cards: []
    })
    const [decks, setDecks] = useState([])
    const [cards, setCards] = useState([])
    const [hand, setHand] = useState(player.hand)
    const [ownership, setOwnership] = useState(player.ownership)
    const [discard, setDiscard] = useState(player.mainDiscard)
    const [pluckDiscard, setPluckDiscard] = useState(player.pluckDiscard)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [selectedPluckIndex, setSelectedPluckIndex] = useState(null)
    const [hoveredCard, setHoveredCard] = useState("")
    const [prompt, setPrompt] = useState({
        message: "",
        action: "",
    })
    const [fromDeck, setFromDeck] = useState(false)
    const [fromDiscard, setFromDiscard] = useState(false)
    const [showCardMenu, setShowCardMenu] = useState(null)
    const [showPluckMenu, setShowPluckMenu] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cardsLoading, setCardsLoading] = useState(false)
    const [shuffling, setShuffling] = useState(false)
    const [shufflingPluck, setShufflingPluck] = useState(false)

    const handleChangeDeck = (event) => {
        const deckID = event.target.value
        const deckFound = decks.find(deck => deck.id === deckID)
        setSelectedMainDeck({
            name: deckFound.name,
            cards: deckFound.cards
        });
        setSelectedPluckDeck({
            name: deckFound.name,
            cards: deckFound.pluck
        })
        console.log(deckFound)
    };

    const fillDecks = (event) => {
        // console.log(selectedMainDeck)
        if (cards.length === 0) {
            addToLog("System", "system", "Cards are loading")
            return;
        }
        if (selectedMainDeck.cards.length > 0) {
            const filledMainDeck = selectedMainDeck.cards.map(cardNumber =>
                    cards.find(card => card.card_number === cardNumber)
                );
            const filledPluckDeck = selectedPluckDeck.cards.map(cardNumber =>
                cards.find(card => card.card_number === cardNumber)
            );
            setPlayerMainDeck({name: selectedMainDeck.name, cards: filledMainDeck})
            setPlayerPluckDeck({name: selectedPluckDeck.name, cards: filledPluckDeck})
            equipSound(volume)
            console.log(selectedMainDeck)
            addToLog("System", "system", `${selectedMainDeck.name} selected`)
        } else {
            addToLog("System", "system", "No deck selected")
        }
    }

    const allPlayerPluck = player.activePluck.slot_1?.length +
        player.activePluck.slot_2?.length +
        player.activePluck.slot_3?.length +
        player.activePluck.slot_4?.length

    const gameStart = () => {
        console.log(player)
        console.log()
        const shuffledMainDeck = [...playerMainDeck.cards]
        let currentMainIndex = shuffledMainDeck.length, randomMainIndex;
        // While there remain elements to shuffle.
        while (currentMainIndex !== 0) {
            // Pick a remaining element.
            randomMainIndex = Math.floor(Math.random() * currentMainIndex);
            currentMainIndex--;
            // And swap it with the current element.
            [shuffledMainDeck[currentMainIndex], shuffledMainDeck[randomMainIndex]] = [
            shuffledMainDeck[randomMainIndex], shuffledMainDeck[currentMainIndex]];
        }
        setHand(shuffledMainDeck.slice(0,6))
        // soundLoop(drawSound, 6, .07)
        gainSound(volume)
        startSound(volume)
        setPlayerMainDeck({name: selectedMainDeck.name, cards: shuffledMainDeck.slice(6)});

        const shuffledPluckDeck = [...playerPluckDeck.cards]
        let currentPluckIndex = shuffledPluckDeck.length, randomPluckIndex;
        // While there remain elements to shuffle.
        while (currentPluckIndex !== 0) {
            // Pick a remaining element.
            randomPluckIndex = Math.floor(Math.random() * currentPluckIndex);
            currentPluckIndex--;
            // And swap it with the current element.
            [shuffledPluckDeck[currentPluckIndex], shuffledPluckDeck[randomPluckIndex]] = [
            shuffledPluckDeck[randomPluckIndex], shuffledPluckDeck[currentPluckIndex]];
        }
        setOwnership([shuffledPluckDeck[0]])
        setPlayerPluckDeck({name: selectedPluckDeck.name, cards: shuffledPluckDeck.slice(1)});
        setGame(true)
        addToLog("System", "system", "Game Start!")
    }

    const checkPlayer = () => {
        activateSound(volume)
        addToLog("System", "system", `${player.name},
        HP: ${player["hp"]},
        Enthusiasm: ${player.enthusiasm},
        Focus: ${player.focus},
        Mettle: ${player.mettle}
        ${player.secondWind? ", Second Wind": ""}`)
        console.log(player)
        console.log(defendingCard)
    }

    const resetPlayer = () => {
        setPlayerMainDeck({name: "", cards: []})
        setPlayerPluckDeck({name: "", cards: []})
        setDiscard([])
        setPluckDiscard([])
        setHand([])
        setOwnership([])
        setPlayArea({
            fighter_slot: [],
            aura_slot: [],
            move_slot: [],
            ending_slot: [],
            slot_5: [],
            slot_6: [],
            slot_7: [],
            slot_8: [],
        })
        setActivePluck({
            slot_1: [],
            slot_2: [],
            slot_3: [],
            slot_4: [],
        })
        setGame(false)
        addToLog("System", "system", "Player was reset")
    }

    const mute = () => {
        volume > 0? setVolume(0) : setVolume(0.05)
    }

    const handleHoveredCard = (cardItem) => {
        setHoveredCard(cardItem)
    }

    return (
        <SimulatorActionsContext.Provider value={{
            selectedMainDeck,
            setSelectedMainDeck,
            selectedPluckDeck,
            setSelectedPluckDeck,
            decks,
            setDecks,
            cards,
            setCards,
            hand,
            setHand,
            ownership,
            setOwnership,
            discard,
            setDiscard,
            pluckDiscard,
            setPluckDiscard,
            hoveredCard,
            selectedIndex,
            setSelectedIndex,
            selectedPluckIndex,
            setSelectedPluckIndex,
            setHoveredCard,
            prompt,
            setPrompt,
            fromDeck,
            setFromDeck,
            fromDiscard,
            setFromDiscard,
            showCardMenu,
            setShowCardMenu,
            showPluckMenu,
            setShowPluckMenu,
            loading,
            setLoading,
            cardsLoading,
            setCardsLoading,
            shuffling,
            setShuffling,
            shufflingPluck,
            setShufflingPluck,
            handleChangeDeck,
            fillDecks,
            allPlayerPluck,
            gameStart,
            checkPlayer,
            resetPlayer,
            mute,
            handleHoveredCard
        }}>
            {children}
        </SimulatorActionsContext.Provider>
    );
};

export { SimulatorActionsContext, SimulatorActionsContextProvider };
