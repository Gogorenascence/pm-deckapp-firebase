from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.how_tos import (
    HowToIn,
    HowTo,
    HowToOut
)


class HowToQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "how_tos"


    def get_how_to(self, id) -> HowToOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return HowToOut(**props)

    def create_how_to(self, how_to: HowToIn) -> HowTo:
        props = how_to.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return HowTo(**props)

    def update_how_to(self, id: str, how_to: HowToIn) -> HowToOut:
        props = how_to.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return HowToOut(**props, id=id)

    def delete_how_to(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
