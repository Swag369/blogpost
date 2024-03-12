from fastapi.testclient import TestClient
from .main import app


# Switch out real DB for test DB in database.py -> easier to write, switching db was a bit tedious
# python -m pytest


# Test client initialization

client = TestClient(app)


# Tests


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200


def test_get_replies():

    # get existing replies
    response = client.get("/articles/1/replies")
    assert response.status_code == 200
    response = response.json()
    # assert len(response) == 1   other tests may have added replies
    response = response[0]
    assert response["writer"] == "Yay"
    assert response["content"] == "Yayman sayss Yay"
    assert response["id"] == 1

    # article doesn't exist
    response = client.get("/articles/64/replies")
    assert response.status_code == 200
    assert response.json() == []

    # pydantic verified but nonsensical article id
    response = client.get("/articles/-64/replies")
    assert response.status_code == 200
    assert response.json() == []

    # no article id passed in
    response = client.get("/articles/replies")
    assert response.status_code == 422


# Manually inserted article, because create article doesn't exist
def test_get_article():

    # get existing article
    article = client.get("/articles/1")
    assert article.status_code == 200
    article = article.json()
    assert article is not None
    assert article["content"] == "Four score and seven years ago our fathers brought forth, upon this continent, a new nation, conceived in liberty"
    assert article["author"] == "Lincoln"

    # get non existing article
    article = client.get("/articles/3")
    assert article.status_code == 200
    article = article.json()
    assert article is not None
    assert article["content"] == "article with that id doesn't exist"


# checks that valid replies are added
def test_add_reply():
    
    # add top level comment
    reply_data = {"writer": "Test User", "content": "Test Reply Content", "parent_reply_id": -1}
    new_reply = client.post(
        "/articles/1/new_reply",
        json=reply_data,
        headers={"X-API-Key": "legit_hashed_stored_in_env_checked_against_in_DB_api_key"})
    new_reply = new_reply.json()
    assert new_reply is not None
    print(new_reply)
    assert new_reply["writer"] == reply_data["writer"]
    assert new_reply["content"] == reply_data["content"]
    assert new_reply["article_id"] == 1
    assert new_reply["parent_reply_id"] is None

    # add child comment
    reply_data = {"writer": "Test User Child", "content": "Child Reply Content", "parent_reply_id": 1}
    new_reply = client.post(
        "/articles/1/new_reply",
        json=reply_data,
        headers={"X-API-Key": "legit_hashed_stored_in_env_checked_against_in_DB_api_key"})
    new_reply = new_reply.json()
    assert new_reply is not None
    assert new_reply["writer"] == reply_data["writer"]
    assert new_reply["content"] == reply_data["content"]
    assert new_reply["article_id"] == 1
    assert new_reply["parent_reply_id"] == 1


def test_bad_header():
    reply_data = {"writer": "Test User Child", "content": "Child Reply Content", "parent_reply_id": 1}

    # check bad header
    new_reply = client.post(
        "/articles/1/new_reply",
        json=reply_data,
        headers={"X-API-Key": "not_legit"})
    assert new_reply.status_code > 400

    # check no header
    new_reply = client.post("/articles/1/new_reply", json=reply_data)
    assert new_reply.status_code > 400