import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { SimulatorActionsContext } from '../Context/SimulatorActionsContext';
import {GameStateContext} from '../Context/GameStateContext';


const SimulateButton = ({deckName, main_list, pluck_list, handlePopUp}) => {
    const {
        setSelectedMainDeck,
        setSelectedPluckDeck,
        setCards,
        fillDecks,
    } = useContext(SimulatorActionsContext)

    const {setGame} = useContext(GameStateContext)

    const navigate = useNavigate()

    const getCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/full_cards/`);
        const cardData = await response.json();
        console.log(cardData.cards)
        setCards(cardData.cards);
    };

    const handleSimulator = async () => {
        // await getCards();
        setSelectedMainDeck({
            name: deckName,
            cards: main_list
        });
        setSelectedPluckDeck({
            name: deckName,
            cards: pluck_list
        })
        // await fillDecks();
        navigate(`/simulator`);
    }

    return (
        <button
            onClick={handleSimulator}
            className="left"
        >
            Simulate
        </button>
    );
};

export default SimulateButton;
