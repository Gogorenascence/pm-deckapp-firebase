import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const howToQueries = {
    getHowTosData: async function getHowTosData() {
        const howTosCollectionRef = collection(db, "how_tos")
        const response = await getDocs(howTosCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default howToQueries
