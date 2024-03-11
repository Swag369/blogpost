from sqlalchemy.orm import Session
from sqlalchemy import null
from api_models.ReplyModels import PostReply, GetReplies
from api_models.ArticleModels import GetArticle
from database import models
from fastapi import HTTPException


#GET

def get_article(db: Session, id: int):

    item = db.query(models.Articles).filter(models.Articles.id == id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Article not found")

    return GetArticle(content=item.content, author=item.author, replies=get_replies(db, id))








def get_replies(db: Session, article_id: int):

    parent_replies = db.query(models.Replies).filter(models.Replies.article_id == article_id, models.Replies.parent_reply_id == None).order_by(models.Replies.insertion_number.asc()).all()

    # i have to visit all nested children to lazily load them, and this seemed the easiest way with no major drawbacks
    to_visit = list(parent_replies)

    for reply in to_visit:
        if reply.children is not None:  # I have to touch each reply.children
            to_visit += reply.children




    def convert_dbreplies_to_apireplies(reply: models.Replies):
        return GetReplies(writer=reply.writer, content=reply.content, children=map(convert_dbreplies_to_apireplies, reply.children))

    pydantic_formatted_replies = []
    for reply in parent_replies:
        pydantic_formatted_replies.append(convert_dbreplies_to_apireplies(reply))





    return pydantic_formatted_replies  # The nested children are appropriatley loaded now












# POST

def add_reply(db: Session, user: PostReply, article_id: int):
    new_reply = models.Replies(**user.model_dump(), article_id=article_id)  # le struggles of le model dump and 80/20
    db.add(new_reply)
    db.commit()
    db.refresh(new_reply)
    return new_reply