import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const termQueries = {
    getTermsData: async function getTermsData() {
        const termsCollectionRef = collection(db, "terms")
        const response = await getDocs(termsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default termQueries
