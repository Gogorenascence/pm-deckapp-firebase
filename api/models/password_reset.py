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



class PasswordResetIn(BaseModel):
    email: str
    username: str
    account_id: str


class PasswordReset(PasswordResetIn):
    id: PydanticObjectId


class PasswordResetOut(PasswordResetIn):
    id: str
