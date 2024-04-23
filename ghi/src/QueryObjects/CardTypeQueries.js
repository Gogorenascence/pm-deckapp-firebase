import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const cardTypeQueries = {
    getCardTypeData: async function getCardTypeData() {
        const CardTypeCollectionRef = collection(db, "card_types")
        const response = await getDocs(CardTypeCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getCardTypeData: async function getCardTypeData(cardTypeNumber) {
        const cardTypesCollectionRef = collection(db, "card_types");
        const int_type_number = parseInt(cardTypeNumber, 10);
        const cardTypeQuery = query(
            cardTypesCollectionRef,
            where("type_number", "==", int_type_number)
            )
        const snapshot = await getDocs(cardTypeQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const cardTypeData = snapshot.docs[0].data();
            return cardTypeData;
        }
    },
    getCardTypeDataFromCard: async function getCardTypeDataFromCard(cardTypeNumbers) {
        const cardTypes = []
        for (let cardTypeNumber of cardTypeNumbers) {
            const cardTypeData = await cardTypeQueries.getCardTypeData(cardTypeNumber)
            cardTypes.push(cardTypeData)
        }
        return cardTypes
    }
}

export default cardTypeQueries
