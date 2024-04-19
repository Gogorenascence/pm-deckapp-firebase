from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from jwtdown_fastapi.authentication import Token
from authenticator import authenticator
from pydantic import BaseModel
from queries.accounts import (
    AccountQueries,
    DuplicateAccountError,
)
from models.accounts import (
    AccountIn,
    Account,
    AccountOut,
    AccountWithOut
    )


class AccountForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    account: AccountOut


class HttpError(BaseModel):
    detail: str


router = APIRouter(tags=["accounts"])


@router.get("/api/accounts/", response_model=list[AccountOut])
async def get_all_accounts(repo: AccountQueries = Depends()):
    return repo.get_all_accounts()


@router.get("/api/accountswithout/", response_model=list[AccountWithOut])
async def get_all_accounts_without_passwords(repo: AccountQueries = Depends()):
    return repo.get_all_accounts_without_passwords()


@router.get("/api/accounts/{account_id}", response_model=AccountOut)
async def get_account(
    account_id: str,
    repo: AccountQueries = Depends(),
):
    account = repo.get_account_by_id(account_id)
    return account


@router.post("/api/accounts/", response_model=AccountToken | HttpError)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    repo: AccountQueries = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = repo.create_account(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot Create An Account With Those Credentials",
        )

    form = AccountForm(username=info.username, password=info.password)

    token = await authenticator.login(response, request, form, repo)
    return AccountToken(account=account, **token.dict())


@router.put(
    "/api/accounts/{account_id}",
    response_model=AccountToken | HttpError,
)
async def update_account(
    account_id: str,
    info: AccountIn,
    request: Request,
    response: Response,
    repo: AccountQueries = Depends(),
):
    if info.password is not None:
        hashed_password = authenticator.hash_password(info.password)
    else:
        hashed_password = None

    try:
        # if info.email in [document.email for document in repo.get_all()]:
        #   raise HTTPException(
        #   status_code=status.HTTP_400_BAD_REQUEST,
        #   detail="Account with that email already exists"
        #   )
        account = repo.update_account(account_id, info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot Create An Account With Those Credentials",
        )

    form = AccountForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return AccountToken(account=account, **token.dict())

@router.put(
    "/api/accounts/{account_id}/without",
    response_model=AccountOut,
)
async def update_with_out_password(
    account_id: str,
    info: AccountIn,
    repo: AccountQueries = Depends(),
):
    account = repo.update_with_out_password(account_id, info)
    return account

@router.delete("/api/accounts/{account_id}", response_model=bool)
async def delete_account(
    username: str,
    repo: AccountQueries = Depends(),
):
    repo.delete_account(username)
    return True


@router.get("/api/token/", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: Account = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    keys = []
    for key in request.keys():
        keys.append(key)
    print(keys)
    if authenticator.cookie_name in request.cookies:
        token_data = {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }
        return AccountToken(**token_data)
    else:
        print("dog")
