import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const reactionQueries = {
    getReactionsData: async function getReactionsData() {
        const reactionsCollectionRef = collection(db, "reactions")
        const response = await getDocs(reactionsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default reactionQueries
