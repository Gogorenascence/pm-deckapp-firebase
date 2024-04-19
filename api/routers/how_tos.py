from models.how_tos import (
    HowToIn,
    HowToOut,
    )
from queries.how_tos import HowToQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["how_tos"])


@router.get("/api/how_tos/", response_model=list[HowToOut])
async def get_all_how_tos(queries: HowToQueries = Depends()):
    return queries.get_all_how_tos()

@router.get("/api/how_tos/{how_to_id}", response_model=HowToOut)
async def get_how_to(
    how_to_id: str,
    response: Response,
    queries: HowToQueries = Depends(),
):
    how_to = queries.get_how_to(how_to_id)
    if how_to is None:
        response.status_code = 404
    else:
        return how_to

@router.post("/api/how_tos/", response_model=HowToOut)
async def create_how_to(
    how_to_in: HowToIn,
    queries: HowToQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    how_to = queries.create_how_to(how_to_in)
    return how_to

@router.put("/api/how_tos/{how_to_id}", response_model=HowToOut | str)
async def update_how_to(
    how_to_id: str,
    how_to_in: HowToIn,
    response: Response,
    queries: HowToQueries = Depends(),
):
    how_to = queries.update_how_to(how_to_id, how_to_in)
    if how_to is None:
        response.status_code = 404
    else:
        return how_to

@router.delete("/api/how_tos/{how_to_id}", response_model=bool | str)
async def delete_how_to(
    how_to_id: str,
    response: Response,
    queries: HowToQueries = Depends(),
):
    how_to = queries.delete_how_to(how_to_id)
    if how_to is None:
        response.status_code = 404
    else:
        return True
