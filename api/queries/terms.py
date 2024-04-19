from bson.objectid import ObjectId
from .client import Queries
from models.rulings import TermIn, Term, TermOut
from pymongo import ReturnDocument


class DuplicateTermError(ValueError):
    pass


class TermQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "terms"

    def get_all_terms(self) -> list[TermOut]:
        db = self.collection.find()
        terms = []
        for document in db:
            document["id"] = str(document["_id"])
            terms.append(TermOut(**document))
        return terms

    def get_term(self, id: str) -> TermOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return TermOut(**props)

    def create_term(self, info: TermIn) -> Term:
        props = info.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return Term(**props)

    def update_term(self, id: str, term: TermIn) -> TermOut:
        props = term.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return TermOut(**props, id=id)

    def delete_term(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
