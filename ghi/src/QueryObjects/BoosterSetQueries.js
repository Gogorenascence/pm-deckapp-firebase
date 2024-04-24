import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"
import cardQueries from "./CardQueries"

const boosterSetQueries = {
    getBoosterSetsData: async function getBoosterSetsData() {
        const boosterSetsCollectionRef = collection(db, "booster_sets")
        const response = await getDocs(boosterSetsCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    },
    getBoosterSetDataById: async function getBoosterSetDataById(id) {
        const boosterSetsCollectionRef = collection(db, "booster_sets");
        const boosterSetQuery = query(
            boosterSetsCollectionRef,
            where("id", "==", id)
        )
        const snapshot = await getDocs(boosterSetQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const boosterSetData = snapshot.docs[0].data();
            return boosterSetData;
        }
    },
    getBoosterSetListDataById: async function getBoosterSetListDataById(id) {
        const boosterSetsCollectionRef = collection(db, "booster_sets");
        const boosterSetQuery = query(
            boosterSetsCollectionRef,
            where("id", "==", id)
        )
        const snapshot = await getDocs(boosterSetQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const boosterSet = snapshot.docs[0].data();
            const cards = await cardQueries.getCardsData();

            const listData = {
                "booster_set_info": boosterSet,
                "max_variables": [],
                "normals": [],
                "rares": [],
                "super_rares": [],
                "ultra_rares": []
            }
            listData["max_variables"] = boosterSet.mv.map((card_number) => cards.find(card => card.card_number === card_number))
            listData["normals"] = boosterSet.normals.map((card_number) => cards.find(card => card.card_number === card_number))
            listData["rares"] = boosterSet.rares.map((card_number) => cards.find(card => card.card_number === card_number))
            listData["super_rares"] = boosterSet.super_rares.map((card_number) => cards.find(card => card.card_number === card_number))
            listData["ultra_rares"] = boosterSet.ultra_rares.map((card_number) => cards.find(card => card.card_number === card_number))
            return listData
        }
    }
}

export default boosterSetQueries
