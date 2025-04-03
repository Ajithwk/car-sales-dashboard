import time
import json
import csv
import requests
import random
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models import Task, SaleRecord
from schemas import TaskCreate
from job_queue import add_task
from database import SessionLocal

from datetime import timedelta
def handle_task_creation(task_data: TaskCreate, db: Session):
    new_task = Task(status="Pending")
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    add_task(process_task, new_task.id, task_data)

    return {"task_id": new_task.id, "status": new_task.status}


def get_status(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    return {"task_id": task.id, "status": task.status}


def process_task(task_id: int, task_data: TaskCreate):
    db = SessionLocal()

    try:
        # Step 1: Simulate 'pending' delay
        time.sleep(random.randint(5, 10))

        # Step 2: Move to 'in_progress'
        task = db.query(Task).filter(Task.id == task_id).first()
        task.status = "In_progress"
        db.commit()

        # Step 3: Simulate 'processing' delay
        time.sleep(random.randint(3, 6))

        records = []

        if task_data.source == "A":
            with open("data/source_a.json") as f:
                data = json.load(f)
                for row in data:
                    if task_data.start_year <= row["year"] <= task_data.end_year:
                        records.append(row)

        elif task_data.source == "B":
            with open("data/source_b.csv") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    year = int(row["year"])
                    if task_data.start_year <= year <= task_data.end_year:
                        if task_data.filter_company and row["company"] != task_data.filter_company:
                            continue
                        records.append(row)


        elif task_data.source == "C":
            try:
                response = requests.get("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
                if response.status_code == 200:
                    api_data = response.json().get("Results", [])
                    for item in api_data[:20]:  # Limit to 20 makes for speed
                        rand_year = random.randint(task_data.start_year, task_data.end_year)
                        rand_price = round(random.uniform(18000, 35000), 2)
                        rand_month = random.randint(1, 12)
                        rand_day = random.randint(1, 28)  # keep it simple

                        record = {
                            "company": item.get("Make_Name", "Unknown"),
                            "model": f"Model-{item.get('Make_ID', 0)}",
                            "year": rand_year,
                            "price": rand_price,
                            "date_of_sale": f"{rand_year}-{rand_month:02d}-{rand_day:02d}",
                        }
                        records.append(record)
            except Exception as e:
                print(f"[Error fetching Source C]: {e}")

        # Save all records to DB
        for row in records:
            record = SaleRecord(
                task_id=task.id,
                company=row["company"],
                model=row["model"],
                year=int(row["year"]),
                price=float(row["price"]),
                date_of_sale=datetime.strptime(row["date_of_sale"], "%Y-%m-%d").date(),
            )
            db.add(record)
        print(f"[Saved {len(records)} records to DB for task {task.id}]")
        task.status = "completed"
        db.commit()

    except Exception as e:
        print(f"[Task {task_id} Error]:", e)

    finally:
        db.close()


def get_task_data(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}

    if task.status != "completed":
        return {"error": "Task not completed yet"}

    data = db.query(SaleRecord).filter(SaleRecord.task_id == task_id).all()

    return [
        {
            "company": r.company,
            "model": r.model,
            "year": r.year,
            "price": r.price,
            "date_of_sale": r.date_of_sale.isoformat(),
        }
        for r in data
    ]
