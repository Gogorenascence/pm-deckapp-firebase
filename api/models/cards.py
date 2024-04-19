from pydantic import BaseModel
from typing import Optional
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


class CardIn(BaseModel):
    name: str
    card_class: str
    hero_id: str
    series_name: str
    card_number: int
    enthusiasm: Optional[int]
    effect_text: Optional[str]
    second_effect_text: Optional[str]
    illustrator: Optional[str]
    picture_url: Optional[str]
    file_name: str
    card_type: list
    extra_effects: list
    reactions: list
    card_tags: list
    created_on: dict
    updated_on: dict
    alpha: Optional[bool]
    beta: Optional[bool]


class Card(CardIn):
    id: PydanticObjectId


class CardOut(CardIn):
    id: str
    count: Optional[int]


class CardsAll(BaseModel):
    cards: list
