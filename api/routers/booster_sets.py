from models.booster_sets import (
    BoosterSetIn,
    BoosterSetOut,
    BoosterSetsAll
    )

from queries.booster_sets import BoosterSetQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["booster_sets"])


@router.get("/api/booster_sets/", response_model=BoosterSetsAll)
async def get_all_booster_sets(queries: BoosterSetQueries = Depends()):
    return BoosterSetsAll(booster_sets=queries.get_all_booster_sets())

@router.get("/api/booster_sets/{booster_set_id}/", response_model=BoosterSetOut)
async def get_booster_set(
    booster_set_id: str,
    response: Response,
    queries: BoosterSetQueries = Depends(),
):
    booster_set = queries.get_booster_set(booster_set_id)
    if booster_set is None:
        response.status_code = 404
    else:
        return booster_set

@router.post("/api/booster_sets/", response_model=BoosterSetOut)
async def create_booster_set(
    booster_set_in: BoosterSetIn,
    queries: BoosterSetQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    booster_set = queries.create_booster_set(booster_set_in)
    return booster_set

@router.put("/api/booster_sets/{booster_set_id}/", response_model=BoosterSetOut | str)
async def update_booster_set(
    booster_set_id: str,
    booster_set_in: BoosterSetIn,
    response: Response,
    queries: BoosterSetQueries = Depends(),
):
    booster_set = queries.update_booster_set(booster_set_id, booster_set_in)
    if booster_set is None:
        response.status_code = 404
    else:
        return booster_set

@router.delete("/api/booster_sets/{booster_set_id}/", response_model=bool | str)
async def delete_booster_set(
    booster_set_id: str,
    response: Response,
    queries: BoosterSetQueries = Depends(),
):
    booster_set = queries.delete_booster_set(booster_set_id)
    if booster_set is None:
        response.status_code = 404
    else:
        return True

@router.get("/api/booster_sets/{booster_set_id}/list/", response_model=dict)
async def get_booster_set_list(
    booster_set_id: str,
    queries: BoosterSetQueries= Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    card_lists = queries.get_booster_set_list(booster_set_id)
    return card_lists

@router.get("/api/booster_sets/{booster_set_id}/open/", response_model=dict)
async def open_booster_pack(
    booster_set_id: str,
    queries: BoosterSetQueries= Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    opened_pack = queries.open_booster_pack(booster_set_id)
    return opened_pack

@router.get("/api/booster_sets/{booster_set_id}/open/{num}", response_model=dict)
async def open_booster_packs(
    booster_set_id: str,
    num: int,
    queries: BoosterSetQueries= Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    opened_packs = queries.open_booster_packs(booster_set_id, num)
    return opened_packs

@router.get("/api/rarity_stats/{set_id}/{deck_id}", response_model=dict)
async def get_rarity_stats(
    set_id: str,
    deck_id: str,
    queries: BoosterSetQueries= Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    deck_rarities = queries.get_rarity_stats(set_id, deck_id)
    return deck_rarities
