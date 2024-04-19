from models.categories import (
    CardCategoryIn,
    CardCategoryOut,
    CardCategoriesAll,
    )
from queries.categories import CardCategoryQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["card_categories"])


@router.get("/api/card_categories/", response_model=CardCategoriesAll)
async def get_all_card_categories(queries: CardCategoryQueries = Depends()):
    return CardCategoriesAll(card_categories=queries.get_all_card_categories())

@router.get("/api/card_categories/{card_category_id}", response_model=CardCategoryOut)
async def get_card_category(
    card_category_id: str,
    response: Response,
    queries: CardCategoryQueries = Depends(),
):
    card_category = queries.get_card_category(card_category_id)
    if card_category is None:
        response.status_code = 404
    else:
        return card_category

@router.post("/api/card_categories/", response_model=CardCategoryOut)
async def create_card_category(
    card_category_in: CardCategoryIn,
    queries: CardCategoryQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    card_category = queries.create_card_category(card_category_in)
    return card_category

@router.put("/api/card_categories/{card_category_id}", response_model=CardCategoryOut | str)
async def update_card_category(
    card_category_id: str,
    card_category_in: CardCategoryIn,
    response: Response,
    queries: CardCategoryQueries = Depends(),
):
    card_category = queries.update_card_category(card_category_id, card_category_in)
    if card_category is None:
        response.status_code = 404
    else:
        return card_category

@router.delete("/api/card_categories/{card_category_id}", response_model=bool | str)
async def delete_card_category(
    card_category_id: str,
    response: Response,
    queries: CardCategoryQueries = Depends(),
):
    card_category = queries.delete_card_category(card_category_id)
    if card_category is None:
        response.status_code = 404
    else:
        return True
