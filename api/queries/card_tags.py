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

    def get_all_tags(self) -> TagsAll:
        db = self.collection.find()
        card_tags = []
        for document in db:
            document["id"] = str(document["_id"])
            card_tags.append(TagOut(**document))
        return card_tags

    def get_tag(self, id) -> TagOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return TagOut(**props)

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
