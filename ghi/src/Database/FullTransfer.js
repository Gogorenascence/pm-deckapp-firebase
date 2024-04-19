import { db } from "../Firebase"
import { getDocs, collection, addDoc } from "firebase/firestore"


function FullTransfer() {
    let cards = require('./cards.json').map(card =>
        {card["id"] = card._id.$oid
            return card
        }).map(card => ({
            ...card,
            picture_url: card.picture_url.replace("https://playmakercards","https://compressedplaymakercards")
                .replace("png", "jpg")
            }))

    // for (let card of cards) {
    //     console.log(card.created_on)
    //     if (card.created_on.full_time.$date) {
    //         const newFullTime = card.created_on.full_time.$date.slice(19)
    //         card.created_on.full_time = newFullTime
    //     } else {
    //         const newFullTime = card.created_on.full_time.slice(19)
    //         card.created_on.full_time = newFullTime
    //     }
    //     if (card.updated_on.full_time.$date) {
    //         const newFullTime = card["updated_on"]["full_time"]["$date"].slice(19)
    //         card["updated_on"]["full_time"] = newFullTime
    //     } else {
    //         const newFullTime = card["updated_on"]["full_time"].slice(19)
    //         card["updated_on"]["full_time"] = newFullTime
    //     }
    //     // addDoc(cardsCollectionRef, card)
    // }

    console.log(cards)

    let card_categories = require('./card_categories.json').map(category =>
        {category["id"] = category._id.$oid
            return category
        })

    let card_types = require('./card_types.json').map(card_type =>
        {card_type["id"] = card_type._id.$oid
            return card_type
        })

    let extra_effects = require('./extra_effects.json').map(extra_effect =>
        {extra_effect["id"] = extra_effect._id.$oid
            return extra_effect
        })

    let card_tags = require('./card_tags.json').map(card_tag =>
        {card_tag["id"] = card_tag._id.$oid
            return card_tag
        })

    let reactions = require('./reactions.json').map(reaction =>
        {reaction["id"] = reaction._id.$oid
            return reaction
        })

    let booster_sets = require('./booster_sets.json').map(booster_set =>
        {booster_set["id"] = booster_set._id.$oid
            return booster_set
        })

    let decks = require('./decks.json').map(deck =>
        {deck["id"] = deck._id.$oid
            return deck
        }).filter(deck => deck.private !== true)

    let terms = require('./terms.json').map(term =>
        {term["id"] = term._id.$oid
            return term
        })

    let articles = require('./articles.json').map(article =>
        {article["id"] = article._id.$oid
            return article
        })

    let howTos = require('./how_tos.json').map(howTo =>
        {howTo["id"] = howTo._id.$oid
            return howTo
        })

    const articlesCollectionRef = collection(db, "articles")
    const booster_setsCollectionRef = collection(db, "booster_sets")
    const card_categoriesCollectionRef = collection(db, "card_categories")
    const card_tagsCollectionRef = collection(db, "card_tags")
    const card_typesCollectionRef = collection(db, "card_types")
    const cardsCollectionRef = collection(db, "cards")
    const decksCollectionRef = collection(db, "decks")
    const extra_effectsCollectionRef = collection(db, "extra_effects")
    const how_tosCollectionRef = collection(db, "how_tos")
    const reactionsCollectionRef = collection(db, "reactions")
    const termsCollectionRef = collection(db, "terms")

    const transferAll = async () => {
        // console.log(cards[0])
        // for (let card of cards) {
        //     console.log(card.created_on)
        //     if (card.created_on.full_time.$date) {
        //         const newFullTime = card.created_on.full_time.$date.slice(0, 19)
        //         card.created_on.full_time = newFullTime
        //     } else {
        //         const newFullTime = card.created_on.full_time.slice(0, 19)
        //         card.created_on.full_time = newFullTime
        //     }
        //     if (card.updated_on.full_time.$date) {
        //         const newFullTime = card["updated_on"]["full_time"]["$date"].slice(0, 19)
        //         card["updated_on"]["full_time"] = newFullTime
        //     } else {
        //         const newFullTime = card["updated_on"]["full_time"].slice(0, 19)
        //         card["updated_on"]["full_time"] = newFullTime
        //     }
        //     addDoc(cardsCollectionRef, card)
        // }
        // console.log(cards[0])

        for (let deck of decks) {
            console.log(deck.created_on)
            if (deck.created_on.full_time.$date) {
                const newFullTime = deck.created_on.full_time.$date.slice(0, 19)
                deck.created_on.full_time = newFullTime
            } else {
                const newFullTime = deck.created_on.full_time.slice(0, 19)
                deck.created_on.full_time = newFullTime
            }
            if (deck.updated_on.full_time.$date) {
                const newFullTime = deck["updated_on"]["full_time"]["$date"].slice(0, 19)
                deck["updated_on"]["full_time"] = newFullTime
            } else {
                const newFullTime = deck["updated_on"]["full_time"].slice(0, 19)
                deck["updated_on"]["full_time"] = newFullTime
            }
            // addDoc(cardsCollectionRef, card)
            addDoc(decksCollectionRef, deck)
        }
        // for (let article of articles) {
        //     addDoc(articlesCollectionRef, article)
        // }
        // for (let booster_set of booster_sets) {
        //     addDoc(booster_setsCollectionRef, booster_set)
        // }
        // for (let card_category of card_categories) {
        //     addDoc(card_categoriesCollectionRef, card_category)
        // }
        // for (let card_tag of card_tags) {
        //     addDoc(card_tagsCollectionRef, card_tag)
        // }
        // for (let card_type of card_types) {
        //     addDoc(card_typesCollectionRef, card_type)
        // }
        // for (let extra_effect of extra_effects) {
        //     addDoc(extra_effectsCollectionRef, extra_effect)
        // }
        // for (let how_to of howTos) {
        //     addDoc(how_tosCollectionRef, how_to)
        // }
        // for (let reaction of reactions) {
        //     addDoc(reactionsCollectionRef, reaction)
        // }
        // for (let term of terms) {
        //     addDoc(termsCollectionRef, term)
        // }
    }



    return (
        <button onClick={transferAll}>
            Transfer All
        </button>
    )
}

export default FullTransfer
