from pydantic import BaseModel
from .ReplyModels import GetReplies
from typing import Union, List


class GetArticle(BaseModel):
    content: str
    author: str
    replies: Union[List[GetReplies], None] = None

    class Config:
        orm_mode = True
