import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const howToQueries = {
    getHowTosData: async function getHowTosData() {
        const howTosCollectionRef = collection(db, "how_tos")
        const response = await getDocs(howTosCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getHowToDataById: async function getHowToDataById(id) {
        const howTosCollectionRef = collection(db, "how_tos");
        const howToQuery = query(
            howTosCollectionRef,
            where("id", "==", id)
        )
        const snapshot = await getDocs(howToQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const howToData = snapshot.docs[0].data();
            return howToData;
        }
    },
}

export default howToQueries
