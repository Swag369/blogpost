from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base


class Articles(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(String)
    author = Column(String)

    replies = relationship("Replies")


class Replies(Base):
    __tablename__ = "replies"

    insertion_number = Column(Integer, autoincrement=True, unique=True, nullable=False, primary_key=True)
    writer = Column(String, nullable=False)
    content = Column(String, nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    parent_reply_id = Column(Integer, ForeignKey("replies.insertion_number"), nullable=True)

    children = relationship("Replies")