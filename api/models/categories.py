from pydantic import BaseModel
from typing import List, Optional
from bson.objectid import ObjectId


class PydanticObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value: ObjectId | str) -> ObjectId:
        if value:
            try:
                ObjectId(value)
            except ValueError:
                raise ValueError(f"Not a valid object id: {value}")
        return value


class CardCategoryIn(BaseModel):
    cat_type: str
    name: str
    description: Optional[str]
    article: Optional[str]
    support: list
    anti_support: list
    created_on: dict
    updated_on: dict



class CardCategory(CardCategoryIn):
    id: PydanticObjectId


class CardCategoryOut(CardCategoryIn):
    id: str

class CardCategoriesAll(BaseModel):
    card_categories: List
