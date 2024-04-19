import { db } from "../Firebase"
import { getDocs, collection } from "firebase/firestore"

const articleQueries = {
    getarticlesData: async function getarticlesData() {
        const articlesCollectionRef = collection(db, "articles")
        const response = await getDocs(articlesCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        console.log(data)
        return data
    }
}

export default articleQueries
