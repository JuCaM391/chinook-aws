from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Album

router = APIRouter(prefix="/albums", tags=["Albums"])

@router.get("/")
def get_albums(db: Session = Depends(get_db)):
    return db.query(Album).all()

@router.get("/{album_id}")
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.AlbumId == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album no encontrado")
    return album
