import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const cardTagQueries = {
    getCardTagsData: async function getCardTagsData() {
        const cardTagsCollectionRef = collection(db, "card_tags")
        const response = await getDocs(cardTagsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getCardTagDataById: async function getCardTagDataById(id) {
        const cardTagsCollectionRef = collection(db, "card_tags");
        const tagQuery = query(
            cardTagsCollectionRef,
            where("id", "==", id)
        )
        const snapshot = await getDocs(tagQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const tagData = snapshot.docs[0].data();
            return tagData;
        }
    },
    getCardTagData: async function getCardTagData(tagNumber) {
        const cardTagsCollectionRef = collection(db, "card_tags");
        const int_tag_number = parseInt(tagNumber, 10);
        const tagQuery = query(
            cardTagsCollectionRef,
            where("tag_number", "==", int_tag_number)
        )
        const snapshot = await getDocs(tagQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const tagData = snapshot.docs[0].data();
            return tagData;
        }
    },
    getCardTagDataFromCard: async function getCardTagDataFromCard(tagNumbers) {
        const cardTags = []
        for (let tagNumber of tagNumbers) {
            const tagData = await cardTagQueries.getCardTagData(tagNumber)
            cardTags.push(tagData)
        }
        return cardTags
    }
}

export default cardTagQueries
