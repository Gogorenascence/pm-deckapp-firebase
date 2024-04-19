from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.articles import (
    ArticleIn,
    Article,
    ArticleOut,
    ArticlesAll,
)

class ArticleQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "articles"

    def get_all_articles(self) -> ArticlesAll:
        db = self.collection.find()
        articles = []
        for document in db:
            document["id"] = str(document["_id"])
            articles.append(ArticleOut(**document))
        return articles

    def get_article(self, id) -> ArticleOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return ArticleOut(**props)

    def create_article(self, article: ArticleIn) -> Article:
        props = article.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return Article(**props)

    def update_article(self, id: str, article: ArticleIn) -> ArticleOut:
        props = article.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return ArticleOut(**props, id=id)

    def delete_article(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
