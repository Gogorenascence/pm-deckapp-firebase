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


class AccountIn(BaseModel):
    email: str
    password: str
    username: str
    unhashed_password: Optional[str]
    collection: Optional[List]
    wishlist: Optional[List]
    decks: Optional[List]
    favorited_decks: Optional[List]
    roles: Optional[List]
    created_on: Optional[dict]


class Account(AccountIn):
    id: PydanticObjectId


class AccountOut(AccountIn):
    id: str

class AccountWithOut(BaseModel):
    email: str
    username: str
    collection: Optional[List]
    wishlist: Optional[List]
    decks: Optional[List]
    favorited_decks: Optional[List]
    roles: Optional[List]
    created_on: Optional[dict]
    id: str
