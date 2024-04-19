from models.rulings import (
    TermIn,
    TermOut,
)
from fastapi import APIRouter, Depends, Response
from queries.terms import TermQueries

router = APIRouter(tags=["terms"])


@router.get("/api/terms/", response_model=list[TermOut])
async def get_all_terms(repo: TermQueries = Depends()):
    return repo.get_all_terms()

@router.get("/api/terms/{term_id}", response_model=TermOut)
async def get_term(
    term_id: str,
    repo: TermQueries = Depends(),
):
    term = repo.get_term(term_id)
    return term

@router.post("/api/terms/", response_model=TermOut)
async def create_term(
    info: TermIn,
    repo: TermQueries = Depends(),
):
    term = repo.create_term(info)
    return term

@router.put("/api/terms/{term_id}", response_model=TermOut | str)
async def update_term(
    term_id: str,
    term_in: TermIn,
    response: Response,
    queries: TermQueries = Depends(),
):
    term = queries.update_term(term_id, term_in)
    if term is None:
        response.status_code = 404
    else:
        return term

@router.delete("/api/terms/{term_id}", response_model=bool)
async def delete_term(
    term_id: str,
    repo: TermQueries = Depends(),
):
    repo.delete_term(term_id)
    return True
