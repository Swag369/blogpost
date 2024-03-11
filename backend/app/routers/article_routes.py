from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from api_models.ReplyModels import PostReply
from database.database import get_db
from database import article_crud


articles = APIRouter(prefix="/articles")


@articles.get("/{article_id}")
def get_article(article_id: int, db: Session = Depends(get_db)):

    return article_crud.get_article(db, article_id)


@articles.post("/{article_id}/new_reply")
def post_reply(article_id: int, reply: PostReply, db: Session = Depends(get_db)):

    return article_crud.add_reply(db, reply, article_id)