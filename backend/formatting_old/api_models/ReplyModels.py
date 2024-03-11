from __future__ import annotations
from pydantic import BaseModel
from typing import Union, List


class PostReply(BaseModel):
    writer: Union[str, None] = None
    content: str
    parent_reply_id: Union[int, None] = None

# potential for updatereply and deletereply


class GetReplies(BaseModel):

    writer: Union[str, None] = None
    content: str
    # children: List[int] = None
    children: List[GetReplies] = None

    class Config:
        orm_mode = True


# I definetly lost my way with naming pydantic models lol
