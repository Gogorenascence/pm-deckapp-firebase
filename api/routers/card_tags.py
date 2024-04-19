from models.card_comps import (
    TagIn,
    TagOut,
    TagsAll
    )
from queries.card_tags import TagQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["card_tags"])


@router.get("/api/tags/", response_model=TagsAll)
async def get_all_tags(queries: TagQueries = Depends()):
    return TagsAll(card_tags=queries.get_all_tags())

@router.get("/api/tags/{tag_id}", response_model=TagOut)
async def get_tag(
    tag_id: str,
    response: Response,
    queries: TagQueries = Depends(),
):
    card_tag = queries.get_tag(tag_id)
    if card_tag is None:
        response.status_code = 404
    else:
        return card_tag

@router.post("/api/tags/", response_model=TagOut)
async def create_tag(
    tag_in: TagIn,
    queries: TagQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    card_tag = queries.create_tag(tag_in)
    return card_tag

@router.put("/api/tags/{tag_id}", response_model=TagOut | str)
async def update_tag(
    tag_id: str,
    tag_in: TagIn,
    response: Response,
    queries: TagQueries = Depends(),
):
    card_tag = queries.update_tag(tag_id, tag_in)
    if card_tag is None:
        response.status_code = 404
    else:
        return card_tag

@router.delete("/api/tags/{tag_id}", response_model=bool | str)
async def delete_tag(
    tag_id: str,
    response: Response,
    queries: TagQueries = Depends(),
):
    card_tag = queries.delete_tag(tag_id)
    if card_tag is None:
        response.status_code = 404
    else:
        return True
