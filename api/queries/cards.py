from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument, MongoClient
from models.cards import (
    CardIn,
    Card,
    CardOut,
    CardsAll
)
from models.card_comps import (
    CardTypeOut,
    ExtraEffectOut,
    ReactionOut,
    TagOut
)
import os
from datetime import datetime


class CardQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "cards"

    def create_card(self, card: CardIn) -> Card:
        props = card.dict()
        date = datetime.now().isoformat()
        time_dict = {
            "year": int(date[:4]),
            "month": int(date[5:7]),
            "day": int(date[8:10]),
            "time": date[11:16],
            "full_time": datetime.now()
        }
        props["created_on"] = time_dict
        props["updated_on"] = time_dict
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return Card(**props)

    def update_card(self, id: str, card: CardIn) -> CardOut:
        props = card.dict()
        date = datetime.now().isoformat()
        time_dict = {
            "year": int(date[:4]),
            "month": int(date[5:7]),
            "day": int(date[8:10]),
            "time": date[11:16],
            "full_time": datetime.now()
        }
        props["updated_on"] = time_dict
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return CardOut(**props, id=id)

    def delete_card(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})

    def get_all_full_cards(self) -> CardsAll:
        db = self.collection.find()
        cards = []
        for props in db:
            card_type_number = props["card_type"][0]
            extra_effect_numbers = props["extra_effects"]
            card_tag_numbers = props["card_tags"]
            reaction_numbers = props["reactions"]

            DATABASE_URL = os.environ["DATABASE_URL"]
            conn = MongoClient(DATABASE_URL)
            db = conn.cards.card_types

            card_types = []
            card_type = db.find_one({"type_number": card_type_number})
            card_type["id"] = str(card_type["_id"])
            card_types.append(CardTypeOut(**card_type))
            props["card_type"] = card_types

            DATABASE_URL = os.environ["DATABASE_URL"]
            conn = MongoClient(DATABASE_URL)
            db = conn.cards.extra_effects

            extra_effects = []
            for extra_effect_number in extra_effect_numbers:
                extra_effect = db.find_one({"effect_number": extra_effect_number})
                extra_effect["id"] = str(extra_effect["_id"])
                extra_effects.append(ExtraEffectOut(**extra_effect))
            props["extra_effects"] = extra_effects

            DATABASE_URL = os.environ["DATABASE_URL"]
            conn = MongoClient(DATABASE_URL)
            db = conn.cards.card_tags

            card_tags = []
            for card_tag_number in card_tag_numbers:
                card_tag = db.find_one({"tag_number": card_tag_number})
                card_tag["id"] = str(card_tag["_id"])
                card_tags.append(TagOut(**card_tag))
            props["card_tags"] = card_tags

            DATABASE_URL = os.environ["DATABASE_URL"]
            conn = MongoClient(DATABASE_URL)
            db = conn.cards.reactions

            reactions = []
            reaction_counts = {}
            for reaction_number in reaction_numbers:
                if reaction_number not in reaction_counts.keys():
                    reaction_counts[reaction_number] = 1
                else:
                    reaction_counts[reaction_number] += 1
            for a,b in reaction_counts.items():
                reaction = db.find_one({"reaction_number": a})
                reaction["id"] = str(reaction["_id"])
                reaction["count"] = b
                reactions.append(ReactionOut(**reaction))
            props["reactions"] = reactions

            props["id"] = str(props["_id"])
            cards.append(CardOut(**props))
        return cards
