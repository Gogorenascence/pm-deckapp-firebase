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


class TermIn(BaseModel):
    name: str
    text: str
    term_number: int


class Term(TermIn):
    id: PydanticObjectId


class TermOut(TermIn):
    id: str
