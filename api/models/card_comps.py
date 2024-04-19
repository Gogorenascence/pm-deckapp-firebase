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


class CardTypeIn(BaseModel):
    name: str
    deck_type: Optional[str]
    description: Optional[str]
    rules: Optional[str]
    type_number: Optional[int]
    support: Optional[list]
    anti_support: Optional[list]


class CardType(CardTypeIn):
    id: PydanticObjectId


class CardTypeOut(CardTypeIn):
    id: str


class CardTypesAll(BaseModel):
    card_types: List


class ExtraEffectIn(BaseModel):
    name: str
    rules: Optional[str]
    effect_number: Optional[int]
    support: Optional[list]
    anti_support: Optional[list]


class ExtraEffect(ExtraEffectIn):
    id: PydanticObjectId


class ExtraEffectOut(ExtraEffectIn):
    id: str


class ExtraEffectsAll(BaseModel):
    extra_effects: List


class ReactionIn(BaseModel):
    name: str
    rules: Optional[str]
    count: Optional[int]
    reaction_number: Optional[int]
    support: Optional[list]
    anti_support: Optional[list]


class Reaction(ReactionIn):
    id: PydanticObjectId


class ReactionOut(ReactionIn):
    id: str


class ReactionsAll(BaseModel):
    reactions: List


class TagIn(BaseModel):
    name: str
    rules: Optional[str]
    tag_number: Optional[int]
    support: Optional[list]
    anti_support: Optional[list]


class CardTag(TagIn):
    id: PydanticObjectId


class TagOut(TagIn):
    id: str


class TagsAll(BaseModel):
    card_tags: List
