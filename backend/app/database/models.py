from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base


class Articles(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(String)
    author = Column(String)

    replies = relationship("Replies")


# STORY TIME
# somewhere here, I realized I was writing too many features at once, and it was both slowing me down and making me miserable
# but also missing the scope that I'm working in, first I just create basic CRUD, with less extensibility focus that I was showing

# i think this is important idea, that extensibility can pull you, and you have to be careful to not overengineer and lose velocity
# so i got rid of the UUID id, and just made insertion_number my primary key -> though I need to learn more about these tradeoffs,
# and documenting them in a useful way (even if it just means going over the code with whoever works on it next is the best way to do it)


class Replies(Base):
    __tablename__ = "replies"

    insertion_number = Column(Integer, autoincrement=True, unique=True, nullable=False, primary_key=True)
    writer = Column(String, nullable=False)
    content = Column(String, nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    parent_reply_id = Column(Integer, ForeignKey("replies.insertion_number"), nullable=True)

    children = relationship("Replies")

    # ! STORY TIME
    # talk about lazy joining choice, and how I chose to "BFS" it in the crud area, and talk about how I was unsure of what to do
    # also how this could TECHNICALLY infinite loop if I had a cycle in the replies, but I'm not sure if that's a problem, because it's technically not possible?
    # esp cuz joindepth wasn't a good approach, and messing too much with sqlalchemy was out of my grasp in my time frame

    # ! part 2, talk about how this ended up being the wrong choice because it encouraged top level fetching from api instead of
    # ! nested fetching which removed some elegance from front end design