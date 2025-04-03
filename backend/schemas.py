from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    source: str  # "A" or "B"
    start_year: int
    end_year: int
    filter_company: Optional[str] = None  # only for source B
