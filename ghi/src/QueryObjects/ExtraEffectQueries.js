import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const extraEffectQueries = {
    getExtraEffectsData: async function getExtraEffectsData() {
        const extraEffectsCollectionRef = collection(db, "extra_effects")
        const response = await getDocs(extraEffectsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getExtraEffectData: async function getExtraEffectData(extraEffectNumber) {
        const extraEffectsCollectionRef = collection(db, "extra_effects");
        const int_effect_number = parseInt(extraEffectNumber, 10);
        const extraEffectQuery = query(
            extraEffectsCollectionRef,
            where("effect_number", "==", int_effect_number)
            )
        const snapshot = await getDocs(extraEffectQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const extraEffectData = snapshot.docs[0].data();
            return extraEffectData;
        }
    },
    getExtraEffectDataFromCard: async function getExtraEffectDataFromCard(extraEffectNumbers) {
        const extraEffects = []
        for (let extraEffectNumber of extraEffectNumbers) {
            const extraEffectData = await extraEffectQueries.getExtraEffectData(extraEffectNumber)
            extraEffects.push(extraEffectData)
        }
        return extraEffects
    }
}

export default extraEffectQueries
