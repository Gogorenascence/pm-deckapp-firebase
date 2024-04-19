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

    def get_all_cards(self) -> CardsAll:
        db = self.collection.find()
        cards = []
        for document in db:
            document["id"] = str(document["_id"])
            cards.append(CardOut(**document))
        return cards

    def get_card(self, card_number) -> CardOut:
        props = self.collection.find_one({"card_number": card_number})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return CardOut(**props)

    def get_related_cards(self, card_number) -> CardsAll:
        card = self.collection.find_one({"card_number": card_number})
        if not card:
            return None
        hero_id = card["hero_id"]
        db = self.collection.find()
        cards = []
        for document in db:
            document["id"] = str(document["_id"])
            if ((document["hero_id"] == hero_id) and
                (document["card_number"] != card_number)):
                cards.append(CardOut(**document))
        return cards

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

    def get_card_type(self, card_number: int) -> CardTypeOut:
        props = self.collection.find_one({"card_number": card_number})
        card_type_number = props["card_type"][0]

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.card_types

        card_type = db.find_one({"type_number": card_type_number})
        card_type["id"] = str(card_type["_id"])
        return card_type

    def get_extra_effects(self, card_number: int) -> list:
        props = self.collection.find_one({"card_number": card_number})
        extra_effect_numbers = props["extra_effects"]

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.extra_effects

        extra_effects = []
        for extra_effect_number in extra_effect_numbers:
            extra_effect = db.find_one({"effect_number": extra_effect_number})
            extra_effect["id"] = str(extra_effect["_id"])
            extra_effects.append(ExtraEffectOut(**extra_effect))
        return extra_effects

    def get_reactions(self, card_number: int) -> list:
        props = self.collection.find_one({"card_number": card_number})
        reaction_numbers = props["reactions"]

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
        return reactions

    def get_tags(self, card_number: int) -> list:
        props = self.collection.find_one({"card_number": card_number})
        card_tag_numbers = props["card_tags"]

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.card_tags

        card_tags = []
        for card_tag_number in card_tag_numbers:
            card_tag = db.find_one({"tag_number": card_tag_number})
            card_tag["id"] = str(card_tag["_id"])
            card_tags.append(TagOut(**card_tag))
        return card_tags

    def get_full_card(self, card_number) -> CardOut:
        props = self.collection.find_one({"card_number": card_number})
        if not props:
            return None

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
        return CardOut(**props)

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

    def get_all_game_cards(self):
        db = self.collection.find()
        items = []
        for document in db:
            document["id"] = str(document["_id"])
            items.append(CardOut(**document))
        items.sort(key=lambda x: x.hero_id)
        cards = []
        for card in items:
            print(type(card.card_type[0]))
            if card.card_type[0] < 1006:
                print(card)
                game_card_name = card.file_name
                id = card.card_number
                name = card.name
                series_names = card.series_name.split("//")
                enthusiasm = card.enthusiasm
                effect_text = card.effect_text
                second_effect_text = card.second_effect_text
                effect = "Effect Value"
                second_effect = "Second Effect Value"
                picture_url = card.picture_url
                card_type = card.card_type[0]
                reactions = card.reactions
                card_tags = card.card_tags

                card_template = '''
{game_card_name} = MainDeckCard(
    id={id},
    name='{name}',
    series_names={series_names},
    hp=5,
    defending=False,
    enthusiasm={enthusiasm},
    effect_text="{effect_text}",
    second_effect_text="{second_effect_text}",
    effect="Effect Value",
    second_effect="Second Effect Value",
    picture_url="{picture_url}",
    card_type={card_type},
    reactions={reactions},
    card_tags={card_tags}
)
'''

                card_code = card_template.format(
                    game_card_name=game_card_name,
                    id=id,
                    name=name,
                    series_names=series_names,
                    enthusiasm=enthusiasm,
                    effect_text=effect_text,
                    second_effect_text=second_effect_text,
                    effect=effect,
                    second_effect=second_effect,
                    picture_url=picture_url,
                    card_type=card_type,
                    reactions=reactions,
                    card_tags=card_tags
                )
                cards.append(card_code)

            else:
                game_card_name = card.file_name
                id = card.card_number
                name = card.name
                series_names = card.series_name.split("//")
                effect_text = card.effect_text
                second_effect_text = card.second_effect_text
                effect = "Effect Value"
                second_effect = "Second Effect Value"
                picture_url = card.picture_url
                card_type = card.card_type[0]
                card_tags = card.card_tags

                card_template = '''
{game_card_name} = PluckDeckCard(
    id={id},
    name="{name}",
    series_names={series_names},
    effect_text="{effect_text}",
    second_effect_text="{second_effect_text}",
    effect="Effect Value",
    second_effect="Second Effect Value",
    picture_url="{picture_url}",
    card_type={card_type},
    card_tags={card_tags}
)
'''

                card_code = card_template.format(
                    game_card_name=game_card_name,
                    id=id,
                    name=name,
                    series_names=series_names,
                    effect_text=effect_text,
                    second_effect_text=second_effect_text,
                    effect=effect,
                    second_effect=second_effect,
                    picture_url=picture_url,
                    card_type=card_type,
                    card_tags=card_tags
                )
                cards.append(card_code)
        return cards
