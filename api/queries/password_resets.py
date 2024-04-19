from bson.objectid import ObjectId
from .client import Queries
from models.password_reset import PasswordResetIn, PasswordReset, PasswordResetOut
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from typing import Union


class DuplicatePasswordResetError(ValueError):
    pass


class PasswordResetQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "password_resets"

    def get_all_password_resets(self) -> list[PasswordResetOut]:
        db = self.collection.find()
        password_resets = []
        for document in db:
            document["id"] = str(document["_id"])
            password_resets.append(PasswordResetOut(**document))
        return password_resets

    def get_password_reset(self, id: str) -> PasswordResetOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return PasswordResetOut(**props)

    def create_password_reset(self, info: PasswordResetIn) -> PasswordReset:
        props = info.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return PasswordResetOut(**props)

    def delete_password_reset(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})




# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=1)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt
