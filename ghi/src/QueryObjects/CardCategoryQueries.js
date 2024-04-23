import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const cardCategoryQueries = {
    getCardCategoriesData: async function getCardCategoriesData() {
        const cardCategoriesCollectionRef = collection(db, "card_categories")
        const response = await getDocs(cardCategoriesCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getCardCategoryData: async function getCardCategoryData(card_category_id) {
        const categoriesCollectionRef = collection(db, "card_categories");
        const categoryQuery = query(
            categoriesCollectionRef,
            where("id", "==", card_category_id)
            )
        const snapshot = await getDocs(categoryQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const categoryData = snapshot.docs[0].data();
            return categoryData;
        }
    }
}

export default cardCategoryQueries
