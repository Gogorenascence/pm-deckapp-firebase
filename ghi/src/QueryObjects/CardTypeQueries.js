import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const cardTypeQueries = {
    getCardTypeData: async function getCardTypeData() {
        const CardTypeCollectionRef = collection(db, "card_types")
        const response = await getDocs(CardTypeCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default cardTypeQueries
