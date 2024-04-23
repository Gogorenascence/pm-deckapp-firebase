import { createContext, useState, useEffect } from "react";


const APIContext = createContext();

const APIContextProvider = ({ children }) => {
    const [pre_processed_cards, setPreprocessedCards] = useState([])
    const [card_types, setCardTypes] = useState("")
    const [extra_effects, setExtraEffects] = useState([])
    const [reactions, setReactions] = useState([])
    const [card_tags, setCardTags] = useState([])
    const [processedCards, setProcessedCards] = useState([])

    const getAPIData = async() => {
        let cards_data = require('../Database/cards.json').map(card =>
            {card["id"] = card._id.$oid
            return card
        })
        setPreprocessedCards(cards_data)
        let card_types_data = require('../Database/card_types.json').map(card_type =>
            {card_type["id"] = card_type._id.$oid
            return card_type
        })
        setCardTypes(card_types_data)
        let extra_effects_data = require('../Database/extra_effects.json').map(extra_effect =>
            {extra_effect["id"] = extra_effect._id.$oid
            return extra_effect
        })
        setExtraEffects(extra_effects_data)
        let card_tags_data = require('../Database/card_tags.json').map(card_tag =>
            {card_tag["id"] = card_tag._id.$oid
            return card_tag
        })
        setCardTags(card_tags_data)
        let reactions_data = require('../Database/reactions.json').map(reaction =>
            {reaction["id"] = reaction._id.$oid
            return reaction
        })
        setReactions(reactions_data)
    }

    useEffect(() => {
        getAPIData();
    }, []);

    return (
        <APIContext.Provider value={{
            pre_processed_cards,
            card_types,
            extra_effects,
            card_tags,
            reactions
            }}>
            {children}
        </APIContext.Provider>
    );
};

export { APIContext, APIContextProvider };
