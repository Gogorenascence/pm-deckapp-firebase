from pydantic import BaseModel
from typing import List, Optional
from bson.objectid import ObjectId


class PydanticObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value: ObjectId | str) -> ObjectId:
        if value:
            try:
                ObjectId(value)
            except ValueError:
                raise ValueError(f"Not a valid object id: {value}")
        return value


class StoryIn(BaseModel):
    section: str
    headline: str
    content: Optional[str]
    image: Optional[str]
    account: str
    story_date: Optional[str]
    site_link: Optional[str]


class Story(StoryIn):
    id: PydanticObjectId


class StoryOut(StoryIn):
    id: str

class StoriesAll(BaseModel):
    stories: List
