from models.card_comps import (
    ReactionIn,
    ReactionOut,
    ReactionsAll,
    )
from queries.reactions import ReactionQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["reactions"])


@router.get("/api/reactions/", response_model=ReactionsAll)
async def get_all_reactions(queries: ReactionQueries = Depends()):
    return ReactionsAll(reactions=queries.get_all_reactions())

@router.get("/api/reactions/{reaction_id}", response_model=ReactionOut)
async def get_reaction(
    reaction_id: str,
    response: Response,
    queries: ReactionQueries = Depends(),
):
    reaction = queries.get_reaction(reaction_id)
    if reaction is None:
        response.status_code = 404
    else:
        return reaction

@router.post("/api/reactions/", response_model=ReactionOut)
async def create_reaction(
    reaction_in: ReactionIn,
    queries: ReactionQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    reaction = queries.create_reaction(reaction_in)
    return reaction

@router.put("/api/reactions/{reaction_id}", response_model=ReactionOut | str)
async def update_reaction(
    reaction_id: str,
    reaction_in: ReactionIn,
    response: Response,
    queries: ReactionQueries = Depends(),
):
    reaction = queries.update_reaction(reaction_id, reaction_in)
    if reaction is None:
        response.status_code = 404
    else:
        return reaction

@router.delete("/api/reactions/{reaction_id}", response_model=bool | str)
async def delete_reaction(
    reaction_id: str,
    response: Response,
    queries: ReactionQueries = Depends(),
):
    reaction = queries.delete_reaction(reaction_id)
    if reaction is None:
        response.status_code = 404
    else:
        return True
