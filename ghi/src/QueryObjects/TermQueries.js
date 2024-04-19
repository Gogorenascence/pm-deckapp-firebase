import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const boosterSetQueries = {
    getboosterSetsData: async function getboosterSetsData() {
        const boosterSetsCollectionRef = collection(db, "booster_sets")
        const response = await getDocs(boosterSetsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default boosterSetQueries
