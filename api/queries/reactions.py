from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.card_comps import (
    ReactionIn,
    Reaction,
    ReactionOut,
    ReactionsAll,
)


class ReactionQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "reactions"


    def create_reaction(self, reaction: ReactionIn) -> Reaction:
        props = reaction.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return Reaction(**props)

    def update_reaction(self, id: str, reaction: ReactionIn) -> ReactionOut:
        props = reaction.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return ReactionOut(**props, id=id)

    def delete_reaction(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
