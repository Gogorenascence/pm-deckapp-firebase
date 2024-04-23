from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.categories import (
    CardCategory,
    CardCategoryIn,
    CardCategoryOut,
    CardCategoriesAll
)
from datetime import datetime


class CardCategoryQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "card_categories"


    def create_card_category(self, card_category: CardCategoryIn) -> CardCategory:
        props = card_category.dict()
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
        return CardCategory(**props)

    def update_card_category(self, id: str, card_category: CardCategoryIn) -> CardCategoryOut:
        props = card_category.dict()
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
        return CardCategoryOut(**props, id=id)

    def delete_card_category(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
