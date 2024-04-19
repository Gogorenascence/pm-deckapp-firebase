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


class DeckIn(BaseModel):
    name: str
    account_id: str
    description: Optional[str]
    strategies: Optional[list]
    cards: list
    pluck: Optional[list]
    side: Optional[list]
    views: Optional[int]
    created_on: Optional[dict]
    updated_on: Optional[dict]
    cover_card: Optional[str]
    parent_id: Optional[str]
    card_names: Optional[list]
    series_names: Optional[list]
    private: Optional[bool]


class Deck(DeckIn):
    id: PydanticObjectId


class DeckOut(DeckIn):
    id: str


class DecksAll(BaseModel):
    decks: List
