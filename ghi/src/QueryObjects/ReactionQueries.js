import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const reactionQueries = {
    getReactionsData: async function getReactionsData() {
        const reactionsCollectionRef = collection(db, "reactions")
        const response = await getDocs(reactionsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getReactionData: async function getReactionData(reactionNumber) {
        const reactionsCollectionRef = collection(db, "reactions");
        const int_reaction_number = parseInt(reactionNumber, 10);
        const reactionQuery = query(
            reactionsCollectionRef,
            where("reaction_number", "==", int_reaction_number)
            )
        const snapshot = await getDocs(reactionQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const reactionData = snapshot.docs[0].data();
            return reactionData;
        }
    },
    getReactionDataFromCard: async function getReactionDataFromCard(reactionNumbers) {
        let reactions = []
        let reactionCounts = {}
        for (let reactionNumber of reactionNumbers) {
            if (Object.keys(reactionCounts).includes(reactionNumber)) {
                reactionCounts[reactionNumber]++
            } else {
                reactionCounts[reactionNumber] = 1
            }
        }
        for (let [reactionNumber, count] of Object.entries(reactionCounts)) {
            const reactionData = await reactionQueries.getReactionData(reactionNumber)
            if (reactionData) {
                reactionData["count"] = count
                reactions.push(reactionData)
            }
        }
        return reactions
    }
}

export default reactionQueries
