from jose import jwt
from datetime import datetime, timedelta


SECRET_KEY = "hospital-management-secret-key"
ALGORITHM = "HS256"


def create_access_token(user_id, username, role):

    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token