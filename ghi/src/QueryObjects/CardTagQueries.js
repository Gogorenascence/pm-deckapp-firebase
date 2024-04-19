import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const cardTagQueries = {
    getCardTagsData: async function getCardTagsData() {
        const cardTagsCollectionRef = collection(db, "card_tags")
        const response = await getDocs(cardTagsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default cardTagQueries
