from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.card_comps import (
    TagIn,
    CardTag,
    TagOut,
    TagsAll
)


class TagQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "card_tags"



    def create_tag(self, card_tag: TagIn) -> CardTag:
        props = card_tag.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return CardTag(**props)

    def update_tag(self, id: str, card_tag: TagIn) -> TagOut:
        props = card_tag.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return TagOut(**props, id=id)

    def delete_tag(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
