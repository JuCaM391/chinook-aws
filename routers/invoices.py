from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Invoice, InvoiceItem, Track

router = APIRouter(prefix="/invoices", tags=["Invoices"])

class PurchaseItem(BaseModel):
    TrackId: int
    Quantity: int = 1

class PurchaseCreate(BaseModel):
    CustomerId: int
    items: list[PurchaseItem]

@router.get("/")
def get_invoices(db: Session = Depends(get_db)):
    return db.query(Invoice).all()

@router.get("/{invoice_id}")
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.InvoiceId == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return invoice

@router.post("/purchase")
def purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    total = 0
    invoice_items = []

    for item in purchase.items:
        track = db.query(Track).filter(Track.TrackId == item.TrackId).first()
        if not track:
            raise HTTPException(status_code=404, detail=f"Canción {item.TrackId} no encontrada")
        subtotal = float(track.UnitPrice) * item.Quantity
        total += subtotal
        invoice_items.append((track, item.Quantity))

    next_invoice_id = db.execute(text("SELECT COALESCE(MAX(invoice_id), 0) + 1 FROM invoice")).scalar()

    invoice = Invoice(
        InvoiceId=next_invoice_id,
        CustomerId=purchase.CustomerId,
        InvoiceDate=datetime.utcnow(),
        Total=total
    )
    db.add(invoice)
    db.flush()

    next_line_id = db.execute(text("SELECT COALESCE(MAX(invoice_line_id), 0) + 1 FROM invoice_line")).scalar()
    for i, (track, quantity) in enumerate(invoice_items):
        line = InvoiceItem(
            InvoiceLineId=next_line_id + i,
            InvoiceId=invoice.InvoiceId,
            TrackId=track.TrackId,
            UnitPrice=track.UnitPrice,
            Quantity=quantity
        )
        db.add(line)

    db.commit()
    db.refresh(invoice)
    return {"message": "Compra exitosa", "invoice_id": invoice.InvoiceId, "total": total}
