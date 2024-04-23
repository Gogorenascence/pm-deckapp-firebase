import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"
import cardTagQueries from "./CardTagQueries"
import extraEffectQueries from "./ExtraEffectQueries"
import cardTypeQueries from "./CardTypeQueries"
import reactionQueries from "./ReactionQueries"



const cardQueries = {
    getCardsData: async function getCardsData() {
        const cardsCollectionRef = collection(db, "cards")
        const response = await getDocs(cardsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        return data
    },
    getCardData: async function getCardData(cardNumber) {
        const cardsCollectionRef = collection(db, "cards");
        const int_card_number = parseInt(cardNumber, 10);
        const cardQuery = query(
            cardsCollectionRef,
            where("card_number", "==", int_card_number)
        )
        const snapshot = await getDocs(cardQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const cardData = snapshot.docs[0].data();
            return cardData;
        }
    },
    getRelatedCardData: async function getCardData(hero_id, cardNumber) {
        const cardsCollectionRef = collection(db, "cards");
        const cardQuery = query(
            cardsCollectionRef,
            where("hero_id", "==", hero_id),
            where("card_number", "!=", cardNumber),
            orderBy("card_number")
        )
        const snapshot = await getDocs(cardQuery);
        console.log("dog")
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            console.log(snapshot?.size||null)
            const relatedCards = []
            snapshot.forEach((card) => relatedCards.push(card.data()))
            return relatedCards;
        }
    },
    getFullCardData: async function getFullCardData(cardNumber) {
        const cardsCollectionRef = collection(db, "cards");
        const int_card_number = parseInt(cardNumber, 10);
        const cardQuery = query(
            cardsCollectionRef,
            where("card_number", "==", int_card_number)
        )
        const snapshot = await getDocs(cardQuery);
        if (!snapshot.empty) {
            const cardData = snapshot.docs[0].data();

            const cardTypeData = await cardTypeQueries.getCardTypeDataFromCard(cardData.card_type)
            cardData["card_type"] = cardTypeData[0]

            const tagData = await cardTagQueries.getCardTagDataFromCard(cardData.card_tags)
            cardData["card_tags"] = tagData

            const extraEffectData = await extraEffectQueries.getExtraEffectDataFromCard(cardData.extra_effects)
            cardData["extra_effects"] = extraEffectData

            const reactionData = await reactionQueries.getReactionDataFromCard(cardData.reactions)
            reactionData.map(reaction => reaction["rules"] = reaction["rules"].replace("{count}", reaction["count"].toString()))
            cardData["reactions"] = reactionData

            return cardData
        } else {
            console.log("No matching documents.");
            return null;
        }
    },
    getAllFullCardsData: async function getAllFullCardsData() {
        const cardsCollectionRef = collection(db, "cards")
        const response = await getDocs(cardsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        for (let card of data) {
            console.log("dog")
            const cardTypeData = await cardTypeQueries.getCardTypeDataFromCard(card.card_type)
            card["card_type"] = cardTypeData[0]

            const tagData = await cardTagQueries.getCardTagDataFromCard(card.card_tags)
            card["card_tags"] = tagData

            const extraEffectData = await extraEffectQueries.getExtraEffectDataFromCard(card.extra_effects)
            card["extra_effects"] = extraEffectData

            const reactionData = await reactionQueries.getReactionDataFromCard(card.reactions)
            reactionData.map(reaction => reaction["rules"] = reaction["rules"].replace("{count}", reaction["count"].toString()))
            card["reactions"] = reactionData
        }
        console.log(data)
        return data
    }
}

export default cardQueries
