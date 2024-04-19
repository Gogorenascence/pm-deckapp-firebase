from models.articles import (
    ArticleIn,
    ArticleOut,
    ArticlesAll,
    )
from queries.articles import ArticleQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["articles"])


@router.get("/api/articles/", response_model=ArticlesAll)
async def get_all_articles(queries: ArticleQueries = Depends()):
    return ArticlesAll(articles=queries.get_all_articles())

@router.get("/api/articles/{article_id}", response_model=ArticleOut)
async def get_article(
    article_id: str,
    response: Response,
    queries: ArticleQueries = Depends(),
):
    article = queries.get_article(article_id)
    if article is None:
        response.status_code = 404
    else:
        return article

@router.post("/api/articles/", response_model=ArticleOut)
async def create_article(
    article_in: ArticleIn,
    queries: ArticleQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    article = queries.create_article(article_in)
    return article

@router.put("/api/articles/{article_id}", response_model=ArticleOut | str)
async def update_article(
    article_id: str,
    article_in: ArticleIn,
    response: Response,
    queries: ArticleQueries = Depends(),
):
    article = queries.update_article(article_id, article_in)
    if article is None:
        response.status_code = 404
    else:
        return article

@router.delete("/api/articles/{article_id}", response_model=bool | str)
async def delete_article(
    article_id: str,
    response: Response,
    queries: ArticleQueries = Depends(),
):
    article = queries.delete_article(article_id)
    if article is None:
        response.status_code = 404
    else:
        return True
