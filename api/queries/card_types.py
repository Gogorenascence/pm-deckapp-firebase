from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.card_comps import (
    CardTypeIn,
    CardType,
    CardTypeOut,
    CardTypesAll,
)


class CardTypeQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "card_types"


    def create_card_type(self, card_type: CardTypeIn) -> CardType:
        props = card_type.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return CardType(**props)

    def update_card_type(self, id: str, card_type: CardTypeIn) -> CardTypeOut:
        props = card_type.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return CardTypeOut(**props, id=id)

    def delete_card_type(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
