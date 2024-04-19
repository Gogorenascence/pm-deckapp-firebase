from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument, MongoClient
from models.booster_sets import (
    BoosterSet,
    BoosterSetIn,
    BoosterSetOut,
    BoosterSetsAll
)
from models.cards import CardOut
import os
from datetime import datetime
import random
import math


class BoosterSetQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "booster_sets"

    def get_all_booster_sets(self) -> BoosterSetsAll:
        db = self.collection.find()
        booster_sets = []
        for document in db:
            document["id"] = str(document["_id"])
            booster_sets.append(BoosterSetOut(**document))
        return booster_sets

    def get_booster_set(self, id) -> BoosterSetOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return BoosterSetOut(**props)

    def create_booster_set(self, booster_set: BoosterSetIn) -> BoosterSet:
        props = booster_set.dict()
        date = datetime.now().isoformat()
        time_dict = {
            "year": int(date[:4]),
            "month": int(date[5:7]),
            "day": int(date[8:10]),
            "time": date[11:16],
            "full_time": datetime.now(),
            "date_created": f"{int(date[5:7])}-{int(date[8:10])}-{int(date[:4])}"
        }
        props["created_on"] = time_dict
        props["updated_on"] = time_dict
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return BoosterSet(**props)

    def update_booster_set(self, id: str, booster_set: BoosterSetIn) -> BoosterSetOut:
        props = booster_set.dict()
        date = datetime.now().isoformat()
        time_dict = {
            "year": int(date[:4]),
            "month": int(date[5:7]),
            "day": int(date[8:10]),
            "time": date[11:16],
            "full_time": datetime.now(),
            "date_updated": f"{int(date[5:7])}-{int(date[8:10])}-{int(date[:4])}"
        }
        props["updated_on"] = time_dict
        date_string = props["created_on"]["full_time"]
        props["created_on"]["full_time"] = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%f")
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        print((props["created_on"]["full_time"]))
        return BoosterSetOut(**props, id=id)

    def delete_booster_set(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})

    def get_booster_set_list(self, id: str) -> dict:
        booster_set = self.collection.find_one({"_id": ObjectId(id)})
        card_lists = {
            "max_variables": [],
            "normals": [],
            "rares": [],
            "super_rares": [],
            "ultra_rares": [],
        }
        mv = booster_set["mv"]
        normals = booster_set["normals"]
        rares = booster_set["rares"]
        super_rares = booster_set["super_rares"]
        ultra_rares = booster_set["ultra_rares"]
        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.cards
        for card_item in mv:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            card_lists["max_variables"].append(CardOut(**card))
        for card_item in normals:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            card_lists["normals"].append(CardOut(**card))
        for card_item in rares:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            card_lists["rares"].append(CardOut(**card))
        for card_item in super_rares:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            card_lists["super_rares"].append(CardOut(**card))
        for card_item in ultra_rares:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            card_lists["ultra_rares"].append(CardOut(**card))
        return card_lists

    def get_pull_rarities(self, set_id, cards) -> dict:
        pull_stats = {
            "set_name": "",
            "max_variables": 0,
            "normals": 0,
            "rares": 0,
            "super_rares": 0,
            "ultra_rares": 0,
        }

        props = self.collection.find_one({"_id": ObjectId(set_id)})
        pull_stats["set_name"] = props["name"]
        max_variables = props["mv"]
        normals = props["normals"]
        rares = props["rares"]
        super_rares = props["super_rares"]

        for card in cards:
            if card in max_variables:
                pull_stats["max_variables"] += 1
            elif card in normals:
                pull_stats["normals"] += 1
            elif card in rares:
                pull_stats["rares"] += 1
            elif card in super_rares:
                pull_stats["super_rares"] += 1
            else:
                pull_stats["ultra_rares"] += 1
        return pull_stats

    def get_pull_types(self, cards) -> dict:
        types = {
            "fighters": 0,
            "auras": 0,
            "moves": 0,
            "endings": 0,
            "max_variables": 0,
            "items": 0,
            "events": 0,
            "comebacks": 0,
            "main_deck_cards": 0,
            "pluck_deck_cards": 0
        }

        for card in cards:
            if card.card_type[0] == 1001:
                types["fighters"] += 1
                types["main_deck_cards"] += 1
            elif card.card_type[0] == 1002:
                types["auras"] += 1
                types["main_deck_cards"] += 1
            elif card.card_type[0] == 1003:
                types["moves"] += 1
                types["main_deck_cards"] += 1
            elif card.card_type[0] == 1004:
                types["endings"] += 1
                types["main_deck_cards"] += 1
            elif card.card_type[0] == 1006:
                types["items"] += 1
                types["pluck_deck_cards"] += 1
            elif card.card_type[0] == 1007:
                types["events"] += 1
                types["pluck_deck_cards"] += 1
            elif card.card_type[0] == 1008:
                types["comebacks"] += 1
                types["pluck_deck_cards"] += 1
            else:
                types["max_variables"] += 1
                types["main_deck_cards"] += 1
        return types

    def open_booster_pack(self, id: str) -> dict:
        booster_set = self.collection.find_one({"_id": ObjectId(id)})
        max_variables = booster_set["mv"]
        normal_pool = booster_set["normals"]
        rare_pool = booster_set["rares"]

        super_rares_cards = booster_set["super_rares"]
        ultra_rares_cards = booster_set["ultra_rares"]

        super_rares = super_rares_cards * (500 // len(super_rares_cards))
        ultra_rares = ultra_rares_cards * (100 // len(ultra_rares_cards))
        super_rare_pool = super_rares + ultra_rares

        ratio = booster_set["ratio"]

        opened_pack = {
            "pull_list": [],
            "pulled_cards": [],
            "pull_stats": {},
            "pulled_card_types": {}
        }

        for i in range(ratio["mv"]):
            if max_variables:
                random_idx = random.randint(0, len(max_variables) - 1)
                opened_pack["pull_list"].append(max_variables[random_idx])
            else:
                pass
        for i in range(ratio["normals"]):
            random_idx = random.randint(0, len(normal_pool) - 1)
            opened_pack["pull_list"].append(normal_pool[random_idx])
        for i in range(ratio["rares"]):
            random_idx = random.randint(0, len(rare_pool) - 1)
            opened_pack["pull_list"].append(rare_pool[random_idx])
        for i in range(ratio["supers"]):
            random_idx = random.randint(0, len(super_rare_pool) - 1)
            opened_pack["pull_list"].append(super_rare_pool[random_idx])

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.cards
        for card_item in opened_pack["pull_list"]:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            opened_pack["pulled_cards"].append(CardOut(**card))
        pull_list = opened_pack["pull_list"]
        pulled_card_types = opened_pack["pulled_cards"]
        opened_pack["pull_stats"] = self.get_pull_rarities(id, pull_list)
        opened_pack["pulled_card_types"] = self.get_pull_types(pulled_card_types)
        return opened_pack

    def open_booster_packs(self, id: str, num: int) -> dict:
        opened_packs = {
            "pulls": [],
            "full_pull_list": [],
            "full_pull_stats": {},
            "full_pull_card_types": {
                "fighters": 0,
                "auras": 0,
                "moves": 0,
                "endings": 0,
                "max_variables": 0,
                "items": 0,
                "events": 0,
                "comebacks": 0,
                "main_deck_cards": 0,
                "pluck_deck_cards": 0
            }
        }

        for i in range(num):
            full_pull_list = opened_packs["full_pull_list"]
            opened_pack = self.open_booster_pack(id)
            pull_list = opened_pack["pull_list"]
            full_pull_list += pull_list
            opened_packs["pulls"].append(opened_pack)
        opened_packs["full_pull_stats"] = self.get_pull_rarities(id, full_pull_list)
        print(opened_packs["full_pull_stats"])

        for pull in opened_packs["pulls"]:
            card_types = pull["pulled_card_types"]
            full_card_types = opened_packs["full_pull_card_types"]

            full_card_types["fighters"] += card_types["fighters"]
            full_card_types["auras"] += card_types["auras"]
            full_card_types["moves"] += card_types["moves"]
            full_card_types["endings"] += card_types["endings"]
            full_card_types["items"] += card_types["items"]
            full_card_types["events"] += card_types["events"]
            full_card_types["comebacks"] += card_types["comebacks"]
            full_card_types["max_variables"] += card_types["max_variables"]
            full_card_types["main_deck_cards"] += card_types["main_deck_cards"]
            full_card_types["pluck_deck_cards"] += card_types["pluck_deck_cards"]
        print(full_card_types)
        return opened_packs

    def get_rarity_stats(self, set_id, deck_id) -> dict:
        deck_rarities = {
            "set_name": "",
            "deck_name": "",
            "max_variables": 0,
            "normals": 0,
            "rares": 0,
            "super_rares": 0,
            "ultra_rares": 0,
            "rating": 0
        }

        props = self.collection.find_one({"_id": ObjectId(set_id)})
        deck_rarities["set_name"] = props["name"]
        max_variables = props["mv"]
        normals = props["normals"]
        rares = props["rares"]
        super_rares = props["super_rares"]

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.decks

        deck = db.find_one({"_id": ObjectId(deck_id)})
        deck_rarities["deck_name"] = deck["name"]
        main_deck = deck["cards"]
        pluck_deck = deck["pluck"]

        for card in main_deck:
            if card in max_variables:
                deck_rarities["max_variables"] += 1
            elif card in normals:
                deck_rarities["normals"] += 1
                deck_rarities["rating"] += 2
            elif card in rares:
                deck_rarities["rares"] += 1
                deck_rarities["rating"] += 4
            elif card in super_rares:
                deck_rarities["super_rares"] += 1
                deck_rarities["rating"] += 8
            else:
                deck_rarities["ultra_rares"] += 1
                deck_rarities["rating"] += 16

        for card in pluck_deck:
            if card in max_variables:
                deck_rarities["max_variables"] += 1
            elif card in normals:
                deck_rarities["normals"] += 1
                deck_rarities["rating"] += 2
            elif card in rares:
                deck_rarities["rares"] += 1
                deck_rarities["rating"] += 4
            elif card in super_rares:
                deck_rarities["super_rares"] += 1
                deck_rarities["rating"] += 8
            else:
                deck_rarities["ultra_rares"] += 1
                deck_rarities["rating"] += 16

        deck_rarities["rating"] = deck_rarities["rating"]/(len(main_deck) + len(pluck_deck))
        deck_rarities["rating"] = round(deck_rarities["rating"], 2)
        return deck_rarities
