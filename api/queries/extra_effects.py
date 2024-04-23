from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.card_comps import (
    ExtraEffectIn,
    ExtraEffect,
    ExtraEffectOut,
    ExtraEffectsAll,
)

class ExtraEffectQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "extra_effects"


    def create_extra_effect(self, extra_effect: ExtraEffectIn) -> ExtraEffect:
        props = extra_effect.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return ExtraEffect(**props)

    def update_extra_effect(self, id: str, extra_effect: ExtraEffectIn) -> ExtraEffectOut:
        props = extra_effect.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return ExtraEffectOut(**props, id=id)

    def delete_extra_effect(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
