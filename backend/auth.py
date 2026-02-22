# auth.py
import os
from functools import lru_cache

import httpx
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
ALGORITHMS = ["RS256"]

bearer_scheme = HTTPBearer()


@lru_cache(maxsize=1)
def get_jwks():
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    response = httpx.get(url)
    response.raise_for_status()
    return response.json()


def decode_token(token: str) -> dict:
    try:
        jwks = get_jwks()
        header = jwt.get_unverified_header(token)

        key = next(
            (k for k in jwks["keys"] if k["kid"] == header["kid"]),
            None
        )
        if key is None:
            raise HTTPException(status_code=401, detail="Signing key not found")

        payload = jwt.decode(
            token,
            key,
            algorithms=ALGORITHMS,
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)
) -> dict:
    payload = decode_token(credentials.credentials)
    if not payload.get("email"):
        email = await get_user_email(credentials.credentials)
        payload["email"] = email
    return payload

async def get_user_email(token: str) -> str:
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"https://{AUTH0_DOMAIN}/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
        data = r.json()
        return data.get("email")