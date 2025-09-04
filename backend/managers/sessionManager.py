import jwt
from datetime import datetime , timezone ,timedelta
import os

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = "thisisnotthekey"

def generate_jwt(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)  # expires in 1 hour
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload 
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None 
    
def get_requester_user(token:str):
    token = token.split(" ")[1]
    payload = verify_jwt(token)
    if payload:
        return payload.get("user_id")
    return None

