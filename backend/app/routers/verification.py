from fastapi import FastAPI, HTTPException, Security
from fastapi.security import APIKeyHeader

api_keys = ["legit_hashed_stored_in_env_checked_against_in_DB_api_key"]

api_key_header = APIKeyHeader(name="X-API-Key")

def check_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header in api_keys:
        return True
    raise HTTPException(
        status_code=401,
        detail="Invalid or missing API Key",
    )