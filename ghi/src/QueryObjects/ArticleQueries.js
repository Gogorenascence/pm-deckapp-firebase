import { db } from "../Firebase"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"

const articleQueries = {
    getarticlesData: async function getarticlesData() {
        const articlesCollectionRef = collection(db, "articles")
        const response = await getDocs(articlesCollectionRef);
        const data = response.docs.map((doc) => ({
            ...doc.data(),
        }))
        return data
    },
    getArticleDataById: async function getArticleDataById(id) {
        const articleCollectionRef = collection(db, "articles");
        const articleQuery = query(
            articleCollectionRef,
            where("id", "==", id)
        )
        const snapshot = await getDocs(articleQuery);
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        } else {
            const articleData = snapshot.docs[0].data();
            return articleData;
        }
    },
}

export default articleQueries
