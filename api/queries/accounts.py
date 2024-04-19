from bson.objectid import ObjectId
from .client import Queries
from models.accounts import Account, AccountIn, AccountOut, AccountWithOut
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from typing import Union
from datetime import datetime


class DuplicateAccountError(ValueError):
    pass


class AccountQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "accounts"

    def get_all_accounts(self) -> list[AccountOut]:
        db = self.collection.find()
        accounts = []
        for document in db:
            document["id"] = str(document["_id"])
            accounts.append(AccountOut(**document))
        return accounts

    def get_all_accounts_without_passwords(self) -> list[AccountWithOut]:
        db = self.collection.find()
        accounts = []
        for document in db:
            document["id"] = str(document["_id"])
            accounts.append(AccountWithOut(**document))
        return accounts

    def get_account(self, username: str) -> AccountOut:
        props = self.collection.find_one({"username": username})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return AccountOut(**props)

    def get_account_by_id(self, id: str) -> AccountOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return AccountOut(**props)

    def create_account(self, info: AccountIn, hashed_password: str) -> Account:
        props = info.dict()
        props["unhashed_password"] = props["password"]
        props["password"] = hashed_password
        props["roles"] = ["member"]
        date = datetime.now().isoformat()
        time_dict = {
            "year": int(date[:4]),
            "month": int(date[5:7]),
            "day": int(date[8:10]),
            "time": date[11:16],
            "full_time": date
        }
        props["created_on"] = time_dict
        try:
            self.collection.insert_one(props)
        except DuplicateKeyError:
            raise DuplicateAccountError()
        props["id"] = str(props["_id"])
        return Account(**props)

    def update_account(
            self,
            id: str,
            info: AccountIn,
            hashed_password: Union[None, str]):
        props = info.dict()
        if hashed_password is not None:
            props["unhashed_password"] = props["password"]
            props["password"] = hashed_password

        try:
            self.collection.find_one_and_update(
                {"_id": ObjectId(id)},
                {"$set": props},
                return_document=ReturnDocument.AFTER,
            )
        except DuplicateKeyError:
            raise DuplicateAccountError()

        return AccountOut(**props, id=id)

    def update_with_out_password(self, id: str, account: AccountIn) -> AccountOut:
        props = account.dict()
        updated_account = self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return AccountOut(**updated_account, id=id)

    def delete_account(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
