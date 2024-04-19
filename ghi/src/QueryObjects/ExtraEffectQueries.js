import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const extraEffectQueries = {
    getExtraEffectsData: async function getExtraEffectsData() {
        const extraEffectsCollectionRef = collection(db, "extra_effects")
        const response = await getDocs(extraEffectsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default extraEffectQueries
