from sqlalchemy.orm import Session
from api_models.ReplyModels import PostReply, GetReplies
from api_models.ArticleModels import GetArticle
from database import models
from fastapi import HTTPException


def get_article(db: Session, id: int):

    item = db.query(models.Articles).filter(models.Articles.id == id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Article not found")

    return GetArticle(
        content=item.content,
        author=item.author,
        replies=get_replies(db, id)
    )


def get_replies(db: Session, article_id: int):

    parent_replies = db.query(models.Replies).filter(models.Replies.article_id == article_id, models.Replies.parent_reply_id == None).order_by(models.Replies.insertion_number.asc()).all()

    # lazy loading nested replies (susceptible to cycles in this step)

    to_visit = list(parent_replies)

    for reply in to_visit:
        if reply.children is not None:
            to_visit += reply.children


    # formatting nested replies into recursive pydantic model

    def convert_orm_to_pydantic(reply: models.Replies):
        return GetReplies(
            writer=reply.writer,
            content=reply.content,
            children=map(convert_orm_to_pydantic, reply.children)
        )

    pydantic_formatted_replies = []
    for reply in parent_replies:
        pydantic_formatted_replies.append(convert_orm_to_pydantic(reply))

    return pydantic_formatted_replies












# POST

def add_reply(db: Session, user: PostReply, article_id: int):
    new_reply = models.Replies(**user.model_dump(), article_id=article_id)  # le struggles of le model dump and 80/20
    db.add(new_reply)
    db.commit()
    db.refresh(new_reply)
    return new_reply