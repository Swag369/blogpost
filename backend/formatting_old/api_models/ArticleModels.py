from pydantic import BaseModel
from .ReplyModels import GetReplies
from typing import Union, List


class GetArticle(BaseModel):
    content: str
    author: str
    # replies: list
    replies: List[GetReplies]

    class Config:
        orm_mode = True