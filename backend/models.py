from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from database import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending")

class SaleRecord(Base):
    __tablename__ = "sales_data"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    company = Column(String)
    model = Column(String)
    year = Column(Integer)
    price = Column(Float)
    date_of_sale = Column(Date)
