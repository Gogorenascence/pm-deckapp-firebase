import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

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
    }
}

export default cardQueries
