from __future__ import annotations
from pydantic import BaseModel
from typing import Union, List


class PostReply(BaseModel):
    writer: Union[str, None] = None
    content: str
    parent_reply_id: int

# potential for updatereply and deletereply


class GetReplies(BaseModel):

    id: int
    writer: Union[str, None] = None
    content: str
    children: List[GetReplies] = None

    class Config:
        orm_mode = True


# Story Time
# I definetly lost my way with naming pydantic models lol
