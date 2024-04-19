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
from queries.password_resets import (
    PasswordResetQueries,
)
from models.password_reset import (
    PasswordResetIn,
    PasswordReset,
    PasswordResetOut,
)


router = APIRouter(tags=["password_resets"])


@router.get("/api/password_resets/", response_model=list[PasswordResetOut])
async def get_all_password_resets(repo: PasswordResetQueries = Depends()):
    return repo.get_all_password_resets()


@router.get("/api/password_resets/{password_reset_id}", response_model=PasswordResetOut)
async def get_password_reset(
    password_reset_id: str,
    repo: PasswordResetQueries = Depends(),
):
    password_reset = repo.get_password_reset(password_reset_id)
    return password_reset


@router.post("/api/password_resets/", response_model=PasswordResetOut)
async def create_password_reset(
    info: PasswordResetIn,
    repo: PasswordResetQueries = Depends(),
):
    password_reset = repo.create_password_reset(info)
    return password_reset


@router.delete("/api/password_resets/{password_reset_id}", response_model=bool)
async def delete_password_reset(
    username: str,
    repo: PasswordResetQueries = Depends(),
):
    repo.delete_password_reset(username)
    return True
