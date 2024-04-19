import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from models.accounts import AccountOut, Account
from queries.accounts import AccountQueries


class Auth(Authenticator):
    async def get_account_data(
        self,
        username: str,
        accounts: AccountQueries,
    ):
        return accounts.get_account(username)

    def get_account_getter(
        self,
        accounts: AccountQueries = Depends(),
    ):
        return accounts

    def get_hashed_password(self, account: Account):
        return account.password

    def get_account_data_for_cookie(self, account: Account):
        return account.username, AccountOut(**account.dict())


authenticator = Auth(os.environ["SIGNING_KEY"])
