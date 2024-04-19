from models.stories import (
    StoryIn,
    StoryOut,
    StoriesAll,
    )
from queries.stories import StoryQueries
from fastapi import APIRouter, Depends, Response
from authenticator import authenticator

router = APIRouter(tags=["stories"])


@router.get("/api/stories/", response_model=StoriesAll)
async def get_all_stories(queries: StoryQueries = Depends()):
    return StoriesAll(stories=queries.get_all_stories())

@router.get("/api/stories/{story_id}", response_model=StoryOut)
async def get_story(
    story_id: str,
    response: Response,
    queries: StoryQueries = Depends(),
):
    story = queries.get_story(story_id)
    if story is None:
        response.status_code = 404
    else:
        return story

@router.post("/api/stories/", response_model=StoryOut)
async def create_story(
    story_in: StoryIn,
    queries: StoryQueries = Depends(),
    # account_data: dict = Depends(authenticator.get_current_account_data),
):
    story = queries.create_story(story_in)
    return story

@router.put("/api/stories/{story_id}", response_model=StoryOut | str)
async def update_story(
    story_id: str,
    story_in: StoryIn,
    response: Response,
    queries: StoryQueries = Depends(),
):
    story = queries.update_story(story_id, story_in)
    if story is None:
        response.status_code = 404
    else:
        return story

@router.delete("/api/stories/{story_id}", response_model=bool | str)
async def delete_story(
    story_id: str,
    response: Response,
    queries: StoryQueries = Depends(),
):
    story = queries.delete_story(story_id)
    if story is None:
        response.status_code = 404
    else:
        return True
