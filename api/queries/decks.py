from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument, MongoClient
from models.decks import (
    DeckIn,
    Deck,
    DeckOut,
    DecksAll
)
from models.cards import CardOut
import os
from datetime import datetime


class DeckQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "decks"

    def get_all_decks(self) -> DecksAll:
        db = self.collection.find()
        decks = []
        for document in db:
            document["id"] = str(document["_id"])
            decks.append(DeckOut(**document))
        return decks

    def get_deck(self, id) -> DeckOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return DeckOut(**props)

    def create_deck(self, deck: DeckIn) -> Deck:
        props = deck.dict()
        props["views"] = 0
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
        return Deck(**props)

    def update_deck(self, id: str, deck: DeckIn) -> DeckOut:
        props = deck.dict()
        date = datetime.now().isoformat()
        time_dict = {
            "year": int(date[:4]),
            "month": int(date[5:7]),
            "day": int(date[8:10]),
            "time": date[11:16],
            "full_time": datetime.now()
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
        return DeckOut(**props, id=id)

    def delete_deck(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})

    def get_deck_list(self, id: str) -> list:
        deck = self.collection.find_one({"_id": ObjectId(id)})
        card_list = deck["cards"]
        pluck_list = deck["pluck"]
        types = {
            "fighters": 0,
            "auras": 0,
            "moves": 0,
            "endings": 0,
            "max_variables": 0,
            "items": 0,
            "events": 0,
            "comebacks": 0,
        }

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.cards
        main_deck = []
        for card_item in card_list:
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            main_deck.append(CardOut(**card))
        pluck_deck = []
        for pluck_item in pluck_list:
            pluck = db.find_one({"card_number": pluck_item})
            if pluck:
                pluck["id"] = str(pluck["_id"])
                pluck_deck.append(CardOut(**pluck))
        full_list = main_deck + pluck_deck
        for card in full_list:
            if card.card_type[0] == 1001:
                types["fighters"] += 1
            elif card.card_type[0] == 1002:
                types["auras"] += 1
            elif card.card_type[0] == 1003:
                types["moves"] += 1
            elif card.card_type[0] == 1004:
                types["endings"] += 1
            elif card.card_type[0] == 1006:
                types["items"] += 1
            elif card.card_type[0] == 1007:
                types["events"] += 1
            elif card.card_type[0] == 1008:
                types["comebacks"] += 1
            else:
                types["max_variables"] += 1
        deck_list = [main_deck, pluck_deck, types]
        return deck_list

    def get_counted_deck_list(self, id: str) -> list:
        deck = self.collection.find_one({"_id": ObjectId(id)})
        card_list = deck["cards"]
        pluck_list = deck["pluck"]
        side_list = deck["side"]

        card_count = {}
        for item in card_list:
            if item not in card_count.keys():
                card_count[item] = 1
            else:
                card_count[item] += 1

        pluck_count = {}
        for item in pluck_list:
            if item not in pluck_count.keys():
                pluck_count[item] = 1
            else:
                pluck_count[item] += 1

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.cards
        main_deck = []
        for card_item, count in card_count.items():
            card = db.find_one({"card_number": card_item})
            card["id"] = str(card["_id"])
            card["count"] = count
            main_deck.append(CardOut(**card))
        pluck_deck = []
        for pluck_item, count in pluck_count.items():
            pluck = db.find_one({"card_number": pluck_item})
            if pluck:
                pluck["id"] = str(pluck["_id"])
                pluck["count"] = count
                pluck_deck.append(CardOut(**pluck))
        side_deck = []
        for side_item in side_list:
            side = db.find_one({"card_number": side_item})
            side["id"] = str(side["_id"])
            side_deck.append(CardOut(**side))
        deck_list = [main_deck, pluck_deck, side_deck]
        return deck_list

    def get_popular_cards(self) -> list:
        deck_count = {}
        all_cards_lists = []

        set_deck_count = {}
        set_all_cards_lists = []

        db = self.collection.find()
        for document in db:
            cards_list = document["cards"] + document["pluck"]
            all_cards_lists += cards_list

            set_cards_list = list(set(document["cards"] + document["pluck"]))
            set_all_cards_lists += set_cards_list

        for card in all_cards_lists:
            if card not in deck_count.keys():
                deck_count[card] = 1
            else:
                deck_count[card] += 1

        for card in set_all_cards_lists:
            if card not in set_deck_count.keys():
                set_deck_count[card] = 1
            else:
                set_deck_count[card] += 1

        DATABASE_URL = os.environ["DATABASE_URL"]
        conn = MongoClient(DATABASE_URL)
        db = conn.cards.cards

        popular_cards = []
        total_cards = 0
        for card_number, count in deck_count.items():
            card = db.find_one({"card_number":card_number})
            card["id"] = str(card["_id"])
            card["count"] = count
            total_cards += count
            popular_cards.append(CardOut(**card))

        set_popular_cards = []
        for card_number, count in set_deck_count.items():
            card = db.find_one({"card_number":card_number})
            card["id"] = str(card["_id"])
            card["count"] = count
            set_popular_cards.append(CardOut(**card))
        return popular_cards, set_popular_cards, total_cards

    def get_times(self, id) -> dict:
        time_ago = {}
        props = self.collection.find_one({"_id": ObjectId(id)})
        created = props["created_on"]["full_time"]
        updated = props["updated_on"]["full_time"]

        time_now = datetime.now()

        created_ago = abs(time_now - created)

        days_created = created_ago.days
        years_created, days_created = divmod(days_created, 365.25)
        months_created, days_created = divmod(days_created, 30.44)
        hours_created, remainder_created = divmod(created_ago.seconds, 3600)
        minutes_created, seconds_created = divmod(remainder_created, 60)

        plural_year_c = 's' if years_created > 1 else ''
        plural_month_c = 's' if months_created > 1 else ''
        plural_day_c = 's' if days_created > 1 else ''
        plural_hour_c = 's' if hours_created > 1 else ''
        plural_minute_c = 's' if minutes_created > 1 else ''

        hour_c_end = ' and ' + str(int(hours_created)) + ' hours ago' if hours_created > 1 else ' ago'
        minute_c_end = ' and ' + str(int(minutes_created)) + ' minutes ago' if minutes_created > 1 else ' ago'

        if years_created > 0:
            time_ago["created"] = f"{int(years_created)} year{plural_year_c} ago"
        elif months_created > 0:
            time_ago["created"] = f"{int(months_created)} month{plural_month_c} ago"
        elif days_created > 0:
            time_ago["created"] = f"{int(days_created)} day{plural_day_c} and {int(hours_created)} hour{plural_hour_c} ago"
            time_ago["created"] = f"{int(days_created)} day{plural_day_c} {hour_c_end}"
        elif hours_created > 0:
            time_ago["created"] = f"{int(hours_created)} hour{plural_hour_c} {minute_c_end}"
        elif minutes_created > 0:
            time_ago["created"] = f"{int(minutes_created)} minute{plural_minute_c} ago"
        else:
            time_ago["created"] = "A few seconds ago"

        updated_ago = abs(time_now - updated)

        days_updated = updated_ago.days
        years_updated, days_updated = divmod(days_updated, 365.25)
        months_updated, days_updated = divmod(days_updated, 30.44)
        hours_updated, remainder_updated = divmod(updated_ago.seconds, 3600)
        minutes_updated, seconds_updated = divmod(remainder_updated, 60)

        plural_year_u = 's' if years_updated > 1 else ''
        plural_month_u = 's' if months_updated > 1 else ''
        plural_day_u = 's' if days_updated > 1 else ''
        plural_hour_u = 's' if hours_updated > 1 else ''
        plural_minute_u = 's' if minutes_updated > 1 else ''

        hour_u_end = ' and ' + str(int(hours_updated)) + ' hours ago' if hours_updated > 1 else ' ago'
        minute_u_end = ' and ' + str(int(minutes_updated)) + ' minutes ago' if minutes_updated > 1 else ' ago'

        if years_updated > 0:
            time_ago["updated"] = f"{int(years_updated)} year{plural_year_u} ago"
        elif months_updated > 0:
            time_ago["updated"] = f"{int(months_updated)} month{plural_month_u} ago"
        elif days_updated > 0:
            time_ago["updated"] = f"{int(days_updated)} day{plural_day_u} {hour_u_end}"
        elif hours_updated > 0:
            time_ago["updated"] = f"{int(hours_updated)} hour{plural_hour_u} {minute_u_end}"
        elif minutes_updated > 0:
            time_ago["updated"] = f"{int(minutes_updated)} minute{plural_minute_u} ago"
        else:
            time_ago["updated"] = "A few seconds ago"

        return time_ago

    def get_all_full_decks(self) -> list:
        db = self.collection.find()
        decks = []
        for deck in db:
            deck["id"] = str(deck["_id"])
            deck.pop("_id")
            deck["time_ago"] = self.get_times(deck["id"])
            decks.append(deck)
        return decks

    def set_all_full_decks(self) -> list:
        db = self.collection.find()
        decks = []
        for deck in db:
            # deck["id"] = str(deck["_id"])
            card_list = set(deck["cards"])
            pluck_list = set(deck["pluck"])
            # deck["time_ago"] = self.get_times(deck["id"])

            DATABASE_URL = os.environ["DATABASE_URL"]
            conn = MongoClient(DATABASE_URL)
            db = conn.cards.cards

            card_names = []
            series_names = []
            for card_item in card_list:
                card = db.find_one({"card_number": card_item})
                card_name = card["name"]
                card_names.append(card_name)
                series_name = card["series_name"]
                series_names.append(series_name)

            for pluck_item in pluck_list:
                pluck = db.find_one({"card_number": pluck_item})
                if pluck:
                    pluck_name = pluck["name"]
                    card_names.append(pluck_name)
                    series_name = pluck["series_name"]
                    series_names.append(series_name)
                else:
                    print(deck["name"], pluck_item)
            deck["card_names"] = card_names
            deck["series_names"] = series_names
            decks.append(deck)

            self.collection.find_one_and_update(
                {"_id": ObjectId(deck["_id"])},
                {"$set": deck},
                return_document=ReturnDocument.AFTER,
            )
        return decks
