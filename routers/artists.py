from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Artist

router = APIRouter(prefix="/artists", tags=["Artists"])

@router.get("/")
def get_artists(db: Session = Depends(get_db)):
    return db.query(Artist).all()

@router.get("/{artist_id}")
def get_artist(artist_id: int, db: Session = Depends(get_db)):
    artist = db.query(Artist).filter(Artist.ArtistId == artist_id).first()
    if not artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist
