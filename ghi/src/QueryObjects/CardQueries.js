import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const cardQueries = {
    getCardsData: async function getCardsData() {
        const cardsCollectionRef = collection(db, "cards")
        const response = await getDocs(cardsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        return data
    }
}

export default cardQueries
