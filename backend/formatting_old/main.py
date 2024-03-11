from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from database import models
from database.database import SessionLocal, engine

from routers import article_routes


#setup
models.Base.metadata.create_all(bind=engine)

app = FastAPI()



#routing
app.include_router(article_routes.articles)





#CORS

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost*",
    "http://127*",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





#hello world

@app.get("/")
def hello_world():
    return {"Hello": "World"}
