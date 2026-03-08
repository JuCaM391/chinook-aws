from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Customer

router = APIRouter(prefix="/customers", tags=["Customers"])

class CustomerCreate(BaseModel):
    FirstName: str
    LastName: str
    Email: str

@router.get("/")
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.CustomerId == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return customer

@router.post("/")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer
