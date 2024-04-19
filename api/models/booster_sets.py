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


class BoosterSetIn(BaseModel):
    name: str
    description: Optional[str]
    ratio: dict
    mv: list
    normals: list
    rares: list
    super_rares: list
    ultra_rares: list
    created_on: Optional[dict]
    updated_on: Optional[dict]
    all_cards: Optional[List]
    cover_image: Optional[str]


class BoosterSet(BoosterSetIn):
    id: PydanticObjectId


class BoosterSetOut(BoosterSetIn):
    id: str


class BoosterSetsAll(BaseModel):
    booster_sets: List
