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

    const getFullCards = async () => {
        const cards = []
        for (let card of pre_processed_cards) {
            const cardData = {...card}
            cardData["seriesNames"] = cardData.series_name.split("//")
            cardData["effectText"] = cardData.effect_text.split("//")
            if (cardData.second_effect_text){
                cardData["secondEffectText"] = cardData.second_effect_text.split("//")
            }
            const card_type = card_types.find(card_type => card?.card_type[0] === card_type?.type_number)
            cardData["card_type"] = [card_type]

            const extra_effects_list = []
            for (let extra_effect of extra_effects) {
                if (card.extra_effects.includes(extra_effect.effect_number) ) {
                    extra_effects_list.push(extra_effect)
                }
            }
            cardData["extra_effects"] = extra_effects_list

            const reaction_counts = {}
            for (let reaction_number of card.reactions) {
                const reaction = reactions.find(reaction => reaction.reaction_number === reaction_number)
                !reaction_counts[reaction.name]?
                reaction_counts[reaction.name] = {
                    info: reaction,
                    count: 1,

                }:
                reaction_counts[reaction.name]["count"]++
            }
            const reactions_list = Object.values(reaction_counts)
            cardData["reactions"] = reactions_list

            const card_tags_list = []
            for (let card_tag of card_tags) {
                if (card.card_tags.includes(card_tag.tag_number) ) {
                    card_tags_list.push(card_tag)
                }
            }
            cardData["card_tags"] = card_tags_list

            cards.push(cardData)
        }
        console.log(cards)
        setProcessedCards(cards)
    }

    useEffect(() => {
        getAPIData();
        // getFullCards();
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
