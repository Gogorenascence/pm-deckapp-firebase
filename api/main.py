from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    card_types,
    extra_effects,
    reactions,
    card_tags,
    cards,
    decks,
    booster_sets,
    accounts,
    password_resets,
    categories,
    terms,
    stories,
    articles,
    how_tos
)
from authenticator import authenticator
import os


app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://192.168.1.220:3000",
    "http://13.57.107.204:3000",
    os.environ.get("REACT_APP_FASTAPI_SERVICE_API_HOST", None),
    os.environ.get("CORS_HOST", None),
    os.environ.get("PUBLIC_URL", None),
]

app.include_router(card_types.router, tags=["card_types"])
app.include_router(extra_effects.router, tags=["extra_effects"])
app.include_router(reactions.router, tags=["reactions"])
app.include_router(card_tags.router, tags=["card_tags"])
app.include_router(cards.router, tags=["cards"])
app.include_router(decks.router, tags=["decks"])
app.include_router(booster_sets.router, tags=["booster_sets"])
app.include_router(accounts.router, tags=["accounts"])
app.include_router(password_resets.router, tags=["password_resets"])
app.include_router(categories.router, tags=["card_categories"])
app.include_router(terms.router, tags=["terms"])
app.include_router(stories.router, tags=["stories"])
app.include_router(articles.router, tags=["articles"])
app.include_router(how_tos.router, tags=["how_tos"])
app.include_router(authenticator.router, tags=["authenticator"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
