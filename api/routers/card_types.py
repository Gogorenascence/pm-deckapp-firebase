from models.card_comps import (
    CardTypeIn,
    CardTypeOut,
    CardTypesAll,
    )
from queries.card_types import CardTypeQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["card_types"])


@router.get("/api/card_types/", response_model=CardTypesAll)
async def get_all_card_types(queries: CardTypeQueries = Depends()):
    return CardTypesAll(card_types=queries.get_all_card_types())

@router.get("/api/card_types/{card_type_id}", response_model=CardTypeOut)
async def get_card_type(
    card_type_id: str,
    response: Response,
    queries: CardTypeQueries = Depends(),
):
    card_type = queries.get_card_type(card_type_id)
    if card_type is None:
        response.status_code = 404
    else:
        return card_type

@router.post("/api/card_types/", response_model=CardTypeOut)
async def create_card_type(
    card_type_in: CardTypeIn,
    queries: CardTypeQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    card_type = queries.create_card_type(card_type_in)
    return card_type

@router.put("/api/card_types/{card_type_id}", response_model=CardTypeOut | str)
async def update_card_type(
    card_type_id: str,
    card_type_in: CardTypeIn,
    response: Response,
    queries: CardTypeQueries = Depends(),
):
    card_type = queries.update_card_type(card_type_id, card_type_in)
    if card_type is None:
        response.status_code = 404
    else:
        return card_type

@router.delete("/api/card_types/{card_type_id}", response_model=bool | str)
async def delete_card_type(
    card_type_id: str,
    response: Response,
    queries: CardTypeQueries = Depends(),
):
    card_type = queries.delete_card_type(card_type_id)
    if card_type is None:
        response.status_code = 404
    else:
        return True
