import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const termQueries = {
    getTermsData: async function getTermsData() {
        const termsCollectionRef = collection(db, "terms")
        const response = await getDocs(termsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        return data
    },
    getTermDataById: async function getTermDataById(id) {
        const termsCollectionRef = collection(db, "terms");
        const termQuery = query(
            termsCollectionRef,
            where("id", "==", id)
            )
        const snapshot = await getDocs(termQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const termData = snapshot.docs[0].data();
            return termData;
        }
    }
}

export default termQueries
