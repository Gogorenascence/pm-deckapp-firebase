from .client import Queries
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from models.stories import (
    StoryIn,
    Story,
    StoryOut,
    StoriesAll
)


class StoryQueries(Queries):
    DB_NAME = "cards"
    COLLECTION = "stories"

    def get_all_stories(self) -> StoriesAll:
        db = self.collection.find()
        stories = []
        for document in db:
            document["id"] = str(document["_id"])
            stories.append(StoryOut(**document))
        return stories

    def get_story(self, id) -> StoryOut:
        props = self.collection.find_one({"_id": ObjectId(id)})
        if not props:
            return None
        props["id"] = str(props["_id"])
        return StoryOut(**props)

    def create_story(self, story: StoryIn) -> Story:
        props = story.dict()
        self.collection.insert_one(props)
        props["id"] = str(props["_id"])
        return Story(**props)

    def update_story(self, id: str, story: StoryIn) -> StoryOut:
        props = story.dict()
        self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": props},
            return_document=ReturnDocument.AFTER,
        )
        return StoryOut(**props, id=id)

    def delete_story(self, id: str) -> bool:
        return self.collection.delete_one({"_id": ObjectId(id)})
