from models.card_comps import (
    ExtraEffectIn,
    ExtraEffectOut,
    ExtraEffectsAll,
    )
from queries.extra_effects import ExtraEffectQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["extra_effects"])


@router.get("/api/extra_effects/", response_model=ExtraEffectsAll)
async def get_all_extra_effects(queries: ExtraEffectQueries = Depends()):
    return ExtraEffectsAll(extra_effects=queries.get_all_extra_effects())

@router.get("/api/extra_effects/{extra_effect_id}", response_model=ExtraEffectOut)
async def get_extra_effect(
    extra_effect_id: str,
    response: Response,
    queries: ExtraEffectQueries = Depends(),
):
    extra_effect = queries.get_extra_effect(extra_effect_id)
    if extra_effect is None:
        response.status_code = 404
    else:
        return extra_effect

@router.post("/api/extra_effects/", response_model=ExtraEffectOut)
async def create_extra_effect(
    extra_effect_in: ExtraEffectIn,
    queries: ExtraEffectQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    extra_effect = queries.create_extra_effect(extra_effect_in)
    return extra_effect

@router.put("/api/extra_effects/{extra_effect_id}", response_model=ExtraEffectOut | str)
async def update_extra_effect(
    extra_effect_id: str,
    extra_effect_in: ExtraEffectIn,
    response: Response,
    queries: ExtraEffectQueries = Depends(),
):
    extra_effect = queries.update_extra_effect(extra_effect_id, extra_effect_in)
    if extra_effect is None:
        response.status_code = 404
    else:
        return extra_effect

@router.delete("/api/extra_effects/{extra_effect_id}", response_model=bool | str)
async def delete_extra_effect(
    extra_effect_id: str,
    response: Response,
    queries: ExtraEffectQueries = Depends(),
):
    extra_effect = queries.delete_extra_effect(extra_effect_id)
    if extra_effect is None:
        response.status_code = 404
    else:
        return True
