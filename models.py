# models.py
from pydantic import BaseModel

class UserOut(BaseModel):
    id: str
    username: str
