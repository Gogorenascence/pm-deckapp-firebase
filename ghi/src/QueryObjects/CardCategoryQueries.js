import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const cardCategoryQueries = {
    getCardCategoriesData: async function getCardCategoriesData() {
        const cardCategoriesCollectionRef = collection(db, "card_categories")
        const response = await getDocs(cardCategoriesCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default cardCategoryQueries
