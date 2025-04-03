from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine, get_db
from models import SaleRecord
from schemas import TaskCreate
import models
import tasks

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return tasks.handle_task_creation(task, db)

@app.get("/tasks/{task_id}")
def get_task_status(task_id: int, db: Session = Depends(get_db)):
    return tasks.get_status(task_id, db)
    
@app.get("/tasks/{task_id}/data")
def get_task_data(task_id: int, db: Session = Depends(get_db)):
    return tasks.get_task_data(task_id, db)


@app.get("/debug/sales")
def debug_sales(db: Session = Depends(get_db)):
    data = db.query(SaleRecord).all()
    return [
        {
            "task_id": r.task_id,
            "company": r.company,
            "model": r.model,
            "year": r.year,
            "price": r.price,
            "date_of_sale": r.date_of_sale.isoformat(),
        }
        for r in data
    ]
